---
title: 'A virtual car is just Docker Compose'
description: 'Build a virtual vehicle from containerized ECUs with RemotiveLabs: signal databases, CAN/LIN/SOME-IP buses, behavioral models — the mental model, a worked topology, and the gotchas.'
pubDate: 'Jul 11 2026'
tags: [sdv, simulation, automotive]
---

## The problem

Automotive software is normally tested against hardware: bench setups with real ECUs, wiring harnesses, and CAN interfaces. That hardware is expensive, scarce, and slow to reconfigure — and not everyone on a team can have a bench on their desk.

But for most of the logic you write in a car — body control, HMI flows, safety-state machines — what matters isn't the silicon. It's the *signals*: who sends what, on which bus, in what format, and how the other ECUs react.

That reframing is what makes vehicle virtualization work. If the contract between ECUs is the signal traffic, you can replace each ECU with a small program that speaks the same signals — and run the whole car as a Docker Compose stack, on any laptop. This post is the mental model for doing that with [RemotiveLabs](https://remotivelabs.com) tooling, plus the lessons that aren't in the docs. Everything here is reproducible with their free trial and public examples.

## The mental model: everything is a signal on a bus

A vehicle network is fully described by three things:

1. **Signal databases** — `.dbc` files for CAN, `.ldf` for LIN, FIBEX/ARXML for automotive Ethernet (SOME/IP). They define frames and the signals inside them: `Vehicle_Speed` is 16 bits at offset 8 in frame `0x123`, scaled by 0.01. These are the same files real OEM toolchains use.
2. **A topology** — which buses exist, and which ECU sits on which bus.
3. **Behavioral models** — the ECU implementations: Python programs that subscribe to signals, run their logic, and publish signals back.

Here's what a small but realistic topology looks like — a few sensor ECUs on one CAN bus, a central unit bridging to the infotainment screen over Ethernet, a restricted bus for the airbag, and a LIN light:

<figure>
<svg viewBox="0 0 720 300" role="img" aria-label="Virtual car topology: sensor ECUs on S-CAN feed CENTER, which talks to IHU over Ethernet, AIRBAG over R-CAN, and a warning light over LIN" style="font-family: var(--font-sans, sans-serif); font-size: 13px;">
  <!-- buses -->
  <line x1="60" y1="90" x2="330" y2="90" stroke="var(--accent)" stroke-width="3"/>
  <text x="70" y="80" fill="var(--text-muted)" font-size="11">S-CAN (sensors)</text>
  <line x1="390" y1="230" x2="660" y2="230" stroke="var(--accent)" stroke-width="3"/>
  <text x="560" y="252" fill="var(--text-muted)" font-size="11">R-CAN (restricted)</text>
  <!-- SEAT -->
  <rect x="60" y="110" width="90" height="40" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="105" y="134" text-anchor="middle" fill="var(--heading)" font-weight="600">SEAT</text>
  <line x1="105" y1="110" x2="105" y2="90" stroke="var(--border-strong)" stroke-width="2"/>
  <!-- DYNAMICS -->
  <rect x="180" y="110" width="110" height="40" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="235" y="134" text-anchor="middle" fill="var(--heading)" font-weight="600">DYNAMICS</text>
  <line x1="235" y1="110" x2="235" y2="90" stroke="var(--border-strong)" stroke-width="2"/>
  <!-- CENTER -->
  <rect x="310" y="40" width="110" height="46" rx="8" fill="var(--accent)" fill-opacity="0.12" stroke="var(--accent)"/>
  <text x="365" y="68" text-anchor="middle" fill="var(--heading)" font-weight="700">CENTER</text>
  <line x1="330" y1="90" x2="345" y2="86" stroke="var(--border-strong)" stroke-width="2"/>
  <!-- IHU -->
  <rect x="540" y="40" width="120" height="46" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="600" y="62" text-anchor="middle" fill="var(--heading)" font-weight="600">IHU</text>
  <text x="600" y="77" text-anchor="middle" fill="var(--text-muted)" font-size="10">(infotainment)</text>
  <line x1="420" y1="63" x2="540" y2="63" stroke="var(--border-strong)" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="480" y="55" text-anchor="middle" fill="var(--text-muted)" font-size="11">Ethernet · SOME/IP</text>
  <!-- AIRBAG -->
  <rect x="390" y="160" width="100" height="40" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="440" y="184" text-anchor="middle" fill="var(--heading)" font-weight="600">AIRBAG</text>
  <line x1="440" y1="200" x2="440" y2="230" stroke="var(--border-strong)" stroke-width="2"/>
  <line x1="380" y1="86" x2="440" y2="160" stroke="var(--border-strong)" stroke-width="2"/>
  <!-- WARNING -->
  <rect x="540" y="160" width="110" height="40" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="595" y="184" text-anchor="middle" fill="var(--heading)" font-weight="600">WARNING</text>
  <line x1="595" y1="200" x2="595" y2="230" stroke="var(--border-strong)" stroke-width="2"/>
  <!-- LIN light -->
  <rect x="540" y="258" width="110" height="34" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="595" y="279" text-anchor="middle" fill="var(--text-muted)" font-size="11">LIGHT (LIN slave)</text>
  <line x1="595" y1="230" x2="595" y2="258" stroke="var(--border-strong)" stroke-width="2" stroke-dasharray="3 3"/>
</svg>
<figcaption>A minimal virtual car: sensors → central logic → infotainment, airbag, and a LIN-driven warning light.</figcaption>
</figure>

RemotiveLabs' topology tool takes those three inputs and *generates* a `docker-compose.yml`: one container per ECU, one broker per bus mediating the signal traffic, virtual CAN networks wiring them together. `docker compose up -d` and you have a car. A web UI on the broker shows every signal on every bus live — the virtual equivalent of clipping a CAN analyzer onto the harness.

Two properties of this setup do a lot of quiet work:

- **The signal database is the contract.** ECU models can be wrong, stubbed, or replaced — but as long as they honor the `.dbc`, everything interoperates. This is exactly the property that makes real cars integrate, and it survives virtualization intact.
- **Record and replay.** Because everything is bus traffic, you can record a drive (real or simulated) and replay it into the stack. Replayed recordings make deterministic, dependency-free test scenarios — in practice most of your tests end up built on them.

## What a behavioral model looks like

The ECU models are deliberately boring. Here's the shape of one, using the `remotivelabs-topology` Python library:

```python
# A minimal ECU: read a seat-weight sensor, decide "child present",
# tell the infotainment unit to show a warning.
async with BehavioralModel("CENTER", buses=[scan]) as center:
    async for sig in center.subscribe("Passenger_Seat_Weight", "Vehicle_Speed"):
        occupied = sig["Passenger_Seat_Weight"] > CHILD_WEIGHT_MIN
        if occupied and sig["Vehicle_Speed"] == 0:
            await center.publish(WarningRequest=1)   # → SOME/IP to the IHU
```

The realism lives in the *signals*, not the code. A real seat module has a microcontroller, diagnostics, and a bootloader; the virtual one is twenty lines. But the frame it emits is bit-identical to the real one — so the central-ECU logic you test against it is the logic that would ship.

One pattern that pays off as soon as you build a second car: **treat ECU models as a reusable library.** Keep a registry file — a YAML catalog listing every ECU model, the buses it uses, and the signals it produces. Composing a new virtual car then becomes: pick ECUs from the catalog, define the bus topology, generate. The second car takes a fraction of the effort of the first.

## Gotchas that will cost you real time

| Gotcha | Symptom | Do this instead |
| --- | --- | --- |
| Unpinned tool versions | Recording/schema errors pointing nowhere near the cause | Pin CLI, broker image, and Python library together; upgrade as a deliberate migration |
| Regenerating on every machine | New machines need the vendor CLI + subscription just to run | Commit the generated `build/` folder; regenerate only when the topology changes |
| Restarting one container | Broker crash — all ECUs reconnect at once and race on registration | Always `docker compose up -d` the **full** stack |
| Real CAN inside Docker | Works only where the kernel service is installed | Wire in the CAN-over-UDP fallback from day one |
| Two topologies on one host | `docker: Pool overlaps` — generated subnets collide | Run one virtual car at a time; know the limit before architecting around it |

Each of these looks obvious in a table and cost days in real life. The version-pinning one deserves the emphasis: the topology tooling, broker image, and Python library version-lock against each other through generated schema files, and an innocent minor-version bump breaks playback with errors that point nowhere near the cause.

## Was it worth it?

Yes — and the reason is iteration speed. Change ECU logic → `docker compose up` → watch the signals: seconds, on any laptop, no bench time to book. Onboarding a new engineer drops from "get hardware access, install the vendor toolchain" to "clone, compose up".

The virtual car also becomes a substrate you can keep building on: bolt a [driving simulator onto the chassis bus](/blog/bridging-carla-to-the-can-bus/), or boot a [real Android Automotive build as the infotainment ECU](/blog/android-automotive-cuttlefish-docker/). If you want to build one yourself from zero, the [hands-on walkthrough](/blog/first-virtual-ecu-hazard-light/) does exactly that, file by file.

The signal-first mental model is the part worth carrying to any similar problem: find the contract, virtualize against the contract, and keep the contract in version control.
