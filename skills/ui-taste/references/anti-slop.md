# Anti-slop review

Go through this list on the rendered screen, desktop and mobile. Each item is a pattern that makes an interface read as generated. Fix what applies, then say what you changed.

## Colour
- [ ] No purple-to-blue (or pink-to-orange) gradient as the hero background or headline fill, unless it is the brand.
- [ ] One accent colour, used for actions and state. Not on every heading, icon and border.
- [ ] No glow, neon or "aurora" blobs added for atmosphere.
- [ ] Grey text passes contrast: 4.5:1 for body, 3:1 for large text. Placeholder-grey body copy fails.
- [ ] Dark mode, if any, uses near-black surfaces in steps (for example #0b0b0c, #141416, #1c1c1f), not pure #000 with grey boxes.

## The current AI look (2025-2026)
Generated pages have a new default that is as recognisable as the purple gradient. More than two of these together and the page reads as generated:
- [ ] Cream or beige background (#f5efe6, #fff8ef) by default, not because the brand is cream.
- [ ] A serif display (Instrument Serif, Fraunces, Newsreader) with one word in italic or in an accent colour ("*Anticiper* la réglementation").
- [ ] Monospace uppercase micro-labels everywhere: eyebrows, "§ 03", "LIVE", metadata, captions.
- [ ] Pill buttons, pill badges and pill chips on everything.
- [ ] Hairline rules and numbered sections standing in for content ("01 / 02 / 03").
- [ ] Decoration posing as concept: hand-drawn circles, stamps, marker strikes, rotated stickers, drawn line-art objects.
- [ ] No real asset anywhere: no product screen at real fidelity, no photo, no real logo.

Cream and a serif are not banned on their own: Y Combinator is cream with a serif headline and reads as designed, because the footnote is a real quote, the logos are real alumni and the photos are real founders. What gives the AI look away is the combination with no real material.

The fix is not another style. It is real material: the product rendered at full fidelity (real labels, 12-14px UI text, dense like the real app), real photos, real logos and marks, real people. Plain confident type (one sans, sentence case) around it. Look at Harvey, Linear, Ramp, Attio, Mercury in the library.

## Type
- [ ] One family, or a deliberate display + text pair. Not three fonts.
- [ ] Two or three weights. No bold everywhere.
- [ ] A visible scale: the h1 is clearly larger than h2, h2 than body. Not five sizes within 4px of each other.
- [ ] Large headings have tight line height (1.0-1.2) and slightly negative tracking; body has 1.5-1.7.
- [ ] Lines of body text stay under about 75 characters.
- [ ] No text in ALL CAPS except short labels and eyebrows, which get letter spacing.

## Layout
- [ ] Not everything centred. Left-aligned text with a clear grid reads as designed; a centred column of centred blocks reads as a template.
- [ ] No row of three identical cards with an emoji or generic icon, a two-word title and one line of text, unless the content really is three parallel items.
- [ ] Sections have different shapes (split, full-bleed, list, table, screenshot), not the same card grid repeated.
- [ ] Spacing follows a scale: large between sections, small inside groups. Nothing floating at random distances.
- [ ] Content has a max width (text 600-720px, layouts 1100-1280px); nothing stretches across a 1920px screen.
- [ ] Mobile is designed, not squeezed: tap targets at least 44px, no horizontal scroll, tables become lists or scroll inside their own box.

## Components
- [ ] One radius family. Not pill buttons next to sharp cards next to 24px-rounded inputs.
- [ ] Shadows only where something floats (menus, dialogs). Cards on a page use a border or a surface step, not a drop shadow each.
- [ ] One primary button per view. Secondary actions look secondary.
- [ ] Icons from one set, one stroke width, sized to the text next to them. No emoji as icons.
- [ ] Borders are quiet (low-contrast lines), not 1px black boxes everywhere.

## Content
- [ ] No invented customers, logos, testimonials, star ratings, user counts or statistics. Real ones, or a marked placeholder.
- [ ] No "Lorem ipsum", "Feature 1", "Revolutionize your workflow", "Unlock the power of", "Seamless", "Next-generation", "Supercharge".
- [ ] Headlines say what the product does for whom. Buttons say what happens ("Start free trial", "Book a demo"), not "Get started" everywhere.
- [ ] Real product screenshots or UI beat abstract 3D blobs and stock illustrations.

## Motion
- [ ] Animations are short (150-300ms), explain a change, and respect `prefers-reduced-motion`.
- [ ] Nothing fades in on scroll just to fade in. Content is readable without waiting.

## Distinctiveness (landing pages)
- [ ] Swap test: put a competitor's logo on the page. If it still works, the page has no idea of its own. Push the signature move.
- [ ] The fold makes one bet you can say in a sentence ("the headline is an audited document"), and it comes from the product or its customers, not from a trend.
- [ ] One signature move, visible in the hero and carried into at least two sections below. Not a hero idea followed by a generic SaaS page.
- [ ] It does not look like the previous landing you built: different direction, different type, different structure.
- [ ] Bold through a decision, not through effects: no glow, gradient or blur added to make a safe page look exciting.
- [ ] Proof is specific: a number in a quote, a metric in the logo grid, a public benchmark, a named result. Not a second row of logos.
- [ ] The copy has a voice. Read the headline aloud: if any company in the category could say it ("Build reliable AI apps", "A new era for X teams"), rewrite it with what only this product can claim.
- [ ] Stock-photo AI imagery (a smiling person holding a tablet, glowing neon panels around them) is never the hero. Use the product, a real photo, or a worked example.

## Accessibility
- [ ] Every interactive element is reachable by keyboard with a visible focus style.
- [ ] Images have alt text; decorative ones have empty alt.
- [ ] Headings are in order (one h1, then h2, h3).
- [ ] Colour is never the only signal (errors also have text, states also have icons or labels).
