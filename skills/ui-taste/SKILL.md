---
name: ui-taste
description: Give the agent UI taste before it builds an interface, and build landing pages that are distinctive rather than templated (three concepts from different directions, one signature move). Use whenever you design, build, restyle or review a user interface or set up a design system (tokens, colour scales, type scale, DESIGN.md) (landing page, pricing page, dashboard, docs, changelog, login, settings, component, mobile screen), when the user says the UI looks generic, "AI-made", bland or off, or asks to make it look like Linear, Stripe, Vercel or another well-designed product. Looks up real screens captured from strong products, with the fonts, type scale, colours, radii and widths they really use, then builds from the project's own design system and checks the rendered result against an anti-slop checklist.
---

# UI taste

AI agents default to the same interface: a purple gradient hero, three centred feature cards with emoji icons, Inter everywhere, shadows on everything. This skill replaces that default with evidence: real screens from products known for their design, measured on the live page, and a review of what you actually rendered.

References are evidence for a decision, never a template. Never copy a brand's logo, illustrations, copy or exact layout; take the decision behind it (hierarchy, density, rhythm, restraint) and apply it with the project's own components and brand.

## Workflow

### 1. Inspect the project first

Before looking anywhere else, read what the project already decided:
- A `DESIGN.md`, design tokens, a Tailwind config, CSS variables, a theme file, a component library (`components/ui`, shadcn, etc.).
- The two or three screens closest to the one you are building: spacing, type sizes, radii, button styles, how sections are separated.
- The brand: fonts, colours, tone of voice, existing illustrations or photos.

The project's system wins over any reference. If there is no system at all, or its tokens are a mess, build one with `references/design-systems.md` (token layers, colour scales with step roles, type roles, spacing, radius, elevation, motion, component states), fill `assets/DESIGN.md` and confirm it with the user before building on it. The library holds the best public systems (Geist, Primer, Carbon, Material 3, Radix, shadcn/ui, Atlassian, GOV.UK…): `find_refs.py "design system colors"`. Never silently replace an existing system.

### 2. Reference: only for a concrete decision

Search the library when outside evidence can settle a specific question: how dense a pricing table should be, how a changelog entry is laid out, what a dark hero needs to stay readable, how a docs sidebar groups pages.

```bash
python3 scripts/find_refs.py "pricing page with comparison table"
python3 scripts/find_refs.py "changelog" --platform both
python3 scripts/find_refs.py "dark landing hero" --limit 2
python3 scripts/find_refs.py --list          # what the library covers
```

Each result gives the screenshot paths (open them with the Read tool: look at them, do not guess), the patterns, why the screen is in the library, and the tokens measured on the live page (fonts, h1/h2/body sizes, line heights, background and text colours, button radius, height and padding, content width).

- One strong reference is enough; three is the maximum. More references blur the decision.
- Say which reference you used and which decision it settled ("Linear's pricing: plan names as plain text, the price as the only large element").
- When the result is labelled "closest match", treat it as a loose hint.
- If the library has nothing relevant, say so and rely on the rules below; do not pretend a screen applies.

For a landing or any marketing page (pricing, about, careers, product), references are not optional: before writing CSS, open at least two library screens from the direction you chose and write one line each on what they do that a default page does not (scale of the headline, how much of the fold the image takes, the one colour, the real material). The first screen you build is calibrated by what you looked at last.

### 3. Build

Apply the decision with the project's components and tokens. Keep to these defaults unless the project says otherwise (see `references/taste-rules.md` for the reasoning):
- One typeface family (two at most: a display face for headings and a text face). Two or three weights. The face is a choice, not the default: pick it for the direction (a grotesk with character, a condensed display, a serif with a voice) from Google Fonts or Fontshare when web fonts are allowed. When they are not, use a deliberate system stack (see `references/taste-rules.md`, "Type without web fonts") and carry the character through scale, weight and width; never ship the bare `-apple-system, Arial` stack as if it were a decision.
- A type scale with clear steps (for example 14 / 16 / 20 / 28 / 40 / 56). Body text 15-18px, line height 1.5-1.7; large headings line height 1.0-1.2 and slightly negative letter spacing.
- Neutral surfaces, one accent colour used for action and state, not decoration. Text never pure black on pure white is fine; grey text must still pass contrast (4.5:1 for body).
- A spacing scale on a 4 or 8px grid; generous vertical space between sections (64-160px on desktop), tight space inside groups.
- One radius family (for example 6px controls, 12px cards) and one button style per level (primary, secondary, ghost).
- Real content: the product's real names, numbers, screenshots and copy. Never invent customers, logos, testimonials, ratings or statistics; leave a clearly marked placeholder and tell the user.

### Landing pages

A landing page must not look like the last one you built, nor like the current AI look (cream, serif with an italic word, mono micro-labels, pills; see `references/anti-slop.md`). Follow `references/landing-concepts.md`: collect the real assets first (product screens at full fidelity, photos, customer and partner logos, people), then find the raw material (the product's edge, its own medium, the customer's world, the brand's tension), propose three concepts from three different directions (poster, colour field, the product is the page, one worked example, docs as the landing, near-nothing, object and photography, editorial, illustrated world, brutalist, quiet product-first, image sandwich), recommend one, give it one signature move nobody else would make, and carry it through every section. Quiet product-first and the image sandwich are the defaults to resist: use them only when they clearly fit, never as two of the three concepts. The image sandwich has its own recipe in `references/landing-recipe.md` and a template in `assets/landing-hero/`. Give the page a ground, not just flat sections: pick a background family from `references/backgrounds.md` (painting, photo as field, duotone of the brand's own photos, material, the customer's technical paper, halftone, colour field) and alternate strong and quiet grounds. Before calling a landing done, run the Distinctiveness checks in `references/anti-slop.md`.

Photos, artworks, illustrations and 3D belong to the client: never generate or fake them. Use the images the brand already has, design image slots with art direction for the rest (`data-slot`, ratio, tone, brief), show a calm placeholder while a slot is empty, and say which slots wait for what. When the client places their files, run `scripts/slots.py` on the page, look at each image, and adapt crop, text colour, veil and accent to it. When there is nothing yet, or the direction wants a painting or an engraving, borrow a public-domain work with `scripts/find_art.py` (The Met, the Cleveland Museum of Art, CC0 only): crop the scan, cut its foreground with `backdrop.py` if it should pass in front of the product, veil behind the text, credit it on the page, and tell the user it is a stand-in they can keep. See `references/imagery.md`.

### 4. Review what you rendered

Render the screen and look at it. This step is not optional and is where most of the quality comes from:

```bash
python3 scripts/shot.py index.html --ref <the library id you leaned on>     # or a dev-server URL
```

It writes the desktop (1440) and mobile (390) first screens, the full page, and `vs-<id>.png`: your fold beside the reference's fold at the same scale. Open them all with the Read tool. If Playwright is missing, install it (`pip install playwright pillow && python3 -m playwright install chromium`); only if that is impossible say plainly that the page was not reviewed.

Then two passes, and at least one round of changes:
1. **The bar.** Look at the side-by-side. If a designer had to pick one of the two folds, would they pick yours? If not, name what the reference does that yours does not (the headline is twice as big, the image takes the fold, one colour is used with conviction, the product is real and dense) and change the page. A tidy page that loses the side-by-side is not done.
2. **The checklist.** Go through `references/anti-slop.md` and fix every item that applies.

Shoot again after the changes. Report what you saw, what you changed, and the final side-by-side.

## Adding screens to the library

```bash
python3 scripts/capture.py https://example.com/pricing --site Example --type pricing \
  --tags "pricing-3-tier,comparison-table" --note "What is worth learning from it"
python3 scripts/capture.py --batch scripts/sources.json      # recapture the whole list
```

`capture.py` refuses cookie banners, hides chat widgets, scrolls to load lazy content, then saves a desktop capture (1440px wide, first 3600px) and a mobile one (390px), and measures the tokens from computed styles. It needs `pip install playwright pillow` and `python3 -m playwright install chromium`.

Only add screens that teach a decision, and write the note: what to learn, not a description. Look at every capture before keeping it (bot walls, empty states and cookie banners get dropped), then fold what the new screens teach into the references (`taste-rules.md`, `landing-concepts.md`, `anti-slop.md`) and the search vocabulary in `find_refs.py`: a screen nobody's rules point to rarely gets used.

## Files

- `scripts/find_refs.py`: search the library.
- `scripts/shot.py`: render your page at 1440 and 390, and set its fold beside a library reference.
- `scripts/capture.py`: add or refresh screens.
- `scripts/sources.json`: the list of pages in the library (re-run it to refresh).
- `library/index.json`: every screen with its patterns, note and measured tokens.
- `library/screens/`: the screenshots.
- `references/taste-rules.md`: the rules behind good interfaces, with examples from the library.
- `references/anti-slop.md`: the review checklist.
- `references/brief-template.md`: a short brief to fill before building a new screen.
- `references/landing-concepts.md`: how to get a distinctive landing (raw material, three concepts, directions, signature move, what a landing may break).
- `references/backgrounds.md`: background families (painting, photo field, duotone, material, technical paper, halftone, colour field), how to build them from the brand's images, what not to do.
- `references/landing-recipe.md`: one direction in detail, the image-sandwich landing (anatomy, scenes, images, sections below, checks).
- `assets/landing-hero/`: a working template for the image-sandwich direction only.
- `scripts/backdrop.py`: foreground cut-out, halftone duotone and colour grade for hero images.
- `scripts/slots.py`: list a page's image slots and measure the client's images (ratio, brightness, text colour, palette).
- `scripts/find_art.py`: search public-domain artworks (The Met, Cleveland Museum of Art), contact sheet, fetch one with its credit line.
- `references/imagery.md`: who provides images, how to design slots with art direction, how to adapt the page once images arrive.
- `references/design-systems.md`: how to set up or clean up a design system (tokens, colour, type, space, shape, motion, components).
- `assets/DESIGN.md`: the template to write it down.
