"use client";
import { useEffect, useRef, useState } from "react";
import { PIECES } from "@/game/spriteData";
import type { PanelProps } from "./types";

// Every position verified with python-chess: legal position, exactly one move mates.
const PUZZLES = [
  { name: "BACK-RANK BLUES", fen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w", sol: "a1a8" },
  { name: "SCHOLAR'S STRIKE", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w", sol: "h5f7" },
  { name: "SMOTHERED", fen: "6rk/6pp/8/6N1/8/8/8/6K1 w", sol: "g5f7" },
  { name: "ARABIAN NIGHT", fen: "7k/7p/5N2/8/8/8/8/6RK w", sol: "g1g8" },
  { name: "FOOL'S REVENGE", fen: "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b", sol: "d8h4" },
  { name: "EPAULETTES", fen: "3rkr2/8/8/8/8/7Q/8/6K1 w", sol: "h3e6" },
];

type Board = (string | null)[]; // index = rank*8 + file, rank 0 = "1"

function parse(fen: string) {
  const [pos, side] = fen.split(" ");
  const b: Board = new Array(64).fill(null);
  pos.split("/").forEach((row, i) => {
    let f = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) f += +ch;
      else b[(7 - i) * 8 + f++] = ch;
    }
  });
  return { b, white: side === "w" };
}

const sq = (i: number) => "abcdefgh"[i % 8] + (Math.floor(i / 8) + 1);

const pieceCache = new Map<string, HTMLCanvasElement>();
function pieceCanvas(p: string) {
  let c = pieceCache.get(p);
  if (c) return c;
  const white = p === p.toUpperCase();
  const rows = PIECES[p.toLowerCase()];
  c = document.createElement("canvas");
  c.width = c.height = 10;
  const g = c.getContext("2d")!;
  rows.forEach((r, y) =>
    [...r].forEach((ch, x) => {
      if (ch === ".") return;
      g.fillStyle = ch === "k" ? (white ? "#1b0f2e" : "#ff9ecb") : white ? "#ffffff" : "#14092b";
      g.fillRect(x, y, 1, 1);
    }),
  );
  pieceCache.set(p, c);
  return c;
}

export default function MateInOne({ progress, update, play }: PanelProps) {
  const firstUnsolved = PUZZLES.findIndex((_, i) => !progress.puzzles.includes(i));
  const [idx, setIdx] = useState(firstUnsolved < 0 ? 0 : firstUnsolved);
  const [state, setState] = useState(() => parse(PUZZLES[idx].fen));
  const [sel, setSel] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ t: string; c: string } | null>(null);
  const [solved, setSolved] = useState(false);
  const [shake, setShake] = useState(false);
  const ref = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const geo = useRef({ s: 1, dpr: 1 });

  const pz = PUZZLES[idx];
  const flip = !state.white;

  useEffect(() => {
    setState(parse(pz.fen));
    setSel(null);
    setMsg(null);
    setSolved(false);
  }, [pz.fen]);

  // draw — integer-scaled 12px squares, pixel-perfect
  useEffect(() => {
    const c = ref.current!;
    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const avail = Math.min(wrap.current!.clientWidth, 420) * dpr - 8 * dpr;
      const s = Math.max(1, Math.floor(avail / 96));
      geo.current = { s, dpr };
      c.width = c.height = 96 * s;
      c.style.width = c.style.height = (96 * s) / dpr + "px";
      const g = c.getContext("2d")!;
      g.imageSmoothingEnabled = false;
      const sol = pz.sol;
      for (let i = 0; i < 64; i++) {
        const f = i % 8,
          r = Math.floor(i / 8);
        const vx = flip ? 7 - f : f,
          vy = flip ? r : 7 - r;
        g.fillStyle = (f + r) % 2 ? "#9aa8f0" : "#5b3e9e";
        if (sel === i) g.fillStyle = "#ffd319";
        if (solved && (sq(i) === sol.slice(0, 2) || sq(i) === sol.slice(2))) g.fillStyle = "#7cff4f";
        g.fillRect(vx * 12 * s, vy * 12 * s, 12 * s, 12 * s);
        const p = state.b[i];
        if (p) g.drawImage(pieceCanvas(p), (vx * 12 + 1) * s, (vy * 12 + 1) * s, 10 * s, 10 * s);
      }
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(wrap.current!);
    return () => ro.disconnect();
  }, [state, sel, solved, flip, pz.sol]);

  const click = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (solved) return;
    const r = e.currentTarget.getBoundingClientRect();
    const vx = Math.floor(((e.clientX - r.left) / r.width) * 8);
    const vy = Math.floor(((e.clientY - r.top) / r.height) * 8);
    if (vx < 0 || vy < 0 || vx > 7 || vy > 7) return;
    const f = flip ? 7 - vx : vx,
      rk = flip ? vy : 7 - vy;
    const i = rk * 8 + f;
    const p = state.b[i];
    const mine = (pc: string | null) => !!pc && (pc === pc.toUpperCase()) === state.white;
    if (sel === null || mine(p)) {
      if (mine(p)) {
        setSel(i);
        play("click");
      }
      return;
    }
    const mv = sq(sel) + sq(i);
    if (mv === pz.sol) {
      const b = state.b.slice();
      b[i] = b[sel];
      b[sel] = null;
      setState({ ...state, b });
      setSel(null);
      setSolved(true);
      setMsg({ t: "# CHECKMATE! " + mv.slice(0, 2) + "→" + mv.slice(2), c: "var(--green)" });
      play("win");
      update((pr) => (pr.puzzles.includes(idx) ? pr : { ...pr, puzzles: [...pr.puzzles, idx] }));
    } else {
      setSel(null);
      setMsg({ t: "NOT MATE — TRY AGAIN", c: "var(--pink)" });
      setShake(true);
      setTimeout(() => setShake(false), 320);
      play("error");
    }
  };

  const solvedCount = progress.puzzles.length;
  return (
    <div className="puzzle">
      <div ref={wrap}>
        <canvas ref={ref} className={"board" + (shake ? " shake" : "")} onPointerDown={click} aria-label={`Chess puzzle: ${pz.name}. ${state.white ? "White" : "Black"} to move and mate in one.`} />
      </div>
      <div>
        <div className="h2" style={{ color: "var(--yellow)" }}>
          PUZZLE {idx + 1}/{PUZZLES.length} · {pz.name}
        </div>
        <p className="p">
          <b style={{ color: state.white ? "#fff" : "var(--purple)" }}>{state.white ? "WHITE" : "BLACK"}</b> to move. Find the move that delivers checkmate. Tap a piece, then its
          destination.
        </p>
        <div className="h2" style={{ color: msg?.c ?? "var(--dim)", minHeight: 18 }} aria-live="polite">
          {msg?.t ?? (sel !== null ? `SELECTED ${sq(sel).toUpperCase()}` : "YOUR MOVE…")}
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn ghost" onClick={() => setIdx((idx + PUZZLES.length - 1) % PUZZLES.length)}>
            ◀ PREV
          </button>
          <button className="btn" onClick={() => setIdx((idx + 1) % PUZZLES.length)}>
            {solved ? "NEXT PUZZLE ▶" : "SKIP ▶"}
          </button>
          {!solved && (
            <button className="btn ghost" style={{ "--c": "var(--cyan)" } as React.CSSProperties} onClick={() => setMsg({ t: `HINT: MOVE THE PIECE ON ${pz.sol.slice(0, 2).toUpperCase()}`, c: "var(--cyan)" })}>
              HINT
            </button>
          )}
        </div>
        <div className="muted" style={{ marginTop: 14, fontSize: 18 }}>
          Solved {solvedCount}/{PUZZLES.length} {solvedCount >= PUZZLES.length ? "— GRANDMASTER! ♛" : solvedCount >= 3 ? "— TACTICIAN ★" : "· solve 3 for an achievement"}
        </div>
      </div>
    </div>
  );
}
