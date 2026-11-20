// chess.com public API → compact data for the Chess Tower.
export const CHESS_USER = "mujju2002";

export interface ChessMode {
  key: string;
  label: string;
  rating: number;
  date: number;
  best: number | null;
  bestDate: number | null;
  bestGame: string | null;
  win: number;
  loss: number;
  draw: number;
}

export type Recent = [tc: string, result: 0 | 1 | 2, opp: number, me: number, t: number, color: "w" | "b", id: string];

export interface ChessData {
  source: "live" | "snapshot";
  fetchedAt: number;
  profile: { username: string; name: string; url: string; league: string | null; joined: number; followers: number; lastOnline: number };
  modes: ChessMode[];
  tactics: { highest: number; highestDate: number; lowest: number; lowestDate: number } | null;
  puzzleRush: number | null;
  fide: number;
  analysis: Analysis | null;
}

export interface Analysis {
  total: number;
  hist: Record<string, { n: number; pts: [number, number][] }>;
  color: { w: [number, number, number]; b: [number, number, number] };
  how: Record<string, number>;
  open: [string, [number, number, number]][];
  streak: number;
  recent: Recent[];
}

const LABELS: Record<string, string> = {
  chess_rapid: "RAPID",
  chess_blitz: "BLITZ",
  chess_bullet: "BULLET",
  chess_daily: "DAILY",
  chess960_daily: "960 DAILY",
};
const ORDER = ["chess_rapid", "chess_blitz", "chess_bullet", "chess_daily", "chess960_daily"];

/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseStats(stats: any, profile: any): Omit<ChessData, "source" | "fetchedAt" | "analysis"> {
  const modes: ChessMode[] = [];
  for (const key of ORDER) {
    const m = stats?.[key];
    if (!m?.last) continue;
    modes.push({
      key: key.replace("chess_", "").replace("chess960_", "960_"),
      label: LABELS[key] ?? key.toUpperCase(),
      rating: m.last.rating,
      date: m.last.date,
      best: m.best?.rating ?? null,
      bestDate: m.best?.date ?? null,
      bestGame: m.best?.game ?? null,
      win: m.record?.win ?? 0,
      loss: m.record?.loss ?? 0,
      draw: m.record?.draw ?? 0,
    });
  }
  const t = stats?.tactics;
  return {
    profile: {
      username: profile?.username ?? CHESS_USER,
      name: profile?.name ?? "",
      url: profile?.url ?? `https://www.chess.com/member/${CHESS_USER}`,
      league: profile?.league ?? null,
      joined: profile?.joined ?? 0,
      followers: profile?.followers ?? 0,
      lastOnline: profile?.last_online ?? 0,
    },
    modes,
    tactics: t?.highest ? { highest: t.highest.rating, highestDate: t.highest.date, lowest: t.lowest?.rating ?? 0, lowestDate: t.lowest?.date ?? 0 } : null,
    puzzleRush: stats?.puzzle_rush?.best?.score ?? null,
    fide: stats?.fide ?? 0,
  };
}

const DRAWS = new Set(["agreed", "repetition", "stalemate", "insufficient", "50move", "timevsinsufficient"]);

export function analyse(games: any[], user = CHESS_USER): Analysis {
  games = games.filter((g) => g && g.rules === "chess").sort((a, b) => a.end_time - b.end_time);
  const me = user.toLowerCase();
  const out: Analysis = { total: games.length, hist: {}, color: { w: [0, 0, 0], b: [0, 0, 0] }, how: {}, open: [], streak: 0, recent: [] };
  const raw: Record<string, [number, number][]> = {};
  const open: Record<string, [number, number, number]> = {};
  let cur = 0;
  for (const g of games) {
    const side = g.white?.username?.toLowerCase() === me ? "white" : "black";
    const opp = side === "white" ? "black" : "white";
    const r = g[side].result;
    const k: 0 | 1 | 2 = r === "win" ? 0 : DRAWS.has(r) ? 2 : 1;
    const c = side[0] as "w" | "b";
    out.color[c][k]++;
    (raw[g.time_class] ??= []).push([g.end_time, g[side].rating]);
    if (k === 0) {
      cur++;
      out.streak = Math.max(out.streak, cur);
      const how = g[opp].result;
      out.how[how] = (out.how[how] ?? 0) + 1;
    } else cur = 0;
    const eco = String(g.eco ?? "")
      .split("/")
      .pop()!
      .replace(/-/g, " ")
      .replace(/\s+\d.*$/, "")
      .split(" ")
      .slice(0, 3)
      .join(" ");
    if (eco) (open[eco] ??= [0, 0, 0])[k]++;
    out.recent.push([g.time_class, k, g[opp].rating, g[side].rating, g.end_time, c, String(g.url).split("/").pop()!]);
  }
  out.recent = out.recent.slice(-10);
  for (const tc in raw) {
    const h = raw[tc];
    const step = Math.max(1, Math.ceil(h.length / 60));
    const ds: [number, number][] = [];
    for (let i = 0; i < h.length; i += step) ds.push(h[i]);
    if (ds[ds.length - 1] !== h[h.length - 1]) ds.push(h[h.length - 1]);
    out.hist[tc] = { n: h.length, pts: ds };
  }
  out.open = Object.entries(open)
    .sort((a, b) => b[1][0] + b[1][1] + b[1][2] - (a[1][0] + a[1][1] + a[1][2]))
    .slice(0, 5);
  return out;
}

const BASE = `https://api.chess.com/pub/player/${CHESS_USER}`;
const HEADERS = { "User-Agent": "mujtabatariq.dev portfolio (chess stats widget)" };

/** fetch with a hard timeout so a slow chess.com never hangs the function */
function getJSON(url: string, revalidate: number, ms = 8000) {
  return fetch(url, { headers: HEADERS, next: { revalidate }, signal: AbortSignal.timeout(ms) } as RequestInit).then((r) =>
    r.ok ? r.json() : Promise.reject(new Error(`${r.status} ${url}`)),
  );
}

/** Server-side: full data incl. game-history analysis. */
export async function fetchChessServer(): Promise<ChessData> {
  const [stats, profile, arch] = await Promise.all([
    getJSON(`${BASE}/stats`, 1800),
    getJSON(BASE, 3600).catch(() => null),
    getJSON(`${BASE}/games/archives`, 3600).catch(() => ({ archives: [] })),
  ]);
  const months: string[] = (arch?.archives ?? []).slice(-18);
  // chess.com asks clients not to hammer the API in parallel → max 3 requests at a time.
  // Finished months never change, so they are cached for a day; the current month for 30 min.
  const games: any[] = [];
  for (let i = 0; i < months.length; i += 3) {
    const batch = months.slice(i, i + 3);
    const res = await Promise.all(
      batch.map((u) => getJSON(u, u === months[months.length - 1] ? 1800 : 86400).catch(() => ({ games: [] }))),
    );
    for (const r of res) games.push(...(r.games ?? []));
  }
  return { source: "live", fetchedAt: Date.now(), ...parseStats(stats, profile), analysis: games.length ? analyse(games) : null };
}

/** Client fallback: stats only (CORS-enabled), keeps snapshot analysis. */
export async function fetchChessClient(prev: ChessData): Promise<ChessData> {
  const [stats, profile] = await Promise.all([
    fetch(`${BASE}/stats`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    fetch(BASE).then((r) => (r.ok ? r.json() : null)),
  ]);
  const parsed = parseStats(stats, profile);
  if (!profile) parsed.profile = prev.profile;
  return { ...prev, source: "live", fetchedAt: Date.now(), ...parsed };
}
