# DESIGN.md

> The design system of <product>. Code follows this file; when they disagree, fix one of them the same day.
> Last updated: <date> · Owner: <name>

## Principles

Three short sentences that settle arguments. Example:
1. Content first: chrome stays quiet so data and copy carry the page.
2. One accent, used for action and state only.
3. Dense in the product, spacious on marketing pages.

## Style family

<quiet product-first | editorial serif | illustrated world | loud and bold | brutalist / technical | object and photography>
References: <2-3 screens from the ui-taste library, by id>

## Colour

### Neutrals (light)
| Token | Value | Role |
|---|---|---|
| gray-1 | | app background |
| gray-2 | | subtle background, sidebar |
| gray-3 / 4 / 5 | | component background: normal / hover / pressed |
| gray-6 / 7 / 8 | | border: subtle / normal / strong and focus |
| gray-9 / 10 | | solid fill / hover |
| gray-11 | | muted text (must pass 4.5:1 on gray-2) |
| gray-12 | | text |

### Accent and status
| Token | Value | Role |
|---|---|---|
| accent-9 / 10 / 11 | | primary action, hover, accent text |
| danger-9 / 11 | | destructive actions, errors |
| warning-9 / 11 | | |
| success-9 / 11 | | |

### Semantic tokens (what components use)
`bg` · `bg-subtle` · `surface` · `surface-hover` · `border` · `border-strong` · `text` · `text-muted` · `accent` · `accent-hover` · `accent-text` · `danger` · `focus-ring`

### Dark mode
Same semantic names, remapped to the dark scales. Surfaces get lighter as they rise.

## Typography

Families: `<display>` for headings, `<text>` for UI and body, `<mono>` for code and data.

| Role | Size / line height | Weight | Tracking | Use |
|---|---|---|---|---|
| display | 56 / 1.05 | | -0.02em | marketing hero |
| h1 | 40 / 1.1 | | -0.02em | page title |
| h2 | 28 / 1.2 | | -0.01em | section |
| h3 | 20 / 1.3 | | | card title |
| body-lg | 18 / 1.6 | | | marketing copy |
| body | 15 or 16 / 1.55 | | | default |
| small | 13 or 14 / 1.5 | | | secondary text, tables |
| caption / label | 12 / 1.4 | | 0.02em, may be uppercase | metadata, eyebrows |
| code | 13 / 1.5 | | | inline and blocks |

## Space and layout

- Base unit 4px. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.
- Control heights: 28 (sm) · 32 (md) · 40 (lg) · 48 (xl).
- Content width: text 680px · app 1280px · marketing 1200px.
- Breakpoints: 640 · 768 · 1024 · 1280.
- Section spacing (marketing): 96-160px desktop, 64-96px mobile.

## Shape, depth and motion

- Radius: sm 4 · md 8 · lg 12 · full.
- Elevation: page items use a border or surface step. Shadows: `shadow-sm` popover, `shadow-md` dropdown and toast, `shadow-lg` dialog.
- Motion: 120ms hover and press · 200ms enter · 160ms exit · easing `cubic-bezier(0.2, 0, 0, 1)` · off under `prefers-reduced-motion`.

## Components

| Component | Variants | Sizes | Built on | Notes |
|---|---|---|---|---|
| Button | primary, secondary, ghost, danger | sm, md, lg | | one primary per view |
| Input / Select | default, error | sm, md, lg | | label above, help text below |
| Dialog | | | | focus trap, Esc closes |
| Table | | | | numbers right-aligned, tabular figures |
| … | | | | |

Every interactive component defines: default, hover, active, focus-visible, disabled, loading, error, selected.

## Content rules

- Buttons say what happens ("Create project"), not "Submit".
- Sentence case everywhere except labels set in caps.
- Never invent customers, logos, testimonials, ratings or numbers.

## Code

Tokens live in `<path to theme file>`. Components live in `<path>`. Hard-coded colours, sizes and radii outside the theme are bugs.
