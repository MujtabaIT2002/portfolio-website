"use client";
import { useEffect, useRef } from "react";
import { PROFILE, EXPERIENCE, PROJECTS, LINKS } from "@/data/cv";
import { SPRITES, PAL } from "@/game/spriteData";
import type { PanelProps } from "./types";

const GLYPH: Record<string, string> = { k: "#", h: "%", H: "&", s: "*", S: "+", e: "@", w: "'", c: "=", C: "x", m: "o", p: "|", P: "!" };
const NOISE = "#%&*+=@$?!/\\<>~^:;01";

/** The player sprite, re-drawn as live coloured ASCII. */
function AsciiAvatar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const g = c.getContext("2d")!;
    const rows = SPRITES.p_down_0;
    const N = 16,
      M = 2; // margin in pixels
    let raf = 0,
      last = 0;
    const start = performance.now();
    const reveal = rows.map((r, y) => r.split("").map((_, x) => 60 + y * 26 + x * 6 + Math.random() * 120));
    const ptr = { x: -99, y: -99 };
    let P = 10,
      mw = 5;
    const size = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(c.clientWidth * dpr);
      P = Math.floor(w / (N + M * 2));
      c.width = c.height = P * (N + M * 2);
      g.font = `${P}px ${getComputedStyle(document.body).getPropertyValue("--font-term") || "monospace"}, monospace`;
      g.textBaseline = "top";
      mw = g.measureText("M").width || P / 2;
    };
    size();
    document.fonts?.ready.then(size);
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      ptr.x = ((e.clientX - r.left) / r.width) * (N + M * 2) - M;
      ptr.y = ((e.clientY - r.top) / r.height) * (N + M * 2) - M;
    };
    const onLeave = () => {
      ptr.x = ptr.y = -99;
    };
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerleave", onLeave);

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 50) return; // ~20fps is plenty for ASCII
      last = now;
      const t = now - start;
      g.clearRect(0, 0, c.width, c.height);
      const blink = t % 3400 < 160;
      const scan = (t / 70) % (N + 10) - 5;
      const glitchRow = t % 2600 < 120 ? Math.floor((t / 2600) * 7) % N : -1;
      const bob = Math.round(Math.sin(t / 500));
      // faint dot field
      g.fillStyle = "#2c1d63";
      for (let y = 0; y < N + M * 2; y++) for (let x = 0; x < N + M * 2; x += 1) if ((x + y) % 3 === 0) g.fillText(".", x * P + P / 4, y * P);
      for (let y = 0; y < N; y++) {
        const row = rows[y];
        const off = y === glitchRow ? (Math.random() < 0.5 ? -1 : 1) : 0;
        for (let x = 0; x < N; x++) {
          const ch = row[x];
          if (ch === ".") continue;
          let glyph = GLYPH[ch] ?? "#";
          let color = PAL[ch];
          if (blink && ch === "e") glyph = "-";
          const dx = x - ptr.x,
            dy = y - ptr.y;
          if (t < reveal[y][x] || dx * dx + dy * dy < 4.5) {
            glyph = NOISE[(Math.random() * NOISE.length) | 0];
            color = t < reveal[y][x] ? "#3d2a80" : "#ff2e88";
          }
          if (Math.abs(y - scan) < 0.8) color = "#ffffff";
          if (ch === "k") color = "#8f7ad9";
          g.fillStyle = color;
          const px = (x + M + off) * P,
            py = (y + M + bob * 0.25) * P;
          const sx = P / 2 / mw;
          g.setTransform(sx, 0, 0, 1, px, py);
          g.fillText(glyph, 0, 0);
          g.setTransform(sx, 0, 0, 1, px + P / 2, py);
          g.fillText(glyph, 0, 0);
          g.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      c.removeEventListener("pointermove", onMove);
      c.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return <canvas ref={ref} className="avatar" aria-label="ASCII portrait of Mujtaba's pixel avatar" />;
}

export default function About({ open }: PanelProps) {
  const gh = LINKS.find((l) => l.id === "github")!;
  const li = LINKS.find((l) => l.id === "linkedin")!;
  return (
    <div className="about">
      <div className="avatar-box">
        <AsciiAvatar />
        <div className="stats">
          <div className="stat card">
            <b>2+</b>
            <span>YEARS</span>
          </div>
          <div className="stat card">
            <b>{EXPERIENCE.length}</b>
            <span>ROLES</span>
          </div>
          <div className="stat card">
            <b>{PROJECTS.length}</b>
            <span>PROJECTS</span>
          </div>
        </div>
      </div>
      <div>
        <h1 className="h1">{PROFILE.name.toUpperCase()}</h1>
        <div className="h2" style={{ color: "var(--pink)" }}>
          {PROFILE.title} · {PROFILE.tagline}
        </div>
        <p className="p">{PROFILE.summary}</p>
        <dl className="kv">
          <dt>BASE</dt>
          <dd>{PROFILE.location}</dd>
          <dt>NOW</dt>
          <dd>
            {EXPERIENCE[0].role} @ {EXPERIENCE[0].company}
          </dd>
          <dt>EDU</dt>
          <dd>
            {PROFILE.education.degree} — {PROFILE.education.school} ({PROFILE.education.dates}) · CGPA {PROFILE.education.cgpa}
          </dd>
          <dt>LANG</dt>
          <dd>{PROFILE.languages.join(" · ")}</dd>
          <dt>SEEKING</dt>
          <dd>Applied ML · AI Engineering · LLM tooling</dd>
        </dl>
        <div className="row">
          <a className="btn" href={PROFILE.cv} download="Mujtaba_Tariq_CV.pdf">
            ↓ DOWNLOAD CV
          </a>
          <a className="btn ghost" style={{ "--c": "var(--cyan)" } as React.CSSProperties} href={gh.href} target="_blank" rel="noreferrer">
            GITHUB
          </a>
          <a className="btn ghost" style={{ "--c": "var(--pink)" } as React.CSSProperties} href={li.href} target="_blank" rel="noreferrer">
            LINKEDIN
          </a>
          <button className="btn ghost" style={{ "--c": "var(--green)" } as React.CSSProperties} onClick={() => open("mail")}>
            ✉ CONTACT
          </button>
        </div>
      </div>
    </div>
  );
}
