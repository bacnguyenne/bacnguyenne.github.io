---
title: 'The model converged. The harness did not.'
description: 'What a coding-agent harness actually is — loop, tools, context, permissions, extensions — and why the same model scores differently in each one.'
pubDate: 'Jul 24 2026'
tags: [llm, coding-agents, developer-tools]
---

## Same weights, different score

The official [Terminal-Bench 2.1 leaderboard](https://www.tbench.ai/leaderboard/terminal-bench/2.1) is the cleanest natural experiment available. Claude Fable 5 scores 83.8% ±1.2 in Claude Code and 80.4% ±1.2 in Terminus 2, the benchmark's neutral single-tool bash harness. GPT-5.5 scores 83.1% ±1.1 in Codex and 78.0% in Terminus 2. Same weights, different wrapper, three to five points.

On the [2.0 board](https://www.tbench.ai/leaderboard/terminal-bench/2.0) the spread is wider: Claude Opus 4.6 sits at 62.9% under Terminus 2 and 76.4% under a bespoke entry called Meta-Harness. And [*Agentic Harness Engineering*](https://arxiv.org/abs/2604.25850) (Lin et al., 2026) automated the wrapper-tuning loop, raising Terminal-Bench 2 pass@1 from 69.7% to 77.0% over ten iterations by evolving harness components alone — past hand-built Codex-CLI at 71.9%.

Meanwhile the model layer flattened into a commodity shelf: Opus 5 at $5/$25 per MTok, GPT-5.6 in three tiers, Gemini 3.1 Pro, Cursor's own Composer 2.5 at $0.50/$2.50. Published SWE-bench Verified numbers cluster in a two-point band and are known to be contaminated — [file-localisation from issue text alone](https://arxiv.org/html/2512.10218v2) hits 65% on SWE-bench Verified versus 12.2% on comparable Python OSS repos. They stopped discriminating.

The interesting variance moved into the code around the model.

## What a harness actually is

Vivek Trivedy's formulation in [The Anatomy of an Agent Harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness) is worth memorising: **Agent = Model + Harness**, the harness being "every piece of code, configuration, and execution logic that isn't the model itself." Or, [Addy Osmani](https://addyosmani.com/blog/agent-harness-engineering/): "If you're not the model, you're the harness."

Five parts do the work: the **loop**, the **tool set**, **context management**, **permissions**, and the **extension surface**. Everything else is UI.

## The loop, concretely

Thorsten Ball's ["It's an LLM, a loop, and enough tokens"](https://ampcode.com/notes/how-to-build-an-agent) is ~400 lines of Go with three tools: `read_file`, `list_files`, `edit_file`. [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) is a ~100-line Python class giving the model bash and nothing else, with a strictly linear history.

A turn in a shipping harness:

```text
1. append user text to the message array
2. send: system prompt + AGENTS.md/CLAUDE.md + full history + tool schemas
3. model emits tool_use blocks
4. harness checks each call against permission rules  <- not the model
5. harness executes, formats, truncates the result
6. append tool_result blocks; goto 2 until no tool_use
```

Steps 4 and 5 are where the design decisions live, and the model only ever sees their consequences as plain text. That is the whole mechanism.

With that in mind, Claude Code's [tools reference](https://code.claude.com/docs/en/tools-reference) reads less like docs than like a behaviour spec. `Read` returns line-numbered content and, past the token budget, a `PARTIAL view` notice telling the model how much it got. `Edit` is exact string replacement with three preconditions — read-before-edit, exact match, uniqueness — and a `PARTIAL view` read does *not* satisfy the first. `Bash` runs each command in a separate process, so environment variables don't persist between calls, and output over 30,000 characters goes to a file with only the path returned. `WebFetch` pipes the page through an extraction prompt on a small fast model, which the docs call "lossy by design."

None of that is model capability. All of it changes what the model does next.

## Where two harnesses diverge

**Tool set.** The SWE-agent paper argued in 2024 that agents need purpose-built interfaces; its [ACI notes](https://github.com/SWE-agent/SWE-agent/blob/main/docs/background/aci.md) settled on a 100-line file viewer, an edit command integrated with it, and a linter that *rejects* syntactically invalid edits. Anthropic reported spending more optimisation time on tools than on the prompt for their SWE-bench agent. That linter's 2026 descendant is Claude Code's `LSP` tool, reporting type errors automatically after each edit.

The edit primitive is where harnesses diverge hardest. Claude Code uses exact-string replace. Codex uses [`apply_patch`](https://github.com/openai/codex/blob/main/codex-rs/core/prompt_with_apply_patch_instructions.md), its own diff dialect:

```text
*** Begin Patch
*** Update File: src/loop.py
@@
 context line
-removed line
+added line
*** End Patch
```

Three lines of context each side, relative paths only. Trivedy flags the consequence: models post-trained against one harness overfit to its edit format and degrade in another. That cuts against the "just pick the best model" instinct.

**Context management.** Anthropic's [context engineering post](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) names the failure mode: context rot, where recall degrades as the window fills — in all models, at different rates. So harnesses fight for budget. Claude Code caps tool responses around 25,000 tokens; subagents return summaries of typically 1,000–2,000 tokens; MCP tool definitions load by name only until used — the productised version of [code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp), which took one worked example from 150,000 tokens to 2,000.

Delivery mode matters more than people expect. [*Is Grep All You Need?*](https://arxiv.org/pdf/2605.15184) (Sen et al., 2026) compared inline tool results against file-based ("programmatic") delivery across four harnesses and five models. Inline grep beat dense vector retrieval on *every* harness–model pair; programmatic delivery reversed the ordering on 5 of 10 pairs, with Codex + GPT-5.4 falling from 93.1% to 55.2%. Same backbone, different harness: Opus 4.6 scored 93.1% under their custom harness versus 76.7% under Claude Code. A memory benchmark, not a coding one — but the mechanism is generic.

Nor is search settled — [Cursor measured +12.5% accuracy](https://cursor.com/blog/semsearch) from semantic search but says grep plus semantic beats either alone.

**Permissions.** Enforcement, not persuasion. Claude Code's [permission docs](https://code.claude.com/docs/en/permissions.md) state it flatly: "Permission rules are enforced by Claude Code, not by the model." Rules evaluate deny → ask → allow, first match wins, specificity does not reorder. The details bite:

```json
{
  "permissions": {
    "deny": ["Bash(rm -rf /*)", "Read(//home/me/.ssh/**)"],
    "allow": ["Bash(ls *)", "Bash(git status)"]
  }
}
```

`Bash(ls *)` matches `ls -la` but not `lsof`; `Bash(ls*)` matches both. A bare-name deny (`Bash`) removes the tool from the model's context entirely, while a scoped deny leaves it visible and filters calls — one is a capability change the model can perceive, the other is a wall it walks into.

**Extension surface.** MCP (spec revision `2025-11-25`) carries third-party tools; its security section says hosts must obtain explicit user consent and that tool annotations "should be considered untrusted" — the protocol can't enforce that, so the harness must. [AGENTS.md](https://agents.md/) is the instruction-file convention, used by 60k+ projects and now stewarded by the Agentic AI Foundation under the Linux Foundation, with the sane rule that the closest file to the edited file wins. Hooks are the deterministic control points: a Claude Code hook exiting with code 2 blocks the call and feeds its stderr back as the reason, *before* permission rules are evaluated.

## What the harnesses actually chose

| Harness | Edit primitive | Default approval | Sandbox | Extension surface |
|---|---|---|---|---|
| Claude Code | exact-string `Edit`, read-before-edit | ask; deny→ask→allow rules, 6 modes | Seatbelt / bubblewrap, fs + network layers | MCP, hooks, Skills, subagents, CLAUDE.md |
| Codex CLI | `apply_patch` diff dialect | approval policy × sandbox mode | Seatbelt / bwrap+seccomp; network off in `workspace-write` | MCP, AGENTS.md, plugins, auto-review agent |
| Cursor | IDE-integrated | per-workspace auto-run controls | enterprise auto-run/network controls | MCP, rules/skills marketplace, own semantic index |
| Amp | — | **none** by default | — | plugins on `tool.call`, AGENTS.md, Oracle model |
| mini-swe-agent | bash only, no tool-calling API | n/a | your container | none by design |
| Pi | — | **no permission system** | your container | fork the harness |

The defaults are the personality. [Amp's manual](https://ampcode.com/manual) says outright that it doesn't prompt; Codex ships `--dangerously-bypass-approvals-and-sandbox` behind a name designed to make you think; Pi's README tells you to containerise, since it runs with your process's permissions. Three risk postures, three different feels.

Sandboxes are the honest answer to Simon Willison's [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) — private data, untrusted content, and outbound communication in one loop. Claude Code's [sandboxing docs](https://code.claude.com/docs/en/sandboxing) are candid about the limits: the proxy doesn't terminate TLS by default, so a broad allow like `github.com` "can create paths for data exfiltration," potentially via domain fronting.

## Where the harness claim is oversold

The number circulating in blog posts — Opus at 93% in Cursor versus 77% in Claude Code on Terminal-Bench 2.0 — appears nowhere on the official leaderboard. Real same-model cross-harness spreads there run roughly 3 to 14 points.

Nor does the harness dominate the model: on the 2.1 board, Claude Code + Opus 4.7 scores 68.9% and Claude Code + Fable 5 scores 83.8% — 15 points from swapping the model inside one harness, the *high* end of the harness spread. The two matter comparably; "the model doesn't matter" is wrong.

Harness choice also inflates the benchmarks themselves. In a June 2026 [analysis of standardised versus vendor harnesses](https://www.digitalapplied.com/blog/swe-bench-verified-june-2026-benchmark-vs-scaffolding-analysis), Claude Opus 4.5 dropped from 80.9% on SWE-bench Verified to 45.9% under Scale's SEAL harness. Public agent scores are joint measurements of a model and somebody's scaffolding; nobody separates them for you.

## What to do differently

Stop shopping for models and start reading tool references. Truncation limits, whether `cd` persists, what a failed edit says back to the model — better predictors of your day than any leaderboard.

Put enforcement in hooks and permission rules, never in the instruction file. A prompt shapes intent; a `PreToolUse` hook exiting 2 shapes outcomes. Keep the instruction file short — under 60 lines, per package, since nearest-file-wins.

Watch tool-output volume the way you watch memory: tight globs, many small searches instead of one huge one, and anything that dumps thousands of lines into context is a bug.

Pick your permission default on purpose. No-prompt harnesses genuinely feel better and are genuinely riskier; the mitigation is a sandbox and disposable credentials, not vigilance.

Then benchmark on your own repository. Given contamination and scaffolding inflation, an internal eval on code you own is the only measurement that transfers.
