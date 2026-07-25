---
title: 'Every methodology is the same work in a different order'
description: 'The phases every software project runs through, why waterfall, iterative and agile only differ in ordering, and how to choose one deliberately.'
pubDate: 'Jul 18 2026'
tags: [engineering-practice, process]
---

## The work is fixed, the order is not

Somebody decides what to build. Somebody decides how to build it. Somebody writes the code. Somebody checks it. It goes out. It breaks and somebody fixes it.

That happens on every project I have ever worked on, including the ones where two of us had no process at all and shipped a Flask app in a weekend. The lifecycle is not a thing you adopt. It is a description of work that occurs whether or not you name it.

What a methodology actually decides is three things: **how big a chunk of that work you do before you get feedback**, **how much of it you write down**, and **who signs off on what**. Waterfall, iterative and agile are not competing philosophies of software. They are three answers to "how late can we afford to find out we were wrong?"

Once you see it that way, choosing between them becomes an engineering decision with inputs, instead of a tribal one.

## The seven jobs

Here is the work, what it produces, and how projects hurt when it is skipped. None of it is optional — you do it on purpose, or accidentally at the worst moment.

| Job | What actually comes out of it | What breaks when you skip it |
| --- | --- | --- |
| Requirements | A list of numbered statements someone will be held to. Not a wish list — testable statements. | You build the thing that was described instead of the thing that was needed. Found at UAT, six weeks late. |
| Planning | Scope, dates, who is on it, and the list of things that could sink it. | Nobody notices the vendor SDK licence takes eight weeks to procure until week seven. |
| Design | Architecture, data model, interfaces between components — high-level, then detailed for anything non-obvious. | Two teams build both sides of an interface from different assumptions about who owns retries. |
| Build | Code, code review, unit tests, everything in version control. | Nothing. This is the part nobody skips. It is also the part people think is the whole job. |
| Test | Functional, integration, system, regression — plus evidence that each requirement was checked. | You ship regressions in the features nobody touched, which is where they always hide. |
| Deploy | A repeatable release path, a rollback, a check that it works in production. | The release is a person following a wiki page at 11pm. It works until they are on holiday. |
| Maintain | Monitoring, bug fixes, small enhancements, an actual support channel. | Users report outages to you on Slack, and you find out about the data loss on Tuesday. |

The two that get quietly dropped are requirements and deployment, and they are dropped for the same reason: neither one produces something you can demo.

Requirements is not paperwork. Its job is to force a disagreement to surface while it is still cheap. When you write "the dashboard shall refresh vehicle status within 2 s of a CAN update" and someone from the product side says "no, 2 s is far too slow at the line", you just saved a re-architecture.

## Three orderings of the same blocks

<figure>
<svg viewBox="0 0 720 250" role="img" aria-label="Three timelines using the same five work blocks. Waterfall runs one long pass ending in a single release. Iterative runs three medium passes with a release each. Agile runs eight short passes, each ending in something shippable.">
  <text x="8" y="48" fill="var(--heading)" font-size="13" font-weight="600">Waterfall</text>
  <rect x="110" y="30" width="118" height="26" rx="3" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="169" y="48" fill="var(--text)" font-size="11" text-anchor="middle">Req</text>
  <rect x="230.5" y="30" width="118" height="26" rx="3" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="289.5" y="48" fill="var(--text)" font-size="11" text-anchor="middle">Design</text>
  <rect x="351" y="30" width="118" height="26" rx="3" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="410" y="48" fill="var(--text)" font-size="11" text-anchor="middle">Build</text>
  <rect x="471.5" y="30" width="118" height="26" rx="3" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="530.5" y="48" fill="var(--text)" font-size="11" text-anchor="middle">Test</text>
  <rect x="592" y="30" width="118" height="26" rx="3" fill="var(--surface-2)" stroke="var(--accent)" stroke-width="2"/>
  <text x="651" y="48" fill="var(--text)" font-size="11" text-anchor="middle">Ship</text>
  <text x="110" y="76" fill="var(--text-muted)" font-size="11">One pass. First honest feedback arrives at the far right.</text>

  <text x="8" y="118" fill="var(--heading)" font-size="13" font-weight="600">Iterative</text>
  <g fill="var(--surface-2)" stroke="var(--border-strong)">
    <rect x="110" y="100" width="36" height="26" rx="3"/><rect x="148.5" y="100" width="36" height="26" rx="3"/><rect x="187" y="100" width="36" height="26" rx="3"/><rect x="225.5" y="100" width="36" height="26" rx="3"/>
    <rect x="315" y="100" width="36" height="26" rx="3"/><rect x="353.5" y="100" width="36" height="26" rx="3"/><rect x="392" y="100" width="36" height="26" rx="3"/><rect x="430.5" y="100" width="36" height="26" rx="3"/>
    <rect x="520" y="100" width="36" height="26" rx="3"/><rect x="558.5" y="100" width="36" height="26" rx="3"/><rect x="597" y="100" width="36" height="26" rx="3"/><rect x="635.5" y="100" width="36" height="26" rx="3"/>
  </g>
  <g fill="var(--surface-2)" stroke="var(--accent)" stroke-width="2">
    <rect x="264" y="100" width="36" height="26" rx="3"/><rect x="469" y="100" width="36" height="26" rx="3"/><rect x="674" y="100" width="36" height="26" rx="3"/>
  </g>
  <text x="110" y="146" fill="var(--text-muted)" font-size="11">Three passes. Wrong assumptions surface after roughly a third of the budget.</text>

  <text x="8" y="188" fill="var(--heading)" font-size="13" font-weight="600">Agile</text>
  <g fill="var(--surface-2)" stroke="var(--border-strong)">
    <rect x="110" y="170" width="12" height="26" rx="2"/><rect x="124.5" y="170" width="12" height="26" rx="2"/><rect x="139" y="170" width="12" height="26" rx="2"/><rect x="153.5" y="170" width="12" height="26" rx="2"/>
    <rect x="185.7" y="170" width="12" height="26" rx="2"/><rect x="200.2" y="170" width="12" height="26" rx="2"/><rect x="214.7" y="170" width="12" height="26" rx="2"/><rect x="229.2" y="170" width="12" height="26" rx="2"/>
    <rect x="261.4" y="170" width="12" height="26" rx="2"/><rect x="275.9" y="170" width="12" height="26" rx="2"/><rect x="290.4" y="170" width="12" height="26" rx="2"/><rect x="304.9" y="170" width="12" height="26" rx="2"/>
    <rect x="337.1" y="170" width="12" height="26" rx="2"/><rect x="351.6" y="170" width="12" height="26" rx="2"/><rect x="366.1" y="170" width="12" height="26" rx="2"/><rect x="380.6" y="170" width="12" height="26" rx="2"/>
    <rect x="412.8" y="170" width="12" height="26" rx="2"/><rect x="427.3" y="170" width="12" height="26" rx="2"/><rect x="441.8" y="170" width="12" height="26" rx="2"/><rect x="456.3" y="170" width="12" height="26" rx="2"/>
    <rect x="488.5" y="170" width="12" height="26" rx="2"/><rect x="503" y="170" width="12" height="26" rx="2"/><rect x="517.5" y="170" width="12" height="26" rx="2"/><rect x="532" y="170" width="12" height="26" rx="2"/>
    <rect x="564.2" y="170" width="12" height="26" rx="2"/><rect x="578.7" y="170" width="12" height="26" rx="2"/><rect x="593.2" y="170" width="12" height="26" rx="2"/><rect x="607.7" y="170" width="12" height="26" rx="2"/>
    <rect x="639.9" y="170" width="12" height="26" rx="2"/><rect x="654.4" y="170" width="12" height="26" rx="2"/><rect x="668.9" y="170" width="12" height="26" rx="2"/><rect x="683.4" y="170" width="12" height="26" rx="2"/>
  </g>
  <g fill="var(--surface-2)" stroke="var(--accent)" stroke-width="2">
    <rect x="168" y="170" width="12" height="26" rx="2"/><rect x="243.7" y="170" width="12" height="26" rx="2"/><rect x="319.4" y="170" width="12" height="26" rx="2"/><rect x="395.1" y="170" width="12" height="26" rx="2"/>
    <rect x="470.8" y="170" width="12" height="26" rx="2"/><rect x="546.5" y="170" width="12" height="26" rx="2"/><rect x="622.2" y="170" width="12" height="26" rx="2"/><rect x="697.9" y="170" width="12" height="26" rx="2"/>
  </g>
  <text x="110" y="216" fill="var(--text-muted)" font-size="11">Many short passes. Accent outline marks a point where something shippable exists.</text>
</svg>
<figcaption>Same five blocks of work in all three rows. Only the chunk size changes — and with it, how much you can be wrong before you find out.</figcaption>
</figure>

## An honest comparison

|  | Waterfall | Iterative | Agile |
| --- | --- | --- | --- |
| Cost of a late requirements change | Very high — re-open design docs, re-run the test campaign | Moderate — absorbed by the next iteration | Low by construction |
| What you need up front | A frozen, correct spec | A rough architecture and a prioritised list | A product owner who is actually available |
| Fails when | The spec was wrong, and it usually is | Iterations quietly become mini-waterfalls with no release | There is no real customer feedback loop, so it degrades into "sprints" with no learning |
| Evidence produced | Excellent — traceable by default | Good if you keep per-iteration records | Poor unless you deliberately engineer it |
| Honest fit | Fixed scope, external gates, hardware coupling | Large systems where the architecture is knowable but the details are not | Anything where you can ship to real users repeatedly |

The interesting failure is the last column, third row. Agile without a feedback loop is worse than waterfall, because you get neither the documentation nor the learning. If your two-week increments end in a demo to your own team and nothing else, you are running waterfall in slices and paying ceremony tax on top. The [Agile Manifesto](https://agilemanifesto.org) is four value statements about weighting, not a delivery process, and the [Scrum Guide](https://scrumguides.org) is deliberately thin about engineering practice — which is why teams adopt Scrum, skip the technical practices from [Kent Beck's XP work](https://martinfowler.com/bliki/ExtremeProgramming.html), and end up with unchanged code quality and more meetings.

## When waterfall is the right answer

It genuinely is, sometimes, and pretending otherwise marks you as someone who has only shipped web apps.

**Regulated work.** On a safety-related ECU under ISO 26262, or avionics under DO-178C, you must show a reviewer that every requirement traces to a design element, to code, and to a test result. That evidence chain is the deliverable. You can build it incrementally, but you cannot build it retroactively without doing the work twice.

**Hardware coupling.** If the board spins in eight weeks and re-spinning costs a hundred thousand dollars and a quarter, the interface between your firmware and that board is frozen whether you like it or not. Iterating on it is not "agile", it is a schedule you cannot pay for. Iterate on everything *around* the frozen interface instead.

**Fixed-price, fixed-scope contracts.** When the scope is a legal document, requirements changes are contract amendments. Discovering scope collaboratively is the wrong tool: the commercial structure has already made change expensive, and no process can undo that.

The V-model is what most regulated teams actually run. It is waterfall with one improvement: each specification level is paired with the test level that will verify it, and you write both at the same time. System requirements pair with system tests; unit design pairs with unit tests. The value is not the shape of the diagram — it is that "how will we prove this?" gets asked while the requirement is being written, not eight months later.

## Things people say that are wrong

**"Agile means no documentation."** The manifesto weighs working software above comprehensive documentation. It does not say zero. Write down anything that would take a new joiner more than an hour to reconstruct, and anything you would be asked to prove in an audit.

**"Testing is a phase."** It is a phase in the schedule and an activity in every phase. If a defect is first detected by your test team, the cheapest place to have caught it has already gone past.

**"Maintenance is what happens after the project."** Most of the money is spent here. Design for it — treat the runbook and the log output as deliverables, not afterthoughts.

## What to do on Monday

Pick the ordering from your two hardest constraints — how expensive is a late change, and who demands evidence — and then make the following cheap, regardless of which one you picked.

Give requirements stable IDs and put them in commits. This is fifteen minutes of convention and it makes traceability a `git` query instead of an archaeology project:

```bash
git commit -m "brake: clamp torque request to axle limit

Implements: SYS-REQ-0412
Verified-By: TC-0412-a, TC-0412-b"

# which requirements have no implementing commit in this release?
comm -13 \
  <(git log --format=%B v2.3..v2.4 | grep -oE 'SYS-REQ-[0-9]+' | sort -u) \
  <(grep -ohE 'SYS-REQ-[0-9]+' requirements/*.md | sort -u)
```

Make the deploy phase a script, not a person. If your release procedure is a wiki page, convert the first three steps to code this week and keep going. And put the test phase behind the merge button so it cannot be deferred by a deadline:

```yaml
# .github/workflows/ci.yml
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -e '.[test]'
      - run: pytest -q --cov=src --cov-fail-under=80
      - run: ruff check src tests
```

Then, in your next retro, ask one question: *what did we learn in the last increment that changed what we are building?* If the answer is nothing, several times running, your feedback loop is decorative and your chunk size is wrong — no matter what the process is called.
