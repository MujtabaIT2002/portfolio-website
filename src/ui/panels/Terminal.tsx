"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE, EXPERIENCE, PROJECTS, SKILLS, LINKS, ZONES, type ZoneId } from "@/data/cv";
import type { PanelProps } from "./types";

type Line = { t: string; c?: "cmd" | "err" | "acc" | "art" };

const LOGO = " __  __ _____\n|  \\/  |_   _|\n| |\\/| | | |\n|_|  |_| |_|";

const TRAIN = [
  String.raw`      ====        ________                ___________ `,
  String.raw`  _D _|  |_______/        \__I_I_____===__|_________| `,
  String.raw`   |(_)---  |   H\________/ |   |        =|___ ___|  `,
  String.raw`   /     |  |   H  |  |     |   |         ||_| |_||  `,
  String.raw`  |      |  |   H  |__--------------------| [___] |  `,
  String.raw`  | ________|___H__/__|_____/[][]~\_______|       |  `,
  String.raw`  |/ |   |-----------I_____I [][] []  D   |=======|__`,
];

const COMMANDS = ["help", "whoami", "about", "experience", "projects", "skills", "chess", "contact", "cv", "neofetch", "sl", "matrix", "open", "ls", "cat", "echo", "date", "history", "clear", "sudo", "exit"];

const FILES: Record<string, string> = {
  "about.txt": PROFILE.summary,
  "contact.txt": LINKS.map((l) => `${l.label.padEnd(10)} ${l.text}`).join("\n"),
  "secret.txt": "There are 12 gems on the island. The cat knows where one of them is. (It doesn't.)",
};

export default function Terminal({ chess, unlock, open, close, play }: PanelProps) {
  const [lines, setLines] = useState<Line[]>([
    { t: "MujtabaOS v2.0 — pixel edition. Type 'help' to list commands.", c: "acc" },
    { t: "Tip: TAB completes, ↑/↓ recalls history.", c: undefined },
  ]);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const [matrix, setMatrix] = useState(false);
  const outRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLInputElement>(null);
  const rainRef = useRef<HTMLCanvasElement>(null);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    inRef.current?.focus({ preventScroll: true });
    const t = timers.current;
    return () => t.forEach(clearInterval);
  }, []);
  useEffect(() => {
    const o = outRef.current;
    if (o) o.scrollTop = o.scrollHeight;
  }, [lines]);

  // matrix rain overlay
  useEffect(() => {
    if (!matrix) return;
    const c = rainRef.current!;
    const g = c.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    c.width = c.clientWidth * dpr;
    c.height = c.clientHeight * dpr;
    const fs = 16 * dpr;
    const cols = Math.ceil(c.width / (fs * 0.6));
    const drops = Array.from({ length: cols }, () => Math.random() * -40);
    const chars = "01アイウエオカキクケコ<>/{}[]#$%&*+=MUJTABA";
    g.font = `${fs}px monospace`;
    let raf = 0,
      last = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < 40) return;
      last = now;
      g.fillStyle = "rgba(5,3,15,0.22)";
      g.fillRect(0, 0, c.width, c.height);
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * fs;
        g.fillStyle = Math.random() < 0.08 ? "#ffffff" : i % 7 === 0 ? "#ff2e88" : "#7cff4f";
        g.fillText(chars[(Math.random() * chars.length) | 0], i * fs * 0.6, y);
        drops[i] = y > c.height && Math.random() > 0.96 ? 0 : drops[i] + 1;
      }
      if (now - t0 > 4500) {
        cancelAnimationFrame(raf);
        setMatrix(false);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [matrix]);

  const print = (...ls: Line[]) => setLines((p) => [...p, ...ls].slice(-400));

  const runTrain = () => {
    const width = 70;
    let x = width;
    const id = setInterval(() => {
      x -= 2;
      const frame = TRAIN.map((r) => {
        const padded = " ".repeat(Math.max(0, x)) + r.slice(Math.max(0, -x));
        return padded.slice(0, width);
      }).join("\n");
      setLines((p) => {
        const copy = p.slice();
        if (copy.length && copy[copy.length - 1].c === "art" && copy[copy.length - 1].t.startsWith("​")) copy[copy.length - 1] = { t: "​" + frame, c: "art" };
        else copy.push({ t: "​" + frame, c: "art" });
        return copy;
      });
      if (x < -TRAIN[0].length) {
        clearInterval(id);
        print({ t: "choo choo! (you meant 'ls')", c: "acc" });
      }
    }, 40);
    timers.current.push(id);
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    print({ t: `guest@mujtaba.dev:~$ ${cmd}`, c: "cmd" });
    if (!cmd) return;
    setHist((h) => [...h, cmd]);
    const flat = cmd.toLowerCase().replace(/\s+/g, " ");
    if (flat === "up up down down left right left right b a" || flat.replace(/ /g, "") === "↑↑↓↓←→←→ba") {
      print({ t: "30 LIVES GRANTED. ░▒▓ RAINBOW MODE ▓▒░", c: "acc" });
      unlock("konami");
      return;
    }
    const [name, ...args] = cmd.split(/\s+/);
    const a = args.join(" ");
    const zoneIds = ZONES.map((z) => z.id) as string[];
    switch (name.toLowerCase()) {
      case "help":
        print({
          t: [
            "whoami        who is this guy",
            "about         summary",
            "experience    quest log",
            "projects      arcade roms",
            "skills        inventory",
            "chess         live elo",
            "contact       ways to reach me",
            "cv            download résumé",
            "neofetch      system info",
            "open <zone>   " + zoneIds.join(" | "),
            "ls / cat      browse files",
            "sl · matrix   ascii toys",
            "sudo ...      try it",
            "clear · exit",
          ].join("\n"),
        });
        break;
      case "whoami":
        print({ t: `${PROFILE.name} — ${PROFILE.title}\n${PROFILE.tagline}\n${PROFILE.location}`, c: "acc" });
        break;
      case "about":
        print({ t: PROFILE.summary });
        break;
      case "experience":
      case "xp":
        print(...EXPERIENCE.map((r) => ({ t: `[${r.end ? "✓" : "●"}] ${r.start} – ${r.end ?? "now"}  ${r.role} @ ${r.company}` })));
        break;
      case "projects":
        print(...PROJECTS.map((p, i) => ({ t: `${String(i + 1).padStart(2, "0")}. ${p.title} — ${p.tag.toLowerCase()}` })));
        break;
      case "skills":
        print(...SKILLS.map((g) => ({ t: `${g.label.padEnd(14)} ${g.items.map((i) => i.name).join(", ")}` })));
        break;
      case "chess":
        print(
          { t: `chess.com/${chess.profile.username} (${chess.source})`, c: "acc" },
          ...chess.modes.map((m) => ({ t: `${m.label.padEnd(8)} ${String(m.rating).padStart(4)}   peak ${m.best ?? "-"}   ${m.win}W/${m.loss}L/${m.draw}D` })),
        );
        break;
      case "contact":
        print({ t: FILES["contact.txt"] });
        break;
      case "cv":
        print({ t: "downloading Mujtaba_CV.pdf …", c: "acc" });
        window.open(PROFILE.cv, "_blank");
        break;
      case "neofetch": {
        const m = Object.fromEntries(chess.modes.map((x) => [x.key, x.rating]));
        print(
          { t: LOGO, c: "art" },
          {
            t: [
              "guest@mujtaba.dev",
              "-----------------",
              "OS      MujtabaOS (pixel edition)",
              `Host    ${PROFILE.location}`,
              "Uptime  2+ years in production",
              `Role    ${PROFILE.title}`,
              `Quest   ${EXPERIENCE[0].role} @ ${EXPERIENCE[0].company}`,
              "Stack   PyTorch · Transformers · React · Node · Docker",
              "LLM     Phi-3 Mini · QLoRA · 4-bit NF4",
              `Chess   rapid ${m.rapid ?? "-"} · blitz ${m.blitz ?? "-"} · bullet ${m.bullet ?? "-"}`,
            ].join("\n"),
            c: "acc",
          },
        );
        break;
      }
      case "ls":
        print({ t: Object.keys(FILES).join("   ") + "   projects/   quests/" });
        break;
      case "cat":
        if (FILES[a]) print({ t: FILES[a] });
        else print({ t: `cat: ${a || "?"}: No such file`, c: "err" });
        break;
      case "echo":
        print({ t: a });
        break;
      case "date":
        print({ t: new Date().toString() });
        break;
      case "history":
        print({ t: hist.map((h, i) => `${i + 1}  ${h}`).join("\n") || "(empty)" });
        break;
      case "clear":
        setLines([]);
        break;
      case "sl":
        runTrain();
        break;
      case "matrix":
        print({ t: "wake up, recruiter…", c: "acc" });
        setMatrix(true);
        break;
      case "open":
        if (zoneIds.includes(a)) {
          if (a === "terminal") print({ t: "you're already here :)", c: "acc" });
          else open(a as ZoneId);
        } else print({ t: `open: unknown zone '${a}'. try: ${zoneIds.join(", ")}`, c: "err" });
        break;
      case "sudo":
        if (/hire\s+mujtaba/i.test(a)) {
          print(
            { t: "[sudo] password for guest: ********", c: "cmd" },
            { t: "Access granted. Scheduling interview…\n████████████████████ 100%\nExcellent choice. Opening the post office ✉", c: "acc" },
          );
          unlock("hacker");
          play("win");
          setTimeout(() => open("mail"), 1600);
        } else print({ t: `guest is not in the sudoers file. This incident will be reported.\n(hint: sudo hire mujtaba)`, c: "err" });
        break;
      case "exit":
        close();
        break;
      default:
        print({ t: `command not found: ${name}. type 'help'`, c: "err" });
        play("error");
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
      setHi(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1);
      if (hist[n] !== undefined) {
        setHi(n);
        setInput(hist[n]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = hi + 1;
      if (n >= hist.length || hi < 0) {
        setHi(-1);
        setInput("");
      } else {
        setHi(n);
        setInput(hist[n]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const [first, ...rest] = input.split(" ");
      if (!rest.length) {
        const m = COMMANDS.filter((c) => c.startsWith(first.toLowerCase()));
        if (m.length === 1) setInput(m[0] + " ");
        else if (m.length > 1) print({ t: m.join("  ") });
      } else if (first === "open" || first === "cat") {
        const pool = first === "open" ? ZONES.map((z) => z.id as string) : Object.keys(FILES);
        const m = pool.filter((z) => z.startsWith(rest.join(" ")));
        if (m.length === 1) setInput(`${first} ${m[0]}`);
      }
    } else if (e.key.length === 1) play("type");
  };

  return (
    <div className="term" onClick={() => inRef.current?.focus({ preventScroll: true })}>
      <div className="term-out" ref={outRef} aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} className={l.c}>
            {l.t}
          </div>
        ))}
      </div>
      <label className="term-in">
        <span>guest@mujtaba.dev:~$</span>
        <input
          ref={inRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="send"
          aria-label="Terminal command"
        />
      </label>
      {matrix && <canvas ref={rainRef} className="rain" aria-hidden="true" />}
    </div>
  );
}
