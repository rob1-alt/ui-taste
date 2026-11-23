import { Archivo, Instrument_Serif } from "next/font/google";

// Archivo across its width axis: condensed black for headlines, normal for reading, expanded for small labels.
export const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
export const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-instrument", display: "swap" });
