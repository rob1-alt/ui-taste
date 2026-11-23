import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { BeforeAfter, Library, Open, Outro, Problem, Review, Search } from "./scenes";
import { PAPER, useArchivo } from "./ui";

export const FPS = 30;

// Scene lengths in frames. Adjacent scenes overlap by FADE so one fades out while the next fades in.
const FADE = 12;
const SCENES: [React.FC<{ total: number }>, number][] = [
  [Open, 110],
  [Problem, 250],
  [Library, 300],
  [Search, 290],
  [Review, 240],
  [BeforeAfter, 300],
  [Outro, 200],
];
export const DURATION = SCENES.reduce((n, [, d]) => n + d, 0) - FADE * (SCENES.length - 1);

export const Launch: React.FC = () => {
  useArchivo();
  let at = 0;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {SCENES.map(([C, d], i) => {
        const from = at;
        at += d - FADE;
        return (
          <Sequence key={i} from={from} durationInFrames={d} layout="none">
            <C total={d} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
