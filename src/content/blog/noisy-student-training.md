---
title: 'Noisy Student Training when you have 100 hours labelled and 60,000 unlabelled'
description: 'How the noisy student loop actually works, why the noise and the pseudo-label filter are the method, and where it falls apart in practice.'
pubDate: 'Jun 18 2026'
tags: [asr, training, research]
---

## Labelled data runs out before unlabelled data does

Transcription costs money per hour. Recording does not. Every speech project I have worked on ends up in the same shape: a few hundred hours of transcribed audio, and a pile of untranscribed audio one or two orders of magnitude larger that nobody has budget to annotate.

Noisy Student Training (NST) is the most reliable thing I know for converting that pile into accuracy. It is not clever. It is a loop you run four or five times, and most of the engineering is in the two steps people skip.

The original is [Xie et al., 2019, *Self-training with Noisy Student improves ImageNet classification*](https://arxiv.org/abs/1911.04252). It reached 88.4% ImageNet top-1, 2.0% above the prior state of the art that had leaned on 3.5B weakly labelled Instagram images, using 300M unlabelled images instead. The robustness numbers are the more interesting part: ImageNet-A top-1 went from 61.0% to 83.7%, ImageNet-C mean corruption error from 45.7 to 28.3.

The speech adaptation is [Park et al., 2020, *Improved Noisy Student Training for Automatic Speech Recognition*](https://arxiv.org/abs/2005.09629). That one is the paper to read if your problem is ASR, because its contribution is almost entirely about filtering and balancing pseudo-labels — the parts the vision paper handles with a single confidence threshold.

## The loop

<figure>
<svg viewBox="0 0 765 250" role="img" aria-label="Diagram of the noisy student loop: a labelled set trains a teacher; the teacher decodes an unlabelled pool into pseudo-labels; the pseudo-labels are filtered and balanced; a student equal to or larger than the teacher trains on them with noise; the student becomes the next teacher." font-family="system-ui, sans-serif">
  <defs>
    <marker id="nst-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)"/>
    </marker>
  </defs>

  <rect x="30" y="12" width="150" height="40" rx="6" fill="var(--surface-2)" stroke="var(--border)"/>
  <text x="105" y="37" text-anchor="middle" font-size="13" fill="var(--text)">Labelled set S</text>

  <rect x="215" y="12" width="150" height="40" rx="6" fill="var(--surface-2)" stroke="var(--border)"/>
  <text x="290" y="37" text-anchor="middle" font-size="13" fill="var(--text)">Unlabelled pool U</text>

  <rect x="30" y="90" width="150" height="64" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="105" y="128" text-anchor="middle" font-size="14" fill="var(--heading)">Teacher</text>

  <rect x="215" y="90" width="150" height="64" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="290" y="120" text-anchor="middle" font-size="14" fill="var(--heading)">Pseudo-labels</text>
  <text x="290" y="138" text-anchor="middle" font-size="11" fill="var(--text-muted)">clean input, no noise</text>

  <rect x="400" y="90" width="150" height="64" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="475" y="120" text-anchor="middle" font-size="14" fill="var(--heading)">Filter + balance</text>
  <text x="475" y="138" text-anchor="middle" font-size="11" fill="var(--text-muted)">drop low-confidence</text>

  <rect x="585" y="90" width="150" height="64" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)"/>
  <text x="660" y="120" text-anchor="middle" font-size="14" fill="var(--heading)">Noisy student</text>
  <text x="660" y="138" text-anchor="middle" font-size="11" fill="var(--text-muted)">size &#8805; teacher</text>

  <path d="M 105 52 L 105 86" stroke="var(--accent)" stroke-width="1.5" fill="none" marker-end="url(#nst-arrow)"/>
  <path d="M 290 52 L 290 86" stroke="var(--accent)" stroke-width="1.5" fill="none" marker-end="url(#nst-arrow)"/>
  <path d="M 182 122 L 211 122" stroke="var(--accent)" stroke-width="1.5" fill="none" marker-end="url(#nst-arrow)"/>
  <path d="M 367 122 L 396 122" stroke="var(--accent)" stroke-width="1.5" fill="none" marker-end="url(#nst-arrow)"/>
  <path d="M 552 122 L 581 122" stroke="var(--accent)" stroke-width="1.5" fill="none" marker-end="url(#nst-arrow)"/>

  <path d="M 660 156 L 660 205 L 105 205 L 105 158" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="5 4" fill="none" marker-end="url(#nst-arrow)"/>
  <text x="382" y="228" text-anchor="middle" font-size="12" fill="var(--text-muted)">student becomes the next teacher — repeat 3–5 times</text>
</svg>
<figcaption>One generation of noisy student training. The teacher labels clean input; the student sees the same targets through heavy augmentation.</figcaption>
</figure>

Four steps. Train a teacher on your labelled set. Run it over the unlabelled pool to produce pseudo-labels, on *clean* input, with every decoding trick you can afford. Filter and balance those pseudo-labels. Train a student at least as large as the teacher on labelled plus pseudo-labelled data, with noise turned up hard. Then the student is the new teacher and you go round again.

Xie et al. ran three iterations: EfficientNet-B7 into an L2 student (87.6%), L2 into L2 (88.1%), then L2 into L2 with a larger unlabelled batch ratio (88.4%). Park et al. ran six generations on LibriSpeech 100-860 and five on the LibriLight task. My own experience matches: generation 1 is most of the win, generation 2 is worth it, generation 3 is usually the last one that pays for its compute, and past that you are burning GPU-weeks for tenths of a point.

## The noise is the method, not a detail

The asymmetry is the whole thing. The teacher sees clean input and produces the best label it can. The student sees the same target through a corrupted view and has to reproduce it anyway. That forces the student to be invariant to the corruption, which is information the teacher's labels alone do not contain — otherwise the student would just learn to imitate the teacher and gain nothing.

Two kinds of noise, and you want both:

- **Input noise.** RandAugment for images; SpecAugment for audio. Xie et al. used RandAugment with two random operations at magnitude 27. Park et al. used adaptive SpecAugment and *increased* the masking across generations — time mask parameter going 40 → 80 → 100 — because a stronger student can absorb harder augmentation.
- **Model noise.** Dropout and stochastic depth. Xie et al. used dropout 0.5 and stochastic depth survival probability 0.8 at the final layer.

Their ablation is honest about the size: removing augmentation, stochastic depth, and dropout together dropped accuracy from 85.1% to 84.3%. Small in isolation, but it is the difference between the loop climbing and the loop sitting still at considerable expense.

## Bigger student, not smaller

This is where NST inverts [knowledge distillation](https://arxiv.org/abs/1503.02531), whose entire point was compressing a large model or ensemble into a small deployable one. NST makes the student equal to or larger than the teacher. Xie et al. call it knowledge expansion. Park et al. do the same implicitly on LibriLight: the ContextNet student grows across generations, 1.25 → 1.75 → 2.25 → 2.5.

| | Plain self-training | Knowledge distillation | Noisy Student Training |
|---|---|---|---|
| Student size vs teacher | same | smaller | equal or larger |
| Noise on student | none/light | usually none | heavy, deliberate |
| Goal | use unlabelled data | compress | use unlabelled data *and* grow capacity |
| Teacher input at labelling time | clean | clean | clean |
| Typical rounds | 1 | 1 | 3–6 |

A smaller distilled student cannot exceed its teacher, which is fine — you wanted the speed. A same-size student with no noise mostly re-learns the teacher's decision boundary, mistakes included. Larger plus noisy is what makes the loop climb.

## What breaks it

| Failure mode | Symptom | Fix |
|---|---|---|
| Confirmation bias | WER improves on dev, degrades on a held-out set with different characteristics; teacher errors appear verbatim in student output | Filter by confidence; keep real labelled data in every batch |
| Class / token imbalance | Frequent classes swallow the pseudo-label set; rare words vanish entirely | Cap per-class counts, oversample the tail |
| Domain mismatch | Unlabelled pool is a different acoustic domain; generation 1 makes things worse, not better | Prefer soft labels; check per-domain dev sets before generation 2 |
| Threshold too aggressive | Kept set is tiny and trivially easy; student learns nothing new | Relax the threshold across generations |

Confirmation bias is the one that will actually bite you. [Arazo et al., 2019](https://arxiv.org/abs/1908.02983) showed cleanly that naive pseudo-labelling overfits to its own incorrect labels, and that mixup plus a guaranteed minimum of labelled samples per mini-batch measurably suppresses it. That second trick is the cheap one and I would not run the loop without it.

Xie et al.'s filtering is a single confidence threshold of 0.3 plus balancing — at most 130K images per class, duplicating images for classes that fall short, ending at 130M images of which 81M were unique. On soft versus hard pseudo-labels they found both work, with soft slightly better for out-of-domain unlabelled data, which matches what I have seen when the unlabelled pool does not match the labelled one.

## The speech setting, concretely

Park et al.'s LibriSpeech 100-860 setup is the normal situation: 100 hours transcribed, 860 hours not. Their baseline was 5.5% / 16.9% WER on test-clean / test-other. After the loop: 4.2% / 8.6%, against a prior state of the art of 4.74% / 12.20%. On the larger task — full 960h labelled plus LibriLight unlab-60k — they reached 1.7% / 3.4% versus a prior 1.9% / 4.1%.

Note where the gain concentrates: test-other, the harder condition, nearly halved. That is the shape you should expect. NST buys you robustness on the conditions your labelled set under-covers.

Two implementation details that matter more than the architecture:

**Decode the teacher as well as you possibly can.** Park et al. shallow-fuse the teacher with a language model trained on a fixed text corpus specifically to produce better transcripts for the student. Teacher decoding is offline and one-shot — use a wide beam and an LM even if you would never ship that latency. Budget for it: pseudo-labelling 60k hours with a wide beam is comparable in cost to a full training run, and you pay it once per generation.

**Pick the threshold on held-out labelled data, not by feel.** Their normalised filtering score divides the LM-fused hypothesis score by a length-dependent normaliser, and they relax the threshold across generations (1, 0.5, 0, −1, then no filter at all) as the teacher gets better. The mechanism is simple enough to reproduce:

```python
def pick_threshold(scored_dev, max_wer=0.20):
    """scored_dev: (score, n_errors, n_ref_tokens) per utterance from a HELD-OUT
    labelled set decoded by the current teacher. Returns the lowest threshold
    whose retained subset stays under max_wer -- i.e. keep the most data we can
    while capping pseudo-label error."""
    for cand in sorted({s for s, _, _ in scored_dev}):
        kept = [(e, n) for s, e, n in scored_dev if s >= cand]
        tokens = sum(n for _, n in kept)
        if tokens and sum(e for e, _ in kept) / tokens <= max_wer:
            return cand
    return None

assert pick_threshold([(0.1, 5, 10), (0.5, 1, 10), (0.9, 0, 10)], 0.05) == 0.5
```

Raise `max_wer` each generation. Holding it fixed is what produces the "kept set is tiny and trivially easy" failure — you filter down to the utterances the model already gets right and the student learns nothing.

Balancing is the other half. Park et al. use sub-modular sampling to match the token distribution of the generated set to the supervised set, capping how many times any utterance can be repeated. A blunt version — cap per-speaker and per-duration-bucket counts, oversample rare tokens — captures most of it. And keep real labels in the mix: they ran supervised-to-pseudo batch ratios of 4:6 early, moving to 2:8 by generation 4 as the pseudo-labels got trustworthy.

## When it is not worth it

If your unlabelled pool is smaller than roughly 5× your labelled set, skip it — you will spend a week of compute for noise-level gains. If the pool is a genuinely different domain and your generation-1 teacher is already weak there, NST amplifies the mismatch rather than fixing it; label a few hours of the new domain first. And if you cannot serve a larger model, the loop's main lever is gone; you would be running plain self-training and should expect plain self-training's results.

## Takeaways

- Budget the pseudo-labelling pass as a first-class training run, not a preprocessing step, and decode with an LM and a wide beam you would never ship.
- Plan three generations, not one and not ten. Measure generation 3's delta before committing to generation 4.
- Set the confidence threshold from a held-out labelled set with an explicit error cap, and relax the cap each generation.
- Never let a batch be all pseudo-labels. A fixed floor of real labelled data per batch is the cheapest defence against confirmation bias there is.
- Turn the augmentation *up* as generations progress. The student that can absorb it is the one that gained something.
- Watch the hard dev set, not the clean one. If test-other is not moving, the loop is recycling the teacher and you should stop.
