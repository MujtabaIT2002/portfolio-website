import { PAL, SPRITES } from "./spriteData";
import { drawGlyph, drawText, textWidth } from "./font";
import { Cell, T, W, H, idx, type World, type Building } from "./world";

export type Canvas = HTMLCanvasElement;

export function makeCanvas(w: number, h: number): Canvas {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function ctx2d(c: Canvas) {
  const g = c.getContext("2d")!;
  g.imageSmoothingEnabled = false;
  return g;
}

// ---------------------------------------------------------------- sprites
const spriteCache = new Map<string, Canvas>();

export function sprite(name: string, flip = false, swap?: Record<string, string>): Canvas {
  const key = name + (flip ? ":f" : "") + (swap ? JSON.stringify(swap) : "");
  let c = spriteCache.get(key);
  if (c) return c;
  const rows = SPRITES[name];
  const w = rows[0].length;
  c = makeCanvas(w, rows.length);
  const g = ctx2d(c);
  for (let y = 0; y < rows.length; y++)
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      if (ch === ".") continue;
      g.fillStyle = (swap && swap[ch]) || PAL[ch];
      g.fillRect(flip ? w - 1 - x : x, y, 1, 1);
    }
  spriteCache.set(key, c);
  return c;
}

export const GEM_SWAPS: Record<string, string>[] = [
  {},
  { c: "#ff2e88", C: "#b3125c" },
  { c: "#ffd319", C: "#c48a00" },
  { c: "#7cff4f", C: "#2fa82f" },
];

// ---------------------------------------------------------------- glyph atlas
export const OCEAN_COLORS = ["#20187a", "#2c2fb0", "#3d5cff", "#00a2ff", "#00e1ff", "#c6fbff", "#ffffff", "#ff2e88", "#ffd319", "#7cff4f", "#b967ff", "#ff8b3d"];
export const GLYPHS = " .'-~=*o+^:%#@$!?<>/\\|_01";

export class GlyphAtlas {
  canvas: Canvas;
  private col = new Map<string, number>();
  constructor() {
    this.canvas = makeCanvas(GLYPHS.length * 8, OCEAN_COLORS.length * 8);
    const g = ctx2d(this.canvas);
    OCEAN_COLORS.forEach((c, ci) => {
      g.fillStyle = c;
      for (let i = 0; i < GLYPHS.length; i++) drawGlyph(g, GLYPHS[i], i * 8, ci * 8);
    });
    for (let i = 0; i < GLYPHS.length; i++) this.col.set(GLYPHS[i], i);
  }
  /** draw glyph at 1x world coordinates into ctx (already scaled or not) */
  draw(g: CanvasRenderingContext2D, ch: string, color: number, x: number, y: number) {
    const i = this.col.get(ch);
    if (i === undefined || i === 0) return;
    g.drawImage(this.canvas, i * 8, color * 8, 8, 8, x, y, 8, 8);
  }
}

// ---------------------------------------------------------------- land layer
function hash(x: number, y: number, s = 0) {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const C = {
  grass: "#34c759",
  grassD: "#26a84a",
  grassL: "#79eb8f",
  sand: "#ffd98a",
  sandD: "#eab95e",
  sandL: "#fff0c4",
  path: "#f2b765",
  pathD: "#cf9145",
  pathL: "#ffd9a0",
  plazaA: "#a9b2ff",
  plazaB: "#97a1f2",
  plazaG: "#6f78cc",
  ink: "#1b0f2e",
  shadow: "rgba(27,15,46,0.28)",
};

function px(g: CanvasRenderingContext2D, color: string, x: number, y: number, w = 1, h = 1) {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
}

function paintTile(g: CanvasRenderingContext2D, world: World, x: number, y: number) {
  const c = world.cells[idx(x, y)];
  const X = x * T,
    Y = y * T;
  if (c === Cell.Water) return;
  if (c === Cell.Grass || c === Cell.Sand) {
    const sand = c === Cell.Sand;
    px(g, sand ? C.sand : C.grass, X, Y, T, T);
    for (let i = 0; i < 7; i++) {
      const hx = Math.floor(hash(x, y, i) * 15);
      const hy = Math.floor(hash(x, y, i + 9) * 15);
      if (sand) px(g, i % 3 ? C.sandD : C.sandL, X + hx, Y + hy);
      else if (i < 4) px(g, C.grassD, X + hx, Y + hy, 2, 1);
      else {
        // little tuft "v"
        px(g, C.grassL, X + hx, Y + hy);
        px(g, C.grassL, X + hx + 2, Y + hy);
        px(g, C.grassD, X + hx + 1, Y + hy + 1);
      }
    }
    return;
  }
  if (c === Cell.Path) {
    px(g, C.path, X, Y, T, T);
    for (let i = 0; i < 5; i++) {
      const hx = Math.floor(hash(x, y, i) * 13);
      const hy = Math.floor(hash(x, y, i + 3) * 13);
      px(g, C.pathD, X + hx, Y + hy + 1, 3, 1);
      px(g, C.pathL, X + hx, Y + hy, 2, 1);
    }
    return;
  }
  if (c === Cell.Plaza) {
    const alt = (x + y) & 1;
    px(g, alt ? C.plazaA : C.plazaB, X, Y, T, T);
    px(g, C.plazaG, X, Y + T - 1, T, 1);
    px(g, C.plazaG, X + T - 1, Y, 1, T);
    px(g, "#c9d0ff", X + 2, Y + 2, 3, 1);
  }
}

/** soften edges between path/plaza and grass */
function paintEdges(g: CanvasRenderingContext2D, world: World) {
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const c = world.cells[idx(x, y)];
      if (c !== Cell.Path) continue;
      const X = x * T,
        Y = y * T;
      const grassAt = (ox: number, oy: number) => {
        const v = world.cells[idx(x + ox, y + oy)];
        return v === Cell.Grass || v === Cell.Sand;
      };
      if (grassAt(0, -1)) px(g, C.pathD, X, Y, T, 1);
      if (grassAt(0, 1)) px(g, C.pathD, X, Y + T - 1, T, 1);
      if (grassAt(-1, 0)) px(g, C.pathD, X, Y, 1, T);
      if (grassAt(1, 0)) px(g, C.pathD, X + T - 1, Y, 1, T);
    }
}


function plaque(g: CanvasRenderingContext2D, label: string, cx: number, y: number, bg: string, fg: string) {
  const tw = textWidth(label);
  const x = Math.round(cx - tw / 2) - 3;
  px(g, C.ink, x, y, tw + 6, 12);
  px(g, bg, x + 1, y + 1, tw + 4, 10);
  g.fillStyle = fg;
  drawText(g, label, x + 3, y + 2);
}

function windowPane(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, glass = "#ffd319") {
  px(g, C.ink, x, y, w, h);
  px(g, glass, x + 1, y + 1, w - 2, h - 2);
  px(g, "#ffffff", x + 2, y + 2, 2, 1);
  px(g, C.ink, x + (w >> 1), y + 1, 1, h - 2);
  px(g, C.ink, x + 1, y + (h >> 1), w - 2, 1);
}

function door(g: CanvasRenderingContext2D, b: Building, color: string, arch = false) {
  const x = b.door.x * T + 3;
  const y = (b.y + b.h) * T - 15;
  px(g, C.ink, x, y, 10, 15);
  px(g, color, x + 1, y + 1, 8, 14);
  px(g, "rgba(0,0,0,0.25)", x + 5, y + 1, 4, 14);
  px(g, "#ffd319", x + 7, y + 8, 1, 2);
  if (arch) {
    px(g, C.ink, x + 1, y - 1, 8, 1);
    px(g, C.ink, x + 2, y - 2, 6, 1);
  }
}

function gableRoof(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, base: string, dark: string, light: string) {
  for (let i = 0; i < h; i++) {
    const inset = Math.max(0, Math.round(((h - i) / h) * 10) - 2);
    const rx = x - 2 + inset;
    const rw = w + 4 - inset * 2;
    px(g, C.ink, rx, y + i, rw, 1);
    px(g, i % 4 === 3 ? dark : base, rx + 1, y + i, rw - 2, 1);
    if (i % 4 === 3) for (let k = (i >> 2) % 2 ? 3 : 7; k < rw - 2; k += 8) px(g, light, rx + 1 + k, y + i - 1, 1, 1);
  }
  px(g, light, x + 10, y + 1, w - 20, 1);
  px(g, C.ink, x - 2, y + h, w + 4, 1);
}

function wall(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, base: string, dark: string) {
  px(g, C.ink, x, y, w, h);
  px(g, base, x + 1, y, w - 2, h - 1);
  px(g, dark, x + 1, y + h - 3, w - 2, 2);
}

function paintBuilding(g: CanvasRenderingContext2D, b: Building) {
  const X = b.x * T,
    Y = b.y * T,
    BW = b.w * T,
    BH = b.h * T;
  // ground shadow
  px(g, C.shadow, X + 2, Y + BH, BW - 2, 3);
  const cx = X + BW / 2;
  switch (b.zone) {
    case "about": {
      const roofH = 28;
      wall(g, X + 2, Y + roofH, BW - 4, BH - roofH, "#fff1d6", "#e8cfa5");
      // chimney
      px(g, C.ink, X + BW - 22, Y + 1, 9, 16);
      px(g, "#c2453a", X + BW - 21, Y + 2, 7, 14);
      px(g, "#e86a5a", X + BW - 21, Y + 2, 7, 2);
      gableRoof(g, X + 2, Y + 4, BW - 4, roofH - 4, "#ff5a3c", "#c9381f", "#ff9b7a");
      plaque(g, b.label, cx, Y + roofH + 2, "#ff2e88", "#ffffff");
      windowPane(g, X + 8, Y + roofH + 16, 14, 11);
      windowPane(g, X + BW - 22, Y + roofH + 16, 14, 11);
      door(g, b, "#8a5a3c");
      // flower boxes
      px(g, "#ff2e88", X + 8, Y + roofH + 27, 14, 2);
      px(g, "#ff2e88", X + BW - 22, Y + roofH + 27, 14, 2);
      break;
    }
    case "quests": {
      const roofH = 38;
      wall(g, X + 2, Y + roofH, BW - 4, BH - roofH, "#dfe3ff", "#b6bdf0");
      // stone lines
      for (let yy = Y + roofH + 4; yy < Y + BH - 4; yy += 6)
        for (let xx = X + 4 + ((yy >> 1) % 2) * 6; xx < X + BW - 6; xx += 12) px(g, "#b6bdf0", xx, yy, 8, 1);
      gableRoof(g, X + 2, Y + 6, BW - 4, roofH - 6, "#8a4dff", "#5e2ccc", "#c4a2ff");
      // tower spire
      px(g, C.ink, cx - 5, Y, 10, 8);
      px(g, "#ffd319", cx - 4, Y + 1, 8, 6);
      px(g, C.ink, cx - 1, Y - 0, 2, 2);
      plaque(g, b.label, cx, Y + roofH + 3, "#1b0f2e", "#ffd319");
      windowPane(g, X + 8, Y + roofH + 18, 12, 12, "#9ef0ff");
      windowPane(g, X + BW - 20, Y + roofH + 18, 12, 12, "#9ef0ff");
      // banners
      for (const bx of [X + 26, X + BW - 32]) {
        px(g, C.ink, bx, Y + roofH + 16, 7, 18);
        px(g, "#ff2e88", bx + 1, Y + roofH + 16, 5, 16);
        px(g, "#ffd319", bx + 2, Y + roofH + 21, 3, 3);
      }
      door(g, b, "#6a3f2a", true);
      break;
    }
    case "arcade": {
      const roofH = 16;
      wall(g, X + 2, Y + roofH, BW - 4, BH - roofH, "#3b2a6b", "#2a1d50");
      px(g, C.ink, X, Y + 4, BW, roofH - 2);
      px(g, "#241a52", X + 1, Y + 5, BW - 2, roofH - 4);
      // marquee (neon drawn dynamically on top)
      px(g, C.ink, X + 8, Y + roofH + 3, BW - 16, 14);
      px(g, "#120a2a", X + 9, Y + roofH + 4, BW - 18, 12);
      g.fillStyle = "#ffd319";
      drawText(g, b.label, Math.round(cx - textWidth(b.label) / 2), Y + roofH + 6);
      // cabinet windows
      for (const wx of [X + 8, X + BW - 24]) {
        px(g, C.ink, wx, Y + roofH + 22, 16, 22);
        px(g, "#ff2e88", wx + 1, Y + roofH + 23, 14, 20);
        px(g, "#00e5ff", wx + 3, Y + roofH + 25, 10, 8);
        px(g, "#ffd319", wx + 4, Y + roofH + 36, 2, 2);
        px(g, "#7cff4f", wx + 10, Y + roofH + 36, 2, 2);
      }
      door(g, b, "#00b3ff");
      break;
    }
    case "skills": {
      const roofH = 34;
      wall(g, X + 2, Y + roofH, BW - 4, BH - roofH, "#f4f6ff", "#c9cff5");
      // dome
      const r = (BW - 8) / 2;
      for (let i = 0; i < roofH; i++) {
        const dy = roofH - i;
        const half = Math.round(Math.sqrt(Math.max(0, r * r - dy * dy * ((r * r) / (roofH * roofH)))));
        if (half <= 0) continue;
        px(g, C.ink, cx - half - 1, Y + i, half * 2 + 2, 1);
        px(g, i < 6 ? "#9ef0ff" : "#00b3ff", cx - half, Y + i, half * 2, 1);
      }
      px(g, "#c6fbff", cx - 14, Y + 12, 4, 10);
      px(g, "#c6fbff", cx - 10, Y + 8, 3, 4);
      px(g, C.ink, X + 2, Y + roofH - 1, BW - 4, 2);
      plaque(g, b.label, cx, Y + roofH + 3, "#00b3ff", "#ffffff");
      windowPane(g, X + 7, Y + roofH + 20, 12, 12, "#b967ff");
      windowPane(g, X + BW - 19, Y + roofH + 20, 12, 12, "#b967ff");
      door(g, b, "#3d5cff");
      break;
    }
    case "chess": {
      const top = 14;
      // battlements
      for (let k = 0; k < 4; k++) {
        const mx = X + 2 + k * 16;
        px(g, C.ink, mx, Y + 4, 12, top - 2);
        px(g, "#ecebff", mx + 1, Y + 5, 10, top - 4);
      }
      px(g, C.ink, X, Y + top, BW, 4);
      px(g, "#cfd0f5", X + 1, Y + top + 1, BW - 2, 2);
      wall(g, X + 4, Y + top + 4, BW - 8, BH - top - 4, "#ecebff", "#c3c4ee");
      for (let yy = Y + top + 8; yy < Y + BH - 6; yy += 6)
        for (let xx = X + 6 + ((yy >> 1) % 2) * 5; xx < X + BW - 10; xx += 10) px(g, "#c3c4ee", xx, yy, 6, 1);
      // checker band
      for (let k = 0; k < (BW - 10) / 4; k++)
        for (let row = 0; row < 2; row++) px(g, (k + row) % 2 ? C.ink : "#ffffff", X + 5 + k * 4, Y + top + 24 + row * 4, 4, 4);
      plaque(g, b.label, cx, Y + top + 40, "#ffd319", "#1b0f2e");
      // slit windows
      px(g, C.ink, cx - 2, Y + top + 8, 4, 10);
      px(g, "#ffd319", cx - 1, Y + top + 9, 2, 8);
      px(g, C.ink, X + 10, Y + top + 58, 4, 10);
      px(g, C.ink, X + BW - 14, Y + top + 58, 4, 10);
      door(g, b, "#5a3824", true);
      break;
    }
    case "mail": {
      const roofH = 26;
      wall(g, X + 2, Y + roofH, BW - 4, BH - roofH, "#ffe3f1", "#f5b6d6");
      gableRoof(g, X + 2, Y + 4, BW - 4, roofH - 4, "#00c2a8", "#008f7b", "#8affea");
      plaque(g, b.label, cx, Y + roofH + 2, "#00c2a8", "#ffffff");
      // envelope emblem
      const ex = X + 8,
        ey = Y + roofH + 18;
      px(g, C.ink, ex, ey, 16, 11);
      px(g, "#ffffff", ex + 1, ey + 1, 14, 9);
      for (let i = 0; i < 7; i++) {
        px(g, "#ff2e88", ex + 1 + i, ey + 1 + (i >> 1), 1, 1);
        px(g, "#ff2e88", ex + 14 - i, ey + 1 + (i >> 1), 1, 1);
      }
      windowPane(g, X + BW - 22, Y + roofH + 18, 14, 11, "#9ef0ff");
      door(g, b, "#ff2e88");
      break;
    }
    case "terminal": {
      // kiosk: body + CRT screen (screen contents animated in engine)
      px(g, C.ink, X + 2, Y + 2, BW - 4, BH - 4);
      px(g, "#3a3f6b", X + 3, Y + 3, BW - 6, BH - 6);
      px(g, "#242845", X + 3, Y + BH - 8, BW - 6, 4);
      px(g, C.ink, X + 6, Y + 6, BW - 12, 22);
      px(g, "#03140a", X + 7, Y + 7, BW - 14, 20);
      plaque(g, b.label, cx, Y + 30, "#7cff4f", "#1b0f2e");
      // keyboard on the door tile
      px(g, C.ink, X + 14, Y + BH - 6, 20, 5);
      px(g, "#c9d1ff", X + 15, Y + BH - 5, 18, 3);
      for (let k = 0; k < 8; k++) px(g, "#8f98d6", X + 16 + k * 2, Y + BH - 5, 1, 1);
      break;
    }
  }
}

function paintDecor(g: CanvasRenderingContext2D, world: World) {
  const tree = sprite("tree");
  const sakura = sprite("tree", false, { g: "#ff9ecb", G: "#e0559a", q: "#ffe3f1" });
  for (const d of world.decor) {
    const X = d.x * T,
      Y = d.y * T;
    switch (d.kind) {
      case "tree":
      case "sakura":
        px(g, C.shadow, X + 3, Y + 14, 10, 2);
        g.drawImage(d.kind === "tree" ? tree : sakura, X, Y);
        break;
      case "rock":
        px(g, C.shadow, X + 2, Y + 13, 12, 2);
        px(g, C.ink, X + 3, Y + 5, 10, 9);
        px(g, C.ink, X + 2, Y + 7, 12, 6);
        px(g, "#9aa0c8", X + 3, Y + 6, 9, 7);
        px(g, "#c9cdf0", X + 4, Y + 6, 4, 2);
        px(g, "#6d73a3", X + 3, Y + 11, 9, 1);
        break;
      case "flower": {
        const cols = ["#ff2e88", "#ffd319", "#ffffff", "#b967ff", "#ff8b3d"];
        for (let i = 0; i < 3; i++) {
          const fx = X + 2 + Math.floor(hash(d.x, d.y, i) * 11);
          const fy = Y + 2 + Math.floor(hash(d.x, d.y, i + 5) * 11);
          px(g, "#1f9e4a", fx, fy + 2, 1, 2);
          px(g, cols[(d.v + i) % cols.length], fx - 1, fy, 3, 2);
          px(g, "#ffd319", fx, fy, 1, 1);
        }
        break;
      }
      case "lamp":
        px(g, C.shadow, X + 5, Y + 14, 7, 2);
        px(g, C.ink, X + 7, Y + 4, 3, 12);
        px(g, "#3d4473", X + 8, Y + 5, 1, 10);
        px(g, C.ink, X + 4, Y, 9, 6);
        px(g, "#ffd319", X + 5, Y + 1, 7, 4);
        break;
      case "sign":
        px(g, C.ink, X + 7, Y + 8, 3, 8);
        px(g, "#8a5a3c", X + 8, Y + 9, 1, 7);
        px(g, C.ink, X + 1, Y + 1, 15, 10);
        px(g, "#c98a52", X + 2, Y + 2, 13, 8);
        px(g, "#8a5a3c", X + 4, Y + 4, 9, 1);
        px(g, "#8a5a3c", X + 4, Y + 7, 7, 1);
        break;
      case "mailbox":
        px(g, C.ink, X + 7, Y + 9, 3, 7);
        px(g, C.ink, X + 3, Y + 2, 11, 8);
        px(g, "#ff3b3b", X + 4, Y + 3, 9, 6);
        px(g, "#ffffff", X + 6, Y + 5, 5, 1);
        px(g, "#ffd319", X + 12, Y + 1, 1, 4);
        break;
      case "bench":
        px(g, C.ink, X + 1, Y + 6, 14, 6);
        px(g, "#c98a52", X + 2, Y + 7, 12, 2);
        px(g, "#a46a38", X + 2, Y + 10, 12, 1);
        px(g, C.ink, X + 2, Y + 12, 2, 3);
        px(g, C.ink, X + 12, Y + 12, 2, 3);
        break;
    }
  }
}

function paintFountain(g: CanvasRenderingContext2D, world: World) {
  const X = world.fountain.x * T,
    Y = world.fountain.y * T;
  px(g, C.shadow, X + 2, Y + 30, 30, 3);
  px(g, C.ink, X + 1, Y + 6, 30, 25);
  px(g, "#dfe3ff", X + 2, Y + 7, 28, 23);
  px(g, C.ink, X + 4, Y + 9, 24, 17);
  px(g, "#00a2ff", X + 5, Y + 10, 22, 15);
  px(g, "#00e1ff", X + 5, Y + 10, 22, 3);
  px(g, C.ink, X + 13, Y + 4, 6, 14);
  px(g, "#dfe3ff", X + 14, Y + 5, 4, 12);
}

export function paintLand(world: World): Canvas {
  const c = makeCanvas(W * T, H * T);
  const g = ctx2d(c);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) paintTile(g, world, x, y);
  paintEdges(g, world);
  paintFountain(g, world);
  paintDecor(g, world);
  for (const b of world.buildings) paintBuilding(g, b);
  return c;
}

/** Tiny overview map, 1px per tile */
export function paintMinimap(world: World): Canvas {
  const c = makeCanvas(W, H);
  const g = ctx2d(c);
  const cols = ["#1b1466", "#ffd98a", "#34c759", "#f2b765", "#a9b2ff"];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(g, cols[world.cells[idx(x, y)]], x, y);
  for (const d of world.decor) if (d.kind === "tree" || d.kind === "sakura") px(g, d.kind === "tree" ? "#1f9e4a" : "#ff9ecb", d.x, d.y);
  const bc: Record<string, string> = {
    about: "#ff5a3c",
    quests: "#b967ff",
    arcade: "#ff2e88",
    skills: "#00e5ff",
    chess: "#ffd319",
    mail: "#00c2a8",
    terminal: "#7cff4f",
  };
  for (const b of world.buildings) px(g, bc[b.zone], b.x, b.y, b.w, b.h);
  return c;
}
