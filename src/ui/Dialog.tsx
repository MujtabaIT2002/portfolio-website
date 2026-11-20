"use client";
import { useEffect, useRef, useState } from "react";
import { sfx } from "@/game/audio";
import type { DialogScript } from "./npcScripts";

export default function Dialog({ script, onClose, touch }: { script: DialogScript; onClose: () => void; touch: boolean }) {
  const [line, setLine] = useState(0);
  const [shown, setShown] = useState(0);
  const text = script.lines[line] ?? "";
  const done = shown >= text.length;
  const state = useRef({ done, line, total: script.lines.length });
  state.current = { done, line, total: script.lines.length };

  useEffect(() => {
    setLine(0);
    setShown(0);
  }, [script]);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setShown((s) => {
        if (s % 4 === 0) sfx("talk");
        return Math.min(text.length, s + 2);
      });
    }, 22);
    return () => clearInterval(id);
  }, [text, done]);

  const advance = () => {
    const s = state.current;
    if (!s.done) setShown(Infinity);
    else if (s.line + 1 < s.total) {
      setLine(s.line + 1);
      setShown(0);
    } else onClose();
  };
  const advRef = useRef(advance);
  advRef.current = advance;

  // E / Enter / Space advance the dialog before the engine sees them
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyE" || e.code === "Enter" || e.code === "Space") {
        const t = e.target as HTMLElement;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "BUTTON")) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        advRef.current();
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, []);

  return (
    <div className="dialog pixbox" style={{ "--accent": script.color } as React.CSSProperties} onClick={advance} role="status">
      <div className="who" style={{ color: script.color }}>
        <span>{script.who}</span>
        <small>
          {line + 1}/{script.lines.length} · {touch ? "TAP" : "E / CLICK"} ▸
        </small>
      </div>
      <p>
        {text.slice(0, shown)}
        {done && <span className="caret" />}
      </p>
    </div>
  );
}
