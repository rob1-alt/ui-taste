---
name: ui-taste
description: Give the agent UI taste before it builds an interface. Use whenever you design, build, restyle or review a user interface or set up a design system (tokens, colour scales, type scale, DESIGN.md) (landing page, pricing page, dashboard, docs, changelog, login, settings, component, mobile screen), when the user says the UI looks generic, "AI-made", bland or off, or asks to make it look like Linear, Stripe, Vercel or another well-designed product. Looks up real screens captured from strong products, with the fonts, type scale, colours, radii and widths they really use, then builds from the project's own design system and checks the rendered result against an anti-slop checklist.
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

### 3. Build

Apply the decision with the project's components and tokens. Keep to these defaults unless the project says otherwise (see `references/taste-rules.md` for the reasoning):
- One typeface family (two at most: a display face for headings and a text face). Two or three weights.
- A type scale with clear steps (for example 14 / 16 / 20 / 28 / 40 / 56). Body text 15-18px, line height 1.5-1.7; large headings line height 1.0-1.2 and slightly negative letter spacing.
- Neutral surfaces, one accent colour used for action and state, not decoration. Text never pure black on pure white is fine; grey text must still pass contrast (4.5:1 for body).
- A spacing scale on a 4 or 8px grid; generous vertical space between sections (64-160px on desktop), tight space inside groups.
- One radius family (for example 6px controls, 12px cards) and one button style per level (primary, secondary, ghost).
- Real content: the product's real names, numbers, screenshots and copy. Never invent customers, logos, testimonials, ratings or statistics; leave a clearly marked placeholder and tell the user.

### 4. Review what you rendered

Render the screen (dev server, Storybook, or a screenshot tool) at desktop (1440px) and mobile (390px) widths and look at it. Then go through `references/anti-slop.md` and fix every item that applies. Report what you checked and what you changed. A UI that was never looked at is not reviewed.

## Adding screens to the library

```bash
python3 scripts/capture.py https://example.com/pricing --site Example --type pricing \
  --tags "pricing-3-tier,comparison-table" --note "What is worth learning from it"
python3 scripts/capture.py --batch scripts/sources.json      # recapture the whole list
```

`capture.py` refuses cookie banners, hides chat widgets, scrolls to load lazy content, then saves a desktop capture (1440px wide, first 3600px) and a mobile one (390px), and measures the tokens from computed styles. It needs `pip install playwright pillow` and `python3 -m playwright install chromium`.

Only add screens that teach a decision, and write the note: what to learn, not a description.

## Files

- `scripts/find_refs.py`: search the library.
- `scripts/capture.py`: add or refresh screens.
- `scripts/sources.json`: the list of pages in the library (re-run it to refresh).
- `library/index.json`: every screen with its patterns, note and measured tokens.
- `library/screens/`: the screenshots.
- `references/taste-rules.md`: the rules behind good interfaces, with examples from the library.
- `references/anti-slop.md`: the review checklist.
- `references/brief-template.md`: a short brief to fill before building a new screen.
- `references/design-systems.md`: how to set up or clean up a design system (tokens, colour, type, space, shape, motion, components).
- `assets/DESIGN.md`: the template to write it down.
