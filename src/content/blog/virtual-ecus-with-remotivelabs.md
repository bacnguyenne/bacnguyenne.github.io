---
title: 'A virtual car is just Docker Compose'
description: 'How we build virtual vehicles from containerized ECUs with RemotiveLabs: signal databases, CAN/LIN/SOME-IP buses, behavioral models, and the gotchas.'
pubDate: 'Jul 22 2026'
tags: [sdv, simulation, automotive]
---

## The problem

Automotive software is tested against hardware: bench setups with real ECUs, wiring harnesses, and CAN interfaces. That hardware is expensive, scarce, and slow to reconfigure — and every engineer on the team can't have one on their desk. For most of the logic we write (body control, HMI flows, safety-state machines), what actually matters isn't the silicon. It's the *signals*: who sends what, on which bus, in what format, and how the other ECUs react.

That reframing is what makes vehicle virtualization work. If the contract between ECUs is the signal traffic, you can replace each ECU with a small program that speaks the same signals — and run the whole car as a Docker Compose stack.

At work I build these virtual cars with [RemotiveLabs](https://remotivelabs.com) tooling. This post is the mental model plus the lessons that weren't in the docs.

## The mental model: everything is a signal on a bus

A vehicle network is described by three things:

1. **Signal databases** — `.dbc` files for CAN, `.ldf` for LIN, FIBEX/ARXML for automotive Ethernet (SOME/IP). These define the frames and the signals inside them: `Vehicle_Speed` is 16 bits at offset 8 in frame `0x123`, scaled by 0.01, and so on. They're the same files a real OEM toolchain uses.
2. **A topology** — which buses exist, which ECU sits on which bus. Ours looks like a simplified real car: sensor ECUs on one CAN bus, a central compute unit bridging to the infotainment unit over Ethernet, an airbag controller on a restricted CAN, a LIN master driving a warning light.
3. **Behavioral models** — the ECU implementations. Each is a Python program that subscribes to signals, runs its logic, and publishes signals back. A Body Control Module is a couple of state machines: turn-signal input on, publish `TurnSignalLeft` blinking at the right rate.

RemotiveLabs' topology tool takes those three inputs and *generates* a `docker-compose.yml`: one container per ECU, one broker per bus mediating the signal traffic, virtual CAN networks wiring them together. `docker compose up -d` and you have a car. A web UI on the broker lets you watch every signal on every bus live — the virtual equivalent of clipping a CAN analyzer onto the harness.

Two properties of this setup do a lot of quiet work:

- **The signal database is the contract.** ECU models can be wrong, stubbed, or replaced — but if they honor the `.dbc`, everything interoperates. This is exactly the property that makes real cars integrate, and it survives virtualization intact.
- **Record and replay.** Because everything is bus traffic, you can record a drive (real or simulated) and replay it into the stack. Most of our test scenarios are replayed recordings, not live simulation — deterministic, fast, no dependencies.

## What a behavioral model looks like

The ECU models are deliberately boring. Here's the shape of one (using the `remotivelabs-topology` Python library):

```python
# A minimal ECU: read a seat-weight sensor, decide "child present",
# tell the infotainment unit to show a warning.
async with BehavioralModel("CENTER", buses=[scan]) as center:
    async for sig in center.subscribe("Passenger_Seat_Weight", "Vehicle_Speed"):
        occupied = sig["Passenger_Seat_Weight"] > CHILD_WEIGHT_MIN
        if occupied and sig["Vehicle_Speed"] == 0:
            await center.publish(WarningRequest=1)   # → SOME/IP to the IHU
```

The realism lives in the *signals*, not the code. A real seat module has a microcontroller, diagnostics, a bootloader; the virtual one is twenty lines. But the frame it emits is bit-identical to the real one, so the central ECU logic you test against it is the logic you'd ship.

One pattern that paid off: **treat ECU models as a reusable library.** We keep a registry file (a YAML catalog) listing every ECU model, which buses it uses, and which signals it produces. Composing a new virtual car for a new scenario is: pick ECUs from the catalog, define the bus topology, generate. The second virtual car took a fraction of the effort of the first.

## Gotchas that cost us real time

**Pin your tool versions.** The topology tooling, the broker image, and the Python library version-lock against each other through generated schema files. An innocent minor-version bump broke our recording playback (schema 0.2 vs 0.15 mismatch) with errors that pointed nowhere near the cause. We now pin all three explicitly and treat upgrades as a deliberate migration.

**Commit the generated compose files.** `topology generate` needs the vendor CLI, a subscription, and the right version. Committing `build/` means a new machine — or CI — goes straight to `docker compose up` with zero setup. Regenerate only when the topology actually changes.

**Never restart one container of the stack.** Restarting just the broker while ECU containers keep running caused a crash deep in the broker (all the ECUs reconnect simultaneously and race on namespace registration). Restarting the *full* stack respects dependency order and takes barely longer. The lazy habit — `docker compose up -d` on everything, every time — is also the reliable one.

**CAN in Docker needs help.** Real CAN networks inside containers need a kernel-level service (`dockercan`) on Linux. Anywhere you can't install it (CI, macOS, WSL2 without the module) there's a fallback that tunnels CAN over UDP. Wire that fallback in from day one; it's the difference between "runs on my machine" and "runs anywhere".

**Two generated topologies can't share a host.** The generator assigns the same subnet to every topology's first CAN network, so two virtual cars collide with `docker: Pool overlaps`. Patching the generated compose works but is lost on regenerate. We just don't run two at once; know the limit before you architect around it.

## Was it worth it?

Yes, and the reason is iteration speed. Change ECU logic → `docker compose up` → watch the signals — seconds, on any laptop, no bench time to book. Onboarding went from "get the hardware, install the vendor toolchain" to "clone, compose up". And the virtual car became the substrate for everything downstream: we bolted a driving simulator onto the chassis bus and a real Android Automotive build onto the infotainment ECU — both of which are their own posts.

The signal-first mental model is the part I'd carry to any similar problem: find the contract, virtualize against the contract, and keep the contract in version control.
