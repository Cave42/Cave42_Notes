# PPTX to Slidev Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Append PPTX slides 11–63 to the existing `slides.md`, with all embedded images extracted to `public/`.

**Architecture:** A one-shot Python script extracts all PPTX images to `public/` using `python-pptx`. The slide content is then appended to `slides.md` in batches, using layout assignments from the design spec (quote/intro for single-statement slides, center for image-only, default for title+content).

**Tech Stack:** python-pptx, Slidev (pnpm), Markdown

---

## File Map

| File | Action |
|---|---|
| `scripts/extract_images.py` | Create — extracts all embedded images from PPTX to `public/` |
| `public/slide_N.png` (or `.jpg`) | Create — ~48 image files extracted from PPTX |
| `slides.md` | Modify — append ~53 slides (PPTX 11–63) |

---

## Task 1: Extract images from PPTX

**Files:**
- Create: `scripts/extract_images.py`
- Creates in: `public/slide_N.png`, `public/slide_N_M.png` (for multi-image slides)

- [ ] **Step 1: Create the scripts directory and extraction script**

Create `scripts/extract_images.py` with this exact content:

```python
#!/usr/bin/env python3
from pptx import Presentation
import os

PPTX_PATH = os.path.expanduser('~/Downloads/committee_meeting_spring.pptx')
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), '..', 'public')

CONTENT_TYPE_EXT = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/gif': '.gif',
    'image/bmp': '.bmp',
}

prs = Presentation(PPTX_PATH)

for i, slide in enumerate(prs.slides):
    slide_num = i + 1
    images = [s for s in slide.shapes if s.shape_type == 13]
    for j, shape in enumerate(images):
        image = shape.image
        ext = CONTENT_TYPE_EXT.get(image.content_type, '.png')
        filename = f'slide_{slide_num}{ext}' if len(images) == 1 else f'slide_{slide_num}_{j+1}{ext}'
        filepath = os.path.join(PUBLIC_DIR, filename)
        with open(filepath, 'wb') as f:
            f.write(image.blob)
        print(f'Saved {filename}')

print('Done.')
```

- [ ] **Step 2: Run the extraction script**

```bash
python3 scripts/extract_images.py
```

Expected output: lines like `Saved slide_3.png`, `Saved slide_14_1.png`, ending with `Done.`

- [ ] **Step 3: Verify key images exist**

```bash
ls public/slide_14_1.* public/slide_59_1.* public/slide_61_1.* public/slide_20.* public/slide_33.*
```

Expected: all five paths resolve (extensions may be `.png` or `.jpg`)

- [ ] **Step 4: Commit**

```bash
git add scripts/extract_images.py public/
git commit -m "feat: extract PPTX images to public/"
```

---

## Task 2: Append slides 11–25 to slides.md

**Files:**
- Modify: `slides.md` (append after the last `---` on line 126)

Append the following block verbatim to the end of `slides.md`:

- [ ] **Step 1: Append slides 11–25**

Add this content to the end of `slides.md`:

```markdown

# What makes DASMs different

- DASMs separate functional mutation predictions and the neutral mutation process
- DASMs factor out nucleotide mutation biases

**Neutral mutations × Selection**

---

# What makes DASMs different

Produces deep mutational like scan

<div style="height: 70%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_12.png" alt="DASM deep mutational scan" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---

<div style="height: 65%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_13.png" alt="DASMs vs antibody mutation assays" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

DASMs were compared to antibody mutation assays (comparing functional effects to mutations). DASMs performed well regardless of how many nucleotide changes were required in a codon for a mutation.

---
layout: center
---

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; height: 80%;">
  <img src="./public/slide_14_1.png" style="max-width: 100%; object-fit: contain;" />
  <img src="./public/slide_14_2.png" style="max-width: 100%; object-fit: contain;" />
</div>

---

<div style="height: 70%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_15.png" alt="DASMs mimic expression data" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

DASMs mimic patterns in expression data

---

# DASMs

- Can outperform larger PLMs despite being trained on a smaller swath of protein
- Steps have been taken to train the model on underlying biological processes of the human immune system
- Not trained on functional properties of proteins

---

DASMs run significantly faster than other models

<div style="height: 70%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_17.png" alt="DASM speed comparison" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---
layout: quote
---

Do larger models perform better than smaller models?

---

# DASMs for Viruses

- Recently, the Matsen lab has been developing a version of DASM trained on viral phylogenetic trees
- There are currently DASM models for SARS-CoV-2 and influenza in development
- SARS-CoV-2 models are trained on large Usher trees

---

Viral DASMs separate neutral mutation and selection

<div style="height: 75%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_20.png" alt="Viral DASM neutral vs selection" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---
layout: center
---

<div style="height: 90%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_21.png" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---

# Normalization is done so probability scores are bounded between 0 and 1

<div style="height: 75%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_22.png" alt="Normalization diagram" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---
layout: center
---

<div style="height: 90%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_23.png" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---

# DASMs include a model to account for neutral mutations

<div style="height: 75%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_24.png" alt="Neutral mutation model" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---

# Based on the Bloom-Neher model

<div style="height: 75%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_25.png" alt="Bloom-Neher model" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>
```

- [ ] **Step 2: Verify slide count**

```bash
grep -c "^---" slides.md
```

Expected: a number between 28 and 35 (13 existing separators + ~15 new ones)

- [ ] **Step 3: Commit**

```bash
git add slides.md
git commit -m "feat: add slides 11–25 (DASM properties, viral DASMs intro)"
```

---

## Task 3: Append slides 26–43 to slides.md

**Files:**
- Modify: `slides.md` (append to end)

- [ ] **Step 1: Append slides 26–43**

Add this content to the end of `slides.md`:

```markdown
---
layout: center
---

<div style="height: 90%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_26.png" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---
layout: center
---

<div style="height: 90%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_27.png" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---

The ratio of expected and actual mutation counts is determined

<div style="height: 75%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_28.png" alt="Expected vs actual mutation ratio" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---

Fitness of mutations for a given clade is determined by how commonly a mutation is seen relative to the rest of the tree

<div style="height: 70%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_29.png" alt="Clade fitness determination" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---
layout: quote
---

- `> 1` — beneficial mutation
- `< 1` — deleterious mutation
- `= 1` — neutral mutation

---
layout: quote
---

Synonymous mutations are treated as a neutral mutation

---

# The neutral mutation model has limitations on its own

- Does not include sequence context
- Limited to clade level analysis

---

# DASMs include a transformer architecture in their model to determine the fitness of a given mutation

<div style="height: 73%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_33.png" alt="DASM transformer architecture" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---
layout: quote
---

The first step in validating a viral DASM model will be to see if it can perform better than the naive spike counts model.

---

The number of spike mutations roughly correlates with the fitness of SARS-CoV-2.

<div style="height: 68%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_35.png" alt="Spike mutation fitness correlation" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

<p style="font-size: 0.75rem; color: #888; text-align: right; margin-top: 0.5rem;"><em>From fitness flux — Trevor Bedford</em></p>

---

# Most Protein Language Models perform worse than a naive spike mutation model

- ESM2: a protein language model trained on millions of diverse proteins from the Uniprot database
- CoVFit: a fine-tuned model of ESM2, with additional training heads, designed to predict the fitness of future SARS-CoV-2 sequences
- EvEscape: a model which incorporates antibody escape predictions

---

# Why DASMs may be able to perform better

- Naïve spike model: not all mutations increase fitness by the same amount (or are even all beneficial)
- Masked language model: doesn't account for neutrality or mutations less common in the dataset
- DASMs are trained using phylogenetic trees — they can learn parent-child pair relationships

---

# SARS-CoV-2 will be the first virus tested

Large amounts of sequencing data and clearly defined clades make it ideal.

<div style="height: 65%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_38.png" alt="SARS-CoV-2 clade schema" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

<p style="font-size: 0.75rem; color: #888; text-align: right;"><em>ncov-clades-schema</em></p>

---
layout: intro
---

# Evaluating viral DASMs

---
layout: quote
---

Will compare the change in fitness between clades against the MLR model EVOfr

---
layout: quote
---

Not all sequences in a clade are identical

---
layout: quote
---

A founder sequence or a clade-defining node will be used to represent a clade

---
layout: quote
---

DASM training/test split cutoffs will be determined by clades
```

- [ ] **Step 2: Verify slide count**

```bash
grep -c "^---" slides.md
```

Expected: a number between 45 and 55

- [ ] **Step 3: Commit**

```bash
git add slides.md
git commit -m "feat: add slides 26–43 (neutral mutation model, validation approach)"
```

---

## Task 4: Append slides 44–63 to slides.md

**Files:**
- Modify: `slides.md` (append to end)

- [ ] **Step 1: Append slides 44–63**

Add this content to the end of `slides.md`:

```markdown
---
layout: quote
---

Although the model has not been trained on the sequences in clade b, the mutation may appear multiple times in clade a before later being fixed in clade b.

---

DASMs may treat these mutations as fit because they arise independently multiple times

<div style="height: 68%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_45.png" alt="Convergent mutations" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

<p style="font-size: 0.75rem; color: #888; text-align: right;"><em>Cao, Y. et al. Nature</em></p>

---

L452R has a high fitness effect in the BA.1 and BA.2 clades but is fixed in BA.4/5

<div style="height: 68%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_46.png" alt="L452R fitness across clades" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

<p style="font-size: 0.75rem; color: #888; text-align: right;"><em>Haddox et al. Virus Evolution</em></p>

---

Spike mutations that differ between parent-child pairs will be run through DASM

<div style="height: 75%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_47.png" alt="Parent-child mutation pipeline" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---

Each differing mutation fitness score will be summed

<div style="height: 75%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_48.png" alt="Summing mutation fitness scores" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---

# The first test

- The first test of viral DASM will be performed with the model trained up to June 2022
- This will include a variety of BA.1 and BA.2 sequences with tests run on the BA.4/5 clades

---

# The limitation of comparing viral DASM fitness to MLR fitness is that the analysis is limited to clade-level comparisons

- Since DASMs are built on parent-child pairs, it will be useful to work on a more granular level
- Look at parent-child pairs not of clades but individual nodes
- This is a good initial pass through

---
layout: center
---

<div style="height: 90%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_51.png" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---
layout: center
---

<div style="height: 90%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_52.png" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---
layout: center
---

<div style="height: 90%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_53.png" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---
layout: center
---

<div style="height: 90%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_54.png" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---
layout: intro
---

# Gradient Descent

---
layout: center
---

<div style="height: 90%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_56.png" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---
layout: intro
---

# How I want to approach DASMs

---
layout: center
---

<div style="height: 90%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_58.png" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>

---

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; height: 88%;">
  <img src="./public/slide_59_1.png" style="max-width: 100%; object-fit: contain;" />
  <img src="./public/slide_59_2.png" style="max-width: 100%; object-fit: contain;" />
  <img src="./public/slide_59_3.png" style="max-width: 100%; object-fit: contain;" />
  <img src="./public/slide_59_4.png" style="max-width: 100%; object-fit: contain;" />
</div>

---

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; height: 88%;">
  <img src="./public/slide_60_1.png" style="max-width: 100%; object-fit: contain;" />
  <img src="./public/slide_60_2.png" style="max-width: 100%; object-fit: contain;" />
  <img src="./public/slide_60_3.png" style="max-width: 100%; object-fit: contain;" />
  <img src="./public/slide_60_4.png" style="max-width: 100%; object-fit: contain;" />
  <img src="./public/slide_60_5.png" style="max-width: 100%; object-fit: contain;" />
</div>

---

# The world of DASMs

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; height: 75%;">
  <img src="./public/slide_61_1.png" style="max-width: 100%; object-fit: contain;" />
  <img src="./public/slide_61_2.png" style="max-width: 100%; object-fit: contain;" />
  <img src="./public/slide_61_3.png" style="max-width: 100%; object-fit: contain;" />
  <img src="./public/slide_61_4.png" style="max-width: 100%; object-fit: contain;" />
</div>

---

# The world of DASMs

- DASMs are not trained on stop codons
- The neutral mutation model can't include more than one mutation at a time
- DASMs are not trained on multi-nucleotide mutations
- Branches with multiple mutations are cut into smaller segments

---
layout: intro
---

# Thank You
```

- [ ] **Step 2: Verify final slide count**

```bash
grep -c "^---" slides.md
```

Expected: between 65 and 75

- [ ] **Step 3: Commit**

```bash
git add slides.md
git commit -m "feat: add slides 44–63 (evaluation, approach, world of DASMs)"
```

---

## Task 5: Verify in dev server

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

Expected: Slidev opens in browser at `http://localhost:3030`. No build errors in terminal.

- [ ] **Step 2: Navigate through the new slides**

Navigate from the last existing slide ("What makes DASMs different" with `dasm_outline.png`) through to the end. Check:
- Images render (not broken img icons)
- Quote slides show centered text
- Intro/section slides show the large title layout
- Grid slides show images side by side

- [ ] **Step 3: Fix any broken image references**

If any `<img>` shows as broken, the extracted filename may have a `.jpg` extension instead of `.png`. Check:

```bash
ls public/ | grep slide_
```

Update any affected `src` paths in `slides.md` to match the actual extension on disk.

- [ ] **Step 4: Final commit if fixes were needed**

```bash
git add slides.md
git commit -m "fix: correct image file extensions in slides"
```
