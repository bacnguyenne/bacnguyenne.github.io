---
title: 'Five Whys: the number is wrong and the answer usually blames someone'
description: 'How to run a root cause analysis that ends in a fix ticket instead of a symptom, a philosophy, or a person to be more careful.'
pubDate: 'Jul 23 2026'
tags: [engineering-practice, thinking]
---

## The number in the name is an estimate, not a rule

The technique comes out of Toyota. Sakichi Toyoda, who founded the group on the loom
business, used repeated questioning on the shop floor; Taiichi Ohno made it standard
practice in the Toyota Production System and wrote down the example everyone quotes, in
*Toyota Production System: Beyond Large-Scale Production* (1988). A machine stops. Why?
Overload tripped the fuse. Why? The bearing wasn't lubricated. Why? The lubrication pump
wasn't pumping enough. Why? Its shaft was worn. Why? No strainer was fitted, so metal
scrap got in.

Ohno's point was never the count. It was that if you stop at answer one, you fit a new
fuse and the machine stops again next month. He said five because in his shop that was
roughly how many steps it took to walk from the visible thing to something you could
change. It's an observation, not a rule. I've closed chains in three. I've had one that
needed seven. I have never had one improved by padding it out to five.

The other end is worse, and nobody warns you about it. Keep going past the point where
the answers are about your system and you land on "because deadlines exist", "because
humans make mistakes", "because the universe permits entropy". All true. All useless.

So the stop condition has to be mechanical, and it is the single most useful line here:

> Stop at the last cause you can write a fix ticket for.

If you can't name a file, a config value, a check, a rota, or a policy that a specific
person could change this quarter, you don't have a root cause. You have a worldview.

## Running one without burning an hour

Write the problem statement before anyone speaks. Not "the pipeline is broken" — what
happened, what should have happened, when it started, how often. If people disagree about
the statement, you are not ready to ask why yet, and half of bad sessions die right here.

Attach evidence to every link: a log line, a metric, a commit hash, a config diff. A chain
built from memory is a chain of plausible stories, and plausible stories are what a 5-Why
session is best at generating.

Ask open questions. "Did the missing review cause this?" gets you a yes and stops the
thinking. "What allowed this change to reach production?" gets you the actual path. The
first form hands the room your answer.

Then read the finished chain backwards, joining each step with "therefore". If any step
sounds like a leap when read in that direction, you skipped a why.

## The failure modes

Most 5-Why sessions produce a wrong answer, and they fail in a small number of repeatable
ways.

| Failure mode | What it sounds like in the room | What to do |
| --- | --- | --- |
| Stopped at a symptom | The cause restates the problem: "the test failed because the assertion failed" | Ask "what would I change to make this impossible?" If nothing, keep going |
| Went past the actionable | Cause mentions headcount, budget, deadlines, human nature | Back up to the last link your team owns |
| Cause names a person | The action is "remind", "train", "be more careful", "double-check" | Ask what let the mistake through. The missing guardrail is your cause |
| One tidy chain | Five neat steps, everyone nodding, done in ten minutes | Split into legs: why it happened, why we missed it, why the system allowed it |
| No evidence | Built entirely from recollection | Attach a log, metric, or commit to each link, or delete the link |
| Cause has no ticket | "Insufficient testing culture" | Not a cause. Keep splitting until it's a check someone can add |

The person-blaming one is the most common and the most damaging. A cause that names a
human is nearly always a missing guardrail wearing a disguise. The rewrite is always the
same shape:

- **Blaming:** "The developer forgot to add the migration for the new column."
- **Rewritten:** "A pull request can add a model field without a matching migration, and
  nothing in CI compares the two."

The first version's corrective action is a reminder in the team channel. That fixes
nothing, because the next person will also forget — forgetting is a property of people,
not a defect in one of them. The second's is a CI step that fails the build. Same
incident; only one of the two answers holds.

The single-chain problem is the other big one. Real incidents have several contributing
causes, and a linear five-step chain quietly asserts there was only one. Branch the tree
instead. If the branches multiply past what a tree can hold — many independent candidate
causes across tooling, process, environment, and data — switch to a fishbone (Ishikawa)
diagram to enumerate them, or a fault tree when you need the AND/OR logic of how several
conditions combined. And when the question is quantitative ("why did p99 latency rise
18%?"), 5 Whys is the wrong instrument entirely; that's a profiler and a distribution, not
a chain of logic.

## Worked example: the nightly pipeline that failed 40% of nights

The nightly integration job started going red on roughly four nights in ten. Every morning
someone hit rerun, it went green, and the day continued. Two weeks in it went red every
night and became urgent.

```text
[02:14:03] Run docker/login-action@v3
[02:14:04] Error: Cannot perform an interactive login from a non-TTY device
[02:14:04] ##[warning]Process completed with exit code 1; continue-on-error is set
[02:17:52] Pulling registry.internal.net/ci/replay-fixture:2.9.1
[02:17:53] Error response from daemon: toomanyrequests: rate limit exceeded
           for anonymous pull
[02:47:53] FAILED tests/integration/test_signal_replay.py::test_replay_full_trace
           Timeout: fixture container not ready after 1800s
```

**Problem statement:** the nightly integration job has failed on 9 of the last 22 runs
since 11 July, all with the same fixture timeout; the same tests pass on rerun after 08:00.

That last clause is the tell. A failure that disappears in the morning is about time of
day, not about the tests.

<figure>
<svg viewBox="0 0 760 350" role="img" aria-label="Why-tree for the failing nightly pipeline. The problem statement branches into three legs: why it happened, ending at a login step marked continue-on-error; why it was not caught, ending at scheduled jobs having no owner or alert rule; and why the system allowed it, ending at no expiry inventory for long-lived credentials." xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="wt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--border-strong)"/>
    </marker>
  </defs>
  <g fill="none" stroke="var(--border-strong)" stroke-width="1.5" marker-end="url(#wt-arrow)">
    <path d="M126,169 C148,169 148,53 170,53"/>
    <path d="M126,169 L170,169"/>
    <path d="M126,169 C148,169 148,285 170,285"/>
    <path d="M348,53 L368,53"/>
    <path d="M546,53 L566,53"/>
    <path d="M348,169 L368,169"/>
    <path d="M546,169 L566,169"/>
    <path d="M348,285 L368,285"/>
  </g>
  <g fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5">
    <rect x="8" y="134" width="118" height="70" rx="6"/>
    <rect x="170" y="24" width="178" height="58" rx="6"/>
    <rect x="368" y="24" width="178" height="58" rx="6"/>
    <rect x="170" y="140" width="178" height="58" rx="6"/>
    <rect x="368" y="140" width="178" height="58" rx="6"/>
    <rect x="170" y="256" width="178" height="58" rx="6"/>
  </g>
  <g fill="var(--surface-2)" stroke="var(--accent)" stroke-width="2">
    <rect x="566" y="24" width="178" height="58" rx="6"/>
    <rect x="566" y="140" width="178" height="58" rx="6"/>
    <rect x="368" y="256" width="178" height="58" rx="6"/>
  </g>
  <g font-size="11" fill="var(--text-muted)">
    <text x="170" y="16">1 — Why it happened</text>
    <text x="170" y="132">2 — Why we did not catch it</text>
    <text x="170" y="248">3 — Why the system allowed it</text>
  </g>
  <g font-size="13" font-weight="600" fill="var(--heading)" text-anchor="middle">
    <text x="67" y="155">Nightly job</text>
    <text x="67" y="170">red on 40%</text>
    <text x="67" y="185">of nights</text>
  </g>
  <g font-size="12" fill="var(--text)">
    <text x="182" y="50">Fixture container never</text>
    <text x="182" y="65">became ready</text>
    <text x="380" y="50">Image pull rejected:</text>
    <text x="380" y="65">anonymous rate limit</text>
    <text x="578" y="50">Login step marked</text>
    <text x="578" y="65">continue-on-error</text>
    <text x="182" y="166">Morning rerun passed —</text>
    <text x="182" y="181">logged as a flake</text>
    <text x="380" y="166">Nightly result went to</text>
    <text x="380" y="181">an unowned channel</text>
    <text x="578" y="166">Scheduled jobs have no</text>
    <text x="578" y="181">owner and no alert rule</text>
    <text x="182" y="282">Robot token expired</text>
    <text x="182" y="297">with no warning</text>
    <text x="380" y="282">No expiry inventory for</text>
    <text x="380" y="297">long-lived credentials</text>
  </g>
</svg>
<figcaption>Three legs, three actionable causes. A single chain would have found leg 1 and shipped.</figcaption>
</figure>

Leg 1 in words: the container never came up because the image pull was rejected as an
anonymous pull, because the runner had no credentials, because the login step failed and
was allowed to fail. Someone had added `continue-on-error: true` a year earlier when the
registry itself was unstable, and it stayed. That's the terminal cause — a config line in
a file, changeable today. Going one step further ("why did nobody remove it?") produces
"we don't audit old workarounds", which is true and unticketable.

The 40% pattern came out of leg 3: the registry's anonymous quota is per-IP and shared
across the runner pool, so the failure depended on which runner picked up the job.

**Corrective actions** fix this occurrence:

- Rotate the expired robot token, drop `continue-on-error` from the login step.
- Assign an owner to the nightly job and route its failures to that team.

**Preventive actions** are a different thing — they stop the class of failure, and they
are the ones that get dropped when the incident stops hurting:

```yaml
- name: Registry login
  uses: docker/login-action@v3
  with:
    registry: registry.internal.net
    username: ${{ vars.CI_ROBOT_USER }}
    password: ${{ secrets.CI_ROBOT_TOKEN }}

- name: Fail loudly if the runner is not authenticated
  run: |
    grep -q '"auths"' "$HOME/.docker/config.json" \
      || { echo "::error::registry login produced no credentials"; exit 1; }
```

Plus: a weekly job that lists every long-lived credential with an expiry inside 30 days,
and an alert rule that fires when any scheduled pipeline fails twice consecutively.

**Verification** is where most of these die. "We merged the fix" is not verification.

- *Corrective:* revoke a throwaway token in a sandbox project and run the pipeline. It must
  go red at the login step within one run. If it goes green, your fix is theatre.
- *Preventive:* track the nightly green rate for four weeks and the time-to-detect on the
  next scheduled-job failure. Before: 14 days. Target: under 24 hours. Put the number on
  the same dashboard as the incident, or nobody checks it.

## On Monday

Write the problem statement first and get agreement on it before anyone says "why".

Stop when the cause maps to a ticket. Not at five, not at "management should have hired
more people".

When a cause names a person, don't argue about it — ask what allowed the mistake through,
and use that answer instead. If your corrective action contains the word "remind", start
over.

Run three legs, not one chain: why it happened, why nobody caught it, why the system
permitted it. Legs two and three are where the fixes that actually last live.

Separate the corrective action from the preventive one in writing, give each an owner, and
put a verification date on both. An unverified preventive action is a note, not a fix.
