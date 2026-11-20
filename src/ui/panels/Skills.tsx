"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SKILLS, skillUsage } from "@/data/cv";
import type { PanelProps } from "./types";

/** The classic spinning ASCII torus — the "neural core". */
function Donut() {
  const ref = useRef<HTMLPreElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const Wc = 44,
      Hc = 20;
    const chars = ".,-~:;=!*#$@";
    let A = 1,
      B = 1,
      raf = 0,
      last = 0;
    const z = new Float32Array(Wc * Hc);
    const b = new Array<string>(Wc * Hc);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 45) return;
      last = now;
      A += 0.07;
      B += 0.035;
      b.fill(" ");
      z.fill(0);
      const cA = Math.cos(A),
        sA = Math.sin(A),
        cB = Math.cos(B),
        sB = Math.sin(B);
      for (let j = 0; j < 6.28; j += 0.09) {
        const ct = Math.cos(j),
          st = Math.sin(j);
        for (let i = 0; i < 6.28; i += 0.03) {
          const sp = Math.sin(i),
            cp = Math.cos(i);
          const h = ct + 2;
          const D = 1 / (sp * h * sA + st * cA + 5);
          const t = sp * h * cA - st * sA;
          const x = (Wc / 2 + 21 * D * (cp * h * cB - t * sB)) | 0;
          const y = (Hc / 2 + 10 * D * (cp * h * sB + t * cB)) | 0;
          const o = x + Wc * y;
          const N = (8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB)) | 0;
          if (y >= 0 && y < Hc && x >= 0 && x < Wc && D > z[o]) {
            z[o] = D;
            b[o] = chars[N > 0 ? N : 0];
          }
        }
      }
      let s = "";
      for (let k = 0; k < Hc; k++) s += b.slice(k * Wc, k * Wc + Wc).join("") + "\n";
      el.textContent = s;
      if (reduced) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <pre className="donut" ref={ref} aria-hidden="true" />;
}

export default function Skills({ play }: PanelProps) {
  const [sel, setSel] = useState<{ g: number; i: number }>({ g: 0, i: 0 });
  const group = SKILLS[sel.g];
  const item = group.items[sel.i];
  const uses = useMemo(() => skillUsage(item.name), [item.name]);
  const total = SKILLS.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="skills">
      <div>
        {SKILLS.map((g, gi) => (
          <div className="inv-group" key={g.id}>
            <div className="h2" style={{ color: g.color }}>
              {g.label} <span className="muted">[{g.items.length}]</span>
            </div>
            <div className="inv">
              {g.items.map((s, i) => (
                <button
                  key={s.name}
                  className="slot"
                  style={{ "--c": g.color } as React.CSSProperties}
                  aria-pressed={sel.g === gi && sel.i === i}
                  aria-label={s.name}
                  title={s.name}
                  onClick={() => {
                    setSel({ g: gi, i });
                    play("click");
                  }}
                  onMouseEnter={() => setSel({ g: gi, i })}
                >
                  {s.abbr}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <aside className="detail">
        <div className="card" style={{ "--c": group.color } as React.CSSProperties}>
          <div className="h2" style={{ textAlign: "center", color: "var(--dim)" }}>
            NEURAL CORE · {total} ITEMS
          </div>
          <Donut />
          <div className="h2" style={{ color: group.color, marginTop: 6 }}>
            {group.label}
          </div>
          <h2 className="h1" style={{ fontSize: 16 }}>
            {item.name}
          </h2>
          <div className="muted" style={{ fontSize: 18 }}>
            {uses.length ? `Equipped in ${uses.length} quest${uses.length > 1 ? "s" : ""}/project${uses.length > 1 ? "s" : ""}:` : "Part of the everyday toolkit."}
          </div>
          {uses.length > 0 && (
            <ul className="uses">
              {uses.slice(0, 6).map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
