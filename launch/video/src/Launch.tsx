import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Library, Loop, Open, Outro, Problem, Proof } from "./scenes";
import { INK, useArchivo } from "./ui";

export const FPS = 30;

// Scene lengths in frames. Adjacent scenes overlap by FADE so one fades out while the next fades in.
const FADE = 12;
const SCENES: [React.FC<{ total: number }>, number][] = [
  [Open, 150],
  [Problem, 210],
  [Library, 240],
  [Loop, 280],
  [Proof, 400],
  [Outro, 170],
];
export const DURATION = SCENES.reduce((n, [, d]) => n + d, 0) - FADE * (SCENES.length - 1);

export const Launch: React.FC = () => {
  useArchivo();
  let at = 0;
  return (
    <AbsoluteFill style={{ background: INK }}>
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
