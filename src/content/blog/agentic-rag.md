---
title: "Agentic RAG: retrieval that decides for itself"
description: "Build agentic RAG in Python: hybrid retrieval as a tool, a bounded agent loop, sufficiency and grounding checks, against any OpenAI-compatible endpoint."
pubDate: "Jun 15 2026"
tags: [rag, agents, retrieval]
---

## The problem with one-shot retrieval

Plain RAG does one thing: embed the user's question, pull the top-k chunks, stuff them into the prompt, generate. It works until the question is ambiguous or needs more than one lookup.

Two failure modes show up constantly in production:

- **Ambiguous queries.** "How do I configure the timeout?" Which timeout? The retriever grabs a plausible-looking chunk and the model answers confidently about the wrong subsystem.
- **Multi-hop questions.** "Which release fixed the bug that caused the 2025 outage?" You first need the outage's root cause, *then* the release notes that reference it. A single top-k pass over the original wording rarely surfaces both.

The fix is not a bigger k. It is giving the model the ability to retrieve more than once, to rewrite the query, and to decide when it has enough. That is agentic RAG: retrieval becomes a tool the model calls in a loop, with a stop condition.

Everything below runs against any OpenAI-compatible endpoint, whether a self-hosted vLLM server or a hosted provider. Set three env vars and go.

```bash
python -m venv .venv && source .venv/bin/activate
pip install "openai>=1.40" sentence-transformers rank-bm25 numpy

export LLM_BASE_URL="http://localhost:8000/v1"   # your vLLM / provider endpoint
export LLM_API_KEY="sk-local-anything"           # any non-empty string for local vLLM
export LLM_MODEL="your-model"
```

If you want a local server, vLLM exposes the OpenAI API directly:

```bash
pip install vllm
python -m vllm.entrypoints.openai.api_server \
  --model your-model --port 8000
```

One caveat before you wire up tools: confirm your served model actually supports tool calling. With vLLM that means launching with `--enable-auto-tool-choice` and a matching `--tool-call-parser` for the model family. If the endpoint ignores `tools`, the loop below degrades to plain generation.

## The retriever behind the tool: hybrid + rerank

The tool the agent calls is not a bare vector search. It is hybrid retrieval (lexical BM25 + dense embeddings) followed by a cross-encoder rerank. BM25 catches exact terms and IDs that embeddings smear; dense catches paraphrases; the cross-encoder reorders the merged candidates by actually reading query and passage together.

```python
# retriever.py
import numpy as np
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer, CrossEncoder


class HybridRetriever:
    def __init__(self, docs):
        self.docs = docs
        self.bm25 = BM25Okapi([d.lower().split() for d in docs])
        self.embedder = SentenceTransformer("BAAI/bge-small-en-v1.5")
        self.reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
        self.doc_emb = self.embedder.encode(
            docs, normalize_embeddings=True, convert_to_numpy=True
        )

    def _minmax(self, x):
        x = np.asarray(x, dtype=float)
        if x.max() - x.min() < 1e-9:
            return np.zeros_like(x)
        return (x - x.min()) / (x.max() - x.min())

    def search(self, query, k=4, pool=20, alpha=0.5):
        pool = min(pool, len(self.docs))
        # lexical
        bm = self._minmax(self.bm25.get_scores(query.lower().split()))
        # dense
        q = self.embedder.encode(
            [query], normalize_embeddings=True, convert_to_numpy=True
        )[0]
        dense = self._minmax(self.doc_emb @ q)
        # fuse, take a pool, then rerank that shortlist
        fused = alpha * dense + (1 - alpha) * bm
        pool_idx = np.argsort(fused)[::-1][:pool]
        pairs = [(query, self.docs[i]) for i in pool_idx]
        ce = self.reranker.predict(pairs)
        order = np.argsort(ce)[::-1][:k]
        return [
            {
                "doc_id": int(pool_idx[i]),
                "text": self.docs[pool_idx[i]],
                "score": float(ce[i]),
            }
            for i in order
        ]
```

The cross-encoder is the expensive part. It is a second forward pass over `pool` query/passage pairs, so keep `pool` modest (20 is plenty for most corpora) and only rerank the fused shortlist, never the full corpus. The `min(pool, len(docs))` guard keeps tiny corpora from indexing past the end.

## Make retrieval a tool the model can call

We describe the retriever as a function in the OpenAI tool schema. The model decides whether and how to call it, and crucially it can rewrite the `query` argument instead of reusing the user's literal words.

```python
# agent.py
import os
import json
from openai import OpenAI
from retriever import HybridRetriever

client = OpenAI(
    base_url=os.environ["LLM_BASE_URL"],
    api_key=os.environ["LLM_API_KEY"],
)
MODEL = os.environ["LLM_MODEL"]

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_docs",
            "description": (
                "Search the knowledge base. Rewrite the query to be specific. "
                "Call again with a refined query if results are insufficient "
                "or a follow-up hop is needed."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "A focused, self-contained search query.",
                    }
                },
                "required": ["query"],
            },
        },
    }
]

SYSTEM = (
    "You answer strictly from retrieved context. Retrieve before answering. "
    "If results are ambiguous or incomplete, refine the query and search again. "
    "For multi-hop questions, search once per hop. When you have enough "
    "evidence, answer and cite doc_ids like [doc 3]. If the corpus does not "
    "contain the answer, say so."
)
```

## The agent loop: when to retrieve, when to stop

The loop is small. The model emits tool calls; we run the retriever; we feed results back; it either calls again or produces a final answer. Two guards keep it bounded: a hard `max_steps` cap and the natural stop condition (the model returns a message with no tool calls).

```python
def run_agent(question, retriever, max_steps=4):
    messages = [
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": question},
    ]
    retrieved = []  # provenance for grounding
    steps = 0

    for step in range(max_steps):
        steps = step
        resp = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
            temperature=0.0,
        )
        msg = resp.choices[0].message
        messages.append(msg.model_dump(exclude_none=True))

        if not msg.tool_calls:
            return {"answer": msg.content, "evidence": retrieved, "steps": steps}

        for tc in msg.tool_calls:
            args = json.loads(tc.function.arguments)
            hits = retriever.search(args["query"], k=4)
            retrieved.extend(hits)
            payload = [{"doc_id": h["doc_id"], "text": h["text"]} for h in hits]
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": json.dumps(payload),
                }
            )

    # max-steps hit: force a final answer with what we have (no tools this time)
    messages.append(
        {"role": "user", "content": "Answer now using only the evidence gathered."}
    )
    final = client.chat.completions.create(
        model=MODEL, messages=messages, temperature=0.0
    )
    return {
        "answer": final.choices[0].message.content,
        "evidence": retrieved,
        "steps": max_steps,
    }
```

Two things matter here. `tool_choice="auto"` lets the model skip retrieval entirely for a trivial question, which is part of the point: it decides *when*. And the `max_steps` cap is non-negotiable. Without it, a model that keeps deciding "not quite enough" will loop until your budget is gone. Note the final fallback call omits `tools` on purpose, so the model cannot answer a tool call again and must emit text.

## Self-check sufficiency before answering

The model's own "I have enough" judgment is the primary stop signal, but it is worth making it explicit rather than implicit in the system prompt. A cheap sufficiency gate forces a structured decision and gives you a logging hook. Pin the output to JSON mode so parsing does not break on stray prose or markdown fences.

```python
# agent.py (continued)
def _ask_json(prompt):
    r = client.chat.completions.create(
        model=MODEL,
        temperature=0.0,
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}],
    )
    try:
        return json.loads(r.choices[0].message.content)
    except (json.JSONDecodeError, TypeError):
        return None


def sufficient(question, evidence):
    ctx = "\n".join(f"[doc {e['doc_id']}] {e['text']}" for e in evidence)
    out = _ask_json(
        f"Question: {question}\n\nEvidence:\n{ctx}\n\n"
        "Can this question be fully answered from the evidence? "
        'Reply as JSON: {"enough": true|false, "missing": "..."}'
    )
    return out or {"enough": False, "missing": "unparseable"}
```

You can call `sufficient(...)` after each retrieval and, when it returns `enough: false`, feed `missing` back as a hint for the next query rewrite. That turns the loop from "model guesses again" into "model targets the named gap." If your endpoint does not support `response_format`, drop that argument; the `try/except` still catches bad output.

## Grounding: verify the answer against the evidence

Iterative retrieval reduces hallucination but does not eliminate it. A final grounding pass checks that each claim is actually supported by a retrieved doc, the same idea as a faithfulness check.

```python
# agent.py (continued)
def verify(answer, evidence):
    ctx = "\n".join(f"[doc {e['doc_id']}] {e['text']}" for e in evidence)
    out = _ask_json(
        f"Evidence:\n{ctx}\n\nAnswer:\n{answer}\n\n"
        "Is every claim in the answer supported by the evidence? "
        'Reply as JSON: {"grounded": true|false, "unsupported": ["..."]}'
    )
    return out or {"grounded": False, "unsupported": ["parse error"]}
```

If `grounded` is false, the honest move is to either retry retrieval targeting the unsupported claims or surface a hedge to the user, not to ship the answer silently.

## A small eval

Do not trust vibes. Even ten labeled questions catch regressions. This checks whether the expected supporting doc made it into the evidence (retrieval recall) and lets you eyeball answers.

```python
# eval.py
from agent import run_agent, verify
from retriever import HybridRetriever

DOCS = [
    "The 2025 outage root cause was a connection-pool exhaustion in the gateway.",
    "Release 4.2 added a hard cap on gateway connection-pool size.",
    "The request timeout for the gateway defaults to 30 seconds.",
    "The database timeout is separate and defaults to 5 seconds.",
]
CASES = [
    {"q": "Which release fixed the cause of the 2025 outage?", "gold": 1},
    {"q": "What is the gateway request timeout?", "gold": 2},
]


def main():
    r = HybridRetriever(DOCS)
    hits = 0
    for c in CASES:
        out = run_agent(c["q"], r)
        ids = {e["doc_id"] for e in out["evidence"]}
        ok = c["gold"] in ids
        hits += ok
        v = verify(out["answer"], out["evidence"])
        print(
            f"[{'OK ' if ok else 'MISS'}] steps={out['steps']} "
            f"grounded={v.get('grounded')} :: {c['q']}"
        )
        print("   ->", out["answer"], "\n")
    print(f"recall@evidence: {hits}/{len(CASES)}")


if __name__ == "__main__":
    main()
```

```bash
python eval.py
```

## The honest cost picture

Agentic RAG is not free. Plain RAG is one retrieval and one generation. This design can fire several LLM calls per question: the agent loop (one model call per step), plus optional sufficiency and verification calls. Latency rises with each hop, and the cross-encoder rerank adds GPU time on the retrieval side.

So spend it where it pays. Route easy questions through plain top-k and reserve the loop for queries flagged ambiguous or multi-hop; the model skipping the tool via `tool_choice="auto"` already gives you some of this. Cap `max_steps` low (3-4); most real multi-hop questions resolve in two retrievals. Cache embeddings and BM25 indexes; they do not change per query. And keep the sufficiency and verification calls optional, gated behind a confidence or risk threshold rather than run on every request.

The payoff is correctness on exactly the questions where plain RAG quietly fails. For an FAQ bot, plain RAG is fine. For anything where a wrong-but-confident answer is expensive, paying for retrieval that decides for itself is usually the cheaper option in the end.
