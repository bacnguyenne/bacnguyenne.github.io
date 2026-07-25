---
title: 'Benchmarks will not tell you which agent to use'
description: 'Why SWE-bench Verified and Terminal-Bench are weak buying signals, and a two-week protocol for evaluating a coding agent on your own repository.'
pubDate: '2026-08-07'
tags: [llm, coding-agents, evaluation]
---

## The leaderboard is not the purchase decision

If you are choosing a coding agent for a team, stop reading leaderboards and spend two weeks running candidates on your own backlog. Below: why the public numbers mislead, then the protocol.

Benchmarks are not worthless. They are a decent screen for "is this model in the game", and a bad instrument for "will this make my team faster on our codebase".

## Reason one: the tasks are in the training data

SWE-bench Verified is [500 human-validated Python issues](https://www.swebench.com/verified.html), all from 2023 or earlier. Every issue and its fix has had years to land in pretraining corpora.

The leakage has been measured. [*Does SWE-Bench-Verified Test Agent Ability or Model Memory?*](https://arxiv.org/html/2512.10218v2) asked models to localise the file to edit **from the issue text alone**, no repository access. On SWE-bench Verified: 65% and 63.2%. On comparable Python OSS corpora: 12.2% and 12%. Roughly a 6x gap on a task that should be equally hard everywhere.

OpenAI's Frontier Evals team reportedly stopped publishing SWE-bench Verified results in February 2026, citing an audit where most of a 138-task problem sample was unsolvable as written. That story reaches me only through [secondary reporting](https://www.digitalapplied.com/blog/swe-bench-verified-june-2026-benchmark-vs-scaffolding-analysis) — the original post returns 403 — so treat it as unconfirmed.

Older structural criticism is easier to verify: [nilenso](https://blog.nilenso.com/blog/2025/09/25/swe-benchmarks/) notes the benchmark is all Python, that **over 40% of issues come from Django alone**, and that solutions are tiny — mean 11 lines changed, median 4. Your repo probably isn't Django, and your median PR isn't four lines.

## Reason two: task shape, not just task content

Benchmarks are single-shot: hand over an issue, get a patch, tests decide. Real work is iterative — an agent lands a change, builds on it next week, someone else builds on that.

[SlopCodeBench](https://arxiv.org/abs/2603.24755) measures the iterative case across 36 problems, 196 checkpoints, 15 agents. Best agent: **14.8% checkpoint pass rate**. More telling: **structural erosion rose in 77% of trajectories, verbosity in 75.5%**, with agent code 2.3x more verbose and 2.0x more eroded than a control of 473 human open-source Python repos. Prompt-level quality guidance cut *initial* verbosity and erosion by up to a third, but not the degradation rate.

None of that shows up in a pass-rate column. It shows up in your review queue three months later.

## Reason three: you are buying a harness, not a model

On the [Terminal-Bench 2.0 leaderboard](https://www.tbench.ai/leaderboard/terminal-bench/2.0), the top slots belong to harnesses nobody ships as a product — NexAU-AHE, LemonHarness, Capy, Polaris. The highest shipping product there is Codex CLI at 82.2% ±2.2, behind a research scaffold at 84.7% ±2.1 on the same model.

Harness swaps move scores by tens of points. In one June 2026 analysis, Claude Opus 4.5 falls from 80.9% on vendor-reported SWE-bench Verified to 45.9% under Scale's standardised SEAL harness — a 35-point cliff — and Gemini 3.1 Pro drops 26.4 points from Verified to SWE-bench Pro. [LOCA-bench](https://arxiv.org/abs/2602.07962) puts it plainly: the unit under test is "a combination of models and scaffolds". A model name alone identifies almost nothing.

The benchmarks themselves also move. [Terminal-Bench 2.1](https://www.tbench.ai/news/terminal-bench-2-1) (6 May 2026) **fixed 28 of the 89 tasks** — nine had Docker images still reaching the live internet, eight had budgets set too tight, several were misspecified (`query-optimize` asked for PostgreSQL while its tests expected Spark SQL). Per-task deltas ran from +84.3% to −18.6%.

And the aggregators disagree: [llm-stats](https://llm-stats.com/benchmarks/swe-bench-verified) lists 104 models on SWE-bench Verified, all self-reported, none verified, while [vals.ai](https://www.vals.ai/benchmarks/swebench) runs its own harness and gets a different ordering. If you want a public number that resists contamination by construction, [SWE-bench Pro](https://labs.scale.com/leaderboard/swe_bench_pro_public) uses GPL repos as a legal deterrent to training on them; scores sit at 55–62%, roughly where honest signal lives.

## The two-week evaluation

### Pick 8–12 real tasks before you look at any tool

From your backlog, spread across categories: 2 bug fixes with a reliable repro, 1 with only a customer report, 2 features in a well-trodden module, 1 feature crossing a service boundary, 1 dependency upgrade with breaking changes, 1 refactor with no behaviour change, 1 test backfill, 1 build/CI task.

Include two you have already solved — you know the shape of a good answer — and one that is genuinely open. Then freeze the list. Adding tasks after seeing results is how you talk yourself into a tool.

### Write pass criteria before the first run

Per task: which tests must pass, what must not regress, whether the API may change, what the reviewer will reject on. If you cannot write the criteria, the task is not eval-ready — a finding about your repo, not the agent.

### Change one thing at a time

Hold the harness constant while changing the model, then the reverse. Both halves matter: the leaderboard evidence says a harness is worth about as much as a model generation.

Two things sabotage this silently. **Auto-updates**: Claude Code's native installs auto-update, while the Homebrew cask `claude-code` tracks stable, lags about a week and skips regressed releases ([docs](https://code.claude.com/docs/en/overview)). **Routing**: [Cursor Router](https://cursor.com/changelog) (22 July 2026) picks a model per request by task type and complexity, and Copilot CLI added auto model selection on 1 July 2026 — under routing, "which model ran" is not yours to control. Turn it off, or accept you are evaluating the router.

```bash
# Pin the harness for the trial (stable cask, no auto-update)
brew install --cask claude-code
claude --version        # record this in every run record

# Pin the model. Claude IDs from 4.6 on are dateless but still
# pinned snapshots, not moving aliases.
claude --model claude-opus-5
```

Log one line per attempt:

```csv
run_id,task_id,harness,harness_version,model,started_at,merged_at,review_rounds,reviewer_minutes,diff_lines,outcome,failure_mode,usd_cost
```

### Measure time-to-merge and review burden, not pass rate

Pass rate is what benchmarks optimise and what matters least to you. A patch that passes tests and costs 90 minutes of senior review is worse than a smaller change that merges in ten.

Track **wall-clock to merged PR**, **review rounds**, **reviewer minutes**, and **diff size against your historical median** for that kind of change. The last is your local check on the SlopCodeBench verbosity finding.

If you add a fresh-context review agent, count what it catches. Cognition [reports](https://cognition.com/blog/multi-agents-working) a reviewer with no prior context finding ~2 bugs per PR, about 58% severe — it avoids the context rot affecting an agent that has worked for hours. Review is not free: GitHub applies a **13x premium-request multiplier to Copilot code review** since 1 June 2026, so each review burns 13 requests against a Pro allowance of 300/month ([billing docs](https://docs.github.com/en/copilot/concepts/billing/copilot-requests)).

### The scoring table

Copy this, one row per attempt.

| Task | Category | Pass criteria (written first) | Outcome | To merge | Rounds | Rev. min | Diff vs median | Failure mode | Cost |
|---|---|---|---|---|---|---|---|---|---|
| T-01 | bug, repro | `test_retry_backoff` green | pass | 42 min | 1 | 12 | 38 / 45 | — | $1.90 |
| T-02 | bug, no repro | root cause named, test added | partial | 3 h 10 | 3 | 55 | 210 / 45 | wrong-root-cause | $6.40 |
| T-03 | cross-boundary | contract unchanged, suites green | fail | — | 2 | 40 | 480 / 45 | scope-creep | $9.10 |

Then compute median time to merge, reviewer minutes per merged task and cost per merged task, and compare against your own no-agent baseline for the same categories. Without that baseline, the exercise measures nothing.

### Track the failure taxonomy

Aggregate pass/fail tells you which tool won. The taxonomy tells you what to change — and it usually points at your repo, not the vendor.

| Symptom | Likely cause | What to change |
|---|---|---|
| Right file, wrong fix | Ticket underspecified; intent guessed | Acceptance criteria in the ticket template |
| 10 files touched for a 20-line change | No convention signal; patterns reinvented | Document conventions the agent cannot infer |
| Passes tests, reviewer rejects | Tests don't encode the reviewer's standard | Fix the test suite — this is a real finding |
| Diff 5–10x your median | Verbosity drift (the SlopCodeBench pattern) | Cap diff size in pass criteria; add a reviewer |
| Stalls or gives up late in long tasks | Context exhaustion | Smaller tasks, or better context management |
| Good on task 1, bad on task 8 | Task-shape mismatch, not capability | Record the category; don't average it away |

Categories that fail for *your repo* reasons fail on every tool you try. That is worth more than the ranking.

## Budget

Anthropic publishes enterprise figures of roughly **$13 per developer per active day, $150–250 per month** ([cost docs](https://code.claude.com/docs/en/costs)); agent-team setups run about 7x a standard session, since each teammate carries its own context window. Subscriptions have converged on $20/$100/$200 with usage-based overflow: a two-week trial is cheap next to getting the decision wrong.

One trap: Anthropic's [pricing docs](https://platform.claude.com/docs/en/about-claude/pricing) note that Claude 4.7 and later use a newer tokenizer producing **about 30% more tokens for the same text**. Token counts are not comparable across that boundary — compare dollars per merged task.

## What to do differently

- Delete "SOTA on SWE-bench" from your criteria. It is self-reported, contaminated and harness-dependent.
- Never compare two tools whose harness versions you did not record. An auto-update mid-trial invalidates it.
- Write pass criteria before you run anything. Tasks you cannot specify are a finding about your repo.
- Report cost and reviewer minutes per *merged* task. Those survive contact with your CFO; pass rate does not.
- Keep the failure taxonomy. The winning tool will be superseded in a quarter; your failure modes will not.
