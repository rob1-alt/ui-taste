# Landing recipe: the image sandwich

This is one of the directions in `references/landing-concepts.md`, not the default. Use it when a concept built on it won against two concepts from other directions. It is the family of heroes in the library tagged `image-sandwich-family` (MeetSense, Qredible, Opero, Torqe, Xenora, Nelson, Orbit, Synais):

```bash
python3 scripts/find_refs.py "image sandwich" --limit 8
```

Open at least two of them before building. The starting point is `assets/landing-hero.html`.

## The one idea

The hero is a **picture you can stand inside**. Three layers, back to front:

1. **Backdrop**: a full-bleed image (sky, landscape, dusk, a duotone engraving, a photo collage).
2. **The product**: a real-looking app window (sidebar, numbers, a table or a workflow), centred, wide (75-85% of the hero), with only its top 60-70% visible.
3. **Foreground**: the front of the same scene (hills, grass, tree canopy, a hand) drawn **over** the bottom of the product window, so the product sits in the landscape instead of floating on it.

Everything else is quiet so this reads. If you cannot make the three layers, you are not building this recipe; pick another reference.

## Anatomy of the hero (top to bottom)

| Part | Spec |
|---|---|
| Frame | The hero is inset: 16-24px margin on a light grey page (#e9e9e7 to #f1f1ef), corners 12-16px, image clipped to the frame. |
| Nav | Logo (mark + word) left, 4-5 plain links, then a white secondary button (Sign in) and a black primary (Start free). 64-72px tall, no background: it sits on the image. |
| Badge | One small pill above the headline: a dark tag (`New`, `AI Meeting`) and a short line in a monospace (`Trusted by 20K+ teams`). Optional. |
| Headline | Two short lines, 64-88px desktop, line height 0.95-1.05, tracking -0.02 to -0.035em. Either a **serif display** (Instrument Serif, Gambetta, Fraunces at low contrast) set in regular weight, or a **tight grotesk** (Inter Display, Neue Montreal, Satoshi) in medium. Never bold, never a gradient. Each line a full thought: “Record talks. / Stay on track.” |
| Sub | One sentence, 15-18px, muted (55-65% ink), max 40ch, centred under a centred headline. |
| Buttons | One filled (black, or the single brand colour) and one white, same height 44-48px. Pills or square, never mixed. An arrow → in the primary is fine. |
| Product | Starts 32-56px under the buttons. White, 12px radius, hairline border, one soft shadow. Real labels and plausible numbers for the product being built, never lorem. |
| Foreground | Covers the product from about 40-55% of its height down. The top edge is an organic curve, never a straight line. |
| Proof | A row of 5-7 customer logos in white (or a short line “Trusted by…”) set on the foreground at the bottom of the hero. Only real customers; otherwise leave the row out. |

Left-aligned variant (Xenora, Torqe, Orbit): headline and buttons top-left, the product enters from the right or the bottom, the foreground sweeps diagonally.

## Picking the scene

| Brand mood | Scene | Palette |
|---|---|---|
| Calm, productive | Pale sky, blue mountains at the sides, bright green hills (MeetSense) | sky #a8d3ea → #eef1ea, grass #a6c95a → #2f611b |
| Bold, technical | Saturated electric blue, grass or one dark hill (Qredible, Torqe) | #1f4bff or #1d5bff, grass, one accent (orange #ff4b1f) |
| Premium, serious | Dusk sky, dark hills, pink and green canopy (Opero) | #1b1d2a → #6b4a48, canopy pinks and olive, white UI |
| Editorial, playful | Clouds with a torn-paper collage, classical statues (Nelson) | photo blues and marble, one electric blue |
| Loud, memorable | One engraving turned into a halftone duotone (Orbit) | one blue #1f1fff + white, nothing else |
| Hardware or object | A hand holding the object on a warm plain background with thin line diagrams (Synais) | beige #e6e1d3, oxblood #7a2f33, dark brown sections |

One brand colour at most. The image carries the colour; the UI stays white, black and grey.

## Getting the images

The look depends on the image. In order of preference:

1. **The user's own photography or brand imagery.** Ask for it, and set the backdrop and foreground as image slots so it drops in later (`references/imagery.md`).
2. **Generated images** with an image model (GPT Image, Flux, Seedream; in this setup through `treg`). Ask for two plates of the same scene so the layers line up:
   - backdrop: “wide 16:9 photograph of … , soft morning light, large empty sky in the upper half, no text, no people”
   - foreground: the same prompt plus “only the foreground hills, everything above them transparent” (or generate one image and cut it, see 3).
3. **Cut the foreground out of one image** with `scripts/backdrop.py foreground` (an outline you trace by looking at the image, or automatic with `rembg` if installed).
4. **Treatments** for a stronger identity: `scripts/backdrop.py duotone` (Orbit), `grade` for a warm or cool cast.
5. Only when nothing else is available: drawn SVG layers (see `assets/landing-hero/`), clearly a placeholder. Tell the user real imagery will lift the page.

Never use a stock photo you cannot license, never a famous artwork you have no right to, never invent customer logos.

## Below the hero

Keep the image language going, but calmer:

- **Section heads**: a small pill eyebrow (icon + `USE CASES`), then a 44-56px headline in the hero face where the second half is greyed (“Ideas into **Structured** Execution” with “Structured” at 45% ink). Lede on the right in a split head, or centred under a centred head.
- **Cards that reuse the backdrop**: 2-3 large panels in the scene's dark colour (deep blue, dusk), the foreground image along their bottom, a white UI fragment (a node, a chart, a share dialog) floating in the top half, and a white title and line of text at the bottom.
- **Three cards with a featured one**: equal cards on white with hairline borders, the middle one black with white text.
- **Big numbers**: three or four 56-72px figures with a one-line label, separated by hairlines. Real figures only.
- **A full statement section**: dark ground (the brand's darkest colour), a 48-64px statement in two tones (first half ink, second half muted).

## Checks for this recipe

- [ ] Three layers are visible: the foreground really overlaps the product.
- [ ] The product window shows the actual product with real labels.
- [ ] One headline face, regular or medium weight, two lines.
- [ ] One filled button per view.
- [ ] The image is the only colourful thing in the hero.
- [ ] Logos and numbers are real or absent.
- [ ] Mobile: the product window keeps its top part, the foreground still overlaps it, the headline is 40-48px.
