import type { ZoneId } from "@/data/cv";

export interface Progress {
  visited: ZoneId[];
  gems: number[];
  talked: string[];
  puzzles: number[];
  projects: string[];
  achievements: string[];
  commands: number;
}

export const ACHIEVEMENTS: Record<string, { name: string; desc: string; xp: number }> = {
  boot: { name: "HELLO WORLD", desc: "Booted MUJTABA.EXE", xp: 50 },
  explorer: { name: "EXPLORER", desc: "Visited all 7 buildings", xp: 200 },
  collector: { name: "BIT HOARDER", desc: "Collected all 12 gems", xp: 200 },
  social: { name: "PEOPLE PERSON", desc: "Talked to every NPC", xp: 100 },
  tactician: { name: "TACTICIAN", desc: "Solved 3 mate-in-1 puzzles", xp: 150 },
  grandmaster: { name: "GRANDMASTER", desc: "Solved every puzzle", xp: 200 },
  arcade: { name: "HIGH SCORE", desc: "Inspected every project", xp: 150 },
  hacker: { name: "ROOT ACCESS", desc: "Ran sudo hire mujtaba", xp: 150 },
  konami: { name: "RETRO GOD", desc: "↑↑↓↓←→←→BA", xp: 250 },
};

const KEY = "mujtaba.exe/progress/v1";

export const EMPTY: Progress = { visited: [], gems: [], talked: [], puzzles: [], projects: [], achievements: [], commands: 0 };

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch {}
  return { ...EMPTY };
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

export function xpOf(p: Progress) {
  let xp = p.visited.length * 40 + p.gems.length * 15 + p.talked.length * 10 + p.puzzles.length * 30 + p.projects.length * 5;
  for (const a of p.achievements) xp += ACHIEVEMENTS[a]?.xp ?? 0;
  return xp;
}

export function levelOf(xp: number) {
  const lvl = Math.floor(Math.sqrt(xp / 60)) + 1;
  const cur = (lvl - 1) * (lvl - 1) * 60;
  const nxt = lvl * lvl * 60;
  return { lvl, frac: (xp - cur) / (nxt - cur) };
}
