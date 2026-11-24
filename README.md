# UI taste

> Show your coding agent what good looks like. A Claude Code skill with a library of real screens from products known for their design (Linear, Stripe, Vercel, Anthropic, Cursor, Figma, Apple, Teenage Engineering…), the tokens measured on each live page, a reference search, and an anti-slop review of what the agent renders.

Agents build the same interface every time: a purple gradient hero, three centred cards with emoji icons, Inter everywhere, shadows on everything. UI taste replaces that default with evidence.

![Landing pages in the library](docs/landing-1.jpg)

## How it works

When Claude builds or reviews an interface, the skill makes it:

1. **Inspect** the project's own design system first (DESIGN.md, tokens, Tailwind config, components). The project always wins over a reference.
2. **Reference** only for a concrete decision: `find_refs.py "pricing page with comparison table"` returns up to three screens, best first, with their screenshots and the tokens measured on the live page.
3. **Build** with the project's components, following the taste rules (one type family, a real scale, neutral surfaces and one accent, one radius family, real content only).
4. **Review** the rendered screen at 1440px and 390px against the anti-slop checklist, and fix what it finds.

When a project has no design system, or a messy one, the skill sets one up with `references/design-systems.md` (token layers, 12-step colour scales with defined roles, type roles, spacing, radius, elevation, motion, component states) and writes it down in `assets/DESIGN.md`, using the best public systems in the library (Vercel Geist, GitHub Primer, IBM Carbon, Material 3, Radix, shadcn/ui, Atlassian, GOV.UK, Apple HIG…) as references.

References are evidence, never templates: Claude takes the decision behind a screen (hierarchy, density, rhythm), not its logo, copy or layout.

## What a search returns

```
$ python3 scripts/find_refs.py "linear pricing" --limit 1
query: linear pricing

## 1. Linear · pricing
url: https://linear.app/pricing  ·  captured 2026-11-22
desktop: …/ui-taste/library/screens/linear-pricing-desktop.jpg  (1440x3600)
patterns: dark, pricing-4-tier, comparison-table, billing-toggle-per-plan
why: Four plans in plain columns with no card boxes: name, price, one line, a checklist. Only the Business button is filled. The billed-yearly toggle sits inside each paid column, right where the price changes.
fonts: Inter Variable
type: h1 Inter Variable 48px/1 w510 ls -1.056px · h2 Inter Variable 72px/1 w510 ls -1.584px · body Inter Variable 15px/1.6 w400 ls -0.165px
colours: bg #08090a · surfaces #08090a, #5e6ad2, #e5e5e6, #ffffff · text #d0d6e0, #8a8f98, #f7f8f8, #08090a
button: "Sign up" bg #e5e5e6 text #08090a radius 9999px height 32px padding-x 12px Inter Variable 13px w510
content max-width: 1436px
```

Claude then opens the screenshot with its Read tool and looks at it before deciding.

## The library

| Page type | Screens | Sites |
|---|---|---|
| landing | 413 | 032c, 1Password, 1X, A24, Ableton, Abridge, Affinity, Airtable, Alan, Alfred, Alice & Bob, Aman, Amie, Analogue, Anduril, Annapurna Interactive, Anthropic, Anthropic Claude, Anytype, Apartamento, Apple, Arc, Arc Institute, Archer, Are.na, Area 17, Asana, Asket, Astranis, Astro, Attio, Augment Code, Axiom, Barbican, Bartender, Base Power, Basecamp, Baseten, Bear, Bee, beehiiv, Bezi, Bluesky, Bolt, Boom Supersonic, Brex, Bridge, Browser Use, Browserbase, Bun, Bunny, Buttondown, Cal.com, Capacities, Carrot Weather, Cartesia, Cash App, Clay, CleanShot, Clerk, ClickHouse, Cline, Cloudflare, Coda, Cognition, Cohere, Collins, Commercial Type, Commonwealth Fusion, Contra, Convex, Cooper Hewitt, Cosmos, Count, Cowboy, Craft, Cursor, Day.ai, Daylight, Dazed, Decagon, Deepgram, Delphi, Deno, Descript, Devin, Dia, Dinamo, Discord, Docker, Dovetail, Drafts, Drizzle, Dub, Duolingo, Dust, E2B, Effect, Elektron, ElevenLabs, Encore, Equals, Etched, Every, Excalidraw, Expo, Extropic, Fabric, Factory, Fairphone, fal, Family, Fantasy, Fathom, Figma, Figma Config, Figma Sites, Figma Slides, Figure, Firecrawl, Flexport, Flighty, Fly by Jing, Fly.io, folk, Frame.io, Framer, Friend, Front, Function Health, Gather, Gentler Streak, Ghost, Ghostty, Ginkgo Bioworks, GitHub, Glossier, Google DeepMind, Granola, Graphite, Greptile, Grilli Type, Groq, GSAP, Gumroad, Hadrian, Halide, Harvey, Haus, Headspace, Hebbia, Hebbia Matrix, Hedra, Heptabase, Hermeus, Hex, HEY, Hey Calendar, Hey Studio, HeyGen, Hugging Face, Hugging Face Spaces, Hume AI, iA Writer, Ideogram, Increase, Infisical, Inngest, Instrument, Intercom, Intercom Fin, Ironclad AI, Isomorphic Labs, It's Nice That, Jam, Jitter, K2 Space, Kagi, Kilo Code, Klim Type Foundry, Knock, Komoot, Koyeb, Kyutai, Ladder, Langfuse, Ledger, Legora, Leica, Levels, Light Phone, Lightmatter, Lindy, Linear, Linear Mobile, Lithic, Liveblocks, Locomotive, Loewe, Logseq, Loom, Loops, Luma, Luma AI, Lydia, Magic Patterns, Mailchimp, Mastodon, Maze, Mercury, Mercury Personal, Mintlify, Miro, Mistral AI, Mobbin, Modal, Modern Treasury, Monarch, Monocle, Monzo, MotherDuck, MSCHF, Mullvad, Muse, Mux, mymind, N26, n8n, Neon, Netlify, Neuralink, Northflank, Nothing, Notion, Notion Sites, NTS, Oatly, Obsidian, Oklo, Olipop, Ollama, Omsom, On, Optimizely, Order, Oura, Paddle, Panda CSS, Pangram Pangram, Panic, Paper, ParadeDB, Parallel, Partiful, Pennylane, Penpot, Pentagram, Perplexity, Phantom, Photoroom, Pika, Pitch, Pitchfork, Pixelmator, Plaid, Plain, Planet, PlanetScale, Plausible, Playdate, Polar, Polestar, Poolside, Porter, PostHog, Prisma, Procreate, Proton, Public, Pylon, Qonto, Quo, Rabbit, Railway, Rainbow, Ramp, Rapha, Raycast, Readwise, Readwise Reader, Readymag, Recess, Recraft, Reddit Inc, Reflect, Rejouice, Relativity Space, Relume, Render, Replicate, Resend, Rest of World, Restate, Retool, Rive, Rogo, Rogue Amoeba, Rows, Runway, Sanity, Saronic, Savee, SavvyCal, Scale AI, Science Corp, Screen Studio, Scribd, Sentry, Sesame, SFMOMA, Shield AI, Shopify, Sierra, Signal, Sketch, Slack, Slate Auto, Snackpass, Soho House, Sorare, Soundtrap, SpaceX, Span, Spellbook, Spline, Spotify, Squarespace, Stedelijk, Steel, Stoke Space, Storybook, Strava, Stripe, Stripe Press, Stripe Sessions, Structured, Stytch, Subframe, Suno, Sunsama, Supabase, Supabase Launch Week, Supergiant Games, Superhuman, Superlist, Superpower, Svelte, Swile, Tailscale, Tana, TanStack, Tate, Tavus, Teenage Engineering, Telegram, Tella, Tempo, Temporal, Tenstorrent, The Browser Company, The Pudding, The Verge, Things, Thinking Machines, Three.js, Tinybird, tldraw, Trigger.dev, Turborepo, Turso, Twenty, Typefully, Udio, Ulysses, Unify, Upstash, v0, Val Town, Vanta, Vapi, Varda, Vectary, Vercel, Vercel Ship, Vitsoe, Walker Art Center, Warp, Webflow, Weekrise, Whimsical, Whitney Museum, Wieden+Kennedy, Wise, Wolff Olins, Wordware, Work & Co, WorkOS, Works in Progress, Y Combinator, Zapier, Zed, Zep, Zipline |
| pricing | 28 | Attio, Cal.com, Clerk, Cursor, Dub, Figma, Framer, Ghost, Kagi, Linear, Loops, Mux, n8n, Netlify, Notion, Obsidian, PostHog, Railway, Raycast, Render, Resend, Sentry, Stripe, Tailscale, Vercel, Warp, Webflow, Zed |
| dashboard | 15 | Artificial Analysis, Fathom, GitHub, Mercury, OpenPanel, Plausible, shadcn/ui, Simple Analytics, Tailwind Catalyst, Tremor, ultrasound.money, Umami, Uniswap |
| app screen | 11 | Cal.com, FotMob, GitHub, Hugging Face, Hyperliquid, Our World in Data, Robinhood, Spotify, Y Combinator, Yr |
| status page | 8 | Anthropic, GitHub, Linear, OpenAI, OpenStatus, Resend, Stripe, Vercel |
| design system | 29 | Adobe Spectrum, Apple HIG, Atlassian Design System, Base UI, Duolingo Design, GitHub Primer, GitLab Pajamas, GOV.UK Design System, IBM Carbon, Material 3, Microsoft Fluent 2, Radix, React Aria, shadcn/ui, Shopify Polaris, Uber Base, Untitled UI, Vercel Geist, Wise Design |
| 404 page | 6 | GitHub, Oura, Polar, Raycast, Resend, Stripe |
| about | 5 | Linear, Notion, PostHog, Stripe |
| careers | 6 | Linear, Ramp, Raycast, Resend, Stripe, Vercel |
| contact | 4 | Attio, Linear, Stripe, Vercel |
| integrations | 6 | Attio, Cal.com, Linear, n8n, Raycast, Vercel |
| developers | 3 | Figma, Linear, Notion |
| brand | 3 | Linear, Resend, Vercel |
| auth | 5 | Cal.com, Figma, Linear, Notion, Vercel |
| product | 3 | Apple, Daylight, Teenage Engineering |
| changelog | 3 | Linear, Raycast, Resend |
| docs | 3 | Resend, Stripe, Tailwind CSS |
| customers | 2 | Linear, Vercel |
| blog | 2 | Linear, Vercel |

**555 pages from 448 sites and design systems, each captured on desktop and mobile (1110 screenshots).**

Every screen is captured at 1440px (desktop, first 3600px) and 390px (mobile), with cookie banners refused and chat widgets hidden. Tokens are read from the browser's computed styles: fonts, h1/h2/h3/body sizes, line heights and tracking, background, surface and text colours by area covered, button fill, radius, height and padding, and content width.

### Landing pages

![landing pages 1](docs/landing-1.jpg)

![landing pages 2](docs/landing-2.jpg)

![landing pages 3](docs/landing-3.jpg)

![landing pages 4](docs/landing-4.jpg)

![landing pages 5](docs/landing-5.jpg)

![landing pages 6](docs/landing-6.jpg)

![landing pages 7](docs/landing-7.jpg)

![landing pages 8](docs/landing-8.jpg)

![landing pages 9](docs/landing-9.jpg)

![landing pages 10](docs/landing-10.jpg)

![landing pages 11](docs/landing-11.jpg)

![landing pages 12](docs/landing-12.jpg)

![landing pages 13](docs/landing-13.jpg)

![landing pages 14](docs/landing-14.jpg)

![landing pages 15](docs/landing-15.jpg)

### Mobile

![Mobile captures](docs/mobile.jpg)

### Pricing

![pricing](docs/pricing.jpg)

### Dashboard

![dashboard](docs/dashboard.jpg)

### App screens

Product screens from other domains: banking, trading, weather, music, sport, scheduling, CI, roadmaps.

![app](docs/app.jpg)

### Status page

![status](docs/status.jpg)

### Design system

![design-system](docs/design-system.jpg)

### 404 page

![404](docs/404.jpg)

### About

![about](docs/about.jpg)

### Careers

![careers](docs/careers.jpg)

### Contact

![contact](docs/contact.jpg)

### Integrations

![integrations](docs/integrations.jpg)

### Developers

![developers](docs/developers.jpg)

### Brand

![brand](docs/brand.jpg)

### Auth

![auth](docs/auth.jpg)

### Product

![product](docs/product.jpg)

### Changelog

![changelog](docs/changelog.jpg)

### Docs

![docs](docs/docs.jpg)

### Customers

![customers](docs/customers.jpg)

### Blog

![blog](docs/blog.jpg)

## Landing pages

Ask for a landing page and the skill does not reach for a template. It finds the raw material first (what the product does that others do not, its own medium, the customer's world), proposes three concepts from three different directions (poster, colour field, the product as the hero, object and photography, editorial, illustrated world, brutalist, image sandwich…), recommends one and gives it a signature move that would look wrong on any other product's site. A swap test closes the review: with a competitor's logo on it, the page should stop working. The process is in `skills/ui-taste/references/landing-concepts.md`.

Photos, artworks and illustrations stay the client's: the skill never fakes them. It uses the images the brand already has, designs image slots with an art-direction brief for the rest (an empty slot shows its brief, not a fake), and once the client drops their files in, `scripts/slots.py` measures each one (ratio, brightness, text colour, palette) so the page is adapted to it: crop, text colour, veil, accent. See `skills/ui-taste/references/imagery.md`.

The image sandwich is one of those directions, with its own recipe (`references/landing-recipe.md`), eight reference landings (`find_refs.py "image sandwich"`), a template (`assets/landing-hero/`) and `scripts/backdrop.py` to prepare the images.


## Browse the library

`site/` holds a landing page for the skill (`index.html`, a page that measures itself: press M) and the library (`library.html`). The library has collections (dark heroes, serif and editorial, illustrated worlds, pricing pages, design systems…), search, filter by page type and pattern, switch desktop and mobile, and open a screen to see why it is in the library, its fonts, type scale, colours (click to copy) and buttons rebuilt from the measured styles. Arrow keys move between screens, `/` focuses the search.

```bash
open site/index.html          # the landing; no server needed
open site/library.html        # the library
python3 site/build.py         # after adding screens: thumbnails and data
```

![The gallery](docs/site.jpg)

## Install

### Claude Code (plugin)

```
/plugin marketplace add rob1-alt/ui-taste
/plugin install ui-taste@ui-taste
```

Then ask: `Redesign our pricing page`, `This dashboard looks generic, fix it`, or call it with `/ui-taste:ui-taste`.

### Manual

```bash
git clone https://github.com/rob1-alt/ui-taste.git
cp -r ui-taste/skills/ui-taste ~/.claude/skills/ui-taste
```

Searching needs only Python 3. Capturing new screens needs:

```bash
pip install playwright pillow
python3 -m playwright install chromium
```

## Add your own screens

```bash
cd skills/ui-taste/scripts
python3 capture.py https://example.com/pricing --site Example --type pricing \
  --tags "pricing-3-tier,comparison-table" --note "What is worth learning from it"
python3 capture.py --batch sources.json           # refresh the whole library
python3 contact_sheet.py ../../../docs            # rebuild the sheets above
```

Add a screen only when it teaches a decision, and write the note as a lesson, not a description.

## Repository

```
.claude-plugin/            plugin and marketplace manifests
skills/ui-taste/
  SKILL.md                 the workflow Claude follows
  references/
    taste-rules.md         what the library's screens have in common
    anti-slop.md           the review checklist
    brief-template.md      a short brief before building a screen
    design-systems.md      how to set up or clean up a design system
    landing-concepts.md    distinctive landings: real assets, three concepts, signature move
    imagery.md             image slots, art direction, adapting to the client's images
  assets/
    DESIGN.md              the template to write a design system down
  scripts/
    find_refs.py           search the library
    capture.py             add or refresh screens (Playwright)
    contact_sheet.py       build the README sheets
    slots.py               list image slots, measure the client's images
    sources.json           the pages in the library
  library/
    index.json             screens, patterns, notes, measured tokens
    screens/               desktop and mobile captures
site/                      landing (index.html), library (library.html), build.py, thumbs/
docs/                      contact sheets for this README
```

## Rights

The screenshots belong to the companies that made those pages. They are kept here as private design references for study, the way a designer keeps a moodboard, and are not to be republished. Keep this repository private.
