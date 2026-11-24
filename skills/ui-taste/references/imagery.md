# Imagery: the client places the art, the page adapts to it

Photos, artworks, illustrations and 3D are what make a page feel made by people: Harvey's paintings behind the product, Mercury's cinematic landscapes, Daylight's device in the moss, Pentagram's work, Teenage Engineering's product photography, Clay's 3D world. They are also the one thing an agent must not invent. A generated "artwork", a stock photo nobody licensed or a line drawing pretending to be an illustration reads as slop and can be a legal problem.

So the work is split:
- **The client owns the images.** Photos of their team, labs, products, customers, events; artworks they own or license; their illustrator's work.
- **The agent designs the places for them and adapts the page once they arrive.**
- **When there is nothing yet, the agent may borrow a public-domain work** from a museum's open collection (section 3), credited, never a generated or unlicensed image.

## 1. Use what already exists

Before designing slots, take every real image the brand already has: the live site (download its photos, logos and marks when rebuilding it), the press kit, the product itself. Real and slightly imperfect beats perfect and fake.

## 2. Design image slots, with art direction

Plan where images carry the page: the hero backdrop, one full-bleed interlude, portraits next to quotes, the product in use. Two or three strong images beat ten small ones.

Mark each slot in the markup so the page and the tools can find it:

```html
<img src="assets/slots/hero-art.jpg" alt=""
  data-slot="hero-art" data-src="assets/slots/hero-art.jpg"
  data-ratio="16/9" data-tone="dark"
  data-brief="Dark, rich artwork or photo behind the product: still life of bottles and glassware, an old apothecary painting, a material in macro.">
```

- `data-ratio`: the crop the layout expects. `data-tone`: `dark`, `light` or `any`, what the layout needs behind its text.
- `data-brief`: the art direction in one or two sentences: subject, mood, light, where the empty space must be. Write it for the client's photographer or for the person choosing an artwork, not for a stock search.
- Give the minimum size (2400px wide for full-bleed, 1600px for half-width).

An empty slot must not break the page and must not fake an image. It shows its brief in a calm placeholder (the slot name, the brief, the file path, ratio and size) and the layout around it still works. A few lines of script swap the placeholder for the image as soon as the file exists:

```js
document.querySelectorAll("img[data-slot]").forEach((img) => {
  const host = img.parentElement;                 // the element that holds the placeholder
  const empty = () => { host.classList.add("slot-empty"); img.remove(); };
  if (img.complete && img.naturalWidth === 0) empty(); else img.addEventListener("error", empty);
});
```

and the CSS shows the brief only under `.slot-empty`. Tell the user, in your report, which slots are empty and what each needs.

## 3. No pictures yet: public-domain art

When the client has nothing for a slot, or the direction calls for a painting, an engraving or an old photograph, use a public-domain work from a museum's open-access collection. It is real, made by a person, free to use, and often stronger than anything stock would give: Van Gogh's *Wheat Field with Cypresses* behind an invoicing app, a Dutch still life behind a fragrance lab, a Hiroshige wave behind a weather tool.

```bash
python3 scripts/find_art.py search "wheat field" --type painting --out assets/art   # numbered contact sheet + list
python3 scripts/find_art.py get met:436535 --out assets/art                        # full size + credit in a .json
```

It searches The Met and the Cleveland Museum of Art, and keeps only CC0 / public-domain works. Then:

1. **Pick with the brief in mind.** Open `sheet.jpg` with the Read tool. The slot's tone and empty space matter more than the subject: a calm sky where the headline goes, a field or a table edge that can pass in front of the product. Search with plain nouns (sky, harbour, orchard, still life, storm, garden, bottles), not adjectives.
2. **Crop the scan.** Museum files often keep the frame or the canvas edge: crop to the painted surface, and to the part that serves the layout.
3. **Make it pass in front of the product** when the direction is the image sandwich: `scripts/backdrop.py foreground art.jpg art-front.png --edge "..."` along the crest of the field, the hills or the table. Backdrop and foreground get the same box and the same `background-size`/`position` so they stay aligned.
4. **Veil behind the text** only, as below, and check the result at 390px: impasto and brushwork get busy behind small text.
5. **Credit it on the page**, small, near the image or in the footer: artist, title, date, museum, "public domain". The `.json` next to the file holds the credit line.
6. **Say it is a choice the client can keep or replace** in your report: "hero-art uses Van Gogh, *Wheat Field with Cypresses* (1889, The Met, public domain) until you have your own."

Not this way: works still under copyright (most art after the 1950s), museum images marked "rights reserved", artworks found through image search, or AI images "in the style of" a painter.

## 4. Adapt when the images arrive

When the client has placed their files:

```bash
python3 scripts/slots.py path/to/index.html
```

It lists each slot, whether it is filled, the image's size and ratio against the expected one, its brightness overall and in the bottom third (where text usually sits), the text colour that reads on it, whether it needs a veil, and its dominant colours. Then open every image with the Read tool, look at it, and adapt:

- **Crop**: set `--focus` / `object-position` on the subject (faces, the product, the brightest point of a painting), not the centre by default.
- **Text on images**: follow the tone it measured. Switch text colour, or add a veil (35-45% black, 45-55% white) only behind the text area, never a flat tint over the whole image.
- **Colour**: the image may lend the page its accent (a warm amber from a painting, a green from a lab), if the brand allows. One colour, sampled from the image, not added on top.
- **Ratio**: if the image fights the slot, change the slot (a portrait image gets a portrait crop) rather than cropping a face in half.
- **Quality**: under the minimum size, use it smaller rather than blurry full-bleed.

Render again at 1440px and 390px and look. The page should feel designed around these images, not with images dropped into boxes.

## What never goes in a slot

- AI-generated artworks or photos presented as the brand's own, unless the user asks for generated imagery and knows it is generated.
- Stock photos without a licence, artworks still under copyright, other brands' imagery. Public-domain works from `find_art.py` are fine, credited.
- Drawn SVG "illustrations" standing in for photos. A clear placeholder is better than a fake.
