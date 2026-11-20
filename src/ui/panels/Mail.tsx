"use client";
import { useEffect, useRef, useState } from "react";
import { LINKS, PROFILE } from "@/data/cv";
import type { PanelProps } from "./types";

const COLORS = ["var(--green)", "var(--cyan)", "var(--purple)", "var(--yellow)", "var(--pink)", "var(--orange)"];

function Envelope({ flying }: { flying: boolean }) {
  const ref = useRef<HTMLPreElement>(null);
  useEffect(() => {
    if (!flying) return;
    const el = ref.current!;
    let x = 0;
    const id = setInterval(() => {
      x = (x + 1) % 26;
      const trail = "~".repeat(Math.max(0, x - 1)).padEnd(26, " ");
      el.textContent = [" ".repeat(x) + " _____", trail.slice(0, x) + "|\\___/|", " ".repeat(x) + "|_____|  >>"].join("\n");
    }, 45);
    return () => clearInterval(id);
  }, [flying]);
  return (
    <pre className="envelope" ref={ref} aria-hidden="true">
      {" _____\n|\\___/|\n|_____|"}
    </pre>
  );
}

export default function Mail({ play }: PanelProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const sid = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const tid = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const key = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (!sid || !tid || !key) {
      // no EmailJS keys configured → hand off to the visitor's mail app
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent("Hello from your portfolio")}&body=${body}`;
      return;
    }
    setState("sending");
    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.send(sid, tid, { name: form.name, email: form.email, message: form.message }, key);
      setState("sent");
      play("win");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setState("error");
      play("error");
    }
  };

  return (
    <div className="mail">
      <div>
        <h2 className="h1">SEND A PIGEON</h2>
        <p className="p">Open to applied ML, AI engineering and LLM-tooling roles — and to good chess games. Pick a channel:</p>
        <div className="links">
          {LINKS.map((l, i) => (
            <a key={l.id} className="link" href={l.href} target={l.id === "email" ? undefined : "_blank"} rel="noreferrer" style={{ "--c": COLORS[i % COLORS.length] } as React.CSSProperties}>
              <span className="ln">{l.label}</span>
              <span className="lt">{l.text}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
      <form onSubmit={send} className="card" style={{ "--c": "var(--green)" } as React.CSSProperties}>
        <Envelope flying={state === "sending"} />
        <div className="field">
          <label htmlFor="m-name">NAME</label>
          <input id="m-name" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="m-email">EMAIL</label>
          <input id="m-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="m-msg">MESSAGE</label>
          <textarea id="m-msg" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <button className="btn" type="submit" disabled={state === "sending"} style={{ "--c": "var(--green)", width: "100%" } as React.CSSProperties}>
          {state === "sending" ? "TRANSMITTING…" : "▶ SEND MESSAGE"}
        </button>
        <div className="h2" style={{ marginTop: 10, marginBottom: 0, color: state === "error" ? "var(--pink)" : "var(--green)" }} aria-live="polite">
          {state === "sent" ? "MESSAGE DELIVERED ✓ — I'LL REPLY SOON" : state === "error" ? "TRANSMISSION FAILED — TRY EMAIL" : ""}
        </div>
      </form>
    </div>
  );
}
