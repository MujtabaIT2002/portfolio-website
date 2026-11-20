"use client";
import { ACHIEVEMENTS } from "../progress";
import type { PanelProps } from "./types";

export default function Help({ progress }: PanelProps) {
  const got = Object.keys(ACHIEVEMENTS).filter((a) => progress.achievements.includes(a)).length;
  return (
    <div className="help">
      <div className="h2">CONTROLS</div>
      <div>
        <kbd>WASD</kbd>
        <kbd>ARROWS</kbd> walk · <kbd>TAP / CLICK</kbd> walk there · walk into a door to enter
      </div>
      <div>
        <kbd>E</kbd>
        <kbd>SPACE</kbd> talk / interact · <kbd>1–7</kbd> fast-travel · <kbd>`</kbd> terminal
      </div>
      <div>
        <kbd>ESC</kbd> close · <kbd>M</kbd> mute · <kbd>P</kbd> performance meter · <kbd>H</kbd> this screen
      </div>
      <div className="h2" style={{ marginTop: 16 }}>
        ACHIEVEMENTS {got}/{Object.keys(ACHIEVEMENTS).length}
      </div>
      <div className="ach">
        {Object.entries(ACHIEVEMENTS).map(([k, a]) => {
          const ok = progress.achievements.includes(k);
          return (
            <div key={k} className={"card" + (ok ? "" : " locked")} style={{ "--c": ok ? "var(--yellow)" : "var(--line)" } as React.CSSProperties}>
              <span className="an" style={{ color: ok ? "var(--yellow)" : "var(--dim)" }}>
                {ok ? "★" : "☆"} {ok || k === "boot" || k === "explorer" || k === "konami" ? a.name : "???"}
              </span>
              <span style={{ fontSize: 18 }}>
                {k === "konami" && !ok ? "On the island press ↑ ↑ ↓ ↓ ← → ← → B A. On a phone, type 'up up down down left right left right b a' in the TERMINAL." : a.desc}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h2" style={{ marginTop: 16 }}>
        PROGRESS
      </div>
      <div>
        Buildings {progress.visited.length}/7 · Gems {progress.gems.length}/12 · Puzzles {progress.puzzles.length}/6 · Projects viewed {progress.projects.length}/8
      </div>
      <div className="muted" style={{ fontSize: 17, marginTop: 8 }}>
        Built from scratch: Next.js + a hand-written canvas engine. No game libraries, no image sprites — every pixel and ASCII wave is generated in code.
      </div>
    </div>
  );
}
