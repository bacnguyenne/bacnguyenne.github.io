---
title: 'The context window is the constraint, not the model'
description: 'Why long coding-agent sessions degrade, what compaction really loses, and the habits that keep an agent sharp: grep-first, sub-agents, short memory files.'
pubDate: 'Aug 8 2026'
tags: [llm, coding-agents, context]
---

## Context is a budget, not a bucket

The mental model that causes trouble: the window is a bucket, I fill it, something compacts it, I carry on. It's a budget, and every token in it competes for attention with every other token.

Anthropic defines context engineering as ["the set of strategies for curating and maintaining the optimal set of tokens (information) during LLM inference"](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), with the goal being the *smallest* set of high-signal tokens that gets the job done. Their mechanical argument for why more hurts: transformers form n² pairwise relationships for n tokens, and attention patterns are learned from training data where short sequences dominate. The result, in their words, is "a performance gradient rather than a hard cliff."

That gradient is why a session feels sharp for forty minutes and mediocre after two hours, with nothing visibly breaking in between.

## What actually spends it

A lot is gone before you type. Claude Code's [context-window doc](https://code.claude.com/docs/en/context-window) puts a representative startup at roughly 4,200 tokens of system prompt, ~680 for auto memory, ~280 for environment info, ~450 for skill descriptions.

Tool definitions are the underrated line item. Anthropic's [tool search docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) note that a five-server MCP setup (GitHub, Slack, Sentry, Grafana, Splunk) can burn ~55k tokens before any work happens, and that tool selection degrades once you pass 30–50 available tools. Deferred loading took one setup from ~77K tokens to ~8.7K.

Then the per-turn spenders, in rough order of damage:

- **Whole-file reads.** The most common own-goal.
- **Verbose test and build logs.** Claude Code truncates Bash output at 30,000 characters and spills the rest to a file — a damage cap, not a fix.
- **Failed attempts.** A wrong approach with three bad edits and a stack trace stays in history forever, and the model keeps reading it.
- **Long diffs**, especially generated files and lockfile churn.
- **Fetched pages.** Anthropic's rules of thumb: [~2,500 tokens](https://platform.claude.com/docs/en/about-claude/pricing) for a 10 kB page, ~125,000 for a 500 kB PDF.

## Degradation is measured, and it isn't only recall

Chroma's [Context Rot study](https://www.trychroma.com/research/context-rot) is still the cleanest controlled evidence: 18 models, 194,480 calls. Conclusion: "LLMs do not maintain consistent performance across input lengths." A single distractor is enough to degrade performance, and performance fell with length even on a repeated-words replication task with zero reasoning content — so this isn't a reasoning-difficulty artefact. Caveat: it's from July 2025 and its model list is two generations old. Treat the shape as current, the per-model numbers as history.

Newer work adds a failure mode that matters more for agents. A [2026 paper on long-horizon search](https://arxiv.org/abs/2606.29718) finds extensive context causes models to "directly give up or prematurely provide uncertain answers," worsening as context grows. That's abstention, not misretrieval — the agent quits rather than misremembers. If yours starts saying "this may require further investigation" three hours in, that's the symptom.

The code-quality side is uglier. [SlopCodeBench](https://arxiv.org/abs/2603.24755) ran 15 coding agents over 36 problems and 196 checkpoints; best agent, 14.8% checkpoint pass rate. Structural erosion rose in 77% of trajectories and verbosity in 75.5%, against a control of 473 open-source Python repos. Quality guidance in the prompt cut *initial* verbosity and erosion by up to a third but **did not change the degradation rate**. You can't prompt your way out of this one.

## Compaction buys time, and here is the bill

When context fills, Claude Code clears older tool outputs first, then summarizes if it still needs to; the summarized portion compresses to roughly 12% of its prior size. Big win, not free.

- **Detail, unevenly.** The [ACE paper](https://arxiv.org/abs/2510.04618) names the failure modes: *brevity bias* (summaries drop domain insight for concision) and *context collapse* (iterative rewriting erodes detail over successive passes).
- **Determinism.** Work on [parallel compaction](https://arxiv.org/abs/2605.23296) reports summarization "stalls agent inference for tens of seconds," that instructions about summary volume are "largely ignored," and that retained information "fluctuate[s] substantially from run to run."
- **Selected context, silently.** CLAUDE.md and auto memory are re-injected from disk afterwards, but rules with `paths:` frontmatter and nested subdirectory CLAUDE.md files are lost until a matching file is read again.

Treat compaction as recovery, not strategy. Cheaper: `/clear` between unrelated tasks, `/compact <focus text>` when you do need it, `/context` to see the breakdown instead of guessing.

## Instruction files: short, and advisory

[AGENTS.md](https://agents.md/) is the nearest thing to a convention — plain Markdown, no required fields, "a README for agents," reported at 60,000+ open-source projects and now stewarded by the Agentic AI Foundation under the Linux Foundation. Agents read the nearest file up the directory tree. Claude Code reads `CLAUDE.md`, not `AGENTS.md`, so bridge it:

```bash
ln -s AGENTS.md CLAUDE.md   # or put the line "@AGENTS.md" in CLAUDE.md
```

Two things people get wrong. **Size**: Claude Code's [memory docs](https://code.claude.com/docs/en/memory) target under 200 lines per file and say plainly that longer files "consume more context and reduce adherence." `@path` imports help organisation but expand at launch — they do not reduce context. Addy Osmani's [harness writeup](https://addyosmani.com/blog/agent-harness-engineering/) cites an even tighter recommendation of under 60 lines. The editing rule I use is the one `/doctor` applies: delete anything derivable from the codebase — directory layouts, dependency lists, architecture overviews — and keep pitfalls, conventions that differ from defaults, and why.

**Enforcement**: CLAUDE.md arrives as a user message, not configuration, and the docs are blunt that "there's no guarantee of strict compliance." *Never edit `.env`* in a memory file is a request. A `PreToolUse` hook that blocks the edit is enforcement.

## Grep first, read narrowly

Anthropic's design is deliberately hybrid: instruction files up front, `glob` and `grep` for just-in-time retrieval, with the agent holding "lightweight identifiers (file paths, stored queries, web links)" rather than content.

The evidence backs grep-first harder than the semantic-search marketing suggests. In a [2026 PwC study](https://arxiv.org/pdf/2605.15184) across four harnesses and five models, lexical grep beat dense vector retrieval for *every* harness-model pair when results were delivered inline — margins from 76.7% vs 75.0% up to 86.2% vs 62.9%. Cursor's [semantic search post](https://cursor.com/blog/semsearch) reports +12.5% average accuracy over grep-only tools, but the gain concentrates in large repos, their embedding model is trained on agent session traces rather than bought off the shelf, and their conclusion is that the combination wins, not the replacement.

The habit: locate with a filename list, then read the span.

```bash
rg -l 'createSession'                 # which files, not which lines
rg -n 'createSession' src/session/    # line numbers in the one dir that matters
```

If your harness has LSP-backed code intelligence, prefer it — symbol lookups replace broad file reads, so net context use goes *down*.

## Send the exploration somewhere else

The strongest structural lever is delegation. A sub-agent gets a fresh window, spends "tens of thousands of tokens or more" exploring, and returns a summary Anthropic puts at typically 1,000–2,000 tokens. The dead ends never touch your thread.

<figure>
<svg viewBox="0 0 720 250" role="img" aria-label="Diagram showing a main thread delegating to a sub-agent: the sub-agent runs in a fresh context window and spends tens of thousands of tokens on greps, file reads and dead ends, returning only a summary of about one to two thousand tokens to the main thread.">
  <defs>
    <marker id="ctxarrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)"/>
    </marker>
  </defs>
  <rect x="8" y="40" width="170" height="170" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="93" y="70" text-anchor="middle" font-size="15" font-weight="600" fill="var(--heading)">Main thread</text>
  <text x="93" y="96" text-anchor="middle" font-size="12" fill="var(--text-muted)">your working context</text>
  <text x="93" y="132" text-anchor="middle" font-size="12" fill="var(--text)">task, plan, decisions,</text>
  <text x="93" y="150" text-anchor="middle" font-size="12" fill="var(--text)">the diff you care about</text>
  <rect x="400" y="12" width="308" height="130" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-dasharray="5 4"/>
  <text x="554" y="42" text-anchor="middle" font-size="15" font-weight="600" fill="var(--heading)">Sub-agent — fresh window</text>
  <text x="554" y="70" text-anchor="middle" font-size="12" fill="var(--text)">greps, whole-file reads, wrong turns,</text>
  <text x="554" y="88" text-anchor="middle" font-size="12" fill="var(--text)">failed builds, 30k-char log dumps</text>
  <text x="554" y="118" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-muted)">tens of thousands of tokens</text>
  <line x1="182" y1="82" x2="396" y2="82" stroke="var(--accent)" stroke-width="2" marker-end="url(#ctxarrow)"/>
  <text x="289" y="72" text-anchor="middle" font-size="12" fill="var(--text-muted)">one question</text>
  <line x1="558" y1="150" x2="558" y2="176" stroke="var(--accent)" stroke-width="2"/>
  <line x1="558" y1="176" x2="182" y2="176" stroke="var(--accent)" stroke-width="2" marker-end="url(#ctxarrow)"/>
  <text x="380" y="200" text-anchor="middle" font-size="13" font-weight="600" fill="var(--accent)">1,000–2,000 token summary</text>
  <text x="380" y="222" text-anchor="middle" font-size="12" fill="var(--text-muted)">the conclusion returns; the search does not</text>
</svg>
<figcaption>Delegation moves the expensive part of the work out of the window you have to live in.</figcaption>
</figure>

Cognition mapped the trade-off honestly. Their 2025 post argued against multi-agent setups because parallel workers make conflicting decisions. Ten months later they published [what actually works](https://cognition.com/blog/multi-agents-working): "setups where multiple agents contribute intelligence to a task while writes stay single-threaded." Their headline pattern is a review agent with *no prior context*, catching on average 2 bugs per PR, ~58% of them severe — and the stated reason is a context one: a fresh reviewer isn't carrying the rot the coding agent accumulated over hours.

*Sub-agents for reading; one thread for writing.* One practical detail: a Claude Code sub-agent [does not see](https://code.claude.com/docs/en/sub-agents) your conversation history or the files you've already read, so brief it properly or it re-derives everything.

## Caching: don't thrash the prefix

Cost, not quality — but it decides which habits are affordable. Anthropic's [prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) multipliers are 1.25× for a 5-minute cache write and **0.1× for a read** — profitable after a single read.

Invalidation cascades `tools` → `system` → `messages`. Adding an MCP server mid-session, flipping a setting that alters the system prompt, or aggressively clearing old tool results all rewrite the prefix and cost full-price input on the next turn. Context editing exposes a `clear_at_least` parameter precisely because clearing a trivial amount isn't worth breaking cache for.

Minimum cacheable prompt length also varies by model — 512 tokens on Opus 5, 4,096 on Haiku 4.5 — and below it nothing caches and no error is raised. And caching buys no room: "prompt caching changes what you pay for those tokens, not whether they count."

## Symptom → cause → fix

| Symptom | Likely cause | Fix |
|---|---|---|
| Forgets a constraint set an hour ago | Early instructions thinned by compaction | Durable constraints belong in CLAUDE.md/AGENTS.md, re-injected from disk |
| Quality drops after ~90 minutes, no error | Context rot: a gradient, not a cliff | `/clear`, restart with a written handoff |
| "This may need further investigation" | Long-context abstention | Fresh window, narrower question |
| Repeats a fix it already rejected | Failed attempts still in history as distractors | Delegate retries; keep only the outcome |
| Window fills in ten minutes | Whole-file reads and verbose logs | `rg -l` first, read spans; filter test output |
| High input bill, slow first token | Prefix invalidated mid-session | Fix the tool set at start; batch config changes |
| Compaction fires repeatedly and stalls | One oversized output refills the window instantly | Read it in ranges, or hand it to a sub-agent |
| Sub-agent returns something useless | It never saw your conversation | Brief it: paths, constraints, what "done" means |

## What to do differently

Start each task with `/clear` instead of continuing an unrelated session. Re-establishing context costs less than dragging an hour of irrelevant history through every turn.

Delete half your CLAUDE.md. Anything derivable from the codebase is dead weight that also lowers adherence to the parts that matter.

Make grep the first move and reading a file a deliberate second one. Delegate any exploration whose *answer* is 20 lines but whose *search* is 20,000 tokens.

Move any rule you actually need enforced out of prose and into a hook. Memory files are requests.

And when a session starts feeling dumb, believe it. That's measurable, not vibes — and the fix is a fresh window with a written handoff, not a better prompt.
