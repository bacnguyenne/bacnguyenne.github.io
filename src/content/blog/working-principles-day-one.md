---
title: 'Ten working principles for engineers, and how each one fails'
description: 'Ten principles that make an engineer good to work with, each grounded in a real situation, plus the specific failure mode each one produces when overdone.'
pubDate: 'Jul 31 2026'
tags: [soft-skills, career]
---

## Every principle is dose-dependent

The behaviours that make someone good to work with all have a dose at which they turn
harmful. Ownership becomes hoarding. High standards become a PR that never merges. The
engineers who are unpleasant to work with are rarely the ones who lack principles —
they're usually the ones running a good principle at ten times the useful dose.

So here are ten I actually use, each with the situation it applies to and the way it
goes wrong. If you only read the table, read the third column.

## Build from what your users need, not from a rival's changelog

In planning, someone puts a competitor's release notes on the screen and we start
generating tickets from them. That's not requirements gathering; that's outsourcing your
roadmap to a company whose constraints you can't see.

The alternative is unglamorous. Our diagnostics tooling got its most valuable change from
watching a field technician work: he was exporting logs, opening them in a spreadsheet,
and manually correlating timestamps across two files. Nobody had filed that as a request.
He'd stopped expecting it to be fixed.

**Failure mode:** feature-chasing. You ship parity with a competitor's list and nothing
your own users asked for, and the features arrive worse because you copied the surface
without the reasoning underneath.

## Process, metrics and status reports are proxies for reality

Every dashboard is a lossy compression of a system. That's fine until you start managing
the compression instead of the system.

The clearest version of this I've seen: all service health checks green, and a customer
unable to complete a single request. The health check pinged a `/health` endpoint that
returned 200 as long as the process was alive. It was measuring "the JVM has not
crashed," and we had been reading it as "the service works."

Keep first-hand contact. Read the log yourself rather than the summary of the log. Run
the failing test on your machine before theorising about it. Call the person who filed
the ticket — five minutes there routinely beats an hour of guessing at what they meant.

**Failure mode:** deciding all process is theatre. The engineer who keeps everything in
their head, writes no runbook, and skips the design review is not resisting proxies. They
have made themselves the proxy, and they don't scale past one person.

## A standard is an explicit, checkable bar

"High quality" is not a standard. "No new public function merges without a test that
fails if you delete the body" is a standard, because two people can look at a diff and
agree on whether it's met.

Standards are also team-specific and learnable. A new joiner doesn't know that your team
requires a rollback plan in the PR description, or that a `TODO` without a ticket number
gets rejected. They aren't lowering the bar; they can't see it. Write it down, and you've
turned a personality trait into something teachable.

Raising the bar is a separate move, and it should be deliberate: pick one thing per
quarter and make it non-negotiable.

**Failure mode:** perfectionism that never ships. A three-week review argument about
naming in a service with two users has a cost, and the cost is the thing you didn't build.

## Learning has to be deliberate, or it's a hobby

Passive learning is reading whatever the algorithm serves you. Deliberate learning is
picking the thing that actually cost you time. I lost two days to a CAN bus arbitration
issue because I'd never properly read that section of the spec. Reading it took ninety
minutes. That is a better return than any course I took that year.

**Failure mode:** learning as procrastination. Starting a third framework tutorial is a
socially acceptable way to avoid the migration you don't want to begin. If you can't name
the decision the learning will improve, you're hiding.

## Sort decisions by how expensive they are to undo

Most decisions are reversible and get treated as if they aren't. A few are irreversible
and get treated as if they are. Both errors are expensive; the second is worse.

<figure>
<svg viewBox="0 0 660 210" role="img" aria-label="Flowchart: a decision is checked for reversibility. If cheap to undo, decide in the meeting and set a review date. If not, write down the options and consequences, get a second reader, then decide." xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="80" width="140" height="50" rx="6" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="78" y="103" text-anchor="middle" font-size="14" fill="var(--heading)">A decision</text>
  <text x="78" y="120" text-anchor="middle" font-size="14" fill="var(--heading)">arrives</text>

  <path d="M148 105 H 212" stroke="var(--text-muted)" stroke-width="1.5" fill="none"/>
  <path d="M212 105 l -8 -4 v 8 z" fill="var(--text-muted)"/>

  <rect x="214" y="76" width="150" height="58" rx="6" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="289" y="99" text-anchor="middle" font-size="14" fill="var(--heading)">Cheap to undo</text>
  <text x="289" y="117" text-anchor="middle" font-size="14" fill="var(--heading)">next month?</text>

  <path d="M364 95 H 420 V 45 H 470" stroke="var(--border)" stroke-width="1.5" fill="none"/>
  <path d="M470 45 l -8 -4 v 8 z" fill="var(--border)"/>
  <text x="418" y="72" text-anchor="middle" font-size="12" fill="var(--text-muted)">yes</text>

  <path d="M364 115 H 420 V 165 H 470" stroke="var(--accent)" stroke-width="1.5" fill="none"/>
  <path d="M470 165 l -8 -4 v 8 z" fill="var(--accent)"/>
  <text x="418" y="148" text-anchor="middle" font-size="12" fill="var(--text-muted)">no</text>

  <rect x="472" y="20" width="180" height="50" rx="6" fill="var(--surface-2)" stroke="var(--border)"/>
  <text x="562" y="42" text-anchor="middle" font-size="13" fill="var(--text)">Decide now, note</text>
  <text x="562" y="59" text-anchor="middle" font-size="13" fill="var(--text)">a date to revisit</text>

  <rect x="472" y="140" width="180" height="50" rx="6" fill="var(--surface-2)" stroke="var(--accent)"/>
  <text x="562" y="162" text-anchor="middle" font-size="13" fill="var(--text)">Write the options</text>
  <text x="562" y="179" text-anchor="middle" font-size="13" fill="var(--text)">down, get a reader</text>
</svg>
<figcaption>One test, two speeds: reversibility decides how much ceremony a decision earns.</figcaption>
</figure>

Reversible: log format, directory layout, which assertion library, anything behind a
feature flag. Decide in the meeting. One-way doors: the shape of a public API other teams
build against, a storage format already written to a million rows, firmware flashed to
vehicles in the field, a vendor you're now integrated with in forty places.

**Failure mode:** saying "we can change it later" about a one-way door. You can, but
"later" now means a migration, a deprecation window, and a year of supporting both.

## Disagree properly, then commit fully

Arguing well has a shape: state your position, the concrete cost you expect, the evidence
behind it, and what would change your mind. Say it once, in writing, where the decision
is being made. Then ask for the decision to be made.

If it goes against you, you're now building the other thing — genuinely. Not "I told you
so" in the retro. Not a design that quietly leaves room for your version. The decision
was made with your objection on the record; that's the system working.

**Failure mode:** silent non-compliance. Nodding in the meeting and then slow-walking the
work is worse than the original disagreement, because it teaches everyone that agreement
in a room means nothing.

## Ownership is about the result, not your ticket

Your ticket is done. The feature still doesn't work, because the upstream service returns
`null` in a field you assumed was populated. Ownership is the difference between "not my
component" and either fixing it, filing it with a reproduction, or walking to the team
that owns it.

**Failure mode:** hero culture. The person who owns everything, answers every page, and
never writes the runbook has produced a single point of failure with a pulse. Ownership
that doesn't end in documentation and a second capable person is hoarding, and it burns
people out on a predictable schedule.

## Invention is the fun half; simplification is the valuable one

Anyone can add. Deleting the config layer nobody ever set, collapsing a 400-line state
machine into a lookup table, removing the abstraction that has exactly one implementation
— that's harder, because it requires understanding the whole thing first.

**Failure mode:** rewriting things that work. A boring service with no open bugs is not a
refactoring opportunity. It's an asset. Simplify what you're already forced to touch.

## Prefer the cheap experiment — where it's genuinely cheap

Two candidate model architectures, and a week of arguing about which will generalise
better. Both fit on the GPU box overnight. Run them.

That reasoning holds only where the experiment is cheap *and* reversible. "Let's just try
it" applies to a branch; it does not apply to a production schema migration.

A failed experiment is data only if you wrote down what you expected beforehand.
Otherwise you'll rationalise the result and learn nothing.

## Set the target past the constraint, then work backwards

"Make the build 10% faster" gets you a cache. "Make the build 4 minutes instead of 40"
makes you ask why the whole thing rebuilds when one file changed. Same engineers, same
week — different question.

Then work backwards to the first concrete step this sprint. A big goal without a Monday
task is a slogan.

| Principle | In practice | Overdone |
| --- | --- | --- |
| Serve the user | Watch someone use the thing before writing tickets | Feature parity with a rival nobody here uses |
| Resist proxies | Read the log, not the summary of the log | No runbooks, no reviews, doesn't scale past you |
| High standards | An explicit bar two people can check on a diff | Nothing merges; naming debates outlive the feature |
| Raise the bar | One new non-negotiable per quarter | Standards churn faster than anyone can absorb |
| Deliberate learning | Study the thing that cost you two days | A tutorial instead of the migration you're avoiding |
| Fast reversible calls | Decide in the meeting; note a revisit date | Speed applied to a one-way door |
| Disagree and commit | Objection in writing, once, then build it | Nodding, then quietly doing it your way |
| Ownership | Chase the result across team boundaries | Hero on every page, bus factor of one |
| Invent and simplify | Delete the layer with one implementation | Rewriting a service that has no bugs |
| Bias for action | Run both models overnight instead of arguing | "Just trying it" on the production database |
| Think big | Target 10x, then find this sprint's first step | A goal with no first step |

## On Monday

- Take the oldest open decision on your team and label it reversible or one-way. If it's
  reversible and still open, close it today.
- Pick one review comment you make repeatedly and turn it into a written, checkable rule
  in the repo. That converts your taste into the team's standard.
- Find one health check or dashboard you trust and verify by hand that it would actually
  go red if the thing it watches broke.
- In your next design review, if you disagree, write the objection down in one paragraph
  with the cost you expect. Then let it be decided and drop it.
- Name the last thing that cost you more than a day, and spend ninety minutes reading the
  primary source on it — the spec, the RFC, the datasheet.
- Delete something. An unused flag, a dead branch, an abstraction with one caller. Ship
  that as its own commit.
