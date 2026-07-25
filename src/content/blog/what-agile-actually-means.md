---
title: 'Agile, before the frameworks'
description: 'What the four values and twelve principles actually say, which ones matter in practice, how to spot agile theatre, and when plan-driven is the right call.'
pubDate: 'Jul 30 2026'
tags: [engineering-practice, agile]
---

## Agile is a page of text, not a tool

The whole of agile is four value statements and twelve principles, published on [agilemanifesto.org](https://agilemanifesto.org) in 2001. Stand-ups are not in it. Story points are not in it. Neither are sprints, burndown charts, Jira workflows, or two-day certification courses.

That gap matters, because in most organisations "we're agile" means "we run the ceremonies." Those are two independent claims. The best team I have worked on ran a perception-model pipeline with no sprint boundary at all — they cut a candidate model whenever the validation set said it was better than the one in the car — and they adapted faster than any Scrum team in the building. A team down the hall had every ceremony, a certified coach, and a six-month cycle from requirement to anything a customer could see.

So read the source. It is shorter than the average onboarding doc.

## The four values, read literally

Every value is a comparison of two real things, written as "we value X over Y." The sentence people forget sits directly under them: *while there is value in the items on the right, we value the items on the left more.* The right-hand items are not junk. They are the things you sacrifice **second**, not the things you delete.

**Individuals and interactions over processes and tools.** When a labelling error shows up in a training set, the fix is one call between the data engineer and whoever wrote the annotation spec. Not a defect ticket that routes through two queues. But the release checklist that blocks a flash of an ECU without a signed hardware-in-the-loop run stays — that process exists because a human once forgot.

**Working software over comprehensive documentation.** A demo on target hardware settles an architecture argument in ninety seconds; a 40-page design doc argues for a month. And yet in automotive, some documents *are* the product: the safety case, the interface control document a supplier builds against. Those get written properly.

**Customer collaboration over contract negotiation.** The OEM integration engineer who joins your Thursday review catches the CAN signal-scaling mismatch in week 3. The one who only reads your milestone report catches it at vehicle integration, in week 30. Contracts still exist — you just stop using them as the primary channel.

**Responding to change over following a plan.** Plans are how you find out you were wrong. Keeping one after the evidence changed is the failure, not having one.

<figure>
<svg viewBox="0 0 640 264" role="img" aria-label="Four horizontal bars, one per Agile value pair. In each bar the left-hand item fills roughly seventy percent and the right-hand item fills the remaining thirty percent, showing that the right-hand items still carry weight.">
  <g font-family="inherit" font-size="13">
    <text x="8" y="14" fill="var(--heading)">Individuals and interactions</text>
    <text x="632" y="14" text-anchor="end" fill="var(--text-muted)">Processes and tools</text>
    <rect x="8" y="22" width="624" height="14" rx="3" fill="var(--surface-2)" stroke="var(--border)"/>
    <rect x="8" y="22" width="436" height="14" rx="3" fill="var(--accent)"/>

    <text x="8" y="74" fill="var(--heading)">Working software</text>
    <text x="632" y="74" text-anchor="end" fill="var(--text-muted)">Comprehensive documentation</text>
    <rect x="8" y="82" width="624" height="14" rx="3" fill="var(--surface-2)" stroke="var(--border)"/>
    <rect x="8" y="82" width="436" height="14" rx="3" fill="var(--accent)"/>

    <text x="8" y="134" fill="var(--heading)">Customer collaboration</text>
    <text x="632" y="134" text-anchor="end" fill="var(--text-muted)">Contract negotiation</text>
    <rect x="8" y="142" width="624" height="14" rx="3" fill="var(--surface-2)" stroke="var(--border)"/>
    <rect x="8" y="142" width="436" height="14" rx="3" fill="var(--accent)"/>

    <text x="8" y="194" fill="var(--heading)">Responding to change</text>
    <text x="632" y="194" text-anchor="end" fill="var(--text-muted)">Following a plan</text>
    <rect x="8" y="202" width="624" height="14" rx="3" fill="var(--surface-2)" stroke="var(--border)"/>
    <rect x="8" y="202" width="436" height="14" rx="3" fill="var(--accent)"/>

    <text x="8" y="250" fill="var(--text)">Left is weighted higher. Right is not zero.</text>
  </g>
</svg>
<figcaption>The four value pairs. Each right-hand item keeps real weight — the manifesto says so explicitly.</figcaption>
</figure>

## The principles that carry most of the load

Twelve principles, and they are not equally load-bearing. In my experience four of them do most of the work, and if you only get these four you will already outperform a team doing full Scrum without them.

**Working software is the primary measure of progress.** This is the one that kills status theatre. "Perception module 80% complete" means nothing. "The model runs on the target SoC at 22 ms and the drive log replays clean" means something.

**Deliver working software frequently — weeks, not months.** Short cycles are not about speed for its own sake. They bound how wrong you can be before someone tells you. A three-week integration cadence means a bad interface assumption costs three weeks; an annual one means it costs a year.

**Simplicity — maximising the work not done.** The most valuable thing a senior engineer does is delete a requirement. The config framework nobody asked for, the abstraction layer for the second vendor that never arrived: that is where schedules go.

**At regular intervals the team reflects and adjusts.** This is the only self-correcting mechanism in the document. Everything else is a static rule; this one lets a team fix its own rules.

The others matter — sustainable pace, technical excellence, motivated individuals given trust — but they tend to follow from these four rather than lead.

## What actually changes, and what doesn't

What changes: decisions move to the people holding the evidence. Integration stops being a phase and becomes a daily condition. Estimates become forecasts you revise, not commitments you defend. Requirements arrive as conversations plus acceptance criteria instead of a frozen 200-page spec. Rework gets found in week 3 instead of week 30.

What does not change: the work still takes as long as it takes. Agile is not a productivity multiplier and anyone selling it as one is selling something. Hard problems stay hard — a sensor fusion stack with a latency budget is difficult under any methodology. Code review, CI, static analysis, coding standards, traceability: all still mandatory. Deadlines still exist. You still need architecture; "emergent design" does not mean "no design," it means the design is allowed to be corrected by what you learn.

## Agile theatre

The common failure is a team running every ceremony and shipping at exactly the pre-agile rate. The ceremonies were adopted; the values were not. It is diagnosable from symptoms.

| Symptom | What it's supposed to be | The fix |
|---|---|---|
| Backlog nobody grooms — 300 stale items, top of list written 8 months ago | A ranked, living list of the next most valuable work | Delete anything untouched for 90 days. If it matters it comes back. Groom 30 minutes a week, top 20 items only. |
| Retro with no action items, or the same three complaints every time | The team's mechanism for changing its own process | One action per retro, named owner, checked at the next retro. Zero actions two retros running means stop holding it. |
| "Sprint" whose scope is set by someone outside the team, mid-sprint | A commitment the team makes and controls | The team decides what enters the sprint. Anything urgent enters by displacing something — visibly, with the person asking present. |
| Velocity used as a performance metric across teams | A rough planning aid, internal to one team | Stop reporting it upward. Report shipped increments. Points inflate the moment they are graded — you have measured nothing. |
| Daily stand-up as a status report to the lead | Peer coordination and unblocking | Face the board, not the manager. If nobody's plan changed as a result, cancel it and use a channel message. |

The tell is always the same: the ritual persists after the feedback it was meant to produce has stopped arriving.

## When plan-driven is genuinely the better choice

Agile is not universally correct, and pretending otherwise costs credibility with the people you need to convince.

**Safety certification.** ISO 26262 or DO-178C work needs requirement-to-test traceability, staged reviews, and frozen baselines. You can run agile *inside* a work product, but the audit trail is plan-driven by construction, and that is correct — the cost of a field failure is not measured in story points.

**Fixed-scope, fixed-price contracts.** If someone signed for a defined deliverable at a defined number, "welcome changing requirements" is a commercial problem, not an engineering virtue. Change control exists because change costs money that must be attributed to someone.

**Hardware-coupled schedules.** Tooling lead times, B-sample dates, and validation vehicle slots do not iterate. Software feeding those gates plans backwards from an immovable date. Iterate inside the gate; do not pretend the gate moves.

The honest position: use the values everywhere, use the ceremonies where they pay, and use plan-driven process where the constraint is real.

## Monday

- Read the manifesto out loud with your team. Fifteen minutes. Most people have never read it.
- Pick your longest feedback loop — idea to something a user can touch — and measure it in days. That one number is your agility. Halve it.
- Cancel one ceremony that produced no decision in the last month. Notice whether anything breaks.
- At the next retro, leave with exactly one action item and an owner's name against it.
- If you report velocity to anyone outside the team, stop this week. Replace it with what shipped.
- List the constraints on your project that genuinely cannot iterate. Plan those. Iterate everything else.
