---
title: 'A field guide to coding agents, mid-2026'
description: 'The coding agents that exist in mid-2026, sorted by shape instead of vendor, with prices, licences, benchmark caveats and a decision guide.'
pubDate: '2026-08-07'
tags: [llm, coding-agents, tooling]
---

## Sort by shape, not by vendor

Every serious vendor now ships the same five surfaces: a terminal agent, an IDE surface, a cloud/async surface, a phone or remote-control surface, and a scheduler. Claude Code, Codex, Cursor, Devin, Antigravity and Amp all tick that list, so "which vendor" is the wrong first question.

The question that decides your day is **shape**: where the agent runs, and where you review its work.

- **IDE-native** — in the editor, you review every diff as it lands.
- **Terminal** — owns the working directory, you review at commit.
- **Cloud/async** — runs elsewhere, you review at PR.
- **Library/SDK** — you embed the loop in your own pipeline.

Most tool pain I see is a shape mismatch: a cloud agent used for exploratory debugging, or an IDE agent for a four-hour migration.

| Tool | Shape | Open source | Models | Pricing shape | Best-fit job |
| --- | --- | --- | --- | --- | --- |
| [Claude Code](https://code.claude.com/docs/en/overview) | Terminal + IDE + desktop/web/mobile | No | Claude only; Opus 5 default | Pro $17/mo annual ($20 monthly), Max from $100; or API/Bedrock/Vertex | Long-horizon work in a repo you own |
| [Codex](https://learn.chatgpt.com/codex/pricing) | Terminal + IDE + cloud + desktop | CLI Apache-2.0; rest closed | GPT-5.6 Sol/Terra/Luna, 5.5, 5.4 | Free, Go $8, Plus $20, Pro $100/$200, Business $20/user | Parallel cloud tasks from GitHub/Linear/Slack |
| [Cursor](https://cursor.com/pricing) | IDE-native + CLI + web + iOS | No | Own Composer 2/2.5 + Claude/GPT/Gemini/Grok | Hobby free, Individual $20, Teams $40/user | Editor work where you read every hunk |
| [Copilot](https://docs.github.com/en/copilot/get-started/plans) | IDE + CLI + cloud agents + PR review | CLI closed | Anthropic, OpenAI, Google, Cognition, xAI via Agent HQ | Free, Pro $10, Pro+ $39, Max $100, Business $19/seat | Work that lives in PRs and issues |
| [Cline](https://github.com/cline/cline) | VS Code + JetBrains + CLI + web kanban | Apache-2.0 | Anything: Bedrock, Vertex, Ollama, OpenRouter… | Free harness; BYOK or at-cost hosted | Step-by-step approval, regulated shops |
| [OpenCode](https://github.com/sst/opencode) | Terminal TUI + desktop beta | MIT | Any provider by key; 75+ | Free harness, BYOK | Vendor-neutral terminal agent |
| [Amp](https://ampcode.com/manual) | Terminal + web + phone | No | GPT-5.6 and Claude Fable 5, per job | Megawatt $20, Gigawatt $200, PAYG at zero markup | Opinionated speed, no approval prompts |
| [Devin](https://devin.ai/pricing) | Cloud agent + IDE (ex-Windsurf) + CLI | No | Opus 5, Fable 5, Sonnet 5, GPT-5.6 | Free, Pro $20, Max $200, Teams $80 + $40/seat | Delegated tickets; on-prem via Outposts |
| [Antigravity](https://antigravity.google/) | IDE + Go CLI + agent manager + SDK | No | Gemini 3.1 Pro / 3.6 Flash, Claude Sonnet 4.6 | Free for individuals; enterprise via Gemini Enterprise | Frontend with browser-in-the-loop |
| [Factory Droid](https://factory.ai/pricing) | Terminal + managed cloud machines | No | "All leading frontier and open-weight models" | Pro $20, Plus $100, Max $200, no free tier | Enterprise terminal work |
| [Hermes](https://hermes-agent.org/) | Terminal, self-hosted | MIT | Nous Portal, OpenRouter, local vLLM | Free | Agent on your server, persistent memory |
| [Pi](https://github.com/badlogic/pi-mono) | Terminal + libraries | MIT | Multi-provider via `pi-ai` | Free, BYOK | Forking your own harness |
| [Aider](https://aider.chat/) | Terminal, git-native | Apache-2.0 | Broad | Free, BYOK | Small surgical auto-committed edits |

One caveat on the last row. Aider is real infrastructure — 47.7k stars, 6.8M pip installs — but its homepage still recommends Claude 3.7 Sonnet, o1 and GPT-4o, and I found no 2026-dated release. Maintained, not keeping pace.

## Terminal

The frontier, and crowded. Install is a one-liner nearly everywhere:

```bash
curl -fsSL https://claude.ai/install.sh | bash          # Claude Code
curl -fsSL https://opencode.ai/install | bash           # OpenCode
python -m pip install aider-install && aider-install    # Aider
```

The differences are guardrails and session model, not editing ability. Claude Code leans on structure: hooks, skills, nested sub-agents to depth 3 by default since v2.1.219, plan mode, `/rewind` checkpoints, and MCP tool definitions deferred by default so only tool *names* enter context until used — which matters more than it sounds if you run many MCP servers (see my [MCP server post](/blog/build-an-mcp-server/) on tool-definition bloat).

Amp is the honest outlier: no backcompat guarantees and **no tool-approval prompts by default**. Its `oracle` second-opinion tool deliberately runs a *different* frontier model than the agent — GPT-5.6 Sol at high reasoning, switching to Claude Fable 5 when the agent is on GPT. More tools should copy that.

Pi is the minimal end: MIT, and **no permissions system at all**. It runs with your process's permissions and the README tells you to containerize.

## IDE-native

Cursor changed category: it now trains and ships its own frontier models. [Composer 2](https://cursor.com/blog/composer-2) landed March 19, 2026 (CursorBench 61.3, up from 44.2; Terminal-Bench 2.0 61.7), priced at [$0.50/$2.50 per MTok](https://cursor.com/docs/models) — about a tenth of frontier pass-through. Route through Auto and a $0.25/M Cursor Token Rate is added on third-party models. Cursor Router (July 22, 2026) classifies each request by task type with Intelligence / Balance / Cost modes; Copilot CLI got auto model selection July 1. Per-request routing is a category now, not a feature.

Devin Desktop is the former Windsurf. The [download page](https://devin.ai/download) says so plainly; migration was an OTA update carrying plans and settings over, and `windsurf.com/pricing` 308s to `devin.ai/pricing`.

Antigravity ate Gemini CLI. [Google's post](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) confirms Antigravity 2.0 and its Go-rewritten CLI went GA May 19, 2026, and that on **June 18, 2026 Gemini CLI and the Code Assist IDE extensions stopped serving free and Pro/Ultra individuals**. Enterprise keeps it via paid API keys.

## Cloud and async

Two ideas worth stealing. **GitHub Agent HQ** assigns parallel work to agents from Anthropic, OpenAI, Google, Cognition and xAI on one Copilot subscription, with custom agents in `.github/agents/` and execution confined to designated branches in sandboxed Actions runners.

**[Devin Outposts](https://devin.ai/blog/introducing-devin-outposts)** (July 21, 2026) is the better architecture: the agent loop stays in Cognition's cloud, execution happens on *your* hardware, and workers claim sessions from a queue — so **no inbound connectivity** to your network. If you've been blocked on "the agent can't reach our internal DB", that's the shape of the answer.

Billing landmine: since **June 1, 2026 Copilot code review carries a 13x premium-request multiplier** — each review burns 13 requests against your [300/mo Pro or 1,500/mo Pro+ allowance](https://docs.github.com/en/copilot/concepts/billing/copilot-requests), overage $0.04. New self-serve Copilot Business sign-ups have also been paused since April 22, 2026 for orgs on GitHub Free and Team plans.

## The leaderboard numbers are worse than they look

If you're choosing on benchmarks, stop.

OpenAI's Frontier Evals team stopped reporting SWE-bench Verified (reported February 2026) after finding tasks unsolvable as written and models reproducing gold patches from the task ID alone. The primary post 403s, so treat the specifics as secondary.

The peer-reviewed version is unambiguous. ["Does SWE-Bench-Verified Test Agent Ability or Model Memory?"](https://arxiv.org/html/2512.10218v2) measures file-localisation *from issue text alone*: **65% on SWE-bench Verified vs 12.2% on comparable Python OSS repos**. Roughly 6x. That gap is memorisation, not ability.

Harness inflation is the second problem. On a June 2026 snapshot Claude Opus 4.5 drops from 80.9% on Verified to **45.9%** under Scale's standardized SEAL harness. And on the [Terminal-Bench 2.0 leaderboard](https://www.tbench.ai/leaderboard/terminal-bench/2.0) most top slots are bespoke harnesses nobody ships; the best shipping product is Codex CLI + GPT-5.5 at 82.2%.

Honest signal now lives in [Terminal-Bench 2.1](https://www.tbench.ai/leaderboard/terminal-bench/2.1) — which repaired 28 of its own 89 tasks in May 2026, the first real "our benchmark was wrong" correction here, with Claude Code + Fable 5 leading at 83.8% ±1.2 — and [SWE-bench Pro](https://labs.scale.com/leaderboard/swe_bench_pro_public), whose contamination defence is *legal*: GPL-only repos, so training on them carries licence risk. Top score there is 61.50. That's what real difficulty looks like.

One trap when comparing cost across model generations: [Anthropic's docs](https://platform.claude.com/docs/en/about-claude/models/overview) note the Opus 4.7 tokenizer change makes the same text produce **~30% more tokens** than pre-4.7 models. Your "costs went up 30%" chart may be a tokenizer artifact.

## Decision guide

- **Solo, cost-sensitive, own the stack** — OpenCode or Cline, BYOK.
- **Most capable long-horizon agent, one vendor acceptable** — Claude Code. Anthropic's own enterprise data: **~$13/dev/active day, $150–250/dev/month**, 90% of users under $30/active day. Agent teams cost about **7x** a normal session.
- **Work already lives in PRs** — Copilot / Agent HQ, but model the 13x review multiplier before enabling it org-wide.
- **Parallel cloud tasks with published limits** — Codex, the only one publishing explicit per-window message counts.
- **You read every diff** — Cursor, with Composer 2.5 for bulk work at a tenth the token price.
- **Code can't leave your network** — Devin Outposts, or a self-hosted MIT agent (Hermes, OpenCode, Pi) against [local vLLM](/blog/serving-open-models-with-vllm/).
- **Free** — Antigravity for individuals, or any MIT/Apache harness plus your own key.

Almost every team I know runs **two**: an interactive agent where you steer, and an async agent where you review. A tool that claims both usually does the second one badly. Two isn't indecision, it's the correct shape.

## What to do differently

1. Pick by shape first, then by tolerable lock-in. Feature checklists will not separate these tools.
2. Build a 20-task eval on **your own repo** and run candidates through one shared harness. The vendor-vs-standardized gap is 20–35 points.
3. Price the failure mode, not the sticker: the 13x review multiplier, the 7x agent-team session, the tokenizer shift.
4. Fix your links. `docs.claude.com/en/docs/claude-code/*`, `developers.openai.com/codex` and `windsurf.com` all redirect elsewhere now.
