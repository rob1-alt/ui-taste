# ui taste · launch video

46 seconds, 1920×1080, 30 fps, built with Remotion, in the site's identity: near-black, Archivo condensed black for headlines, one vermilion. Six scenes:

1. **Open**: library pages fill the frame, only the ones spelling TASTE stay lit, the site's headline and logo arrive.
2. **The default**: "It builds the default." A 2024 purple-gradient page, then what Opus actually built for the Tally brief without the skill, tagged (cream, serif italic, pill, stamp, invented stats).
3. **The library**: the page count over scrolling columns of real pages, then Linear's pricing page with the tokens measured on it.
4. **The loop**: Look (start.py's reference sheet), Build (the page made with the skill), Compare (shot.py's side-by-side with the reference).
5. **The proof**: same prompt, same model, three ways (without, without but told to iterate, with ui taste), with the real step counts, across landing, pricing and dashboard.
6. **Outro**: logo, the two install commands, uitaste.dev, the repo.

```bash
npm install
../../.venv/bin/python make_assets.py   # copies tiles, comparison shots and review frames into public/
npm run render                          # → out/uitaste-launch.mp4
npx remotion studio                     # edit with live preview
npx remotion still src/index.ts Launch out/f.png --frame=520
```

`make_assets.py` reads the library, `site/thumbs/` and `site/demo/compare/`. The reference sheet (`refs.jpg`) and the side-by-side (`review-top.jpg`) come from the skill's Tally run; they are committed in `public/`, re-run the comparison to refresh them.

Scene lengths are in `src/Launch.tsx` (`SCENES`), in frames; adjacent scenes cross-fade over 12 frames. No audio track: add music at the editing stage or with Remotion's `<Audio>`.
