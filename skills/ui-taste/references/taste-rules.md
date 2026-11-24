# Taste rules

What the screens in the library have in common, and what to take from them. Each rule names screens to open with `find_refs.py` when you need to see it.

## 1. One idea per fold

Every strong landing page says one thing above the fold: what the product is, in a sentence, with one action. Linear ("The product development system for teams and agents"), Resend ("Email for developers"), Raycast ("Your shortcut to everything."). Supporting copy is one or two short lines, smaller and lighter.

Take: write the headline first. If it needs a second sentence to make sense, the headline is wrong.

## 2. Show the product, not a metaphor

Linear, Framer, Raycast and Stripe put real interface in the hero or right after it: an issue view, the editor canvas, the launcher, a checkout. Abstract 3D shapes and stock illustration say "we had nothing to show".

Take: a real screenshot or a faithful rebuilt UI of the product, cropped on the part that matters, beats any illustration. Framed in a window with a subtle border, not a heavy device mockup.

Better still, let it work. Vapi's hero starts a real voice call, Firecrawl's hero is the input with its modes (Search, Scrape, Map, Crawl), Mux's cards are a playable video, a live transcript and a cost breakdown. When the product cannot run on the page, run one concrete example through it: Browser Use takes "Buy trail shoes, size 42, under $120" through each step to "Ordered".

## 3. Restraint in colour

Most screens use neutrals for 90% of the surface and one accent for actions: Vercel is black on #fafafa, Linear near-black with white text, Resend black with a single gradient word. Stripe is the exception that proves it: its gradient is the brand, used in one place, and everything else is white.

Take: pick the neutral surfaces first (background, raised surface, border, muted text, text), then one accent. Colour is for meaning.

## 4. Type does the hierarchy

Measured on these pages: hero headings 54-96px with tight line height (about 1.0-1.1) and negative letter spacing; body 14-18px. One family is common (Inter, Geist, Söhne); when there is a second face it is deliberate (Resend's serif display, monospace for code and labels at Linear and Raycast).

Take: let size and weight carry hierarchy instead of colour, boxes and icons. Monospace small caps make good eyebrows and metadata.

## 5. Logos as quiet proof

A single row of customer logos, monochrome, right under the hero (Linear, Vercel, Stripe, Resend, Framer). No "Trusted by" heading in 32px, no coloured logos.

Take: only logos you are allowed to show. If you have none, skip the row; never invent them.

Proof that says something beats a bigger wall. Front mixes ROI numbers (591%, 90%) and a quote into the logo grid's own cells. Vapi leads with one customer quote with the metric set in bold inside the sentence. Greptile keeps the customer's real voice, swearing included. Browser Use publishes benchmarks ("Everything we sell is benchmarked. In public."). Y Combinator lists alumni as faint text wordmarks ending on one number. Pick one of these over a second row of logos.

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

## 10. Pick a style family and commit to it

The strongest landing pages in the library each commit to one family and carry it everywhere:

| Family | What defines it | Look at |
|---|---|---|
| Quiet product-first | small type, neutral surfaces, the real UI as the hero | Linear, Cursor, Polar, Vercel |
| Editorial serif | a serif display face, warm off-white, lots of space | Anthropic, Granola, mymind, Perplexity, Oura, Daylight, Y Combinator |
| Illustrated world | one consistent illustration system around plain copy | Fly.io, Family, Craft, Railway, Browserbase |
| Loud and bold | saturated colour, oversized or heavy type, stickers or pixels | fal, Bun, Gumroad, Mistral AI, Dia, Pitch |
| Brutalist / technical | monospace, hard borders, visible grids, plain text | PlanetScale, Warp, Sanity, n8n, Mux, Firecrawl, Greptile |
| Near-nothing | one paragraph or one sentence over one image, almost no page | Ollama, Scale AI |
| Object and photography | the physical product or a photo carries the page | Apple, Teenage Engineering, Oura, Daylight, Mercury |
| The product is the page | a prompt box or the tool itself as the hero | v0, Pitch, Retool, Rive, Ghostty, Vapi, Firecrawl |

Take: choose the family that fits the brand before choosing components, then search the library inside it (`find_refs.py "serif display"`, `"brutalist"`, `"illustration-brand"`). Mixing families (a brutalist grid with soft 3D blobs and a serif headline) is what makes a page look assembled rather than designed.

The rules above (one accent, restrained type, neutral surfaces) are the floor for product UI. A landing page can go further inside its family: a saturated colour field, a 200px display face, a broken grid. See `references/landing-concepts.md` for what a landing may break and what it never breaks.

## 11. Accent through a device, not only a colour

Several strong pages carry emphasis with one device used on a few words: a yellow highlighter behind them (Quo, Langfuse, Infisical), a switch of typeface on the product name (Wordware), a footnote marker (Y Combinator). It reads as a voice rather than as decoration because it is rare and always means "this word matters".

Take: choose one emphasis device for the whole site and use it on two or three words per page at most. An italic serif word in an accent colour is the current generated default (see `anti-slop.md`); reach for another device.

## 12. Pricing turns units into outcomes

Usage pricing is abstract. Mux's pricing page answers "What can you get with $100 credit?" per use case (company website, user-generated video, live stream, gen AI), and keeps enterprise as a thin strip under three plans instead of a fourth column.

Take: under usage-based plans, translate one realistic budget into concrete results for two to four typical customers.

## 13. Physical products: the photograph is the page

The hardware and commerce pages in the library (Analogue, Nothing, Rapha, On, Polestar, Ledger) all do the same thing: one large, well-lit photograph per product, a label of a few words, one button, and plain grids with prices further down. Type is small, UI is grey, nothing competes with the object.

Take: for anything people can hold, spend the effort on the photograph (studio light, a real setting, the product large) and strip the interface around it. A 3D render or a device mockup is a weaker substitute.

## 14. Specimens are posters

The type foundries in the library (Commercial Type, Grilli Type, Pangram Pangram, Klim, Dinamo) never show a font as a table of weights first. Each typeface gets a full-width tile with its own colour, image or drawing and its name set huge in that face; the specimen grid comes later.

Take: when the thing you sell is visual (fonts, templates, themes, photos), give each item its own poster before any list or table, and let the item's own character set the tile's colour and image.

The sample words are copy, not filler. Displaay sets "Extra chewy!" and "Post Internet" in the faces they describe; Production Type lists its serif as publishing sentences ("In Quarto Book Club", "Deluxe edition, 472 pages"); Swiss Typefaces picks "star" for the letters that show the face best; Bureau Brut's manifesto is set in its own serif. When the faces differ enough, the colour can go: 205TF and OH no Type are black and white only and still read as posters.

Take: write the specimen text for the face's use and mood, never a pangram, and choose the hero word for its letterforms.

## 15. Content-led sites lead with the content

Museums, magazines, publishers and studios in the library (Whitney, Tate, Cooper Hewitt, Walker, The Pudding, Rest of World, Works in Progress, Apartamento, Supergiant, Annapurna) put the thing itself first: the artwork, the essay's own chart, the cover, the game's key art. The identity lives in two or three strong moves around it (a wordmark, one colour for UI chrome, a type treatment) and never competes with the content.

Take: when the product is content, design the frame, not a hero. Let each item bring its own colour and image, keep the chrome to one brand colour and one type voice, and give dates, places and prices a consistent small metadata style.

## 16. Deep tech shows the machine, at its real scale

The aerospace, energy and chip companies in the library (SpaceX, Relativity, Hermeus, Stoke, K2, Oklo, Extropic, Span) never draw their product. They photograph it: a rocket stage on a crane with workers below, an engine test, a macro of a chip surface, a reactor building at night. The type is either tiny inside the photograph (Hermeus) or as loud as the machine (Stoke), never in between.

Take: for hard tech, the documentary photograph of the real object is the brand. Decide the type's role against it: a caption, or a shout.

## 17. Luxury is space and the object, not ornament

The luxury and heritage brands in the library (Loewe, Aman, Leica, Vitsœ, Soho House, Asket) put one object or one place in a large, carefully lit photograph and shrink the interface to small text links. Loewe shoots each bag as a sculpture on a plinth; Aman gives a misty valley the whole width; Asket colour-blocks folded garments; Vitsœ explains in plain text. None of them uses gradients, shadows, badges or icons.

Take: for a premium brand, spend the budget on the photograph and on space, cut the UI to the minimum, and let one typographic voice (a thin serif, a plain grotesk) do the rest.

## 18. Event pages know where the event is in its life

The conference pages in the library change with the date. GitHub Universe, after the event, says "thanks-for-joining-us/" and "see-you-next-year/" (section titles written as URL paths, in the audience's own syntax); Config sells the next edition with a stage photograph and the early-bird price set as large as the headline, the full price struck through; Next.js Conf turns the agenda into a plain table with speakers' roles in mono caps.

Take: an event page has states (announce, early bird, live, recap) and each needs its own first screen. Sell the room with one photograph, make the deadline or price the biggest number, and treat the agenda as data in a table, not speaker cards.
