export type Screen = { full: string; thumb: string; tile?: string; w: number; h: number };
export type TypeTok = { font: string; size: number; weight: string; lineHeight: number; letterSpacing?: string; color?: string };
export type Btn = {
  label?: string; bg: string; color: string; radius: string; height?: number; paddingX?: number;
  font?: string; size?: number; weight?: string;
};
export type Item = {
  id: string;
  site: string;
  url: string;
  type: string;
  tags: string[];
  note: string;
  captured: string;
  screens: Partial<Record<"desktop" | "mobile", Screen>>;
  fonts: string[];
  typeScale: Partial<Record<"h1" | "h2" | "h3" | "body", TypeTok>>;
  colors: { background?: string; surfaces?: string[]; text?: string[] };
  buttons: Btn[];
  contentWidth?: number | null;
};
// what the hero mosaic needs for each page: kept small because it is sent to the browser for every page
export type Tile = { id: string; site: string; type: string; src: string; light: boolean; hint: string };
