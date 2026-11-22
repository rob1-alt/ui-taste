# Design systems

Use this when a project has no design system, when its tokens are a mess (twelve greys, five radii), or when the user asks for one. The goal is a small system the code actually uses, written down in `DESIGN.md` (template: `assets/DESIGN.md`) and mirrored in CSS variables or the Tailwind theme.

Search the library for how the best public systems present each part:

```bash
python3 scripts/find_refs.py "design system colors"
python3 scripts/find_refs.py "design system typography"
python3 scripts/find_refs.py "design system overview" --limit 5
```

## 1. Three layers of tokens

| Layer | What it holds | Example | Who uses it |
|---|---|---|---|
| Primitive | raw values, named by what they are | `gray-1…gray-12`, `blue-9`, `space-4 = 16px` | only the semantic layer |
| Semantic | the role a value plays | `bg`, `bg-subtle`, `surface`, `border`, `text`, `text-muted`, `accent`, `danger` | every component |
| Component | rare overrides for one component | `button-primary-bg` | that component only |

Components never reference primitives directly. Dark mode, a rebrand or a high-contrast theme then means remapping the semantic layer, not editing every component. Atlassian and Material 3 document this well; Radix Colors and Geist are the clearest practical examples.

## 2. Colour

- **Neutrals first.** One grey scale of about 12 steps does most of the interface. Tint it slightly toward the brand hue (warm or cool) instead of pure grey.
- **Steps have jobs** (the Radix convention, also close to Geist): 1-2 app and subtle backgrounds, 3-5 component backgrounds (normal, hover, pressed), 6-8 borders (subtle, normal, strong/focus), 9-10 solid fills (normal, hover), 11 low-contrast text, 12 high-contrast text.
- **One accent scale** for action and selection. Add scales only for meaning: danger, warning, success, info.
- **Contrast is part of the token, not a later check.** Step 11 on step 2 must pass 4.5:1; step 12 passes 7:1. Check with a contrast tool when you define the scale.
- **Dark mode is its own scale**, not an inversion. Surfaces get lighter as they rise; borders are low-alpha white.

## 3. Typography

- One family, or a display face plus a text face. A monospace for code, data and small labels if the product is technical.
- A type scale with named roles rather than sizes: `display`, `h1`, `h2`, `h3`, `body-lg`, `body`, `small`, `caption`, `label`, `code`. Each role fixes size, line height, weight and tracking.
- A workable ratio is 1.2-1.25 for product UI, up to 1.333 for marketing. Example product scale: 12 / 13 / 14 / 16 / 20 / 24 / 32 / 40.
- Line height drops as size grows (body 1.5-1.6, headings 1.1-1.25, display 1.0-1.1); tracking goes slightly negative above 24px.
- Carbon and Material 3 have the most explicit type-role tables; Geist shows a compact product scale.

## 4. Space, size and layout

- A 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.
- Control heights from a short list (for example 28 / 32 / 40 / 48) so buttons, inputs and selects line up.
- Layout: a max content width (text 65-75ch, app 1200-1440px), a 12-column grid for marketing, sidebar + content for apps, and named breakpoints (for example 640 / 768 / 1024 / 1280).

## 5. Shape, depth and motion

- **Radius:** two or three values (for example 4 small controls, 8 cards and inputs, 12-16 dialogs), plus `full` for pills and avatars.
- **Elevation:** a border or a surface step for things on the page; real shadows only for things that float (popover, dropdown, dialog, toast), in two or three levels.
- **Motion:** durations of 100-150ms for hover and press, 200-300ms for enter and exit, one standard easing, and everything disabled under `prefers-reduced-motion`.

## 6. Components and states

Start with the components the product uses on every screen: Button, Input, Select, Checkbox, Switch, Tabs, Dialog, Dropdown menu, Tooltip, Toast, Table, Card, Badge, Avatar. For each one, define:

- Variants (primary, secondary, ghost, danger) and sizes, from the tokens above.
- Every state: default, hover, active, focus-visible, disabled, loading, error, selected.
- Keyboard behaviour and ARIA roles. Do not hand-roll this: build on an accessible headless layer (Radix Primitives, React Aria, Base UI) or a library built on one (shadcn/ui).

## 7. Writing it down

Fill `assets/DESIGN.md` and keep it next to the code. Mirror it exactly in code, for example with Tailwind v4:

```css
@theme {
  --color-gray-1: oklch(99% 0.002 260);
  /* … */
  --color-bg: var(--color-gray-1);
  --color-surface: var(--color-gray-2);
  --color-border: var(--color-gray-6);
  --color-text: var(--color-gray-12);
  --color-text-muted: var(--color-gray-11);
  --color-accent: var(--color-blue-9);
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --font-sans: "Inter", system-ui, sans-serif;
}
```

Then audit the codebase: replace hard-coded colours, sizes and radii with tokens, and remove the values the system does not have.

## Which public system to look at for what

| Need | Look at |
|---|---|
| A compact product system for a startup | Vercel Geist, shadcn/ui, Radix Themes |
| Colour scales with defined step roles | Radix Colors, Geist colours, Atlassian colour |
| Type roles and a strict grid | IBM Carbon, Material 3 |
| Accessibility and plain-language guidance | GOV.UK Design System, React Aria |
| Tokens and theming at scale | Atlassian, Material 3, Microsoft Fluent 2, Adobe Spectrum |
| Platform conventions (iOS, macOS) | Apple Human Interface Guidelines |
| Brand-led systems with strong personality | Wise Design, Duolingo Design |
| Developer-tool density | GitHub Primer, GitLab Pajamas |
| Ready-made marketing and app blocks | Tailwind Plus, Untitled UI, shadcn/ui blocks |
