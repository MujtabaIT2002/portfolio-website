"use client";
import { useRef } from "react";

/**
 * Pixel-style virtual joystick + A button for touch screens.
 * The knob moves via a direct style write (no React re-render per touch move);
 * the engine is only told when the 4-way direction actually changes.
 */
export default function Joystick({ onDir, onAction }: { onDir: (d: number | null) => void; onAction: () => void }) {
  const knob = useRef<HTMLDivElement>(null);
  const state = useRef({ id: -1, cx: 0, cy: 0, dir: null as number | null, R: 40 });

  const setDir = (d: number | null) => {
    if (d === state.current.dir) return;
    state.current.dir = d;
    if (d !== null) navigator.vibrate?.(6);
    onDir(d);
  };

  const move = (x: number, y: number) => {
    const s = state.current;
    let dx = x - s.cx,
      dy = y - s.cy;
    const len = Math.hypot(dx, dy);
    if (len > s.R) {
      dx = (dx / len) * s.R;
      dy = (dy / len) * s.R;
    }
    // snap knob to a 4px grid so it moves like a sprite
    const kx = Math.round(dx / 4) * 4,
      ky = Math.round(dy / 4) * 4;
    if (knob.current) knob.current.style.transform = `translate(${kx}px, ${ky}px)`;
    if (len < 12) return setDir(null);
    setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 3 : 2) : dy > 0 ? 0 : 1);
  };

  const end = () => {
    state.current.id = -1;
    if (knob.current) knob.current.style.transform = "translate(0px, 0px)";
    setDir(null);
  };

  return (
    <>
      <div
        className="stick"
        role="application"
        aria-label="Joystick: drag to walk"
        onPointerDown={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const s = state.current;
          s.id = e.pointerId;
          s.cx = r.left + r.width / 2;
          s.cy = r.top + r.height / 2;
          s.R = r.width * 0.36;
          e.currentTarget.setPointerCapture(e.pointerId);
          move(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => e.pointerId === state.current.id && move(e.clientX, e.clientY)}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span className="ar u">▲</span>
        <span className="ar d">▼</span>
        <span className="ar l">◀</span>
        <span className="ar r">▶</span>
        <div className="knob" ref={knob} />
      </div>
      <button
        className="abtn"
        aria-label="Action: talk, enter, next"
        onPointerDown={(e) => {
          e.preventDefault();
          navigator.vibrate?.(10);
          onAction();
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        A
      </button>
    </>
  );
}
