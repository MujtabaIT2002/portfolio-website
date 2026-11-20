"use client";
import { useEffect, useRef } from "react";

export default function Window({ title, color, onClose, children }: { title: string; color: string; onClose: () => void; children: React.ReactNode }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    bodyRef.current?.focus({ preventScroll: true });
    return () => prev?.focus?.({ preventScroll: true });
  }, []);
  return (
    <div className="overlay" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="win" role="dialog" aria-modal="true" aria-label={title} style={{ "--accent": color } as React.CSSProperties}>
        <header className="win-bar">
          <span className="win-title">▓ {title}</span>
          <span className="win-hint">ESC TO EXIT</span>
          <button className="win-x" onClick={onClose} aria-label="Close">
            X
          </button>
        </header>
        <div className="win-body" ref={bodyRef} tabIndex={-1}>
          {children}
        </div>
      </section>
    </div>
  );
}
