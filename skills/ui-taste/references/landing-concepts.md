# Landing concepts: never the same page twice

A landing page that only avoids slop is forgettable. The strong landings in the library each make one bet nobody else made: Dia paints the whole fold yellow behind a giant outlined wordmark, Oatly turns the page into a hand-made newspaper, Rive puts a playable game where the hero should be, Teenage Engineering lets one product photo and tiny technical type carry everything. This file is the process that gets you there instead of to the template.

## Before any concept: collect the real assets

A concept made of type and decoration alone reads as generated, however clever it is. First list what is real: the product's screens and data, photos (team, customers, events, the product in use), logos of customers and partners, marks of the institutions it works with, the founders. Download them from the live site when you are rebuilding it. The page is built on these; the concept only decides how to stage them. What is missing (artworks, photography, illustration) becomes image slots with art direction for the client to fill; the page adapts once they do (`references/imagery.md`). If there is nothing at all, say so and ask before going bold with type.

## The process

### 1. Find the raw material (before any layout)

Write down, in a few words each:
- **The one thing** the product does that others do not. Not the category ("compliance platform"), the edge ("turns a 3-week audit into an afternoon").
- **The product's own medium**: what it looks like when it works. A terminal, a document, a map, a waveform, a graph, a stamp, a calendar, a receipt, a chat.
- **The world of the customer**: the objects, places and words of the people who buy it. Lawyers have red ink, binders, seals, footnotes; farmers have soil, weather, tractors; musicians have tape, knobs, stages.
- **The brand's tension**: two words that pull against each other (serious but fast, technical but warm, old but new). The best pages live on that tension.

### 2. Propose three concepts from three different directions

Pick three directions from the table below, and never only "image sandwich" plus two variations of it. For each concept write five lines:

```
Concept: <a name>
Direction: <one from the table>
The bet: <the one idea the fold is built on, one sentence>
Signature move: <the thing nobody else would do, see step 3>
References: <1-2 library screens, by id>
```

Show the three to the user and recommend one. If you cannot ask (autonomous run), pick the boldest one that still fits the brand and say why in your report. The safest concept is rarely the right one: if one of the three would make the client nervous, it is probably the one worth showing first.

### 3. Give it a signature move

A signature move is one decision that would look wrong on any other product's site. Examples of the kind (invent your own from step 1, do not reuse these literally):

- The headline set in the product's own medium: a compliance tool's headline stamped and annotated like an audited document; a CLI tool's hero is a real terminal session.
- Type as the image: a 160-280px wordmark or word cropped by the viewport edge, outlined, or with the product UI sitting inside its letters.
- One colour as the whole page: a saturated field (Cash App green, Dia yellow, Playdate yellow) with everything else black or white.
- The customer's object, photographed or drawn: the binder, the receipt, the vinyl, the seed packet.
- The page behaves like the product: a prompt that answers, a slider that changes the hero, a timeline that scrubs, a before/after you drag.
- A grid broken on purpose: one element (the product window, a photo, a number) bleeds out of the column and off the edge.
- A voice written into the layout: marginal notes, footnotes, handwriting, redactions, a changelog as the hero. Y Combinator's headline carries a footnote [1] that opens onto a real Paul Graham quote: the brand's own canon as the subhead.
- The wordmark as a frame: SFMOMA crops its letters into the corners of the hero photograph; The Verge runs its wordmark vertically down the page edge.
- The page is a toy: Hey Studio's homepage is a game of Pong you play before you read anything.
- Two colours for everything: Varda uses only orange and navy, as duotone photos, fields and text.
- The category's own imagery, borrowed: Plaid recolours Benjamin Franklin's engraving from the $100 bill; Lithic photographs the physical cards in the dark.
- A number that keeps counting: Unify's proof is its pipeline total in the headline serif ('$1,105,931,739 and counting'); Turborepo leads with compute hours saved.
- The price as the headline, when the price is the news: Figma Config sells the early-bird ticket ($600, $1,200 struck through) in the biggest type on the page.
- The product's data shape as the brand mark: Levels uses a glucose curve as its only illustration.
- Proof you can operate: Haus puts a mortgage calculator (loan amount → monthly payment, Haus vs normal) where others put testimonials.
- The product's own documents as imagery: Flexport illustrates with a real shipment card (INVPO10903, in transit, Shanghai), not with ships and globes.
- A voice nobody else would use: Rabbit writes everything lowercase and talks like a friend ("that folder you keep putting off"); Mullvad's headline is political ("Privacy is for the people"); Arc said goodbye with a signed letter as its homepage.
- One accent device instead of one accent colour, used on the few words that matter: a yellow highlighter (Quo, Langfuse, Infisical), a typeface switch on the product name (Wordware's serif "Sauna" inside a sans headline).

One signature move per page, carried through every section. Two compete; zero is the template.

### 4. Build it, then run the distinctiveness check

Build with `references/taste-rules.md` and the project's tokens, then go through the "Distinctiveness" section of `references/anti-slop.md` on the rendered page. If the page fails it, push the signature move further instead of adding decoration.

## Directions

| Direction | The bet | Look at (find_refs) |
|---|---|---|
| **Poster / type as image** | One giant word, wordmark or number is the visual. Colour fields, no illustration. Or text alone: Groq's hero is a manifesto of short sentences in large grey type. | `dia-landing`, `glossier-landing`, `playdate-landing`, `mymind-landing`, `jitter-landing`, `groq-landing`, type foundries (`commercial-type-landing` stacks a colour band per typeface, `grilli-type-landing`, `pangram-pangram-landing`, `klim-type-foundry-landing`, `dinamo-landing`) — `"oversized wordmark"`, `"bold typography"`, `"manifesto hero"` |
| **Colour field** | One saturated brand colour fills the fold; UI and copy in black or white only. | `cash-app-landing`, `dia-landing`, `fal-landing`, `discord-landing` — `"bold color"` |
| **The product is the page** | The hero is the working tool: a prompt, a terminal, a playable scene, a live editor, a call you can start. | `rive-landing`, `ghostty-landing`, `suno-landing`, `pitch-landing`, `vectary-landing`, `vapi-landing`, `firecrawl-landing`, `mux-landing`, `effect-landing` (a concurrency toggle you run), `restate-landing` (a pixel platformer to play) — `"prompt box hero"`, `"interactive hero"`, `"working demo"` |
| **One worked example** | The hero runs one concrete, specific job end to end (input, what happens, result) instead of stating a claim. | `browser-use-landing` (trail shoes, size 42, under $120 → Ordered), `zapier-landing` (one notification: the ticket got fixed), money-movement diagrams (`bridge-landing`, `modern-treasury-landing`) — `"flow diagram hero"`, `"concrete example"` |
| **Docs as the landing** | For developer tools: the landing lives in the docs chrome (sidebar, table of contents, changelog, live stats). Says "nothing hidden". | `langfuse-landing` — `"docs shell landing"` |
| **Near-nothing** | One fold or one sentence: a paragraph and a button, or a full-bleed video and a line. Only for brands whose reputation already does the work. | `ollama-landing`, `scale-ai-landing`, `friend-landing` (one film photograph, one button), `thinking-machines-landing` (an essay, nothing else), `sesame-landing`, `light-phone-landing` (a sky and a few lines), `the-browser-company-landing` (a letterhead) — `"one fold"`, `"full-bleed video"` |
| **Object and photography** | A real object or photo carries the page; type is small and precise. A motion-blurred or painted photo can be the field itself (Pylon, Vapi, Zapier). | `teenage-engineering-landing`, `daylight-landing`, `monzo-landing`, `runway-landing`, `ideogram-landing`, `pylon-landing`, `vapi-landing` — `"product photo"`, `"photo hero"`, `"motion blur"` |
| **The index is the page** | A list in huge type is the whole homepage: every drop, client, exhibition or section on its own line, running off the edge, with tiny thumbnails or numbers. | `mschf-landing` (numbered list of every drop), `stedelijk-landing` (what's on as giant uppercase lines), `locomotive-landing` (clients in a huge condensed serif) — `"index"`, `"list as page"` |
| **The work is the headline** | For studios and anything with a portfolio: one client's work fills the hero, the company's own claim comes second and small. | `fantasy-landing`, `wieden-kennedy-landing`, `wolff-olins-landing`, `order-landing`, `area-17-landing`, `instrument-landing` — `"agency"`, `"studio"` |
| **Commerce: the object sells** | For physical products: one studio or lifestyle photograph per product, tiny labels, one button, then plain grids with prices. The UI almost disappears. | `analogue-landing`, `nothing-landing`, `rapha-landing`, `on-landing`, `polestar-landing`, `ledger-landing`, `fairphone-landing`, `bee-landing`; loud food and drink commerce takes every colour from the packaging (`fly-by-jing-landing`, `olipop-landing`, `omsom-landing`) — `"commerce"`, `"product photography"` |
| **The output is the image** | The hero is made of what the product produces or what its users made: generated videos, cut-out product photos, event covers. | `heygen-landing`, `photoroom-landing`, `luma-landing`, `savee-landing`, `contra-landing` — `"output as hero"` |
| **Editorial / collage** | The page reads like a magazine, a newspaper or a book: columns, captions, hand-made pieces. | `oatly-landing`, `stripe-press-landing`, `pentagram-landing`, `are-na-landing` — `"editorial"`, `"collage"` |
| **Illustrated world** | One illustration system (mascots, stickers, pixels, icons, isometric maps) builds a world around plain copy. Dust draws multiplayer as an isometric floor plan with avatars in rooms; Northflank draws infrastructure as a small green city. | `bun-landing`, `mistral-ai-landing`, `panic-landing`, `family-landing`, `duolingo-landing` — `"illustration brand"`, `"pixel"` |
| **Brutalist / technical** | Hard borders, monospace, visible grid, raw numbers. Confidence through bareness. Graph paper, crosshair corner marks and node-graph connectors between sections (Mux, Firecrawl, Greptile); one engraved or ASCII illustration keeps it from being cold (Greptile's iguana, Wordware's text-drawn plant). | `gumroad-landing`, `mux-landing`, `greptile-landing`, `firecrawl-landing`, `wordware-landing`, PlanetScale, Warp — `"brutalist"`, `"monospace"`, `"technical grid"`, `"ascii illustration"` |
| **Quiet product-first** | Small type, neutral surfaces, the real UI as the hero. Right for tools whose UI is the brand. | Linear, Cursor, Vercel, Polar — `"product screenshot hero"` |
| **Image sandwich** | The product window set into a full-bleed scene, the foreground over it. See `references/landing-recipe.md`. | `find_refs.py "image sandwich"` |

Quiet product-first and image sandwich are the two directions an agent reaches for by default. Use them only when they are clearly the best fit, and never as two of the three concepts.

## What a landing may break

Landing pages are marketing, not product UI. Within one concept you may:
- Use a display face that is loud (condensed, outlined, italic serif, pixel, heavy grotesk) at 120-280px, next to a quiet text face.
- Fill the fold with one saturated colour, or a photograph, or a pattern that is the brand.
- Break the grid with one element, crop type at the viewport edge, rotate a sticker.
- Use motion as the concept (a scene that plays, a hero that reacts), with `prefers-reduced-motion` respected.

What never changes: real content and no invented proof, one primary action per view, body text that passes contrast, a designed 390px layout, keyboard access. Bold is a decision carried through the page, not more effects.
