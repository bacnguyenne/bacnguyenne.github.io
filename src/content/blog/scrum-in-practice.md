---
title: 'Scrum in practice'
description: 'The roles, events and artifacts Scrum actually defines, how each one degrades on a real team, and the kinds of work it fits badly.'
pubDate: 'Jul 31 2026'
tags: [engineering-practice, agile]
---

## The whole framework fits on one page

The [Scrum Guide](https://scrumguides.org/) is about thirteen pages, mostly definitions. Everything else you have been told is Scrum — story points, velocity charts, three-question standups, Jira workflows with eleven states — is local convention someone added on top.

What the Guide mandates:

- **Three accountabilities**: Product Owner, Scrum Master, Developers. Everyone building the thing is a "Developer," testers and designers included. Ten or fewer, no sub-teams.
- **Five events**: the Sprint, containing Sprint Planning, the Daily Scrum, the Sprint Review, and the Sprint Retrospective.
- **Three artifacts**: Product Backlog, Sprint Backlog, Increment. Each carries a commitment: the Product Goal, the Sprint Goal, and the Definition of Done.
- **Three pillars**: transparency, inspection, adaptation — a dependency chain, not slogans. You cannot inspect what is not visible, or adapt from an inspection you skipped.

That is the specification. It is deliberately incomplete: Scrum says when to look at your work and who decides what, and nothing about how to build software. Weak engineering practice shows up faster under Scrum but does not get fixed by it. Martin Fowler named the failure mode [flaccid Scrum](https://martinfowler.com/bliki/FlaccidScrum.html) — ceremonies on time, codebase rotting, velocity dropping every quarter, and no meeting that was ever supposed to prevent it. The engineering half comes from elsewhere: Kent Beck's *Extreme Programming Explained*, and the [Agile Manifesto](https://agilemanifesto.org/) both descend from, which is twelve principles rather than a process.

## The three roles, minus the folklore

The **Product Owner** owns the order of the Product Backlog. One person, not a committee, not a rotating duty. Organisations break this first: if four stakeholders can each push work straight into the sprint, nobody owns the trade-off between them and the team ends up arbitrating business priorities in a standup. Want your item moved up? Convince the PO.

The **Developers** own how the work gets done, the Sprint Backlog, and the sizing. A manager who assigns tasks in Sprint Planning has removed the self-management everything else assumes.

The **Scrum Master** is accountable for the team's effectiveness, not its schedule. Concretely: unblocking a two-week security review, killing a status meeting that duplicates the Sprint Review, teaching the PO to write backlog items longer than a fifteen-word title. If the main output is chasing Jira updates, the role has collapsed into project administration.

## What each event is for, and how it degrades

Timeboxes below are the Guide's maximums for a one-month Sprint; scale down proportionally for shorter ones.

| Event | Timebox | What it is actually for | How it degrades | Fix |
| --- | --- | --- | --- | --- |
| Sprint Planning | 8 h | Agree one Sprint Goal, then pick work serving it | Grooming marathon; team leaves with 23 tickets and no goal | Write the Sprint Goal first, on one line, before anything is pulled in |
| Daily Scrum | 15 min | Developers re-plan the next 24 h against the Sprint Goal | Round-robin status report to the Scrum Master or manager | Walk the board right-to-left; talk about blocked items, not about people |
| Sprint Review | 4 h | Show working software to stakeholders, decide what is next | Slide deck; approval gate; PO reads out a completion percentage | Demo from the deployed build, and let stakeholders reorder the backlog live |
| Sprint Retrospective | 3 h | Change one thing about how the team works | Fifty stickies, zero owners, same complaints next month | Pick exactly one improvement and put it in the next Sprint Backlog with a name on it |
| The Sprint itself | ≤ 1 month | A fixed container so replanning happens at a known cadence | Scope injected mid-sprint by whoever shouts loudest | Only the PO may cancel a Sprint; new work goes to the Product Backlog |

Two things people get wrong. The Sprint Review is not a release gate — an Increment meeting the Definition of Done can ship on day three, and often should. And the Daily Scrum's three questions ("what did I do, what will I do, what is blocking me") were dropped from the Guide in 2020, precisely because they turned the event into a status round.

## Sprint length

Shorter sprints cost more overhead per unit of work and buy faster correction. The right length is set by how fast your feedback actually arrives.

Two weeks is the default for a reason: short enough that a wrong assumption costs ten days, long enough to finish something non-trivial. I have run one-week sprints on a team with a flaky integration environment and it was miserable — half of every sprint was planning and review, and nothing needing a hardware-in-the-loop run fit inside one. If your validation loop takes four days, a one-week sprint is arithmetic that does not work. Change the length at most once, and only after a retrospective that says why.

## Definition of Done

The DoD has real teeth: work that does not meet it is not part of the Increment. It goes back to the Product Backlog and does not count as finished in the review.

A DoD reading "code reviewed, tested, documented" is decoration. Make it checkable, and where possible let CI check it so nobody argues in review:

```yaml
# .github/workflows/dod.yml — the mechanical half of our Definition of Done
name: definition-of-done
on: pull_request
jobs:
  gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pytest --cov=src --cov-fail-under=80
      - run: ruff check src tests
      - run: mypy src
      - name: Fail if new public function lacks a docstring
        run: python tools/check_docstrings.py --changed-only
```

The human half is a short checklist a reviewer confirms: rollback path known, on-call runbook updated, feature flag defaults to off, no new dependency without a licence check. Automate what a machine can decide; keep the human items few enough that people read them.

## Estimation

Scrum requires that backlog items be sized, and that the Developers doing the work do the sizing. It does not require story points, planning poker, velocity, or burndown charts — the 2020 Guide dropped burndowns entirely.

Sizing exists to decide whether an item is small enough to pull in, and to expose disagreement. When one engineer says 2 and another says 13, the number is worthless but the argument is the point: they are describing different work. Resolve that and the estimate stops mattering.

Estimates are not a commitment or a productivity metric. Report velocity upward as a performance number and it inflates — points drift, and the only signal it carried is gone.

## Where Scrum fits badly

Scrum assumes a stable-ish team, scope you can reorder, and a feedback loop shorter than the sprint. Break one and you pay ceremony cost for nothing.

- **Interrupt-driven work.** A support or platform team whose queue arrives hourly cannot commit to a Sprint Goal. Use Kanban — WIP limits, classes of service, cycle time. Keep the retrospective, drop the sprint.
- **Long-lead research.** A six-day training run, or a board bring-up waiting on a part with an eight-week lead time, does not fit a two-week container. Timebox the *investigation* and define done as "we know enough to decide."
- **Fixed-gate compliance work.** Audited and safety-critical processes have milestone reviews on dates you do not control. Scrum can run underneath them, but the Sprint Review is not that gate; pretending otherwise gets you a shadow process.
- **Teams of one or two.** All five events for two people is theatre. Keep a backlog and a weekly retrospective.
- **Undecided scope.** If nobody can act as PO, Scrum will not create that authority — it just gives the vacuum a meeting schedule.

## On Monday

- Write your current Sprint Goal in one sentence. If you cannot, you have a batch of tickets, not a sprint — fix it at the next planning.
- Open your Definition of Done. Delete every line a reviewer cannot verify in a minute; move the mechanical ones into CI.
- At the next standup, walk the board instead of the people. Notice how much faster it ends.
- Leave the next retrospective with one improvement, one owner, one ticket in the sprint. Bin the other stickies without guilt.
- Count unplanned arrivals for one sprint. Over a third, propose Kanban instead of getting better at missing the goal.
