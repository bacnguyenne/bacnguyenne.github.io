---
title: 'Technical debt is a decision, not a sin'
description: 'How to tell deliberate debt from accidental mess, measure what it costs you, and make the case for paying it down in numbers a manager will accept.'
pubDate: 'Jul 21 2026'
tags: [engineering-practice, code-quality]
---

## The metaphor was invented to defend shipping early, not to shame people

Ward Cunningham coined the debt metaphor while explaining to non-technical stakeholders
why his team kept rewriting code that already worked. His argument was not "we made a
mess and we're sorry." It was: you ship with a partial understanding of the problem,
and that's correct — shipping is how you learn. But you then have to fold what you
learned back into the code. If you don't, every future change costs extra, forever.
That extra cost is the interest.

Martin Fowler's write-up on
[the debt metaphor](https://martinfowler.com/bliki/TechnicalDebt.html) keeps that
framing. Since then the phrase has drifted into meaning "any code I don't like," and
that drift is why the conversation with your product manager goes badly. If debt just
means bad code, asking for time to fix it is asking to be paid for your own mistakes.
If debt means a loan taken deliberately to hit a date, paying it down is ordinary
financial hygiene.

## Where the metaphor breaks

Take it too literally and it misleads you in three ways.

**You can't see the balance.** A real loan has a number on a statement. Any tool
reporting "€437,000 of technical debt" from static analysis is making that up — it
counts rule violations and multiplies by a guessed remediation time. Nobody wrote that
cheque.

**Interest is only charged on code you touch.** This is the part people get wrong most
often. A gnarly 3,000-line module nobody has modified in four years, that doesn't
crash, is costing you approximately nothing. A 200-line file with tangled conditionals
that three people edit every sprint is costing you weekly. "Clean up the codebase" is a
bad goal. "Make the CAN signal decoder safe to change" is a goal.

**Some of it is never worth repaying.** If a service is decommissioned in six months,
its debt gets written off. Deciding *not* to fix something is a legitimate answer — as
long as it's a decision and not avoidance.

## Fowler's quadrant, and why "reckless" is the only bad box

Fowler's [technical debt quadrant](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html)
splits debt on two axes: deliberate vs. inadvertent, and prudent vs. reckless.

| | **Deliberate** | **Inadvertent** |
| --- | --- | --- |
| **Prudent** | "We hardcode the three known vehicle variants to make the auto show demo; the generated table lands in Q3." | "Now that we've shipped, it's obvious the decoder should have been table-driven." |
| **Reckless** | "We don't have time for tests on this one." | "What's a layered architecture?" |

Three of those four boxes are normal engineering. Prudent-deliberate is a trade made
with open eyes. Prudent-inadvertent is what learning looks like — you could not have
known before you built it. Reckless-inadvertent is a training and review problem, not a
moral one.

Only reckless-deliberate is a genuine failure: you knew better, you had the time, you
skipped it anyway. That box is emptier than the "developers are lazy" narrative
suggests. Most debt on real teams is prudent-deliberate debt nobody wrote down, so it
quietly became permanent.

## What it actually looks like on the ground

Debt doesn't announce itself. It surfaces as two measurable effects: changes take
longer, and more of them break something. Everything else — the frustration, the
turnover, the "don't touch that file" folklore — is downstream of those two.

| Debt type | Symptom you'll actually notice | Payoff for fixing it |
| --- | --- | --- |
| Duplicated logic | The same bug is fixed three times in three files; one copy always gets missed | One place to change; bug-fix effort drops to 1× |
| Tangled dependencies | A change to logging requires recompiling the perception stack | Small changes stay small; build and test time collapse |
| No test automation | Every release needs two days of manual regression | Refactoring becomes cheap, which unlocks every other fix |
| Flaky tests | Engineers re-run CI until green; real failures get ignored | The suite becomes evidence again instead of noise |
| Long, branchy functions | Reviewers approve without understanding; new hires take a month on it | Reviews get real; onboarding drops to days |
| Unsupported dependency | A CVE lands and there is no patched version to upgrade to | Security response goes from "port the fix ourselves" to `pip install -U` |
| Tribal knowledge | One person is on every incident call and can't take leave | Bus factor above one; on-call stops being one person's problem |
| Manual deploys | Releases happen at 2am on Fridays and sometimes get rolled back | Deploy on a Tuesday afternoon, in daylight, un-dramatically |
| Config drift between envs | "Works on my machine"; staging and prod disagree | Reproduction becomes possible, so debugging becomes possible |

## Measure the effect, not the mess

Don't size the principal. Measure the interest — the recurring cost — because that's
what you can observe and what a business person can act on. Start with churn, since
interest accrues only where the code changes:

```bash
# Files touched most often in the last year — your interest-bearing accounts
git log --since='12 months ago' --name-only --pretty=format: \
  | grep -v '^$' \
  | sort | uniq -c | sort -rn \
  | head -20
```

Now cross that against complexity. A file that is both high-churn and high-complexity
is where your money is going:

```bash
# Python: cyclomatic complexity, grade C and worse
radon cc -s -n C src/ | head -30
```

Then measure how long changes take end to end. This is the number executives care
about, and you can get it from your forge:

```bash
# Hours from PR open to merge, with size, for the last 100 merged PRs
gh pr list --state merged --limit 100 \
  --json number,additions,createdAt,mergedAt \
  --jq '.[] | [.number, .additions,
               (((.mergedAt|fromdate) - (.createdAt|fromdate)) / 3600 | floor)] | @tsv'
```

If a 30-line PR routinely takes four days to merge, that's not a people problem.

Two more are free and legible to someone who has never opened your repo: percentage of
sprint capacity lost to unplanned work, and time-to-first-merged-PR for new joiners.
Both trend up as debt accumulates.

A subjective signal works too: have the team rate quality in the areas they touched,
1–5, every retro. The absolute value is meaningless; the direction over six months
isn't.

## Making the argument in the language of money

Engineers lose this argument by describing the code. Win it by describing the invoice.

Weak: *"The signal decoder needs refactoring, it's badly designed."*

Strong: *"Adding a vehicle variant to the decoder takes three weeks, because the DBC
mapping is hardcoded in 14 places and we miss one about half the time. Five variants
are on the roadmap this year — that's 15 weeks. Two weeks of work makes it
table-driven; the remaining variants cost two days each. Net saving is about 12 weeks,
and it removes the class of defect behind both field incidents in March."*

Same request. The second version has a payback period, a comparison against roadmap
work, and a risk story. It's now a normal investment decision — one your manager
already knows how to make.

Two things make this stick. Keep debt items in the same backlog as features, with the
same estimates — a separate "tech debt board" is a board nobody prioritises. And
ring-fence a standing 15–20% of sprint capacity so routine paydown doesn't need
re-arguing every time. That fraction is what the
[Agile Manifesto](https://agilemanifesto.org/principles.html) means by "continuous
attention to technical excellence and good design enhances agility" — a technical
claim, not a wellbeing one.

Avoid the big-rewrite pitch. It asks for a large budget, delivers nothing for months,
and reliably reproduces the original debt with fresh bugs. Incremental replacement
behind a stable interface is slower on paper and finishes sooner in practice.

## What to do on Monday

- Run the churn command against your repo. Pick the single worst file that is both
  high-churn and high-complexity. That's your first target — not the file you hate
  most.
- For your next prudent-deliberate shortcut, open the backlog ticket *in the same
  commit* that takes the shortcut, and reference it from a comment in the code. Debt
  that isn't written down becomes permanent.
- Rewrite one existing "refactor X" ticket into hours-saved-per-change and
  incidents-avoided. See whether it gets scheduled.
- Fix or delete the flakiest test in your suite today. A suite people don't trust is
  worse than no suite: it costs time and buys nothing.
- Leave every file you touch this week slightly better — one renamed variable, one
  extracted function — in a separate commit from the behaviour change, so the reviewer
  can read both.
