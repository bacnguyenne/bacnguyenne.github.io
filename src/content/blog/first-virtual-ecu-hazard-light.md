---
title: 'Your first virtual ECU: a hazard-light walkthrough'
description: 'From zero to a tested virtual ECU with RemotiveLabs, file by file: signal databases, a Python behavioral model, topology build, and a pytest that proves it works.'
pubDate: 'Jul 14 2026'
tags: [sdv, automotive, tutorial]
---

## What we're building

I've written about [why a virtual car is just a Docker Compose stack](/blog/virtual-ecus-with-remotivelabs/). This post is the hands-on companion: a walkthrough you can type along with, from an empty folder to a passing test — no hardware, no prior automotive background needed.

The example: press the hazard-light button → the Body Control Module (BCM) sets **both** turn-light requests → a test asserts the front-light module actually receives them. Small enough to fit in a post, real enough to touch every layer: two CAN buses, a signal database each, one behavioral model, and a containerized pytest. It's based on RemotiveLabs' public [getting-started example](https://github.com/remotivelabs/remotivelabs-topology-examples), so every file here is reproducible.

<figure>
<svg viewBox="0 0 720 150" role="img" aria-label="Signal flow: hazard button on SCCM crosses DriverCan to BCM, which sets both turn-light requests on BodyCan, received by FLCM" style="font-family: var(--font-sans, sans-serif); font-size: 13px;">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border-strong)"/>
    </marker>
  </defs>
  <rect x="20" y="50" width="130" height="52" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="85" y="72" text-anchor="middle" fill="var(--heading)" font-weight="600">SCCM</text>
  <text x="85" y="90" text-anchor="middle" fill="var(--text-muted)" font-size="10">hazard button</text>
  <line x1="150" y1="76" x2="290" y2="76" stroke="var(--border-strong)" stroke-width="2" marker-end="url(#arr)"/>
  <text x="220" y="66" text-anchor="middle" fill="var(--text-muted)" font-size="11">DriverCan · frame 100</text>
  <rect x="295" y="50" width="130" height="52" rx="8" fill="var(--accent)" fill-opacity="0.12" stroke="var(--accent)"/>
  <text x="360" y="72" text-anchor="middle" fill="var(--heading)" font-weight="700">BCM</text>
  <text x="360" y="90" text-anchor="middle" fill="var(--text-muted)" font-size="10">mirror to both lights</text>
  <line x1="425" y1="76" x2="565" y2="76" stroke="var(--border-strong)" stroke-width="2" marker-end="url(#arr)"/>
  <text x="495" y="66" text-anchor="middle" fill="var(--text-muted)" font-size="11">BodyCan · frame 103</text>
  <rect x="570" y="50" width="130" height="52" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="635" y="72" text-anchor="middle" fill="var(--heading)" font-weight="600">FLCM</text>
  <text x="635" y="90" text-anchor="middle" fill="var(--text-muted)" font-size="10">pytest asserts here</text>
</svg>
<figcaption>The whole exercise in one line: button frame in, two turn-light signals out, a test watching the far end.</figcaption>
</figure>

## Setup (10 minutes, once)

Prerequisites: Python ≥ 3.10, native Docker (not Docker Desktop — [its hidden VM breaks host networking later](/blog/android-automotive-cuttlefish-docker/)), and a RemotiveLabs account for the trial.

There are **two separate installs**, and you need both:

```bash
# 1. The CLI — runs topologies (pipx keeps it isolated and on PATH)
pipx install remotivelabs-cli

# 2. The Python library — what your ECU code imports
pip install -U remotivelabs-topology

# Verify both
remotive --version && remotive topology version
```

Then authenticate and start the trial — `remotive topology build` refuses to run without an active subscription:

```bash
remotive cloud auth login
remotive topology start-trial        # 30-day trial
remotive topology subscription status
```

Two gotchas that bite everyone: **pin the broker tag** (broker and platform schema versions are coupled; a mismatch fails with `E004`), and if `remotive` behaves oddly, check for PATH drift with `which -a remotive` — a stray copy from an old install shadows the pipx one.

## The file layout

Seven files, four layers — database, platform, model, instance:

```text
getting_started/
├─ platform/
│  ├─ topology.platform.yaml        # buses → databases
│  └─ databases/
│     ├─ driver_can.dbc             # DriverCan0  (hazard button)
│     └─ body_can.dbc               # BodyCan0    (turn lights)
├─ models/
│  ├─ bcm/__main__.py               # BCM logic
│  └─ bcm.instance.yaml             # BCM → container
├─ tests/tester.instance.yaml       # FLCM + pytest
├─ instances/main.instance.yaml     # ties it together
└─ Dockerfile + pyproject.toml + uv.lock
```

## Step 1 — the signal databases

`.dbc` is the ancient, ubiquitous CAN database format. Here's the driver bus — one 1-byte message, one 1-bit signal:

```text
BU_:
    SCCM
    BCM
BO_ 100 HazardLightButton: 1 SCCM
 SG_ HazardLightButton : 0|1@1+ (1,0) [0|1] ""  BCM
VAL_ 100 HazardLightButton 0 "Off" 1 "On";
BA_ "GenMsgCycleTime" BO_ 100 50;
```

Reading it: `BU_` lists the ECUs; `BO_ 100` is a 1-byte frame sent by the steering-column module (SCCM); `SG_` is a 1-bit signal inside it, received by BCM; `VAL_` maps 0/1 to Off/On; the cycle time is 50 ms. The body bus database is the same idea — frame `TurnLightControl` (id 103) from BCM with `LeftTurnLightRequest` and `RightTurnLightRequest` bits, received by the light modules.

This file *is* the contract. Everything else in the stack decodes against it.

## Step 2 — the platform

The platform binds each bus to its database — the "physical wiring" of the car:

```yaml
schema: remotive-topology-platform:0.17
channels:
  DriverCan0:
    type: can
    database: ./databases/driver_can.dbc
  BodyCan0:
    type: can
    database: ./databases/body_can.dbc
```

## Step 3 — the behavioral model

The BCM is a small async Python program. Wiring first: one `CanNamespace` per bus, a restbus that periodically transmits BCM's frames, and an input handler routing the button frame to a callback:

```python
async with BrokerClient(url=avp.url, auth=avp.auth) as broker:
    body_can_0 = CanNamespace("BCM-BodyCan0", broker,
        restbus_configs=[RestbusConfig([filters.SenderFilter(ecu_name="BCM")])])
    driver_can_0 = CanNamespace("BCM-DriverCan0", broker)
    bcm = BCM(body_can_0)
    async with BehavioralModel("BCM",
        namespaces=[body_can_0, driver_can_0], broker_client=broker,
        input_handlers=[driver_can_0.create_input_handler(
            [filters.FrameFilter("HazardLightButton")], bcm.on_hazard_light)],
    ) as bm:
        await bm.run_forever()
```

And the actual ECU logic — the entire point of the exercise — is four lines:

```python
async def on_hazard_light(self, frame: Frame):
    val = frame.signals["HazardLightButton.HazardLightButton"]
    # mirror the hazard press to BOTH turn lights
    await self.body_can_0.restbus.update_signals(
        ("TurnLightControl.RightTurnLightRequest", val),
        ("TurnLightControl.LeftTurnLightRequest", val),
    )
```

Note what's absent: no bit offsets, no frame packing, no CAN IDs. Everything is by signal name; the broker does the encoding against the `.dbc`. The **restbus** is the detail people miss — real buses have periodic keep-alive traffic, and the restbus synthesizes it, so your updated signal values ride out on the next scheduled frame instead of needing explicit sends.

## Step 4 — instances

Instances declare what actually runs. The main instance pulls in the platform and the parts; the BCM instance says "run this model as a container":

```yaml
# instances/main.instance.yaml
schema: remotive-topology-instance:0.17
name: getting-started
platform:
  includes: [../platform/topology.platform.yaml]
includes:
  - ../models/bcm.instance.yaml
  - ../tests/tester.instance.yaml

# models/bcm.instance.yaml
ecus:
  BCM:
    models:
      bcm:
        type: container
        container:
          build: { dockerfile: ../Dockerfile }
          command: python -m bcm
```

## Step 5 — the test as part of the car

This is my favorite design decision in the whole stack: the test rig is *just another instance file*. FLCM is a real ECU stub under test, SCCM is a mock (the test sends the button through it), and `tester` is a pytest container talking to the broker:

```yaml
containers:
  tester:
    profiles: [tester]
    command: "pytest --broker_url=http://topology-broker.com:50051 -s -vv"
    depends_on: [ FLCM-broker.com ]
ecus:
  FLCM: {}
  SCCM:
    mock: {}
```

## Steps 6–8 — build and run

One Dockerfile builds all ECU containers (the one rule: `models/` must live inside the Docker build context, or `COPY` can't see it). Then instance YAMLs go in, a docker-compose comes out:

```bash
remotive topology build \
  -f getting_started/instances/main.instance.yaml \
  -f getting_started/settings/can_over_udp.settings.instance.yaml \
  --name getting_started build
```

Each `-f` layers another instance file — the second one here switches CAN to run over UDP, which avoids installing the CAN Docker plugin entirely. Then:

```bash
docker compose -f build/getting_started/docker-compose.yml \
  --profile tester up --abort-on-container-exit --build
```

A green pytest means: the button frame crossed the driver bus, the BCM decoded it, mirrored it to two signals on the body bus, the restbus carried them out, and the front-light module received both. That's a virtual car, tested, on your laptop.

## The checklist and the failure table

Everything a runnable virtual ECU needs: **(1)** signal databases, **(2)** a platform binding buses to them, **(3)** a behavioral model per ECU, **(4)** instances wiring it together, **(5)** a Dockerfile with the code inside the build context, **(6)** matching schema/broker versions and a valid trial.

And the errors you'll actually hit:

| Symptom | Fix |
| --- | --- |
| `E004` version mismatch | Match platform schema to broker version — pin both |
| SOME/IP `name_conflict` on restart | Always `up -d` the full stack, never one service |
| `type: can` needs a plugin | Use CAN-over-UDP (`default_driver: udp`) |
| `remotive` not found / weird version | PATH drift — `which -a remotive` |
| Playback runs 1000× too fast | Offsets are **microseconds** — write `--offset 10s`, never a bare number |

From here, the same four layers scale to the real thing: more buses, more ECUs, [a real Android head unit](/blog/android-automotive-cuttlefish-docker/), and [a physics simulator on the chassis bus](/blog/bridging-carla-to-the-can-bus/). The layers never change — that's what makes the small example worth learning properly.
