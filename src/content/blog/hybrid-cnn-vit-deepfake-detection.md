---
title: "Hybrid CNN + Vision Transformer for deepfake detection"
description: "Why combining CNNs, InceptionNeXt, and a Vision Transformer beat either alone for video deepfake detection — and why cross-dataset generalization is the metric that matters."
pubDate: "Jun 6 2026"
tags: [computer-vision, research]
---

Deepfake detectors are easy to make look good and hard to make actually work. Train on one dataset, report 99% on its test split, ship it, and watch it fall apart on fakes made with a generator it never saw. During my research at the CIS Lab at National Chung Cheng University I built **CIViT**, a hybrid pipeline combining CNNs, InceptionNeXt, and a Vision Transformer for video deepfake detection. It reached 91% on CelebDF-V2 and 94% on DFD — but the more useful lessons were about *why* the hybrid helped and how to keep a detector from fooling itself.

## Fakes leave two kinds of evidence

Manipulated faces betray themselves at two scales:

- **Local artifacts** — blending seams, warped textures, inconsistent eyes or teeth, compression quirks around the face boundary. These are small and spatial.
- **Global inconsistencies** — lighting that doesn't agree across the face, identity drift, geometry that's subtly off when you look at the whole image.

CNNs (and InceptionNeXt, a modern convolutional design) are excellent at the *local* texture artifacts — that's what convolutions are for. A **Vision Transformer**, with attention across the whole image, is better at the *global* relationships. Used alone, each misses what the other catches. The hybrid exists because the evidence genuinely lives at both scales.

The transferable idea: **don't pick an architecture by fashion, pick it by what the signal looks like.** When your signal has both local and global structure, a model that only sees one scale leaves accuracy on the table.

## Cross-dataset generalization is the real metric

The number that matters is not accuracy on the dataset you trained on — it's accuracy on fakes made by methods you *didn't* train on. A detector that memorizes the fingerprint of one generation pipeline is useless in the wild, where new methods appear constantly.

So I trained across several datasets — **Celeb-DF (V2), DFD, DeepfakeTIMIT, and WildDeepfake** — specifically to stop the model from latching onto one source's quirks. Evaluating on a held-out dataset is the only honest signal of whether you've learned "what a fake looks like" versus "what *this* fake generator looks like." If you report a single in-domain number, you're measuring memorization.

## Augmentation is the cheapest robustness

Real videos in the wild are compressed, resized, re-encoded, and noisy. A detector trained on pristine frames falls over on a phone-quality clip. Strong augmentation — compression, blur, scaling, color shifts — was one of the highest-leverage things I did: it forces the model to rely on artifacts that survive real-world degradation, not fragile pixel-perfect cues that vanish after one re-encode.

It cuts both ways, though. Over-augment and you destroy the very seams that distinguish a fake. Tuning the strength was a real part of the work, not a default I could set and forget.

## The boring knobs still decided convergence

The hybrid only trained stably after getting the unglamorous parts right: **batch size, number of epochs, and the learning-rate schedule.** Combining heterogeneous components (convolutional + attention) makes training touchier than a single clean architecture — the pieces want different effective learning rates and warmups. Most of my "the model won't converge" days were schedule problems, not architecture problems.

## What I'd tell someone starting

- **Lead with cross-dataset evaluation.** Decide up front which dataset you'll hold out, and never tune on it. It keeps you honest from day one.
- **Augment for the deployment domain**, not the training domain. If it'll see compressed video, train on compressed video.
- **Add complexity only when it pays.** The hybrid earned its keep because local and global evidence are both real here — but I validated that each component actually contributed before keeping it.

## Takeaway

The hybrid worked because deepfakes leave evidence at two scales, and CNNs and Transformers cover different ones. But the durable lesson isn't the architecture — it's that a deepfake detector is only as good as its worst out-of-distribution result. Train across sources, evaluate cross-dataset, augment for the real world, and treat that held-out number as the only score that counts.
