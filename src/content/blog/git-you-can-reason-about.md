---
title: 'Git you can reason about'
description: 'A working mental model of Git — snapshots, pointers, three trees — then the daily commands and how to escape the five situations that scare people.'
pubDate: 'Aug 1 2026'
tags: [engineering-practice, git]
---

## Three facts that make the rest of Git obvious

People usually learn Git as a list of spells. `add`, `commit`, `push`, and when something goes sideways, delete the folder and clone again. That works until the day it doesn't, and then you are guessing under pressure.

Three facts remove most of the guessing.

**A commit is a snapshot, not a diff.** Git stores the whole tree of files as it looked at that moment, addressed by content hash, plus a pointer to its parent commit. The diffs you see in `git log -p` are computed on demand by comparing a commit to its parent. Consequence: a commit is immutable. "Editing" one — amend, rebase, squash — always produces a *new* commit with a new hash, and the old one still exists until garbage collection eats it.

**A branch is a pointer.** Not a copy, not a folder. It is a file containing forty hex characters:

```bash
$ cat .git/refs/heads/main
9f1c0e2a4b8d3f6017c5aa9e2d4b7c81f0a3e5d9
```

That is why creating a branch is instant and free even in a 5 GB repo. Committing on a branch means "write a new commit, then move this pointer to it". `HEAD` is one more pointer, normally pointing at a branch name rather than a commit. When it points straight at a commit instead, you are in detached HEAD — more on that below.

**There are three trees, and `git status` is a report about the gaps between them.** Your working directory (real files on disk), the index or staging area (what your next commit will contain), and `HEAD` (what your last commit contained).

<figure>
<svg viewBox="0 0 720 210" role="img" aria-label="Diagram of Git's three trees: working directory, staging area, and repository, with git add moving changes to staging, git commit moving them to the repository, and git restore or git reset moving them back" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted)"/>
    </marker>
  </defs>
  <rect x="10" y="40" width="190" height="60" rx="6" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <rect x="265" y="40" width="190" height="60" rx="6" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <rect x="520" y="40" width="190" height="60" rx="6" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="105" y="66" text-anchor="middle" font-size="15" fill="var(--heading)">Working dir</text>
  <text x="105" y="86" text-anchor="middle" font-size="12" fill="var(--text-muted)">files on disk</text>
  <text x="360" y="66" text-anchor="middle" font-size="15" fill="var(--heading)">Staging area</text>
  <text x="360" y="86" text-anchor="middle" font-size="12" fill="var(--text-muted)">next commit</text>
  <text x="615" y="66" text-anchor="middle" font-size="15" fill="var(--heading)">Repository</text>
  <text x="615" y="86" text-anchor="middle" font-size="12" fill="var(--text-muted)">HEAD and history</text>
  <line x1="205" y1="70" x2="258" y2="70" stroke="var(--accent)" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="460" y1="70" x2="513" y2="70" stroke="var(--accent)" stroke-width="2" marker-end="url(#ar)"/>
  <text x="231" y="30" text-anchor="middle" font-size="12" fill="var(--accent)">git add</text>
  <text x="486" y="30" text-anchor="middle" font-size="12" fill="var(--accent)">git commit</text>
  <path d="M615,110 L615,160 L105,160 L105,108" fill="none" stroke="var(--border-strong)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#ar)"/>
  <text x="360" y="180" text-anchor="middle" font-size="12" fill="var(--text-muted)">git restore / git reset</text>
</svg>
<figcaption>The three trees. Every everyday command is a move between two of them.</figcaption>
</figure>

One more structural fact: your clone holds the entire history. That is what "distributed" means in practice — `log`, `diff`, `branch`, `blame` and committing all run at local-disk speed with the network unplugged, and only `fetch`, `pull` and `push` touch a server. Coming from SVN, that is the difference you actually feel: not philosophy, latency.

## Setup and the daily loop

Two settings decide how your name appears in history forever, so get them right on a new machine:

```bash
git config --global user.name "Bac Nguyen"
git config --global user.email "bac@example.com"
git config --global pull.ff only     # refuse surprise merge commits on pull
```

Then either `git init` in an existing folder or `git clone <url>`. A clone already has its remote wired up as `origin`; an `init` does not:

```bash
git remote add origin git@github.com:team/service.git
git push -u origin main   # -u sets the upstream so later `git push` needs no args
```

The loop itself is small:

```bash
git pull --ff-only                 # start the session on current code
# ...edit...
git status                         # which tree is each change sitting in?
git add src/planner.cpp            # stage exactly what belongs in this commit
git commit -m "Clamp lateral accel to vehicle limit"
git log --oneline --graph --decorate -10
git push
```

A widely believed thing that is wrong: that `pull` is the safe, conservative way to sync. Default `pull` is `fetch` plus `merge`, so on a diverged branch it silently creates a merge commit nobody asked for. `git fetch` is the conservative one — it updates `origin/main` and touches nothing you are working on. Look, then decide:

```bash
git fetch
git log --oneline HEAD..origin/main   # what they have that I don't
git log --oneline origin/main..HEAD   # what I have that they don't
```

Tags are the other thing people get wrong. An annotated tag is a real object with author, date and message; a lightweight tag is just another pointer. Use annotated for anything a release note or a flashed ECU build will ever reference. And tags are not pushed by your normal `git push`:

```bash
git tag -a v2.4.0 -m "Release 2.4.0"
git push origin v2.4.0        # one tag
git push origin --tags        # all of them
```

Renaming a branch is three operations, because the remote branch is a separate ref:

```bash
git branch -m feat/parkig feat/parking
git push -u origin feat/parking
git push origin --delete feat/parkig
```

## Branching strategies, compared honestly

`git branch`, `git switch -c name`, `git merge` are five minutes of learning. Choosing a branching model is the part that actually costs teams money. The real variable is not the diagram — it is how long a change lives outside the mainline, because integration pain grows superlinearly with that time. Martin Fowler's [branching patterns](https://martinfowler.com/articles/branching-patterns.html) is the best long-form treatment; the short version:

| Model | Shape | Fits when | Cost you pay |
|---|---|---|---|
| Trunk-based | Everyone commits to `main`, branches live hours | Strong CI, feature flags, one deployable | Needs discipline and fast tests; no branch to hide in |
| GitHub Flow | Short branch → PR → merge to `main` → deploy | Web services, continuous delivery | Review latency becomes the bottleneck |
| Release branches | `main` plus `release/2.4` cut per release, fixes cherry-picked back | Firmware, embedded, anything shipped to a customer that cannot be redeployed | Cherry-pick drift; every fix is applied N times |
| Git Flow (`develop` + `release` + `hotfix`) | Long-lived `develop`, formal release branches | Scheduled releases, several teams, heavy QA gates | Most ceremony; long-lived branches mean big merges |
| Integration branch per team | Each team merges into a shared branch, that branch into `main` | Many teams touching one product line | Conflicts surface late, at the worst level |

Concrete case: an automotive stack shipping to a customer program cannot be trunk-only, because a frozen build keeps receiving fixes for eighteen months while `main` moves on. `release/*` branches are right there. The same repo's tooling and simulation code has no reason to leave trunk. Different lifetimes, different models, one repository — better than forcing one diagram on everything.

Whatever you pick, write down which branch is deployable and who may force-push where.

## The five situations that scare people

| Symptom | What actually happened | Way out |
|---|---|---|
| "HEAD detached at 9f1c0e2" | `HEAD` points at a commit, not a branch. New commits belong to nothing. | `git switch -c rescue/wip` to keep them, or `git switch main` to leave |
| Merge went wrong, not pushed | The merge commit is local | `git merge --abort` mid-conflict, or `git reset --hard ORIG_HEAD` after |
| Bad merge already pushed | History is public; rewriting it breaks everyone | `git revert -m 1 <merge-sha>` — a new commit that undoes it |
| Someone force-pushed over your branch | Remote ref moved backwards; your commits are still in your reflog | `git reflog`, then `git branch salvage <sha>` |
| Commit "disappeared" after reset/rebase | Unreachable, not deleted, for ~90 days | `git reflog` first; `git fsck --lost-found` if the reflog is gone |

`git reflog` is the single most valuable command in this list. It is a local log of everywhere `HEAD` has been, including states no branch points at any more:

```bash
$ git reflog
a1b2c3d HEAD@{0}: reset: moving to HEAD~3
7e8f9a0 HEAD@{1}: commit: Add curvature filter     # <- the "lost" work
...
$ git branch salvage 7e8f9a0
```

Conflicts deserve one clear statement: a conflict is not an error, it is Git declining to guess. When two branches change the same lines, you get markers in the file, and your job is to produce the final text — not to keep either side by ritual.

```bash
git status                  # "both modified" = the list of files to fix
# edit each file, delete every <<<<<<<, =======, >>>>>>> marker
git add src/planner.cpp
git commit                  # message is pre-filled
git merge --abort           # or: back out entirely, nothing lost
```

Two rules keep this rare and cheap: pull before you start, and keep branches short. A branch that lives three days conflicts on a few lines. A branch that lives three weeks conflicts on a design.

On rewriting history: rebase and amend are fine on branches only you have. On a shared branch they announce that everyone else's clone is now wrong. If you must force-push something others may have fetched, use `git push --force-with-lease` — it refuses when the remote holds commits you have not seen. Plain `--force` will delete a colleague's work without asking.

## What to do differently on Monday

- Set `git config --global pull.ff only`. Let Git refuse instead of inventing merge commits.
- Use `git fetch` plus `git log HEAD..origin/main` when you are unsure what changed upstream. It costs four seconds.
- Run `git reflog` once today on a real repo, so it is familiar the day you need it.
- Alias `git push --force-with-lease` and stop typing plain `--force`.
- Find your team's oldest open branch. More than a week old is your next merge conflict — split it or land it this week.
