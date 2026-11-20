"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChessData, ChessMode } from "@/lib/chess";
import { drawText } from "@/game/font";
import MateInOne from "./MateInOne";
import type { PanelProps } from "./types";

const MODE_COLOR: Record<string, string> = { rapid: "#7cff4f", blitz: "#ffd319", bullet: "#ff2e88", daily: "#00e5ff", "960_daily": "#b967ff" };
const fmtDate = (s: number | null) => (s ? new Date(s * 1000).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "—");
const pct = (a: number, n: number) => (n ? Math.round((a / n) * 100) : 0);

function useCountUp(target: number, dur = 700) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return v;
}

function WLD({ w, l, d }: { w: number; l: number; d: number }) {
  const n = w + l + d || 1;
  return (
    <>
      <div className="bar" role="img" aria-label={`${w} wins, ${l} losses, ${d} draws`}>
        <i style={{ width: `${(w / n) * 100}%`, background: "var(--green)" }} />
        <i style={{ width: `${(d / n) * 100}%`, background: "var(--dim)" }} />
        <i style={{ width: `${(l / n) * 100}%`, background: "var(--pink)" }} />
      </div>
      <div className="legend">
        <b>
          <span className="sq" style={{ background: "var(--green)" }} />
          {w}W
        </b>
        <b>
          <span className="sq" style={{ background: "var(--dim)" }} />
          {d}D
        </b>
        <b>
          <span className="sq" style={{ background: "var(--pink)" }} />
          {l}L
        </b>
      </div>
    </>
  );
}

function ModeCard({ m }: { m: ChessMode }) {
  const v = useCountUp(m.rating);
  const n = m.win + m.loss + m.draw;
  const c = MODE_COLOR[m.key] ?? "#fff";
  return (
    <div className="card mode" style={{ "--c": c } as React.CSSProperties}>
      <div className="ml">♞ {m.label}</div>
      <div className="mr">{v}</div>
      <div className="mp">
        PEAK <b>{m.best ?? "—"}</b> · {fmtDate(m.bestDate)}
        <br />
        {n.toLocaleString()} games · {pct(m.win, n)}% won
      </div>
      <WLD w={m.win} l={m.loss} d={m.draw} />
    </div>
  );
}

function Source({ chess }: { chess: ChessData }) {
  const live = chess.source === "live";
  return (
    <span className={"src" + (live ? " live" : "")}>
      <i /> {live ? "LIVE · CHESS.COM API" : "SNAPSHOT · SYNCING…"}
    </span>
  );
}

function Overview({ chess }: { chess: ChessData }) {
  const a = chess.analysis;
  const total = chess.modes.reduce((n, m) => n + m.win + m.loss + m.draw, 0);
  return (
    <>
      <div className="modes">
        {chess.modes.map((m) => (
          <ModeCard key={m.key} m={m} />
        ))}
      </div>
      <div className="grid2">
        <div className="card" style={{ "--c": "var(--purple)" } as React.CSSProperties}>
          <div className="h2" style={{ color: "var(--purple)" }}>
            TACTICS & PUZZLES
          </div>
          {chess.tactics ? (
            <div className="p" style={{ margin: 0 }}>
              Highest puzzle rating <b style={{ color: "var(--yellow)" }}>{chess.tactics.highest}</b> ({fmtDate(chess.tactics.highestDate)})
              <br />
              Lowest {chess.tactics.lowest} · Puzzle Rush best {chess.puzzleRush ?? "—"}
            </div>
          ) : (
            <div className="muted">No puzzle data yet.</div>
          )}
          <div className="h2" style={{ color: "var(--purple)", marginTop: 12 }}>
            CAREER
          </div>
          <div className="p" style={{ margin: 0 }}>
            {total.toLocaleString()} rated games · {chess.profile.league ? `${chess.profile.league} league · ` : ""}
            member since {fmtDate(chess.profile.joined)}
            {a ? ` · longest win streak ${a.streak}` : ""}
          </div>
        </div>
        {a && (
          <div className="card" style={{ "--c": "var(--yellow)" } as React.CSSProperties}>
            <div className="h2" style={{ color: "var(--yellow)" }}>
              LAST 10 GAMES
            </div>
            <div className="form" aria-label="Recent results">
              {a.recent
                .slice()
                .reverse()
                .map((r) => (
                  <a
                    key={r[6]}
                    href={`https://www.chess.com/game/live/${r[6]}`}
                    target="_blank"
                    rel="noreferrer"
                    title={`${r[0]} · ${r[5] === "w" ? "white" : "black"} vs ${r[2]} · ${new Date(r[4] * 1000).toLocaleDateString()}`}
                    style={{ background: r[1] === 0 ? "var(--green)" : r[1] === 1 ? "var(--pink)" : "var(--dim)" }}
                  >
                    {r[1] === 0 ? "W" : r[1] === 1 ? "L" : "D"}
                  </a>
                ))}
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 17 }}>
              Newest first · tap a square to open the game on chess.com
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Chart({ pts, color }: { pts: [number, number][]; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [tip, setTip] = useState<string | null>(null);
  const geo = useRef({ x0: 0, w: 1, n: 0 });
  useEffect(() => {
    const c = ref.current!;
    const draw = () => {
      const PX = 1; // one chart pixel = 1 CSS px, upscaled with nearest-neighbour on HiDPI
      const W = Math.max(60, Math.floor(c.clientWidth / PX));
      const H = Math.max(40, Math.floor(c.clientHeight / PX));
      c.width = W;
      c.height = H;
      const g = c.getContext("2d")!;
      g.imageSmoothingEnabled = false;
      g.fillStyle = "#0e0828";
      g.fillRect(0, 0, W, H);
      if (!pts.length) return;
      const vals = pts.map((p) => p[1]);
      let lo = Math.min(...vals),
        hi = Math.max(...vals);
      const pad = Math.max(20, (hi - lo) * 0.12);
      lo = Math.floor((lo - pad) / 50) * 50;
      hi = Math.ceil((hi + pad) / 50) * 50;
      const L = 36,
        R = W - 6,
        T = 22,
        B = H - 14;
      const y = (v: number) => Math.round(B - ((v - lo) / (hi - lo)) * (B - T));
      const x = (i: number) => Math.round(L + (i / Math.max(1, pts.length - 1)) * (R - L));
      geo.current = { x0: L, w: R - L, n: pts.length };
      // grid
      for (let k = 0; k <= 4; k++) {
        const v = lo + ((hi - lo) * k) / 4;
        const yy = y(v);
        g.fillStyle = "#241a52";
        for (let xx = L; xx < R; xx += 4) g.fillRect(xx, yy, 2, 1);
        g.fillStyle = "#8f7ad9";
        const label = String(Math.round(v));
        drawText(g, label, 2, yy - 4);
      }
      // area + line
      g.fillStyle = color + "22";
      for (let i = 0; i < pts.length - 1; i++) {
        const x1 = x(i),
          x2 = x(i + 1);
        for (let xx = x1; xx <= x2; xx++) {
          const t = (xx - x1) / Math.max(1, x2 - x1);
          const yy = Math.round(y(pts[i][1]) + (y(pts[i + 1][1]) - y(pts[i][1])) * t);
          g.fillRect(xx, yy, 1, B - yy);
        }
      }
      g.fillStyle = color;
      for (let i = 0; i < pts.length - 1; i++) {
        let x1 = x(i),
          y1 = y(pts[i][1]);
        const x2 = x(i + 1),
          y2 = y(pts[i + 1][1]);
        const dx = Math.abs(x2 - x1),
          dy = -Math.abs(y2 - y1),
          sx = x1 < x2 ? 1 : -1,
          sy = y1 < y2 ? 1 : -1;
        let err = dx + dy;
        for (;;) {
          g.fillRect(x1, y1, 2, 2);
          if (x1 === x2 && y1 === y2) break;
          const e2 = 2 * err;
          if (e2 >= dy) {
            err += dy;
            x1 += sx;
          }
          if (e2 <= dx) {
            err += dx;
            y1 += sy;
          }
        }
      }
      // peak
      const pi = vals.indexOf(Math.max(...vals));
      g.fillStyle = "#ffd319";
      g.fillRect(x(pi) - 2, y(vals[pi]) - 2, 5, 5);
      // dates
      g.fillStyle = "#8f7ad9";
      drawText(g, fmtDate(pts[0][0]).toUpperCase(), L, B + 4);
      const end = fmtDate(pts[pts.length - 1][0]).toUpperCase();
      drawText(g, end, R - end.length * 8, B + 4);
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, [pts, color]);

  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const PX = r.width / (ref.current?.width || 1);
    const gx = (e.clientX - r.left) / PX;
    const { x0, w, n } = geo.current;
    const i = Math.max(0, Math.min(n - 1, Math.round(((gx - x0) / w) * (n - 1))));
    const p = pts[i];
    if (p) setTip(`${p[1]} · ${new Date(p[0] * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`);
  };
  return (
    <div className="chart" onPointerMove={onMove} onPointerLeave={() => setTip(null)}>
      <canvas ref={ref} style={{ imageRendering: "pixelated" }} aria-label="Rating history chart" />
      <div className="tip">{tip ?? "HOVER / DRAG TO INSPECT"}</div>
    </div>
  );
}

function Journey({ chess }: { chess: ChessData }) {
  const a = chess.analysis;
  const keys = useMemo(() => (a ? Object.keys(a.hist).sort((x, y) => a.hist[y].n - a.hist[x].n) : []), [a]);
  const [tc, setTc] = useState(keys[0] ?? "rapid");
  if (!a) return <div className="muted">Game history unavailable right now.</div>;
  const winsTotal = Object.values(a.how).reduce((n, v) => n + v, 0) || 1;
  const HOW: [string, string][] = [
    ["checkmated", "CHECKMATE"],
    ["resigned", "RESIGNATION"],
    ["timeout", "ON TIME"],
    ["abandoned", "ABANDONED"],
  ];
  return (
    <>
      <div className="tabs" role="tablist">
        {keys.map((k) => (
          <button key={k} role="tab" className="tab" aria-selected={tc === k} onClick={() => setTc(k)} style={{ "--accent": MODE_COLOR[k] ?? "#fff" } as React.CSSProperties}>
            {k.toUpperCase()} <span style={{ opacity: 0.7 }}>({a.hist[k].n})</span>
          </button>
        ))}
      </div>
      <Chart pts={a.hist[tc]?.pts ?? []} color={MODE_COLOR[tc] ?? "#ffffff"} />
      <div className="grid2" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="h2">BY COLOUR</div>
          <div className="hbars">
            {(["w", "b"] as const).map((c) => {
              const [w, l, d] = a.color[c];
              return (
                <div key={c}>
                  <div style={{ marginBottom: 4 }}>
                    {c === "w" ? "♔ WHITE" : "♚ BLACK"} · {pct(w, w + l + d)}% wins
                  </div>
                  <WLD w={w} l={l} d={d} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <div className="h2">HOW THE WINS CAME</div>
          <div className="hbars">
            {HOW.map(([k, label], i) => (
              <div className="hbar" key={k}>
                <span>{label}</span>
                <span className="muted">{pct(a.how[k] ?? 0, winsTotal)}%</span>
                <div className="bar">
                  <i style={{ width: `${pct(a.how[k] ?? 0, winsTotal)}%`, background: ["#7cff4f", "#ffd319", "#00e5ff", "#b967ff"][i] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="h2">FAVOURITE OPENINGS</div>
          <div className="hbars">
            {a.open.map(([name, [w, l, d]]) => (
              <div className="hbar" key={name}>
                <span>{name}</span>
                <span className="muted">
                  {w + l + d} · {pct(w, w + l + d)}%
                </span>
                <div className="bar">
                  <i style={{ width: `${(w / (w + l + d)) * 100}%`, background: "var(--green)" }} />
                  <i style={{ width: `${(d / (w + l + d)) * 100}%`, background: "var(--dim)" }} />
                  <i style={{ width: `${(l / (w + l + d)) * 100}%`, background: "var(--pink)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Chess(props: PanelProps) {
  const { chess } = props;
  const [tab, setTab] = useState<"overview" | "journey" | "play">("overview");
  return (
    <div>
      <div className="row" style={{ alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <h2 className="h1" style={{ marginBottom: 2 }}>
            ♜ {chess.profile.username.toUpperCase()}
          </h2>
          <Source chess={chess} />
        </div>
        <a className="btn" href={chess.profile.url} target="_blank" rel="noreferrer" style={{ "--c": "#7cff4f" } as React.CSSProperties}>
          CHALLENGE ME ↗
        </a>
      </div>
      <div className="tabs" role="tablist">
        {(
          [
            ["overview", "RATINGS"],
            ["journey", "JOURNEY"],
            ["play", "PLAY: MATE IN 1"],
          ] as const
        ).map(([k, l]) => (
          <button key={k} role="tab" className="tab" aria-selected={tab === k} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>
      {tab === "overview" && <Overview chess={chess} />}
      {tab === "journey" && <Journey chess={chess} />}
      {tab === "play" && <MateInOne {...props} />}
    </div>
  );
}
