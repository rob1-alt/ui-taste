// The review checklist (mirrors skills/ui-taste/references/anti-slop.md).
export const CHECK: Record<string, string[]> = {
  Colour: ["No purple-to-blue or pink-to-orange hero gradient unless it is the brand.", "One accent colour, for action and state only.", "No glow or aurora blobs for atmosphere.", "Grey text passes contrast: 4.5:1 for body.", "Dark mode uses near-black surfaces in steps."],
  Type: ["One family, or a deliberate display and text pair.", "Two or three weights, not bold everywhere.", "A visible scale between h1, h2 and body.", "Tight line height on large headings, 1.5 to 1.7 on body.", "Lines of body text under about 75 characters."],
  Layout: ["Not everything centred: left-aligned text on a clear grid.", "No row of three identical emoji cards.", "Sections with different shapes, not one card grid repeated.", "Spacing on a scale: large between sections, small inside groups.", "Mobile designed, not squeezed: 44px targets, no sideways scroll."],
  Components: ["One radius family.", "Shadows only where something floats.", "One primary button per view.", "Icons from one set, no emoji as icons.", "Quiet borders, not black boxes everywhere."],
  Content: ["No invented customers, logos, ratings or numbers.", "No “Seamless”, “Supercharge”, “Unlock the power of”.", "Headlines say what the product does, buttons say what happens.", "Real screenshots over abstract blobs."],
  Motion: ["Short animations that explain a change.", "Respects reduced motion.", "Nothing fades in on scroll just to fade in."],
};

export function Checklist() {
  const n = Object.values(CHECK).flat().length;
  return (
    <details className="all-checks">
      <summary>The full checklist Claude runs <span id="n-checks">{n} items</span></summary>
      <div className="checks" id="checks">
        {Object.entries(CHECK).map(([g, items]) => (
          <div className="check-group" key={g}><h3>{g}</h3><ul>{items.map((t) => <li key={t}>{t}</li>)}</ul></div>
        ))}
      </div>
    </details>
  );
}
