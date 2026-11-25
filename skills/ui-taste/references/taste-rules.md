# Taste rules

What the screens in the library have in common, and what to take from them. Each rule names screens to open with `find_refs.py` when you need to see it.

## 1. One idea per fold

Every strong landing page says one thing above the fold: what the product is, in a sentence, with one action. Linear ("The product development system for teams and agents"), Resend ("Email for developers"), Raycast ("Your shortcut to everything."). Supporting copy is one or two short lines, smaller and lighter.

Take: write the headline first. If it needs a second sentence to make sense, the headline is wrong.

## 2. Show the product, not a metaphor

Linear, Framer, Raycast and Stripe put real interface in the hero or right after it: an issue view, the editor canvas, the launcher, a checkout. Abstract 3D shapes and stock illustration say "we had nothing to show".

Take: a real screenshot or a faithful rebuilt UI of the product, cropped on the part that matters, beats any illustration. Framed in a window with a subtle border, not a heavy device mockup.

Better still, let it work. Vapi's hero starts a real voice call, Firecrawl's hero is the input with its modes (Search, Scrape, Map, Crawl), Mux's cards are a playable video, a live transcript and a cost breakdown. When the product cannot run on the page, run one concrete example through it: Browser Use takes "Buy trail shoes, size 42, under $120" through each step to "Ordered".

The smallest version is the product's output, in the hero, already personal. Beacon's promise is a date ("Find your financial independence date") and the page has the calculator that returns it; Portrait's sign-up field is prefilled with the URL you will own (portrait.so/robert); SevenGrid's copy is computed from today ("It's week 48. Six days of this week are still open."). One concrete output beats three feature cards.

Product inside the sentence: Backyard sets little photos of its houses inline between the words of its headline ('Backyard [house] is the elegant, effortless ADU designed for [house] your next chapter'); Deltaboard writes each product name in orange with an arrow inside one long pitch sentence, so the paragraph doubles as the menu.
Burner does it with its crypto cards ('The easiest way to gift [card] crypto. Tap [card] it, load it, gift it.'); 855-HOW-TO-QUIT puts a real pill inside the brackets of its name.

Two more: Stable Audio writes its prompt as a sentence whose words are coloured, editable chips ("A driving trap track with percussion, synth bass and flute, 140 BPM, 1:00"), so the hero teaches the prompt grammar by example; Micrtype, a one-typeface foundry, puts the licence picker, price and pay button in the first screen next to the digits: for a single product, buying is the landing page.

## 3. Restraint in colour

Most screens use neutrals for 90% of the surface and one accent for actions: Vercel is black on #fafafa, Linear near-black with white text, Resend black with a single gradient word. Stripe is the exception that proves it: its gradient is the brand, used in one place, and everything else is white.

Take: pick the neutral surfaces first (background, raised surface, border, muted text, text), then one accent. Colour is for meaning.

## 4. Type does the hierarchy

Measured on these pages: hero headings 54-96px with tight line height (about 1.0-1.1) and negative letter spacing; body 14-18px. One family is common (Inter, Geist, Söhne); when there is a second face it is deliberate (Resend's serif display, monospace for code and labels at Linear and Raycast).

Take: let size and weight carry hierarchy instead of colour, boxes and icons. Monospace small caps make good eyebrows and metadata.

**Type without web fonts.** When a page may not load fonts, the system stack is still a choice. Pick one with a character that fits the direction and say why:
- Editorial or warm: `"Iowan Old Style", "Palatino Linotype", Charter, "Bitstream Charter", Georgia, serif` (Charter and Iowan are on every Mac and iPhone).
- Geometric and precise: `"Avenir Next", Avenir, "Segoe UI Variable Display", "Century Gothic", sans-serif`.
- Neo-grotesk with weight: `"Helvetica Neue", "Inter Display", Arial, sans-serif` at 700-800 for display, tracked tight; only when the scale is big enough to be the poster.
- Condensed display: `"Avenir Next Condensed", "Arial Narrow", "Roboto Condensed", sans-serif` for a loud headline.
- Technical: `ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace` for numbers and the product's own text.
Then make the character in scale (a 120-200px headline), weight contrast (800 against 400) and width, not in decoration.

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

The device can carry a whole identity when it is applied everywhere. Oma Appel, a small jam maker, sets its name and every heading in red and mirrors it upside down below itself; Operate frames its entire page with green football-pitch lines and puts its sales product on the field; Benjamin Righetti's bio is one sentence where each role takes a different blue. One trick, applied without exception, beats five tasteful details.
The trick can be a genre of writing: Stop, an email blocker, fills a full red panel with an open letter 'Dear Salespeople, ...' signed 'Everyone', so the pitch is addressed to the people it blocks.

## 12. Pricing turns units into outcomes

Usage pricing is abstract. Mux's pricing page answers "What can you get with $100 credit?" per use case (company website, user-generated video, live stream, gen AI), and keeps enterprise as a thin strip under three plans instead of a fourth column.

Take: under usage-based plans, translate one realistic budget into concrete results for two to four typical customers.

## 13. Physical products: the photograph is the page

The hardware and commerce pages in the library (Analogue, Nothing, Rapha, On, Polestar, Ledger) all do the same thing: one large, well-lit photograph per product, a label of a few words, one button, and plain grids with prices further down. Type is small, UI is grey, nothing competes with the object.

Take: for anything people can hold, spend the effort on the photograph (studio light, a real setting, the product large) and strip the interface around it. A 3D render or a device mockup is a weaker substitute.

## 14. Specimens are posters

The type foundries in the library (Commercial Type, Grilli Type, Pangram Pangram, Klim, Dinamo) never show a font as a table of weights first. Each typeface gets a full-width tile with its own colour, image or drawing and its name set huge in that face; the specimen grid comes later.

Take: when the thing you sell is visual (fonts, templates, themes, photos), give each item its own poster before any list or table, and let the item's own character set the tile's colour and image.

Three more ways the foundries do it: the index set in itself (Village lists each family's name in that family, one ruled line each), the character set written as copy (Tightype turns each name into a poem of glyphs, arrows and brackets), and the specimen that explains its decisions (JetBrains Mono annotates a giant 'An' with what each choice fixes; Recursive gives every variable axis a live slider).

The sample words are copy, not filler. Displaay sets "Extra chewy!" and "Post Internet" in the faces they describe; Production Type lists its serif as publishing sentences ("In Quarto Book Club", "Deluxe edition, 472 pages"); Swiss Typefaces picks "star" for the letters that show the face best; Bureau Brut's manifesto is set in its own serif. When the faces differ enough, the colour can go: 205TF and OH no Type are black and white only and still read as posters.

Take: write the specimen text for the face's use and mood, never a pangram, and choose the hero word for its letterforms.

A single typeface can be sold through a story instead of a grid: PP Neue Montreal is written as an "Official Travel Guide" to the city it is named after, with postcards, street photos and mixed-colour italic lines ("Out with the old, in with the Neue"), and the weights list only arrives under the story.
Mass Driver and Nikolas Type keep the catalogue but write a sentence per face ('Choose Your Own Adventure', 'Sagittarius A* 17h 45m 40.0409s', 'At Casa di Solare, フォント forever'), so the index itself sells each typeface.

## 15. Content-led sites lead with the content

Museums, magazines, publishers and studios in the library (Whitney, Tate, Cooper Hewitt, Walker, The Pudding, Rest of World, Works in Progress, Apartamento, Supergiant, Annapurna) put the thing itself first: the artwork, the essay's own chart, the cover, the game's key art. The identity lives in two or three strong moves around it (a wordmark, one colour for UI chrome, a type treatment) and never competes with the content.

Take: when the product is content, design the frame, not a hero. Let each item bring its own colour and image, keep the chrome to one brand colour and one type voice, and give dates, places and prices a consistent small metadata style.

Catalogues and galleries follow the same rule. Heroicons puts the search field and the full icon grid in the first screen under one line of headline; Hoverstat's hero is today's pick, big in a browser frame with a one-line review; Minimal Gallery keeps its chrome black and its type small so the thumbnails bring all the colour. The generic version (Lucide, Iconoir, One Page Love) wraps the same inventory in a stats row, a promo bar and a plain directory grid.
Material Archiv opens on a dense grid of material swatches under one search bar, every tile a sample; Anècdota, a small olive oil producer, lists every shop that sells it beside a satellite map instead of testimonials. Gass Records makes its homepage the discography itself: one full-width row per release, the title in huge type, rows alternating red and green like a festival bill.

## 16. Deep tech shows the machine, at its real scale

The aerospace, energy and chip companies in the library (SpaceX, Relativity, Hermeus, Stoke, K2, Oklo, Extropic, Span) never draw their product. They photograph it: a rocket stage on a crane with workers below, an engine test, a macro of a chip surface, a reactor building at night. The type is either tiny inside the photograph (Hermeus) or as loud as the machine (Stoke), never in between.

Take: for hard tech, the documentary photograph of the real object is the brand. Decide the type's role against it: a caption, or a shout.

Three variants from the curated galleries: Normal Computing pairs nature texture (dark sea, desert sand) with its red ASIC board shot on white, and the same red marks the key words of the text; Tequs lights its heat pump in a black void like a monolith, the way a luxury brand shoots a bag; Enode shows an EV charging under a forest carport with two tiny live labels pinned on the photo (charging, 11.2 kW), so the software appears only as annotations on the real home it controls.

## 17. Luxury is space and the object, not ornament

The luxury and heritage brands in the library (Loewe, Aman, Leica, Vitsœ, Soho House, Asket) put one object or one place in a large, carefully lit photograph and shrink the interface to small text links. Loewe shoots each bag as a sculpture on a plinth; Aman gives a misty valley the whole width; Asket colour-blocks folded garments; Vitsœ explains in plain text. None of them uses gradients, shadows, badges or icons.

Take: for a premium brand, spend the budget on the photograph and on space, cut the UI to the minimum, and let one typographic voice (a thin serif, a plain grotesk) do the rest.

## 18. Event pages know where the event is in its life

The conference pages in the library change with the date. GitHub Universe, after the event, says "thanks-for-joining-us/" and "see-you-next-year/" (section titles written as URL paths, in the audience's own syntax); Config sells the next edition with a stage photograph and the early-bird price set as large as the headline, the full price struck through; Next.js Conf turns the agenda into a plain table with speakers' roles in mono caps.

The last state is the archive: DICE Conference, on hiatus, keeps its 3D wordmark, a thank-you line, two stage photos and the full list of every past artist, so the page still works as a record.

Take: an event page has states (announce, early bird, live, recap) and each needs its own first screen. Sell the room with one photograph, make the deadline or price the biggest number, and treat the agenda as data in a table, not speaker cards.

## 18. A studio's site is its work, at full size

The studios in the library (Bureau Borsche, Zak Group, Sagmeister, Gretel, Porto Rocha, Locomotive) skip the claim. The first screen is the work: a mosaic of identities in situ, one project as one big photograph with its name, or a plain index of clients. The studio's own voice is a single line or a caption.

Take: for a portfolio, lead with one large piece of real work and its name, then an index (grid or text table). The studio's statement, if any, fits in one sentence.

When the studio does write its sentence, it can carry a mark of the identity: Company Policy sets its blue logo inline after its name, Poch draws an infinity loop inside brackets in the middle of 'endless (∞) skills', newkid sets its whole pitch as a small white caption label on a street photo, and Studio Rodrigo spells its name with its own icon glyphs.

A studio that lists brands rather than projects can make the list the layout: Kurppa Hosk sets each client as a row (name, one-line brief, a strip of thumbnails) on black; Isa de Burgh sets client names as a wall of condensed caps with colour chips between them; Greenspace opens on its Pantone chips with the colour names set vertically, then lists projects as client names only. Bajgart Office, a one-person studio, puts its offer in the hero instead (process and pricing, '1 spot left', 'book your intro call'): for a small studio the terms can be the design.

Beyond that, a studio page usually needs one move, and these are the ones that worked:

- **The work where it lives.** Studio C lays out identities photographed in use (signage, bottles, screens) as a masonry with a one-line header; Early Works, a venture studio, shows the companies it built as product screens with an 'ongoing' chip; Bielke&Yang's photo cards are questions in Norwegian ('Hvordan kan vi jobbe sammen?') instead of service names; Studiopucky captions each project with a verb ('Explore live radio worldwide by rotating the globe') instead of a title.
- **Volume or a count as the statement.** Murmure sets a screen-wide condensed wordmark over a dense mosaic of every project; Prowl mixes work, news and yellow 'projections' cards in one bento of equal cells; Mister counts its output in plain text ('246 websites, 162 logos, 22 names'); Mikhail Riches, an architecture practice, sets '535 Homes Delivered' huge over a photo of residents; Pihlmann makes its homepage a feed of news, each a full-width film photograph with a large caption; Snøhetta keeps to one sentence, its four disciplines as a large list, then news and events: an institution rather than a portfolio.
- **The archive as the interface.** Oof's homepage is only a table of projects by year, client and service with blue links; Naranjo-Etxeberria puts a table header above a dense black and white grid of every project; Fons Hickmann's homepage is a search field over a grid of posters; Galgo lists projects as large names, one per line; Moniker, a studio that closed, keeps its site as an archive titled 'Moniker 2012–2023'; Gentle Systems, an R&D studio, makes its homepage a dated log of experiments.
- **The roster or client list as the hero.** Yambo sets its clients in large serif names separated by dots; Aku lists them as a centred column of large caps; Pine sets its directors' names in serif over a film still; Panthalassa lists creators and clients as rows of outlined pills; Dunderville turns its client list into big boxed buttons.
- **The logo idea as the illustration system, or the wordmark as an object.** Secco² builds a rising bar chart out of the black squares of its mark; Dipsy sets ';DIPSY' huge and writes its pitch as an equation ('creative approach + two cats + love for AI'); Deeo renders its letters as tall chrome blocks; Konkat breaks its name into giant letters stepping down the page; 27b piles chrome and neon stickers over its name; Studio Hyperlink sets its name half serif, half bold sans with a hand-drawn arrow to the work. One spectacular object can carry the page if everything else stays plain: ilovecreatives makes 'Studio' a chrome 3D word with a toy on it above three newspaper columns; Fidler WNA pairs a bubbly 70s wordmark with a calm beige grid of product photographs.
- **An intro sentence that carries images, marks or edits.** Alt-Border sets small images inline between the words; Opening Line circles 'bland' with a pen stroke; Hexagon sets a tiny client logo after each noun; Homage puts key words in small outlined boxes; Zeus Jones underlines two words and italicises one; s-mon.com sets key words in big coloured pills; Janos Koos underlines the facts in one huge sentence so the bio is the navigation; Skrekkøgle, a studio that closed, edits its own intro in red ('is' struck through for 'was').
- **The terms, the audience or the status up front.** Bajgart Office puts process, pricing and '1 spot left' in the hero; Brandson names the audience and the moment ('For companies about to be looked at'); S.B. Studio's headline is 'Brand and web design for women-led businesses'; Under After fits bio, founder, services and availability into the first screen as small columns; Duties shows a live 'Currently: Off-duty' status in the header; Bureau Cool shows a live log of visitor cities in mono caps; Fathom announces it is now Direct Message with a typewritten letter and two signatures. No Ideas turned its homepage into the poster for its second-birthday party; Monumento draws its own building as a line illustration with the address inline.
- **The navigation as the hero.** The Jacky Winter Group makes eight coloured tiles, each a section with one outline icon; School turns the homepage into a desktop of small widgets to click (colour wheel, clock, chessboard); Marco Koenig shows each client as one horizontal strip of tiles.
- **Architecture offices** push the same ideas further: Johnston Marklee's homepage is white building silhouettes on black, each one a project link; Spine Architects sets 'Spine Architects / Projects, About, Contact' as one huge headline, the name and the menu in the same line of type; Kaan's nav is set large as the page's main typography; Groth sets a bold 'Groth™' with a cube drawing and status chips on its renders, an architecture studio that looks like a product brand; UNStudio turns its seven offices into a row of clocks; Ted Synnott and Marazzi Reinhardt list each work as a ruled row (name, place, year, one photo), a catalogue raisonné rather than a showreel.

## 19. Personal sites: one sentence and one move

The strongest personal sites in the library (Rauno, Lynn Fisher, Maggie Appleton, Robin Sloan, Tobias van Schneider) each do one thing: a single sentence over a yellow circle, a book's title page, a garden of growing notes, an orange pamphlet, a manifesto poster. None of them has a hero, a services grid and a testimonials row.

Take: for a personal or portfolio site, write the one sentence that says who you are, choose one metaphor or one shape, and let the index of work follow plainly. The one move can be any of these; pick one, not three:

- **A format borrowed from elsewhere.** Vogelhaus writes its manifesto as a signed letter with polaroids of the two founders; Bruno Cisco, a copywriter, makes one long paragraph the whole page and ends on an italic 'Anything but skippable.'; Loli Laboureau builds the page from cut-outs, gilded frames and stickers over film stills; Zef Cherry-Kynaston sets his CV like a pink poster with superscript year ranges and a struck-through 'UX developer'; Teardwn opens on a painted-sky collage with a Chuck Norris cut-out so the long mono story below gets read; NoGood adds a 'system log' side column (last supporter, last commission) that makes an illustrator's site feel lived in.
- **A trade's own vocabulary.** Jacob McKee, a colorist, lists jobs as credits with timecodes; Geoff Levy, a director, overlays his film titles on one full-bleed still; Petar Zeman titles his site 'folio Nº 04'; Austen Ezzell redesigns every year and makes the homepage a grid of the old versions; Xavier Valarino leaves Columns / Baseline toggles in the footer so the grid can be switched on. When the craft is the web itself, demonstrate it: Jen Simmons scatters her name across a layout grid with overlapping red blocks. Tobias Ahlin, who teaches CSS, makes the homepage a blog whose cards illustrate the technique they explain.
- **A familiar interface as navigation.** Ralph Tharayil shows his writing as an iPhone Notes app; Stefan Poulos opens with 'Ask me anything…' and a chat field; Simone's Computer puts the links as icons in a 90s desktop window.
- **The menu as the page.** A. Savage turns five links into full-width colour bars; Daniel See centres a numbered menu with an italic descriptor for each word; Artem Militonian writes navigation as prose ('index: about / design / journalism', 'links: … (not active)'); Marina Suvorova, an artist, offers two doors, AVAILABLE ART and CUSTOM ART, and nothing else.
- **The index as the page.** Tyler McRobert's homepage is one line of clients with circled numbers; Vasantha Yogananthan lists his books as a run of serif titles with a tiny thumbnail after each; Lelism sets a centred list of mono titles numbered at both edges; Ben Mingo shows a whole archive as a contact sheet of thumbnails labelled with file names; Faris Kassim maps projects in a ruled grid coded by kind; Other Office scatters framed thumbnails like a desk; Archive makes each year a huge numeral with the count of places at the edge; Lost Memories scatters found snapshots like prints on a table. All I Possess, an art project, lists every object one person owns as cut-out photos with a single mono rule; Julien Renau labels projects A, B, C with a running line of technologies and awards under each. Claire Arnold, a video director, lists jobs as centred Didone credits ('Prada SS26 by Jordan Wolfson'); Kay Schuttel sets each work as a big light title with a tiny thumbnail and mono tags; Stephen Wells, a photographer, titles the site 'Incomplete works: 1981—present'; Scott Sanders lists the full team credits beside each project.
- **Outcomes as a table.** Joshua Kaplan lists his career with codes, years and green 'Acquired' / 'Now' pills, patents included; Christopher Bailey titles the work 'Selected Works 19'—25'' and stacks each job's deliverables beside the client; Arnaud Alves greys out confidential rows instead of hiding them; Dima Hamayunau files every shipped product under its year; Sayed Essam states Product 1 / Team 5 / Scale 1,000x before naming the products; Stas Polyakov writes his career as paragraphs with a tiny logo before each company.
- **The CV beside shipped screens** (product designers). Harry Bissett shows the real Ableton Live screen on a purple panel; Boris Verks puts dashboards next to a bullet list of what he did; Abhay Singh ends each case card with the result in mono ('0 to 40k revenue in five years'); Lukas Guschlbauer opens his first case study on the homepage itself; Sarthak Mishra lays out the offer as a bento of cards, prices included; Ryan Stephen shows prototypes as phones held in hands outdoors; Sylvain Julé shows each website in a small slideshow player with play and fullscreen controls; Marco Cornacchia lists 'I think…' sentences next to a bento of product fragments.
- **The writing carries it.** Charlie Pite ('I know you're only here for the copy') above a client table; Nastya Borodina describes her job twice, once for her grandmother and once 'in corporate language'; Jonny Belton makes an essay the homepage; Ana Rita Morais makes her bio a long linked serif text; Digital Solitude, a site one person can visit at a time, is only the idea and its rule; Jason Briscoe sets his bio huge (bagpipes, HYROX) as the hook; Stu Ohler writes 'Work samples are available upon request' under a single billboard photo. Abeer Seikaly's homepage is only the questions her practice asks ('What is a Home?'); Pavel Kedich arranges his work 'as a long read' with a reading time; Rumsey Taylor's is an essay whose red dots open footnotes; Kevin van der Wijst corrects his bio with a strikethrough ('~~Amsterdam~~ Valencia'). Tobias Thaden lists his stack with 'VueJS' struck through; Alex Singh's homepage is one short essay on black.
- **One typographic or graphic gesture.** Andy Rader turns his whole intro 90 degrees; Seb Astian splits words across the page with a rule between the halves ('DE —— SIGN'); Harry Atkins and Patrick Johnson spread their initials to the page edges; Marcus Eriksson gives a plain photo page one custom wordmark full of ligatures; Elena Borisova opens on a scribbled bird and the word 'forget' falling apart; Tjorven Stein stacks 3D pills embossed with client names, the client list as a sculpture; Xtina Starr pins 'ENGINEER BY DAY' and 'DJ BY NIGHT' to the corners of one portrait; Sylvan Hillebrand opens on a black wall of every logo he drew.
- **Contact or status first.** Nathan Smith's first screen is his phone number and '→EMAIL →INSTA' in big type; Igor Mahr puts 'Currently booked for Sep 2026' in a chip above his project rows. An illustrator can skip the header entirely: Daniel Triendl slips his about and newsletter in as cards inside the picture masonry.
