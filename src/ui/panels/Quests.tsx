"use client";
import { useEffect, useState } from "react";
import { EXPERIENCE } from "@/data/cv";
import type { PanelProps } from "./types";

export default function Quests({ play }: PanelProps) {
  const [i, setI] = useState(0);
  const r = EXPERIENCE[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown" || e.code === "ArrowRight") setI((v) => Math.min(EXPERIENCE.length - 1, v + 1));
      else if (e.code === "ArrowUp" || e.code === "ArrowLeft") setI((v) => Math.max(0, v - 1));
      else return;
      e.preventDefault();
      play("click");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [play]);

  return (
    <div className="quests">
      <div className="qlist" role="tablist" aria-label="Roles">
        {EXPERIENCE.map((q, k) => (
          <button
            key={q.id}
            role="tab"
            aria-selected={k === i}
            className="qitem"
            onClick={() => {
              setI(k);
              play("click");
            }}
          >
            <span className="qn">
              QUEST {String(EXPERIENCE.length - k).padStart(2, "0")} {q.end ? "" : "· NOW"}
            </span>
            <span className="qc">{q.company}</span>
          </button>
        ))}
      </div>
      <div key={r.id} role="tabpanel">
        <div className="row" style={{ alignItems: "center", marginBottom: 8 }}>
          <span className="status" style={{ background: r.end ? "var(--purple)" : "var(--green)" }}>
            {r.end ? "COMPLETED" : <><span className="live">▮</span> ACTIVE QUEST</>}
          </span>
          <span className="muted">
            {r.start} – {r.end ?? "Present"}
          </span>
        </div>
        <h2 className="h1">{r.role}</h2>
        <div className="h2">
          @ {r.company} · {r.location}
        </div>
        <div className="h2" style={{ color: "var(--dim)", marginTop: 14 }}>
          OBJECTIVES
        </div>
        <ul className="objectives">
          {r.bullets.map((b, k) => (
            <li key={k} style={{ animationDelay: `${k * 70}ms` }}>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="h2" style={{ color: "var(--dim)" }}>
          LOOT ACQUIRED
        </div>
        <div className="chips">
          {r.loot.map((l, k) => (
            <span className="chip" key={l} style={{ "--c": ["var(--cyan)", "var(--pink)", "var(--yellow)", "var(--green)"][k % 4] } as React.CSSProperties}>
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
