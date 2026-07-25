---
title: 'Ten working principles for engineers, and how each one fails'
description: 'Ten principles that make an engineer good to work with, each grounded in a real situation, plus the failure mode each one produces when overdone.'
pubDate: 'Jul 31 2026'
tags: [soft-skills, career]
---

## Every principle is dose-dependent

Every behaviour that makes someone good to work with has a dose at which it turns
harmful. Ownership becomes hoarding; high standards become a PR that never merges.
Engineers who are hard to work with rarely lack principles — they run a good one at ten
times the dose. Ten I use, each with the situation it applies to and how it goes wrong.

## Build from what your users need, not from a rival's changelog

In planning, someone puts a competitor's release notes on screen and we start generating
tickets from them. That's not requirements gathering — it's outsourcing your roadmap to a
company whose constraints you can't see.

The best change we made to our diagnostics tooling came from watching a field technician
correlate timestamps across two exported logs by hand in a spreadsheet. Nobody had filed
it; he'd stopped expecting it to be fixed.

**Failure mode:** feature-chasing. You ship parity with someone else's list, nothing your
own users asked for, and the copies land worse because you took the surface without the
reasoning under it.

## Process, metrics and status reports are proxies for reality

Every dashboard is a lossy compression of a system — fine, until you manage the
compression instead of the system.

The clearest version I've seen: every health check green, customer unable to complete a
request. The check hit a `/health` endpoint that returned 200 while the process was
alive. It measured "the JVM has not crashed"; we read it as "the service works."

Keep first-hand contact: read the log, not the summary of the log; run the failing test
yourself before theorising; call the person who filed the ticket. Five minutes there
beats an hour of guessing what they meant.

**Failure mode:** deciding all process is theatre. The engineer who keeps everything in
their head, writes no runbook and skips design reviews hasn't resisted the proxy — they
have become one.

## A standard is an explicit, checkable bar

"High quality" is not a standard. "No new public function merges without a test that
fails if you delete the body" is one, because two people can look at a diff and agree on
whether it's met.

Standards are team-specific and learnable. A new joiner doesn't know you require a
rollback plan in the PR description, or that a `TODO` without a ticket number gets
rejected. They aren't lowering the bar; they can't see it. Write it down and taste
becomes teachable. Raising the bar is a separate, deliberate move: one new
non-negotiable per quarter.

**Failure mode:** perfectionism that never ships. A three-week naming argument in a
service with two users costs exactly what you didn't build instead.

## Learning has to be deliberate, or it's a hobby

Passive learning is reading whatever the feed serves. Deliberate learning is studying
what actually cost you time. I lost two days to a CAN bus arbitration issue
because I'd never properly read that part of the spec. Reading it took ninety minutes —
a better return than any course I took that year.

**Failure mode:** learning as procrastination. Starting a third framework tutorial is a
socially acceptable way to avoid the migration you don't want to begin. If you can't name
the decision the learning improves, you're hiding.

## Sort decisions by how expensive they are to undo

Most decisions are reversible and get treated as if they weren't. A few are irreversible
and get treated as if they were. The second error is much more expensive.

<figure>
<svg viewBox="0 0 660 210" role="img" aria-label="Flowchart: a decision is checked for reversibility. If cheap to undo, decide now and note a date to revisit. If not, write the options down and get a second reader before deciding." xmlns="http://www.w3.org/2000/svg">
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

Reversible: log format, directory layout, anything behind a feature flag. Decide in the
meeting. One-way: a public API other teams build against, a storage format already
written to a million rows, firmware flashed to vehicles in the field.

**Failure mode:** saying "we can change it later" about a one-way door. You can — where
"later" means a migration, a deprecation window and a year of supporting both.

## Disagree properly, then commit fully

Arguing well has a shape: your position, the cost you expect, the evidence, and what
would change your mind. Say it once, in writing, where the decision gets made — then ask
for it to be made.

If it goes against you, you build the other thing — genuinely. Not "I told you so" in the
retro, not a design that quietly leaves room for your version.

**Failure mode:** silent non-compliance. Nodding in the meeting and slow-walking the work
is worse than the original disagreement, because it teaches everyone that agreement in a
room means nothing.

## Ownership is about the result, not your ticket

Your ticket is done. The feature still doesn't work, because the upstream service returns
`null` in a field you assumed was populated. Ownership is the gap between "not my
component" and either fixing it, filing it with a reproduction, or walking to the team
that owns it.

**Failure mode:** hero culture. Someone who owns everything, answers every page and never
writes the runbook is a single point of failure with a pulse. Ownership that doesn't end
in documentation and a second capable person is hoarding.

## Invention is the fun half; simplification is the valuable one

Anyone can add. Deleting the config layer nobody set, collapsing a 400-line state machine
into a lookup table, removing the abstraction with one implementation — that's harder,
because it needs understanding the whole thing first.

**Failure mode:** rewriting things that work. A boring service with no open bugs isn't a
refactoring opportunity, it's an asset. Simplify what you're already forced to touch.

## Prefer the cheap experiment — where it's genuinely cheap

Two candidate model architectures, and a week of arguing about which generalises better.
Both fit on the GPU box overnight. Run them.

That only holds where the experiment is cheap *and* reversible: "let's just try it"
applies to a branch, not to a production schema migration. And a failed experiment is
data only if you wrote down what you expected first — otherwise you'll rationalise the
result and learn nothing.

## Set the target past the constraint, then work backwards

"Make the build 10% faster" gets you a cache. "Make the build 4 minutes instead of 40"
makes you ask why the whole thing rebuilds when one file changed. Same engineers, same
week, different question. Then work backwards to a first concrete step this sprint — a
big goal with no Monday task is a slogan.

| Principle | In practice | Overdone |
| --- | --- | --- |
| Serve the user | Watch someone use it before writing tickets | Parity with a rival nobody here uses |
| Resist proxies | Read the log, not the summary of it | No runbooks; doesn't scale past you |
| High standards | A bar two people can check on a diff | Naming debates outlive the feature |
| Deliberate learning | Study what cost you two days | A tutorial instead of the migration |
| Reversible calls | Decide now, note a revisit date | Speed applied to a one-way door |
| Disagree and commit | Objection in writing once, then build it | Nodding, then doing it your way |
| Ownership | Chase the result across team lines | Hero on every page, bus factor of one |
| Invent and simplify | Delete the layer with one caller | Rewriting a service with no bugs |
| Bias for action | Run both models overnight, don't argue | "Just trying it" on the prod database |
| Think big | Target 10x, then find this sprint's step | A goal with no first step |

## On Monday

- Label your team's oldest open decision reversible or one-way. If it's reversible, close
  it today.
- Turn one review comment you make repeatedly into a written, checkable rule in the repo.
  That converts your taste into the team's standard.
- Verify by hand that one health check you trust would actually go red if the thing it
  watches broke.
- Put your next design-review disagreement in one written paragraph with the cost you
  expect. Then let it be decided, and drop it.
- Spend ninety minutes on the primary source — spec, RFC, datasheet — for the last thing
  that cost you more than a day.
- Delete something: an unused flag, a dead branch, an abstraction with one caller.
