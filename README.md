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
| landing | 121 | Alan, Amie, Anthropic, Apple, Are.na, Astro, Attio, Bezi, Browserbase, Bun, Cal.com, Clay, CleanShot, Clerk, Convex, Craft, Cursor, Daylight, Delphi, Deno, Descript, Dia, Discord, Dub, Duolingo, ElevenLabs, Expo, Factory, fal, Family, Figma, Fly.io, folk, Framer, Ghostty, GitHub, Glossier, Granola, Gumroad, Harvey, Headspace, Heptabase, Hex, Hugging Face, Ideogram, Inngest, Intercom, Jitter, Linear, Liveblocks, Loops, Luma AI, Mailchimp, Mercury, Mintlify, Miro, Mistral AI, Mobbin, Modal, Monzo, mymind, n8n, Neon, Notion, Oatly, Oura, Paddle, Pennylane, Perplexity, Phantom, Pitch, Plain, PlanetScale, Polar, PostHog, Prisma, Qonto, Railway, Ramp, Raycast, Reflect, Replicate, Resend, Retool, Rive, Rows, Runway, Sanity, SavvyCal, Screen Studio, Shopify, Sierra, Soundtrap, Spline, Spotify, Steel, Stripe, Suno, Supabase, Superhuman, Svelte, Tana, Teenage Engineering, Tella, Temporal, Things, Tinybird, Trigger.dev, Twenty, Typefully, Upstash, v0, Vectary, Vercel, Warp, Webflow, Weekrise, Whimsical, Wise, WorkOS, Zed |
| pricing | 19 | Attio, Cal.com, Clerk, Cursor, Dub, Figma, Framer, Linear, Loops, n8n, Notion, PostHog, Railway, Raycast, Resend, Vercel, Warp, Webflow, Zed |
| design system | 29 | Adobe Spectrum, Apple HIG, Atlassian Design System, Base UI, Duolingo Design, GitHub Primer, GitLab Pajamas, GOV.UK Design System, IBM Carbon, Material 3, Microsoft Fluent 2, Radix, React Aria, shadcn/ui, Shopify Polaris, Uber Base, Untitled UI, Vercel Geist, Wise Design |
| 404 page | 6 | GitHub, Oura, Polar, Raycast, Resend, Stripe |
| about | 4 | Linear, Notion, PostHog, Stripe |
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

**219 pages from 141 sites and design systems, each captured on desktop and mobile (438 screenshots).**

Every screen is captured at 1440px (desktop, first 3600px) and 390px (mobile), with cookie banners refused and chat widgets hidden. Tokens are read from the browser's computed styles: fonts, h1/h2/h3/body sizes, line heights and tracking, background, surface and text colours by area covered, button fill, radius, height and padding, and content width.

### Landing pages

![landing pages 1](docs/landing-1.jpg)

![landing pages 2](docs/landing-2.jpg)

![landing pages 3](docs/landing-3.jpg)

![landing pages 4](docs/landing-4.jpg)

![landing pages 5](docs/landing-5.jpg)

### Mobile

![Mobile captures](docs/mobile.jpg)

### Pricing

![pricing](docs/pricing.jpg)

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
  assets/
    DESIGN.md              the template to write a design system down
  scripts/
    find_refs.py           search the library
    capture.py             add or refresh screens (Playwright)
    contact_sheet.py       build the README sheets
    sources.json           the pages in the library
  library/
    index.json             screens, patterns, notes, measured tokens
    screens/               desktop and mobile captures
docs/                      contact sheets for this README
```

## Rights

The screenshots belong to the companies that made those pages. They are kept here as private design references for study, the way a designer keeps a moodboard, and are not to be republished. Keep this repository private.
