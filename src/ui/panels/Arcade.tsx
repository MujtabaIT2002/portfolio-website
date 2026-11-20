"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/data/cv";
import type { PanelProps } from "./types";

const cache = new Map<string, HTMLImageElement>();
function loadImg(src: string) {
  let im = cache.get(src);
  if (!im) {
    im = new Image();
    im.decoding = "async";
    im.src = src;
    cache.set(src, im);
  }
  return im;
}

/** Project screenshot that "de-pixelates" into focus like an old console boot. */
function Screen({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const g = c.getContext("2d")!;
    const im = loadImg(src);
    let raf = 0;
    const tmp = document.createElement("canvas");
    const tg = tmp.getContext("2d")!;
    const run = () => {
      const dpr = window.devicePixelRatio || 1;
      const W = Math.max(1, Math.round(c.clientWidth * dpr));
      const H = Math.max(1, Math.round(c.clientHeight * dpr));
      c.width = W;
      c.height = H;
      // cover-fit crop
      const ir = im.naturalWidth / im.naturalHeight;
      const cr = W / H;
      let sw = im.naturalWidth,
        sh = im.naturalHeight,
        sx = 0,
        sy = 0;
      if (ir > cr) {
        sw = sh * cr;
        sx = (im.naturalWidth - sw) / 2;
      } else {
        sh = sw / cr;
        sy = (im.naturalHeight - sh) / 2;
      }
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 520);
        const block = Math.max(1, Math.round(48 * Math.pow(1 - k, 2.2)));
        const w = Math.max(1, Math.ceil(W / block));
        const h = Math.max(1, Math.ceil(H / block));
        tmp.width = w;
        tmp.height = h;
        tg.imageSmoothingEnabled = true;
        tg.drawImage(im, sx, sy, sw, sh, 0, 0, w, h);
        g.imageSmoothingEnabled = block === 1;
        g.drawImage(tmp, 0, 0, w, h, 0, 0, w * block, h * block);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    if (im.complete && im.naturalWidth) run();
    else im.onload = run;
    return () => {
      cancelAnimationFrame(raf);
      im.onload = null;
    };
  }, [src]);
  return <canvas ref={ref} role="img" aria-label={title + " screenshot"} />;
}

export default function Arcade({ progress, update, play }: PanelProps) {
  const [i, setI] = useState(0);
  const p = PROJECTS[i];
  const swipe = useRef<number | null>(null);

  const go = useCallback(
    (d: number) => {
      setI((v) => (v + d + PROJECTS.length) % PROJECTS.length);
      play("click");
    },
    [play],
  );

  useEffect(() => {
    update((pr) => (pr.projects.includes(p.id) ? pr : { ...pr, projects: [...pr.projects, p.id] }));
    // preload neighbours
    loadImg(PROJECTS[(i + 1) % PROJECTS.length].img);
  }, [i, p.id, update]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.code === "ArrowRight" || e.code === "KeyD") go(1);
      else if (e.code === "ArrowLeft" || e.code === "KeyA") go(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div className="arcade">
      <div className="cabinet">
        <div className="marquee">
          * INSERT COIN * {String(i + 1).padStart(2, "0")}/{String(PROJECTS.length).padStart(2, "0")}
        </div>
        <div
          className="screen"
          onPointerDown={(e) => (swipe.current = e.clientX)}
          onPointerUp={(e) => {
            if (swipe.current === null) return;
            const dx = e.clientX - swipe.current;
            swipe.current = null;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          }}
        >
          <Screen src={p.img} title={p.title} />
        </div>
        <div className="controls">
          <button className="btn" onClick={() => go(-1)} aria-label="Previous project">
            {"<"}
          </button>
          <div className="dots">
            {PROJECTS.map((q, k) => (
              <button
                key={q.id}
                aria-label={q.title}
                aria-current={k === i}
                className={progress.projects.includes(q.id) ? "seen" : ""}
                onClick={() => {
                  setI(k);
                  play("click");
                }}
              />
            ))}
          </div>
          <button className="btn" onClick={() => go(1)} aria-label="Next project">
            {">"}
          </button>
        </div>
      </div>
      <div key={p.id}>
        <span className="chip" style={{ "--c": "var(--pink)" } as React.CSSProperties}>
          {p.tag}
        </span>
        <h2 className="h1" style={{ marginTop: 12 }}>
          {p.title}
        </h2>
        <p className="p">{p.blurb}</p>
        <ul className="objectives" style={{ marginTop: 0 }}>
          {p.points.map((x, k) => (
            <li key={k} style={{ animationDelay: `${k * 70}ms` }}>
              <span>{x}</span>
            </li>
          ))}
        </ul>
        <div className="chips" style={{ marginBottom: 16 }}>
          {p.stack.map((s, k) => (
            <span className="chip" key={s} style={{ "--c": ["var(--cyan)", "var(--yellow)", "var(--green)", "var(--purple)"][k % 4] } as React.CSSProperties}>
              {s}
            </span>
          ))}
        </div>
        <div className="row">
          {p.code && (
            <a className="btn" href={p.code} target="_blank" rel="noreferrer">
              {"</>"} SOURCE
            </a>
          )}
          {p.demo && (
            <a className="btn ghost" style={{ "--c": "var(--cyan)" } as React.CSSProperties} href={p.demo} target="_blank" rel="noreferrer">
              ▶ {p.demoLabel ?? "DEMO"}
            </a>
          )}
          {!p.code && !p.demo && <span className="muted">Private codebase — happy to walk through it in an interview.</span>}
        </div>
      </div>
    </div>
  );
}
