---
title: "From 34% to 28% WER: lessons from code-switching ASR"
description: "What I learned building a Whisper + LLaMA speech recognizer for Malay–English code-switching — where the WER actually came from, and what didn't help."
pubDate: "Jun 18 2026"
tags: [asr, nlp, research]
---

Code-switching — speakers mixing two languages inside one sentence — quietly breaks most speech recognizers. A model trained on clean monolingual audio hears "boleh tolong check ini" and confidently transcribes it as one language or the other, mangling the half it wasn't expecting. During my research internship at A\*STAR I²R I worked on Malay–English code-switching ASR, and got word error rate down from a 34% baseline to 28%. Here is where that improvement actually came from, and what I'd tell myself starting over.

## Why code-switching is its own problem

It isn't just "two languages." The hard parts are specific:

- **Tokenizers fight you.** A vocabulary tuned for one language fragments the other into nonsense subwords, so the decoder pays a tax on every switch.
- **Switch points are unpredictable.** They happen mid-phrase, often on named entities and discourse markers — exactly the low-frequency tokens models are worst at.
- **Data is scarce.** Labeled code-switch audio is rare and expensive. You almost never have enough.

If you treat it as ordinary ASR with more data, you plateau fast. The wins came from attacking these directly.

## A hybrid encoder–decoder, not a bigger model

The architecture that worked was a hybrid: a **Whisper encoder** for robust acoustic features, paired with a **LLaMA decoder** for the language modeling. The intuition is a division of labor — Whisper already hears multilingual audio well, and a strong autoregressive LM decoder handles the messy bilingual token stream and context far better than Whisper's native decoder does on switch points.

The lesson that generalizes: when one part of a pipeline is the bottleneck, replace *that part* rather than scaling the whole thing. A bigger monolithic model would have cost far more for less gain than swapping in a decoder built for language modeling.

## Noisy Student Training did the heavy lifting

With labeled data scarce, the biggest single lever was **Noisy Student Training** with pseudo-labels. The loop:

1. Train a teacher on the labeled set.
2. Run it over unlabeled audio to produce pseudo-labels.
3. Train a student on labeled + pseudo-labeled data, **with noise** (augmentation, dropout) on the student but clean inputs for the teacher's labels.
4. Promote the student to teacher and repeat.

Two details mattered more than the recipe. First, **filter pseudo-labels by confidence** — feeding the student the teacher's worst guesses just teaches it the teacher's mistakes. Second, the *noise* is the point: a student that has to recover clean targets from degraded input generalizes; one trained on easy copies just memorizes.

This is the part I'd reach for first on any low-resource task now. Unlabeled data plus a disciplined self-training loop beat almost everything else I tried.

## Engineering is what made the experiments possible

None of the above matters if a training run takes a week. The unglamorous changes that bought iteration speed:

- **Mixed precision (bf16)** — roughly halved memory and sped up training with no accuracy cost in my runs.
- **Gradient checkpointing** — traded compute for memory so larger batches fit, which stabilized training.
- **A scalable dataloader** — once the GPU stopped waiting on disk, throughput jumped.

The meta-lesson: in research, **iteration speed is a first-class result.** Every hour shaved off a run is another experiment you get to try, and the number of experiments — not the cleverness of any one — is what moved WER.

## What didn't help

Honesty matters more than a clean story:

- **Throwing in more monolingual data** barely moved code-switch WER. The model needs to see *switching*, not more of each language alone.
- **Over-aggressive augmentation** hurt — past a point, noise destroys the signal the model needs at switch boundaries.
- **Chasing the leaderboard metric** hid where errors actually were. Reading transcripts showed most remaining errors clustered on named entities and rare switches — a data problem, not an architecture one.

## Takeaway

The six points of WER didn't come from one trick. They came from matching the architecture to the bottleneck (a real LM decoder), exploiting unlabeled data with confidence-filtered Noisy Student Training, and making runs fast enough to actually iterate. On any low-resource problem, that order — bottleneck, self-training, iteration speed — is where I'd start.
