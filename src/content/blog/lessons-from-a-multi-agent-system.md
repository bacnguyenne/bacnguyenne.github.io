---
title: "Lessons from shipping a multi-agent e-commerce assistant"
description: "Building an end-to-end multi-agent system — support, recommendation, and pricing — with LangChain, AutoGen, FastAPI, Kafka, and Qdrant. What held up and what I'd change."
pubDate: "Jun 12 2026"
tags: [agents, rag, llmops]
---

"Multi-agent" is an easy thing to say and a hard thing to ship. I built an e-commerce assistant where separate agents handled customer support, product recommendation, and dynamic pricing, wired together over a streaming backend with a TypeScript front-end. It worked end to end — data ingestion → embeddings → agents → API → UI. Here's what I'd keep, and what the experience taught me about when multiple agents actually earn their complexity.

## Split by responsibility, not by vibe

The reason to have multiple agents isn't that it sounds advanced. It's that **support, recommendation, and pricing are genuinely different jobs** with different tools, data, and failure modes. Support reads order history and policy docs. Recommendation ranks products. Pricing applies rules and guardrails. Forcing one mega-prompt to do all three produces a model that's mediocre at each and impossible to debug.

The test I use now: if two "agents" share the same tools and the same data, they're one agent with two prompts — merge them. Only split when the boundary is real.

## A router is cheaper than a committee

Early on, the temptation is to let agents freely talk to each other. That gets expensive and non-deterministic fast — every hop is another model call and another chance to drift. What worked better was a thin **router** that classifies the request and dispatches to exactly one specialist, with hand-offs only when a specialist explicitly needs another.

LangChain and AutoGen made the orchestration easy to express, but the discipline mattered more than the framework: keep the graph shallow, make most requests one hop, and treat agent-to-agent calls as the exception you justify, not the default.

## RAG is what made answers trustworthy

A support agent that hallucinates a refund policy is worse than no agent. Grounding every factual answer in retrieval — order data and policy documents in **Qdrant**, pulled in per query — is what made the assistant safe to show. Two things mattered: retrieve few, relevant chunks (not the top-20), and **format what you retrieve for the model**, not as raw JSON. A clean, labeled context beats a bigger one.

## Streaming and Kafka: decouple the slow parts

The pipeline had naturally async stages — ingestion, embedding, indexing — that should never block a user request. Putting **Kafka** between them meant the front-end stayed responsive while embedding and indexing happened out of band. The lesson is older than LLMs: find the slow, bursty work and move it off the request path. An agent waiting synchronously on an embedding job is a bad user experience and a fragile system.

On the front-end, **streaming tokens** turned multi-second model latency into something that felt instant. It complicates error handling — a stream can fail after you've rendered text — but for anything user-facing it's worth it.

## Make every step observable

The hardest bug in a multi-agent system is "the answer is wrong and I don't know which agent did it." Logging each hop — router decision, chosen agent, tool calls, retrieved context, final output — turned debugging from guesswork into reading a trace. If I rebuilt this, observability would be there from commit one, not bolted on after the first confusing failure.

## What I'd change

- **Fewer agents to start.** I'd ship the router + support agent first, prove the spine, then add recommendation and pricing. Standing up all three at once made early debugging harder than it needed to be.
- **Guardrails as code, not prompts.** Pricing especially — money decisions belong behind deterministic checks, not a politely-worded instruction the model can ignore.
- **Evals before features.** A small set of real conversations to test against would have caught regressions I only noticed by hand.

## Takeaway

Multi-agent is worth it when the sub-tasks are genuinely different — and a liability when they're not. Keep the orchestration shallow with a router, ground answers in retrieval, push slow work off the request path, and log every hop. The framework is the easy part; the boundaries and the guardrails are the engineering.
