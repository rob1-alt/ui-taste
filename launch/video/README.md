# taster · launch video

55 seconds, 1920×1080, 30 fps, built with Remotion. Seven scenes: the mark, the page every agent builds, the library as measured colours, a search in the terminal, the anti-slop review, a real brief in three rounds, the install commands.

```bash
npm install
npm run render            # → out/taster-launch.mp4
npx remotion studio       # edit with live preview
npx remotion still src/index.ts Launch out/f.png --frame=520
```

## What to swap before publishing

- `public/before.jpg`, `public/loud.jpg`, `public/after.jpg`: the three rounds of a worked example. The Relay X frames were removed (client brand): re-render the three from a fictional product (Tally, as on the site's comparison) and drop the files in.
- `public/library.json`: regenerate with `python3 make_data.py` when the library grows. The mosaic shows 345 cells (23 × 15); more pages are simply not drawn.
- The install commands in `Outro` (src/scenes.tsx) once the plugin is renamed taster.
- `public/Archivo.ttf` is the OFL variable font used by the site. The terminal uses Liberation Mono from the system.

## Pacing

Scene lengths are in `src/Launch.tsx` (`SCENES`), in frames; adjacent scenes cross-fade over 12 frames. No audio track: add music at the editing stage or with Remotion's `<Audio>`, and keep it under the voice if you record one.
