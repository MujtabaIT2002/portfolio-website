import type { ZoneId } from "@/data/cv";

export const T = 16; // tile size in world pixels
export const W = 48; // world width in tiles
export const H = 36; // world height in tiles

export const Cell = { Water: 0, Sand: 1, Grass: 2, Path: 3, Plaza: 4 } as const;

export interface Building {
  zone: ZoneId;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  door: { x: number; y: number };
}

export interface Npc {
  id: "robot" | "knight" | "cat";
  x: number;
  y: number;
  // smooth movement for the wandering cat
  fx: number;
  fy: number;
  home: { x: number; y: number };
  flip: boolean;
}

export interface Decor {
  kind: "tree" | "sakura" | "rock" | "lamp" | "sign" | "flower" | "mailbox" | "bench";
  x: number;
  y: number;
  v: number;
}

export interface World {
  cells: Uint8Array;
  solid: Uint8Array;
  depth: Uint8Array; // water distance to land (capped)
  buildings: Building[];
  doorAt: Map<number, Building>;
  decor: Decor[];
  npcs: Npc[];
  gems: { x: number; y: number; c: number; taken: boolean }[];
  signAt: Map<number, string>;
  spawn: { x: number; y: number };
  fountain: { x: number; y: number };
}

export const idx = (x: number, y: number) => y * W + x;
export const inb = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BUILDINGS: Omit<Building, "door">[] = [
  { zone: "about", label: "HOME", x: 8, y: 7, w: 5, h: 4 },
  { zone: "quests", label: "QUESTS", x: 20, y: 4, w: 7, h: 5 },
  { zone: "arcade", label: "ARCADE", x: 33, y: 7, w: 6, h: 4 },
  { zone: "skills", label: "SKILLS", x: 7, y: 19, w: 5, h: 5 },
  { zone: "chess", label: "CHESS", x: 37, y: 16, w: 4, h: 7 },
  { zone: "mail", label: "MAIL", x: 16, y: 25, w: 5, h: 4 },
  { zone: "terminal", label: "TERM", x: 29, y: 26, w: 3, h: 3 },
];

export function buildWorld(): World {
  const r = rng(20020909);
  const cells = new Uint8Array(W * H);
  const solid = new Uint8Array(W * H);

  // --- island shape: wobbly ellipse
  const cx = (W - 1) / 2;
  const cy = (H - 1) / 2;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const a = Math.atan2(y - cy, x - cx);
      const wob = 0.06 * Math.sin(a * 3 + 1.3) + 0.045 * Math.sin(a * 7 + 0.4) + 0.03 * Math.sin(a * 11);
      const dx = (x - cx) / 20.5;
      const dy = (y - cy) / 15.2;
      const d = Math.sqrt(dx * dx + dy * dy) + wob;
      cells[idx(x, y)] = d < 1 ? Cell.Grass : Cell.Water;
    }

  const buildings: Building[] = BUILDINGS.map((b) => ({
    ...b,
    door: { x: b.x + (b.w >> 1), y: b.y + b.h - 1 },
  }));
  const inBuilding = (x: number, y: number, m = 0) =>
    buildings.some((b) => x >= b.x - m && x < b.x + b.w + m && y >= b.y - m && y < b.y + b.h + m);

  // force land around buildings
  for (const b of buildings)
    for (let y = b.y - 2; y < b.y + b.h + 3; y++)
      for (let x = b.x - 2; x < b.x + b.w + 2; x++) if (inb(x, y)) cells[idx(x, y)] = Cell.Grass;

  // plaza + fountain
  const PX = 21,
    PY = 14,
    PW = 6,
    PH = 6;
  for (let y = PY; y < PY + PH; y++) for (let x = PX; x < PX + PW; x++) cells[idx(x, y)] = Cell.Plaza;
  const fountain = { x: 23, y: 16 };
  for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) solid[idx(fountain.x + x, fountain.y + y)] = 1;

  // --- paths from each door to the plaza (L-shaped, avoiding buildings)
  const blocked = (x: number, y: number) =>
    inBuilding(x, y) || (x >= fountain.x && x < fountain.x + 2 && y >= fountain.y && y < fountain.y + 2);
  const inPlaza = (x: number, y: number) => x >= PX && x < PX + PW && y >= PY && y < PY + PH;
  for (const b of buildings) {
    const sx = b.door.x;
    const sy = b.door.y + 1;
    const tx = Math.min(Math.max(sx, PX + 1), PX + PW - 2);
    const ty = Math.min(Math.max(sy, PY + 1), PY + PH - 2);
    const routes = [
      () => {
        const pts: [number, number][] = [];
        let x = sx,
          y = sy;
        pts.push([x, y]);
        while (x !== tx) {
          x += Math.sign(tx - x);
          pts.push([x, y]);
        }
        while (y !== ty) {
          y += Math.sign(ty - y);
          pts.push([x, y]);
        }
        return pts;
      },
      () => {
        const pts: [number, number][] = [];
        let x = sx,
          y = sy;
        pts.push([x, y]);
        while (y !== ty) {
          y += Math.sign(ty - y);
          pts.push([x, y]);
        }
        while (x !== tx) {
          x += Math.sign(tx - x);
          pts.push([x, y]);
        }
        return pts;
      },
    ];
    for (const route of routes) {
      const pts = route();
      if (pts.some(([x, y]) => blocked(x, y))) continue;
      for (const [x, y] of pts) if (!inPlaza(x, y)) cells[idx(x, y)] = Cell.Path;
      break;
    }
  }

  // --- sand ring: land next to water
  const isWater = (x: number, y: number) => !inb(x, y) || cells[idx(x, y)] === Cell.Water;
  const sand: number[] = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (cells[idx(x, y)] !== Cell.Grass) continue;
      let near = false;
      for (let oy = -1; oy <= 1 && !near; oy++) for (let ox = -1; ox <= 1; ox++) if (isWater(x + ox, y + oy)) near = true;
      if (near) sand.push(idx(x, y));
    }
  for (const i of sand) cells[i] = Cell.Sand;

  // water + building solidity
  for (let i = 0; i < W * H; i++) if (cells[i] === Cell.Water) solid[i] = 1;
  const doorAt = new Map<number, Building>();
  for (const b of buildings) {
    for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) solid[idx(x, y)] = 1;
    solid[idx(b.door.x, b.door.y)] = 0;
    doorAt.set(idx(b.door.x, b.door.y), b);
  }

  const decor: Decor[] = [];
  const signAt = new Map<number, string>();
  const spawn = { x: 24, y: 20 };

  const place = (kind: Decor["kind"], x: number, y: number, isSolid: boolean) => {
    decor.push({ kind, x, y, v: Math.floor(r() * 4) });
    if (isSolid) solid[idx(x, y)] = 1;
  };
  // plaza lamps + welcome sign
  place("lamp", PX, PY, true);
  place("lamp", PX + PW - 1, PY, true);
  place("lamp", PX, PY + PH - 1, true);
  place("lamp", PX + PW - 1, PY + PH - 1, true);
  place("sign", 26, 21, true);
  signAt.set(idx(26, 21), "welcome");
  place("mailbox", 21, 28, true);
  place("bench", 22, 13, true);
  place("bench", 25, 13, true);

  // NPCs
  const npcs: Npc[] = [
    { id: "robot", x: 18, y: 12, fx: 18, fy: 12, home: { x: 18, y: 12 }, flip: false },
    { id: "knight", x: 36, y: 21, fx: 36, fy: 21, home: { x: 36, y: 21 }, flip: false },
    { id: "cat", x: 28, y: 18, fx: 28, fy: 18, home: { x: 28, y: 18 }, flip: false },
  ];

  // --- trees, rocks, flowers
  const isPath = (x: number, y: number) => inb(x, y) && (cells[idx(x, y)] === Cell.Path || cells[idx(x, y)] === Cell.Plaza);
  const nearPath = (x: number, y: number) => {
    for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) if (isPath(x + ox, y + oy)) return true;
    return false;
  };
  const reserved = (x: number, y: number) =>
    npcs.some((n) => Math.abs(n.x - x) <= 1 && Math.abs(n.y - y) <= 1) ||
    (Math.abs(x - spawn.x) <= 2 && Math.abs(y - spawn.y) <= 2) ||
    decor.some((d) => d.x === x && d.y === y);

  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const c = cells[idx(x, y)];
      if (c !== Cell.Grass) continue;
      if (inBuilding(x, y, 1) || nearPath(x, y) || reserved(x, y)) continue;
      const n = r();
      if (n < 0.16) place(r() < 0.3 ? "sakura" : "tree", x, y, true);
      else if (n < 0.185) place("rock", x, y, true);
      else if (n < 0.33) place("flower", x, y, false);
    }

  // --- reachability from spawn
  const reach = new Uint8Array(W * H);
  const q = [idx(spawn.x, spawn.y)];
  reach[q[0]] = 1;
  while (q.length) {
    const i = q.pop()!;
    const x = i % W,
      y = (i / W) | 0;
    for (const [ox, oy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + ox,
        ny = y + oy;
      if (!inb(nx, ny)) continue;
      const j = idx(nx, ny);
      if (reach[j] || solid[j]) continue;
      if (doorAt.has(j)) continue; // don't route through doors
      reach[j] = 1;
      q.push(j);
    }
  }

  // --- collectible gems on reachable grass/sand, spread out
  const gems: World["gems"] = [];
  const candidates: [number, number][] = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      if (!reach[i] || isPath(x, y)) continue;
      if (decor.some((d) => d.x === x && d.y === y)) continue;
      if (npcs.some((n) => n.x === x && n.y === y)) continue;
      if (Math.abs(x - spawn.x) + Math.abs(y - spawn.y) < 4) continue;
      candidates.push([x, y]);
    }
  let guard = 0;
  while (gems.length < 12 && guard++ < 5000) {
    const [x, y] = candidates[Math.floor(r() * candidates.length)];
    if (gems.some((g) => Math.abs(g.x - x) + Math.abs(g.y - y) < 7)) continue;
    gems.push({ x, y, c: gems.length % 4, taken: false });
  }

  // --- water depth (distance from land), capped at 6
  const depth = new Uint8Array(W * H).fill(255);
  const dq: number[] = [];
  for (let i = 0; i < W * H; i++)
    if (cells[i] !== Cell.Water) {
      depth[i] = 0;
      dq.push(i);
    }
  for (let h = 0; h < dq.length; h++) {
    const i = dq[h];
    const x = i % W,
      y = (i / W) | 0;
    for (let oy = -1; oy <= 1; oy++)
      for (let ox = -1; ox <= 1; ox++) {
        const nx = x + ox,
          ny = y + oy;
        if (!inb(nx, ny)) continue;
        const j = idx(nx, ny);
        if (depth[j] !== 255) continue;
        depth[j] = Math.min(6, depth[i] + 1);
        dq.push(j);
      }
  }

  return { cells, solid, depth, buildings, doorAt, decor, npcs, gems, signAt, spawn, fountain };
}

/** BFS path on the tile grid; returns list of tiles from (excl.) start to goal. */
export function findPath(world: World, sx: number, sy: number, gx: number, gy: number, allowGoalDoor = true) {
  if (sx === gx && sy === gy) return [];
  const prev = new Int32Array(W * H).fill(-1);
  const start = idx(sx, sy);
  const goal = idx(gx, gy);
  prev[start] = start;
  const q = new Int32Array(W * H);
  let h = 0,
    t = 0;
  q[t++] = start;
  const npcBlock = new Set(world.npcs.map((n) => idx(n.x, n.y)));
  while (h < t) {
    const i = q[h++];
    if (i === goal) break;
    const x = i % W,
      y = (i / W) | 0;
    const nb = [i + 1, i - 1, i + W, i - W];
    const ok = [x < W - 1, x > 0, y < H - 1, y > 0];
    for (let k = 0; k < 4; k++) {
      if (!ok[k]) continue;
      const j = nb[k];
      if (prev[j] !== -1) continue;
      if (world.solid[j] || npcBlock.has(j)) continue;
      if (world.doorAt.has(j) && !(allowGoalDoor && j === goal)) continue;
      prev[j] = i;
      q[t++] = j;
    }
  }
  if (prev[goal] === -1) return null;
  const out: { x: number; y: number }[] = [];
  let c = goal;
  while (c !== start) {
    out.push({ x: c % W, y: (c / W) | 0 });
    c = prev[c];
  }
  return out.reverse();
}
