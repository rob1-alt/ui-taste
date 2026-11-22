# Taste rules

What the screens in the library have in common, and what to take from them. Each rule names screens to open with `find_refs.py` when you need to see it.

## 1. One idea per fold

Every strong landing page says one thing above the fold: what the product is, in a sentence, with one action. Linear ("The product development system for teams and agents"), Resend ("Email for developers"), Raycast ("Your shortcut to everything."). Supporting copy is one or two short lines, smaller and lighter.

Take: write the headline first. If it needs a second sentence to make sense, the headline is wrong.

## 2. Show the product, not a metaphor

Linear, Framer, Raycast and Stripe put real interface in the hero or right after it: an issue view, the editor canvas, the launcher, a checkout. Abstract 3D shapes and stock illustration say "we had nothing to show".

Take: a real screenshot or a faithful rebuilt UI of the product, cropped on the part that matters, beats any illustration. Framed in a window with a subtle border, not a heavy device mockup.

## 3. Restraint in colour

Most screens use neutrals for 90% of the surface and one accent for actions: Vercel is black on #fafafa, Linear near-black with white text, Resend black with a single gradient word. Stripe is the exception that proves it: its gradient is the brand, used in one place, and everything else is white.

Take: pick the neutral surfaces first (background, raised surface, border, muted text, text), then one accent. Colour is for meaning.

## 4. Type does the hierarchy

Measured on these pages: hero headings 54-96px with tight line height (about 1.0-1.1) and negative letter spacing; body 14-18px. One family is common (Inter, Geist, Söhne); when there is a second face it is deliberate (Resend's serif display, monospace for code and labels at Linear and Raycast).

Take: let size and weight carry hierarchy instead of colour, boxes and icons. Monospace small caps make good eyebrows and metadata.

## 5. Logos as quiet proof

A single row of customer logos, monochrome, right under the hero (Linear, Vercel, Stripe, Resend, Framer). No "Trusted by" heading in 32px, no coloured logos.

Take: only logos you are allowed to show. If you have none, skip the row; never invent them.

## 6. Density is a choice

Dev tools (Linear, Raycast, Vercel) use small text (13-14px) and dense UI in their product shots; marketing copy around them gets air. Pricing pages carry far more information but stay readable through alignment: plan columns that line up, a comparison table with sections, prices as the only big numbers.

Take: decide the density per zone. Dense inside the product shot or the table, spacious around it.

## 7. Dark mode done properly

Dark pages here use near-black (#000 to #0b0b0c) with surfaces a few steps lighter, borders around 8-12% white, and text at two levels (white and about 60% white). Light glows are used once, behind the hero or the product shot, never sprinkled.

Take: build dark surfaces as a scale, and check grey text contrast; it fails more often in dark mode.

## 8. Navigation stays out of the way

Top bars are thin (48-64px), with the logo left, 4-7 links, and one filled button on the right (Sign up, Download, Get started) next to a plain "Log in".

Take: one filled button in the nav. Everything else is text.

## 9. Mobile is its own layout

On the mobile captures, heroes become left-aligned stacks, product shots are cropped rather than shrunk, card rows become horizontal scrollers or single columns, and buttons go full width or keep a comfortable 44px height.

Take: design the 390px layout on purpose; do not just let the desktop grid wrap.
