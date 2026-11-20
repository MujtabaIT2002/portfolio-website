"use client";

import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Engine } from "@/game/engine";
import { paintMinimap } from "@/game/art";
import { W, H } from "@/game/world";
import { sfx, setSfx, setMusic, unlockAudio, type Sfx } from "@/game/audio";
import { ZONES, PROJECTS, type ZoneId } from "@/data/cv";
import { CHESS_SNAPSHOT } from "@/lib/chessSnapshot";
import { fetchChessClient, type ChessData } from "@/lib/chess";
import { ACHIEVEMENTS, EMPTY, loadProgress, saveProgress, xpOf, levelOf, type Progress } from "./progress";
import { script, type DialogScript } from "./npcScripts";
import { PixIcon } from "./icons";
import Boot from "./Boot";
import Window from "./Window";
import Dialog from "./Dialog";
import Joystick from "./Joystick";
import type { PanelProps } from "./panels/types";

const loaders = {
  about: () => import("./panels/About"),
  quests: () => import("./panels/Quests"),
  arcade: () => import("./panels/Arcade"),
  skills: () => import("./panels/Skills"),
  chess: () => import("./panels/Chess"),
  mail: () => import("./panels/Mail"),
  terminal: () => import("./panels/Terminal"),
  help: () => import("./panels/Help"),
};
const PANELS = Object.fromEntries(Object.entries(loaders).map(([k, f]) => [k, lazy(f)])) as Record<
  keyof typeof loaders,
  React.LazyExoticComponent<React.ComponentType<PanelProps>>
>;

type PanelId = ZoneId | "help";

const TITLES: Record<PanelId, string> = {
  about: "HOME.EXE — ABOUT ME",
  quests: "QUESTS.LOG — EXPERIENCE",
  arcade: "ARCADE.ROM — PROJECTS",
  skills: "INVENTORY — SKILLS",
  chess: "CHESS_TOWER — mujju2002",
  mail: "POST_OFFICE — CONTACT",
  terminal: "guest@mujtaba.dev: ~",
  help: "HELP + ACHIEVEMENTS",
};

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];

interface Toast {
  id: number;
  title: string;
  desc: string;
}

export default function Portfolio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const hudTopRef = useRef<HTMLElement>(null);
  const hudBotRef = useRef<HTMLElement>(null);
  const perfRef = useRef<HTMLButtonElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const miniRef = useRef<HTMLCanvasElement>(null);

  const [booted, setBooted] = useState(false);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [dialog, setDialog] = useState<DialogScript | null>(null);
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sound, setSound] = useState(true);
  const [music, setMusicOn] = useState(false);
  const [perfOpen, setPerfOpen] = useState(false);
  const [rainbow, setRainbow] = useState(false);
  const [chess, setChess] = useState<ChessData>(CHESS_SNAPSHOT);
  const [touch, setTouch] = useState(false);

  const progressRef = useRef(progress);
  progressRef.current = progress;
  const panelRef = useRef(panel);
  panelRef.current = panel;
  const chessRef = useRef(chess);
  chessRef.current = chess;
  const talkCount = useRef<Record<string, number>>({});

  const play = useCallback((s: Sfx) => sfx(s), []);

  // ------------------------------------------------------------------ progress + achievements
  // Pure updater (React may call it twice in dev/StrictMode) — side effects live in the effect below.
  const update = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((prev) => {
      const next = fn(prev);
      if (next === prev) return prev;
      const got: string[] = [];
      const has = (a: string) => next.achievements.includes(a) || got.includes(a);
      const grant = (a: string, cond: boolean) => cond && !has(a) && got.push(a);
      grant("explorer", next.visited.length >= ZONES.length);
      grant("collector", next.gems.length >= 12);
      grant("social", ["robot", "knight", "cat"].every((n) => next.talked.includes(n)));
      grant("tactician", next.puzzles.length >= 3);
      grant("grandmaster", next.puzzles.length >= 6);
      grant("arcade", next.projects.length >= PROJECTS.length);
      return got.length ? { ...next, achievements: [...next.achievements, ...got] } : next;
    });
  }, []);

  const unlock = useCallback((a: string) => update((p) => (p.achievements.includes(a) ? p : { ...p, achievements: [...p.achievements, a] })), [update]);

  const toastId = useRef(0);
  const pushToast = useCallback((title: string, desc: string) => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((t) => [...t, { id, title, desc }]);
  }, []);

  const triggerRainbow = useCallback(() => {
    setRainbow(true);
    setTimeout(() => setRainbow(false), 12000);
  }, []);

  // toast auto-dismiss
  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => setToasts((ts) => ts.slice(1)), 3600);
    return () => clearTimeout(t);
  }, [toasts]);

  // persist progress + announce newly earned achievements (exactly once each)
  const prevAch = useRef<string[] | null>(null);
  useEffect(() => {
    if (prevAch.current === null) return; // not loaded from storage yet
    saveProgress(progress);
    const before = prevAch.current;
    prevAch.current = progress.achievements;
    const fresh = progress.achievements.filter((a) => !before.includes(a));
    if (!fresh.length) return;
    sfx("achieve");
    for (const a of fresh) pushToast("ACHIEVEMENT: " + ACHIEVEMENTS[a].name, `${ACHIEVEMENTS[a].desc} (+${ACHIEVEMENTS[a].xp} XP)`);
    if (fresh.includes("konami")) triggerRainbow();
  }, [progress, pushToast, triggerRainbow]);

  // ------------------------------------------------------------------ panels
  const openPanel = useCallback(
    (id: PanelId, warp = false) => {
      const eng = engineRef.current;
      if (warp && id !== "help" && eng) eng.warp(id as ZoneId);
      setDialog(null);
      setPanel(id);
      eng?.pause(true);
      play("open");
      if (id !== "help") update((p) => (p.visited.includes(id as ZoneId) ? p : { ...p, visited: [...p.visited, id as ZoneId] }));
    },
    [play, update],
  );

  const closePanel = useCallback(() => {
    const eng = engineRef.current;
    setPanel(null);
    play("close");
    if (eng) {
      eng.exitDoor();
      eng.pause(false);
    }
    requestAnimationFrame(() => canvasRef.current?.focus({ preventScroll: true }));
  }, [play]);

  // ------------------------------------------------------------------ engine
  useEffect(() => {
    const canvas = canvasRef.current!;
    const saved = loadProgress();
    prevAch.current = saved.achievements;
    setProgress(saved);
    setTouch(matchMedia("(pointer: coarse)").matches);

    const eng = new Engine(
      canvas,
      {
        enter: (zone) => openPanel(zone),
        talk: (id) => {
          const n = talkCount.current[id] ?? 0;
          talkCount.current[id] = n + 1;
          setDialog(script(id, chessRef.current, matchMedia("(pointer: coarse)").matches, n));
          sfx("talk");
          if (id === "robot" || id === "knight" || id === "cat")
            update((p) => (p.talked.includes(id) ? p : { ...p, talked: [...p.talked, id] }));
        },
        gem: (_taken, _total, index) => update((p) => (p.gems.includes(index) ? p : { ...p, gems: [...p.gems, index] })),
        tile: (x, y) => {
          const d = dotRef.current;
          if (d) d.style.transform = `translate(${x * 3}px, ${y * 3}px)`;
          setDialog((dl) => (dl && dl.who === "SIGNPOST" ? dl : dl ? null : dl));
        },
        stats: (s) => {
          const el = perfRef.current;
          if (!el) return;
          el.firstChild!.textContent = `⚡ ${s.ms.toFixed(2)}ms`;
          (el.lastChild as HTMLElement).textContent = `${Math.round(s.fps)}fps · worst ${s.max.toFixed(1)}ms · input ${s.input.toFixed(2)}ms`;
        },
        sfx: (n) => sfx(n),
      },
      saved.gems,
    );
    engineRef.current = eng;

    // minimap
    const mm = miniRef.current;
    if (mm) {
      const src = paintMinimap(eng.world);
      mm.width = W;
      mm.height = H;
      mm.getContext("2d")!.drawImage(src, 0, 0);
    }
    return () => {
      eng.destroy();
      engineRef.current = null;
    };
  }, [openPanel, update]);

  // keep camera centred between HUD bars
  useEffect(() => {
    const measure = () => {
      const t = hudTopRef.current?.getBoundingClientRect().bottom ?? 0;
      const b = hudBotRef.current ? window.innerHeight - hudBotRef.current.getBoundingClientRect().top : 0;
      engineRef.current?.setInsets(t, b);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (hudTopRef.current) ro.observe(hudTopRef.current);
    if (hudBotRef.current) ro.observe(hudBotRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [booted]);

  // ------------------------------------------------------------------ boot
  const onBooted = useCallback(() => {
    setBooted(true);
    engineRef.current?.start();
    unlock("boot");
    // warm up panel chunks while idle so first open is instant
    const idle = (window as unknown as { requestIdleCallback?: (f: () => void) => void }).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 300));
    idle(() => Object.values(loaders).forEach((l) => l()));
    if (!sessionStorage.getItem("mx.welcomed")) {
      sessionStorage.setItem("mx.welcomed", "1");
      setTimeout(() => setDialog(script("welcome", chessRef.current, matchMedia("(pointer: coarse)").matches, 0)), 450);
    }
  }, [unlock]);

  // live chess data (edge-cached API route, falls back to chess.com directly)
  useEffect(() => {
    if (!booted) return;
    let alive = true;
    fetch("/api/chess")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: ChessData) => {
        if (!alive) return;
        if (d.source === "live") setChess(d);
        else return fetchChessClient(CHESS_SNAPSHOT).then((c) => alive && setChess(c));
      })
      .catch(() => fetchChessClient(CHESS_SNAPSHOT).then((c) => alive && setChess(c)).catch(() => {}));
    return () => {
      alive = false;
    };
  }, [booted]);

  // ------------------------------------------------------------------ global keys
  useEffect(() => {
    const seq: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      unlockAudio();
      const tgt = e.target as HTMLElement;
      const typing = tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA");
      seq.push(e.code);
      if (seq.length > KONAMI.length) seq.shift();
      if (seq.join() === KONAMI.join()) {
        seq.length = 0;
        if (progressRef.current.achievements.includes("konami")) triggerRainbow();
        else unlock("konami");
      }
      if (e.code === "Escape") {
        if (panelRef.current) closePanel();
        else setDialog(null);
        return;
      }
      if (typing || panelRef.current || !booted) return;
      const z = ZONES.find((z) => z.key === e.key);
      if (z && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        openPanel(z.id, true);
        return;
      }
      if (e.code === "Backquote") {
        e.preventDefault();
        openPanel("terminal", true);
      } else if (e.code === "KeyM") toggleSound();
      else if (e.code === "KeyP") setPerfOpen((v) => !v);
      else if (e.code === "KeyH" || e.key === "?") openPanel("help");
    };
    const onFirst = () => unlockAudio();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onFirst, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onFirst);
    };
  }, [booted, openPanel, closePanel, unlock, triggerRainbow]);

  const toggleSound = () => {
    setSound((s) => {
      setSfx(!s);
      if (s) setMusicOn(false);
      return !s;
    });
  };
  const toggleMusic = () => {
    setMusicOn((m) => {
      setMusic(!m);
      if (!m) {
        setSound(true);
        setSfx(true);
      }
      return !m;
    });
  };

  const xp = useMemo(() => xpOf(progress), [progress]);
  const { lvl, frac } = levelOf(xp);
  const Panel = panel ? PANELS[panel] : null;
  const zone = ZONES.find((z) => z.id === panel);

  const panelProps: PanelProps = {
    progress,
    update,
    unlock,
    chess,
    play,
    close: closePanel,
    open: (id) => {
      closePanel();
      setTimeout(() => openPanel(id, true), 0);
    },
  };

  return (
    <div className={"stage" + (rainbow ? " rainbow" : "")}>
      <canvas ref={canvasRef} className="world" tabIndex={-1} aria-label="Pixel island map. Use arrow keys or tap to move." />

      <div className="hud" aria-hidden={!!panel}>
        <header className="hud-top" ref={hudTopRef}>
          <div className="badge pixbox">
            <div className="lvl">
              <div className="logo">MUJTABA.EXE</div>
              <div className="lvl-row">
                LV <b>{lvl}</b> · {xp} XP · {progress.gems.length}/12 ◆
              </div>
              <div className="xpbar" aria-hidden="true">
                <i style={{ transform: `scaleX(${frac.toFixed(3)})` }} />
              </div>
            </div>
          </div>
          <div className="tools">
            {(perfOpen || !touch) && (
              <button className="perf" ref={perfRef} onClick={() => setPerfOpen((v) => !v)} title="Frame time (press P)">
                <span>⚡ --ms</span>
                <small style={{ display: perfOpen ? "block" : "none" }}>measuring…</small>
              </button>
            )}
            <button className="tbtn" aria-pressed={sound} aria-label="Sound effects (M)" onClick={toggleSound}>
              <PixIcon name={sound ? "sound" : "mute"} color="#00e5ff" />
            </button>
            <button className="tbtn" aria-pressed={music} aria-label="Chiptune music" onClick={toggleMusic}>
              <PixIcon name="music" color="#ff2e88" />
            </button>
            <button className="tbtn" aria-label="Help and achievements (H)" onClick={() => openPanel("help")}>
              <PixIcon name="trophy" color="#ffd319" />
            </button>
          </div>
        </header>

        <div className="hud-mid">
          <div className="toasts" aria-live="polite">
            {toasts.slice(0, 2).map((t) => (
              <div className="toast pixbox" key={t.id}>
                <span className="ti">★</span>
                <div>
                  <div className="tt">{t.title}</div>
                  <div className="td">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="minimap pixbox">
            <canvas
              ref={miniRef}
              aria-label="Minimap — click to walk there"
              onPointerDown={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                engineRef.current?.walkTo(Math.floor(((e.clientX - r.left) / r.width) * W), Math.floor(((e.clientY - r.top) / r.height) * H));
              }}
            />
            <div className="dot" ref={dotRef} />
          </div>
          {touch && booted && !panel && (
            <Joystick
              onDir={(d) => engineRef.current?.setStick(d)}
              onAction={() => {
                unlockAudio();
                // same path as the E key: advances an open dialog, otherwise talks / enters
                window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyE", key: "e", bubbles: true }));
              }}
            />
          )}
        </div>

        <footer className="hud-bottom" ref={hudBotRef}>
          {dialog && <Dialog script={dialog} onClose={() => setDialog(null)} touch={touch} />}
          <nav className="dock pixbox" aria-label="Fast travel">
            {ZONES.map((z) => (
              <button
                key={z.id}
                className={progress.visited.includes(z.id) ? "seen" : ""}
                style={{ "--c": z.color } as React.CSSProperties}
                onClick={() => openPanel(z.id, true)}
                aria-label={`${z.name} (${z.key})`}
                title={`${z.name} — press ${z.key}`}
              >
                <span className="key">{z.key}</span>
                <PixIcon name={z.id} color={z.color} />
                <span className="lbl">{z.label}</span>
              </button>
            ))}
          </nav>
        </footer>
      </div>

      {Panel && panel && (
        <Window title={TITLES[panel]} color={zone?.color ?? "#ffd319"} onClose={closePanel}>
          <Suspense fallback={<div className="loading">LOADING…</div>}>
            <Panel {...panelProps} />
          </Suspense>
        </Window>
      )}

      {!booted && <Boot onDone={onBooted} />}
    </div>
  );
}
