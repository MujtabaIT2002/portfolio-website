"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { unlockAudio, sfx } from "@/game/audio";

const BANNER = [
  "    __  _____  __    ___________    ____  ___ ",
  "   /  |/  / / / /   / /_  __/   |  / __ )/   |",
  "  / /|_/ / / / /_  / / / / / /| | / __  / /| |",
  " / /  / / /_/ / /_/ / / / / ___ |/ /_/ / ___ |",
  "/_/  /_/\\____/\\____/ /_/ /_/  |_/_____/_/  |_|",
  "                                              ",
  "          _________    ____  ________         ",
  "         /_  __/   |  / __ \\/  _/ __ \\        ",
  "          / / / /| | / /_/ // // / / /        ",
  "         / / / ___ |/ _, _// // /_/ /         ",
  "        /_/ /_/  |_/_/ |_/___/\\___\\_\\         ",
].join("\n");

const NOISE = "!<>-_\\/[]{}—=+*^?#$%&@01";
const LOG = [
  ["mounting", "pixel_island.map"],
  ["spawning", "ascii_ocean @ 9Hz"],
  ["syncing", "chess.com/mujju2002"],
  ["loading", "quests · arcade · skills"],
];

export default function Boot({ onDone }: { onDone: () => void }) {
  const preRef = useRef<HTMLPreElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState(0);
  const [ready, setReady] = useState(false);
  const [out, setOut] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    unlockAudio();
    sfx("warp");
    setOut(true);
    setTimeout(onDone, 330);
  };

  // fit the banner to the screen width (pixel-perfect, never overflows)
  useLayoutEffect(() => {
    const fit = () => {
      const pre = preRef.current,
        box = boxRef.current;
      if (!pre || !box) return;
      pre.style.fontSize = "20px";
      const w = pre.scrollWidth;
      const avail = box.clientWidth;
      const size = Math.max(6, Math.min(22, Math.floor((20 * avail) / w)));
      pre.style.fontSize = size + "px";
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // decode animation: noise → banner
  useEffect(() => {
    const pre = preRef.current!;
    const quick = sessionStorage.getItem("mx.booted") === "1";
    const start = performance.now();
    const dur = quick ? 250 : 900;
    const chars = BANNER.split("");
    const order = chars.map((_, i) => ((i % 47) / 47) * 0.6 + Math.random() * 0.4);
    let raf = 0;
    const tick = (now: number) => {
      const k = (now - start) / dur;
      let s = "";
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        if (c === "\n" || c === " " || order[i] <= k) s += c;
        else s += NOISE[(Math.random() * NOISE.length) | 0];
      }
      pre.textContent = s;
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let n = 0;
    const iv = setInterval(
      () => {
        n++;
        setLines(n);
        if (n >= LOG.length) {
          clearInterval(iv);
          setReady(true);
          sessionStorage.setItem("mx.booted", "1");
        }
      },
      quick ? 60 : 230,
    );
    const auto = setTimeout(finish, quick ? 900 : 3800);
    const key = () => finish();
    window.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(iv);
      clearTimeout(auto);
      window.removeEventListener("keydown", key);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={"boot" + (out ? " out" : "")} onPointerDown={finish} role="dialog" aria-label="Loading MUJTABA.EXE">
      <div className="boot-inner" ref={boxRef}>
        <pre className="banner" ref={preRef} aria-label="Mujtaba Tariq">
          {BANNER}
        </pre>
        <div className="boot-sub">
          AI / FULL-STACK DEVELOPER
          <br />
          LLM FINE-TUNING · AUTOMATION SYSTEMS
        </div>
        <div className="boot-log" aria-hidden="true">
          {LOG.slice(0, lines).map(([a, b]) => (
            <div key={b}>
              &gt; {a} <span>{b}</span> … OK
            </div>
          ))}
        </div>
        <button className="press" style={{ visibility: ready ? "visible" : "hidden" }} onClick={finish}>
          ▶ PRESS ANY KEY / TAP TO START
        </button>
      </div>
    </div>
  );
}
