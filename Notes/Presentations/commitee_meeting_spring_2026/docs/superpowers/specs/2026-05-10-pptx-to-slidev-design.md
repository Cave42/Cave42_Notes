# PPTX to Slidev Conversion — Design Spec

**Date:** 2026-05-10  
**Source:** `/Users/cavendan/Downloads/committee_meeting_spring.pptx` (63 slides, 48 embedded images)  
**Target:** `/Users/cavendan/Desktop/commitee_meeting_spring_2026/slides.md`

---

## Goal

Continue the existing partial Slidev conversion of `committee_meeting_spring.pptx`. The existing `slides.md` covers through PPTX slide 10 ("What makes DASMs different" with `dasm_outline.png`) with a slightly customized structure (added intro/background slides). The conversion will append the remaining content (PPTX slides 11–63) in the same style and spirit as what already exists.

## Scope

- **In scope:** Appending slides 11–63 to the existing `slides.md`; extracting all embedded PPTX images to `public/`
- **Out of scope:** Modifying existing slides in `slides.md`; replacing the custom intro slides; converting PPTX animations to Slidev `v-click`

---

## Section 1: Image Extraction

**Tool:** `python-pptx`

**Naming convention:**
- Single image on a slide: `public/slide_{N}.png`
- Multiple images on a slide: `public/slide_{N}_1.png`, `public/slide_{N}_2.png`, etc.

**Deduplication:** `public/dasm_outline.png` and `public/single_vs_multiple_mut.png` already exist (from PPTX slides 10 and 6 respectively). The extractor will write all images by slide number — no re-mapping of existing named files is needed since new slides will reference the new `slide_{N}.png` names.

**Format:** Images are extracted in their native format from the PPTX (PNG or JPEG). Extension is determined from the image blob content type.

---

## Section 2: Layout Mapping

Each PPTX slide type maps to a Slidev layout as follows:

| Slide type | Slidev layout | Notes |
|---|---|---|
| Single bold statement (no image) | `layout: quote` | Short assertive text, no bullets |
| Section transition title | `layout: intro` | Slide 57 "How I want to approach DASMs", slide 39 "Evaluating viral DASMs" |
| Image only | `layout: center` + centered `<img>` | Slides 21, 23, 51–54 |
| Title + image | Default + `<img>` in centered div | Same `<div style="height:78%...">` pattern from existing slides.md |
| Title + bullets | Default layout, markdown bullet list | |
| Title + image + caption/bullets | Default, image above text | Slides 13, 45, 46 |
| Thank You / closing | `layout: intro` | Slide 63 |

**Image HTML pattern** (matches existing slides.md):
```html
<div style="height: 78%; display: flex; align-items: center; justify-content: center;">
  <img src="./public/slide_N.png" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
</div>
```

---

## Section 3: Special Cases

**Multi-image grid slides (59, 60, 61):**  
Slides with 4–5 images use a CSS grid layout:
```html
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; height: 80%;">
  <img src="./public/slide_N_1.png" style="max-width: 100%; object-fit: contain;" />
  <img src="./public/slide_N_2.png" style="max-width: 100%; object-fit: contain;" />
  ...
</div>
```

**Citation slides (35, 45, 46):**  
Author citations ("From fitness flux Trevor Bedford", "Cao, Y. et al Nature") rendered as small italic captions below the image:
```html
<p style="font-size: 0.75rem; color: #888; text-align: right; margin-top: 0.5rem;"><em>Cao, Y. et al. Nature</em></p>
```

**Progressive build pairs:**  
Slides that repeat a title with accumulated content (e.g., slides 10/11/12 "What makes DASMs different") remain as separate slides. No collapsing.

**Slide 30 (fitness scoring legend):**  
The `> 1 / < 1 / = 1` content is a blockquote-style text box. Rendered as a `layout: quote` slide with a markdown blockquote or styled list.

---

## Section 4: Slide Count

| | Count |
|---|---|
| Existing slides in slides.md | ~13 |
| New slides to append (PPTX 11–63) | ~53 |
| Expected total | ~66 |

---

## Constraints

- Do not modify any existing content in `slides.md`
- Follow the existing font/color/transition settings in the frontmatter
- All images go into `public/` — no subdirectories
- Image references use `./public/` prefix (matching existing convention)
