# Backgrounds: the ground a landing stands on

A landing made of flat white and flat dark sections reads as a template even when the type and the content are good. The strongest pages in the library treat the background as material: a painting, a photograph used as a field, a duotone, a texture, a technical paper. The background is where the brand's world shows up without a single extra word.

Search them by tag (`find_refs.py "bg-painting"`, `"bg-duotone"`, …), open two, then decide.

## The families

| Family | What it is | Look at (tag) |
|---|---|---|
| **Painting** | A real painting, watercolour or painted sky behind the product or the headline. Warmth and culture for a technical product. | Harvey, Zep, Cohere, Magic Patterns, Zapier, Tavus (`bg-painting`) |
| **Photo as field** | One photograph that fills the section, often blurred, graded or cropped so text sits on a calm part of it. | Mercury, Pylon, Vapi, Flexport, Legora, Oklo, Friend (`bg-photo-field`) |
| **Duotone** | The brand's own photo or an engraving reduced to two colours, the brand ink and the paper. Turns any photo into brand. | Orbit, Varda, Plaid, K2 Space (`bg-duotone`) |
| **Material** | A macro of the product's material: metal, chip, clay, stone, textile. Tactile, specific to the category. | Extropic, Deepgram, Commonwealth Fusion, Rogo, Hebbia (`bg-material`) |
| **Technical paper** | Graph paper, blueprint, crosshair marks, a schedule grid: the customer's working surface. | Mux, Firecrawl, Greptile, Hadrian, Modern Treasury (`bg-technical-grid`) |
| **Halftone and dots** | A dot screen or dot-matrix drawing that carries an image or a map with a print feel. | Hume, Isomorphic Labs, ParadeDB, Equals (`bg-halftone-dots`) |
| **Illustrated sky** | A drawn or pixel sky and clouds, a world rather than a picture. | MotherDuck, Bluesky, Bunny, Mastodon (`bg-illustrated-sky`) |
| **Colour field** | One saturated brand colour, nothing on it but type and UI. | Vanta, ParadeDB, Cloudflare, Signal, Slate (`bg-colour-field`) |

## How to choose and build

1. **Start from the brand's real images.** Duotone them (`scripts/backdrop.py duotone photo.jpg out.jpg --ink "#brand" --paper "#light" --dots 4`), grade them (`backdrop.py grade`), or crop them to a texture. A grain of the client's own photo beats any generic pattern.
2. **Take the pattern from the customer's world.** Construction: blueprint and schedule grid. Finance: banknote engraving. Fencing: the piste markings. Audio: waveform. Never a generic "tech" grid on a non-technical brand.
3. **One family per page, two at most.** Alternate a strong field (photo, duotone, colour) with a quiet one (paper, grain) so the strong ones keep their force. A section-by-section rhythm: field, paper, field.
4. **Text on a background**: put it where the image is calm, or add a veil only behind the text column (`references/imagery.md`). Body text still passes 4.5:1.
5. **Make the background do something once.** It can move with scroll, reveal on hover, or be the thing the product acts on (a schedule the product annotates). Once, not everywhere.

## What not to do

- Gradient mesh or aurora blobs added "for depth" (the 2023 default, see `anti-slop.md`).
- Noise everywhere at 3% opacity as the only idea.
- A stock photo darkened to 70% black so text fits on it.
- Patterns unrelated to the brand (a hexagon grid for a perfume).
- Every section on its own different background: it reads as a template gallery, not a page.
