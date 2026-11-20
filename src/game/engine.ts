import { buildWorld, findPath, idx, inb, T, W, H, type World, type Building } from "./world";
import { GlyphAtlas, paintLand, sprite, GEM_SWAPS, makeCanvas, type Canvas } from "./art";
import type { ZoneId } from "@/data/cv";

export interface EngineEvents {
  enter(zone: ZoneId): void;
  talk(id: string): void;
  gem(taken: number, total: number, index: number): void;
  tile(x: number, y: number): void;
  stats(s: { ms: number; max: number; fps: number; input: number }): void;
  sfx(name: "step" | "gem" | "bump" | "warp" | "door"): void;
}

type Dir = 0 | 1 | 2 | 3; // down, up, left, right
const DX = [0, 0, -1, 1];
const DY = [1, -1, 0, 0];
const KEYMAP: Record<string, Dir> = {
  ArrowDown: 0,
  KeyS: 0,
  ArrowUp: 1,
  KeyW: 1,
  ArrowLeft: 2,
  KeyA: 2,
  ArrowRight: 3,
  KeyD: 3,
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  life: number;
  max: number;
  ch: string;
  col: number;
}

interface FloatText {
  x: number;
  y: number;
  t: number;
  text: string;
  col: number;
}

const STEP_TIME = 0.14; // seconds per tile
const OCEAN_TICK = 0.11;
const OCEAN_BG = ["#241f8f", "#241f8f", "#1c1878", "#161264", "#120e55", "#0f0b49", "#0c083d"];
const OCEAN_CH = [" ", ".", ".", "-", "~", "="];
const OCEAN_COL = [0, 1, 1, 2, 3, 4];

export class Engine {
  world: World;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private ev: EngineEvents;
  private land: Canvas;
  private ocean: Canvas;
  private octx: CanvasRenderingContext2D;
  private atlas: GlyphAtlas;

  private devW = 1;
  private devH = 1;
  private s = 3;
  private dpr = 1;
  private insetTop = 0;
  private insetBottom = 0;

  private cam = { x: 0, y: 0 };
  private camReady = false;

  private p = { x: 0, y: 0, fx: 0, fy: 0, dir: 0 as Dir, moving: false, t: 0, ox: 0, oy: 0, anim: 0 };
  private held: Dir[] = [];
  private path: { x: number; y: number }[] = [];
  private pathAction: { kind: "door" | "talk"; id?: string; face?: Dir } | null = null;
  private target: { x: number; y: number } | null = null;
  private bumpCool = 0;

  private parts: Particle[] = [];
  private floats: FloatText[] = [];
  private talked = new Set<string>();

  private time = 0;
  private oceanT = 0;
  private oceanDirty = true;
  private raf = 0;
  private last = 0;
  private running = false;
  private paused = false;
  private reduced = false;
  private smokeT = 0;
  private fountT = 0;
  private catT = 2;

  // perf
  private frameMs = 0;
  private frameMax = 0;
  private frames = 0;
  private statT = 0;
  private inputLat = 0;

  private ro?: ResizeObserver;
  private onKeyDown = (e: KeyboardEvent) => this.keyDown(e);
  private onKeyUp = (e: KeyboardEvent) => this.keyUp(e);
  private onPointer = (e: PointerEvent) => this.pointer(e);
  private onVis = () => {
    if (document.hidden) this.halt();
    else if (!this.paused) this.start();
  };
  private onBlur = () => (this.held.length = 0);

  constructor(canvas: HTMLCanvasElement, ev: EngineEvents, takenGems: number[] = []) {
    this.canvas = canvas;
    this.ev = ev;
    this.ctx = canvas.getContext("2d", { alpha: false })!;
    this.world = buildWorld();
    for (const i of takenGems) if (this.world.gems[i]) this.world.gems[i].taken = true;
    this.land = paintLand(this.world);
    this.ocean = makeCanvas(W * T, H * T);
    this.octx = this.ocean.getContext("2d")!;
    this.atlas = new GlyphAtlas();
    this.reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sp = this.world.spawn;
    Object.assign(this.p, { x: sp.x, y: sp.y, fx: sp.x, fy: sp.y, dir: 1 });

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onBlur);
    canvas.addEventListener("pointerdown", this.onPointer);
    document.addEventListener("visibilitychange", this.onVis);

    if (typeof ResizeObserver !== "undefined") {
      this.ro = new ResizeObserver((entries) => {
        const e = entries[0];
        const box = e.devicePixelContentBoxSize?.[0];
        if (box) this.resize(box.inlineSize, box.blockSize);
        else this.resize();
      });
      try {
        this.ro.observe(canvas, { box: "device-pixel-content-box" });
      } catch {
        this.ro.observe(canvas);
      }
    }
    this.resize();
    this.ev.tile(this.p.x, this.p.y);
  }

  destroy() {
    this.halt();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onBlur);
    this.canvas.removeEventListener("pointerdown", this.onPointer);
    document.removeEventListener("visibilitychange", this.onVis);
    this.ro?.disconnect();
  }

  // ---------------------------------------------------------------- sizing
  resize(devW?: number, devH?: number) {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = dpr;
    const ew = Math.round(rect.width * dpr);
    const eh = Math.round(rect.height * dpr);
    // trust devicePixelContentBox only when it agrees with layout (some emulators report CSS px)
    if (devW === undefined || Math.abs(devW - ew) > 2) devW = ew;
    if (devH === undefined || Math.abs(devH - eh) > 2) devH = eh;
    this.devW = Math.max(1, devW);
    this.devH = Math.max(1, devH);
    if (this.canvas.width !== this.devW) this.canvas.width = this.devW;
    if (this.canvas.height !== this.devH) this.canvas.height = this.devH;
    const cssMin = Math.min(rect.width || this.devW / dpr, rect.height || this.devH / dpr);
    const tileCss = Math.max(30, Math.min(48, cssMin / 12));
    const pref = Math.max(1, Math.round((tileCss * dpr) / T));
    const min = Math.ceil(Math.max(this.devW / (W * T), this.devH / (H * T)));
    this.s = Math.max(pref, min);
    this.ctx.imageSmoothingEnabled = false;
    this.camReady = false;
    this.oceanDirty = true;
    if (!this.running) this.frame(performance.now(), true);
  }

  setInsets(top: number, bottom: number) {
    this.insetTop = top;
    this.insetBottom = bottom;
  }

  // ---------------------------------------------------------------- loop
  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      this.frame(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private halt() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Freeze the world while a panel is open (saves battery, frees the frame budget). */
  pause(p: boolean) {
    this.paused = p;
    this.held.length = 0;
    if (p) this.halt();
    else this.start();
  }

  private frame(now: number, still = false) {
    const t0 = performance.now();
    const dt = still ? 0 : Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.update(dt);
    this.render();
    const t1 = performance.now();
    const ms = t1 - t0;
    this.frameMs = this.frameMs * 0.9 + ms * 0.1;
    this.frameMax = Math.max(this.frameMax, ms);
    this.frames++;
    if (now - this.statT > 500) {
      const fps = (this.frames * 1000) / Math.max(1, now - this.statT);
      if (this.statT) this.ev.stats({ ms: this.frameMs, max: this.frameMax, fps, input: this.inputLat });
      this.statT = now;
      this.frames = 0;
      this.frameMax = 0;
    }
  }

  /** time from the OS event to the world state being updated (event.timeStamp shares the performance.now() clock) */
  private markInput(e: Event) {
    this.inputLat = Math.max(0, performance.now() - (e.timeStamp || performance.now()));
  }

  // ---------------------------------------------------------------- input
  private keyDown(e: KeyboardEvent) {
    if (this.paused) return;
    const tgt = e.target as HTMLElement | null;
    if (tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA" || tgt.isContentEditable)) return;
    const d = KEYMAP[e.code];
    if (d !== undefined) {
      e.preventDefault();
      if (!this.held.includes(d)) this.held.push(d);
      this.path.length = 0;
      this.pathAction = null;
      this.target = null;
      if (!this.p.moving) this.tryStep();
      this.markInput(e);
      return;
    }
    if (e.code === "KeyE" || e.code === "Enter" || e.code === "Space") {
      if (tgt && tgt.tagName === "BUTTON") return;
      e.preventDefault();
      this.interact();
      this.markInput(e);
    }
  }

  private keyUp(e: KeyboardEvent) {
    const d = KEYMAP[e.code];
    if (d === undefined) return;
    const i = this.held.indexOf(d);
    if (i >= 0) this.held.splice(i, 1);
  }

  private pointer(e: PointerEvent) {
    if (this.paused) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const rect = this.canvas.getBoundingClientRect();
    const dx = (e.clientX - rect.left) * (this.devW / rect.width);
    const dy = (e.clientY - rect.top) * (this.devH / rect.height);
    const wx = (dx + Math.round(this.cam.x * this.s)) / this.s;
    const wy = (dy + Math.round(this.cam.y * this.s)) / this.s;
    const tx = Math.floor(wx / T);
    const ty = Math.floor(wy / T);
    if (!inb(tx, ty)) return;
    this.walkTo(tx, ty);
    this.markInput(e);
  }

  /** route the player toward whatever is at (tx,ty) */
  walkTo(tx: number, ty: number) {
    const w = this.world;
    const b = w.buildings.find((b) => tx >= b.x && tx < b.x + b.w && ty >= b.y - 1 && ty < b.y + b.h);
    if (b) return this.routeTo(b.door.x, b.door.y, { kind: "door" });
    const npc = w.npcs.find((n) => n.x === tx && n.y === ty);
    const sign = w.signAt.get(idx(tx, ty));
    if (npc || sign) {
      const id = npc ? npc.id : sign!;
      // stand next to it
      let best: { x: number; y: number }[] | null = null;
      let face: Dir = 0;
      for (let d = 0 as Dir; d < 4; d++) {
        const nx = tx - DX[d],
          ny = ty - DY[d];
        if (!inb(nx, ny) || w.solid[idx(nx, ny)] || w.doorAt.has(idx(nx, ny))) continue;
        const pth = nx === this.p.x && ny === this.p.y ? [] : findPath(w, this.p.x, this.p.y, nx, ny, false);
        if (pth && (!best || pth.length < best.length)) {
          best = pth;
          face = d;
        }
      }
      if (best) {
        this.path = best;
        this.pathAction = { kind: "talk", id, face };
        this.target = best.length ? best[best.length - 1] : null;
        if (!best.length) this.finishPath();
        else if (!this.p.moving) this.tryStep();
      }
      return;
    }
    // ground: nearest walkable tile
    let gx = tx,
      gy = ty;
    if (w.solid[idx(tx, ty)]) {
      let found = false;
      for (let r = 1; r < 4 && !found; r++)
        for (let oy = -r; oy <= r && !found; oy++)
          for (let ox = -r; ox <= r && !found; ox++) {
            const nx = tx + ox,
              ny = ty + oy;
            if (inb(nx, ny) && !w.solid[idx(nx, ny)] && !w.doorAt.has(idx(nx, ny))) {
              gx = nx;
              gy = ny;
              found = true;
            }
          }
      if (!found) return this.ev.sfx("bump");
    }
    this.routeTo(gx, gy, null);
  }

  private routeTo(gx: number, gy: number, action: Engine["pathAction"]) {
    this.held.length = 0;
    const pth = findPath(this.world, this.p.x, this.p.y, gx, gy, true);
    if (!pth) {
      this.ev.sfx("bump");
      return;
    }
    this.path = pth;
    this.pathAction = action;
    this.target = pth.length ? { x: gx, y: gy } : null;
    if (!pth.length) this.finishPath();
    else if (!this.p.moving) this.tryStep();
  }

  /** Virtual joystick: 0 down, 1 up, 2 left, 3 right, null = released */
  setStick(d: number | null) {
    if (this.paused) return;
    const t0 = performance.now();
    if (d === null) {
      this.held.length = 0;
      return;
    }
    this.held = [d as Dir];
    this.path.length = 0;
    this.pathAction = null;
    this.target = null;
    if (!this.p.moving) this.tryStep();
    this.inputLat = performance.now() - t0;
  }

  private interact() {
    const fx = this.p.x + DX[this.p.dir];
    const fy = this.p.y + DY[this.p.dir];
    if (!inb(fx, fy)) return;
    const i = idx(fx, fy);
    const npc = this.world.npcs.find((n) => n.x === fx && n.y === fy);
    if (npc) return this.talk(npc.id);
    const sign = this.world.signAt.get(i);
    if (sign) return this.talk(sign);
    if (this.world.doorAt.has(i)) {
      this.held = [this.p.dir];
      this.tryStep();
      this.held = [];
    }
  }

  private talk(id: string) {
    this.talked.add(id);
    const n = this.world.npcs.find((n) => n.id === id);
    if (n) {
      // face the player
      n.flip = this.p.x < n.x;
    }
    this.ev.talk(id);
  }

  // ---------------------------------------------------------------- actions from UI
  warp(zone: ZoneId) {
    const b = this.world.buildings.find((b) => b.zone === zone);
    if (!b) return;
    this.burst(this.p.fx * T + 8, this.p.fy * T + 8, ["#", "%", "*", "+"], [7, 4, 10], 18, 60);
    this.path.length = 0;
    this.target = null;
    Object.assign(this.p, { x: b.door.x, y: b.door.y + 1, fx: b.door.x, fy: b.door.y + 1, moving: false, dir: 1 });
    this.burst(this.p.fx * T + 8, this.p.fy * T + 8, ["#", "%", "*", "+"], [7, 4, 10], 18, 60);
    this.camReady = false;
    this.ev.sfx("warp");
    this.ev.tile(this.p.x, this.p.y);
    if (!this.running) this.frame(performance.now(), true);
  }

  /** step back out of a door after closing a panel */
  exitDoor() {
    const b = this.world.doorAt.get(idx(this.p.x, this.p.y));
    if (b) {
      Object.assign(this.p, { y: b.door.y + 1, fy: b.door.y + 1, dir: 0, moving: false });
      this.ev.tile(this.p.x, this.p.y);
    }
  }

  get gemsTaken() {
    return this.world.gems.map((g, i) => (g.taken ? i : -1)).filter((i) => i >= 0);
  }

  // ---------------------------------------------------------------- update
  private occupied(x: number, y: number) {
    return this.world.npcs.some((n) => n.x === x && n.y === y);
  }

  private tryStep() {
    if (this.p.moving) return;
    let d: Dir | undefined;
    let next: { x: number; y: number } | undefined;
    if (this.held.length) d = this.held[this.held.length - 1];
    else if (this.path.length) {
      next = this.path[0];
      const ddx = next.x - this.p.x,
        ddy = next.y - this.p.y;
      d = ddx > 0 ? 3 : ddx < 0 ? 2 : ddy > 0 ? 0 : 1;
    }
    if (d === undefined) return;
    this.p.dir = d;
    const tx = this.p.x + DX[d];
    const ty = this.p.y + DY[d];
    const i = idx(tx, ty);
    const blocked = !inb(tx, ty) || this.world.solid[i] || this.occupied(tx, ty);
    if (blocked) {
      if (next) {
        // something moved into our path (the cat!) — re-route
        const goal = this.path[this.path.length - 1];
        const np = findPath(this.world, this.p.x, this.p.y, goal.x, goal.y, true);
        this.path = np ?? [];
        if (!np) this.pathAction = null;
        return;
      }
      if (this.bumpCool <= 0) {
        const npc = this.world.npcs.find((n) => n.x === tx && n.y === ty);
        const sign = inb(tx, ty) ? this.world.signAt.get(i) : undefined;
        if (npc) this.talk(npc.id);
        else if (sign) this.talk(sign);
        else this.ev.sfx("bump");
        this.bumpCool = 0.35;
      }
      return;
    }
    if (next) this.path.shift();
    this.p.ox = this.p.x;
    this.p.oy = this.p.y;
    this.p.x = tx;
    this.p.y = ty;
    this.p.moving = true;
    this.p.t = 0;
  }

  private arrive() {
    const { x, y } = this.p;
    this.p.moving = false;
    this.p.fx = x;
    this.p.fy = y;
    this.ev.tile(x, y);
    // gems
    const gi = this.world.gems.findIndex((g) => !g.taken && g.x === x && g.y === y);
    if (gi >= 0) {
      const g = this.world.gems[gi];
      g.taken = true;
      const cols = [4, 7, 8, 9];
      this.burst(x * T + 8, y * T + 8, ["*", "+", "$", "o"], [cols[g.c], 6], 14, 70);
      this.floats.push({ x: x * T + 8, y: y * T, t: 0, text: "+1 GEM", col: cols[g.c] });
      this.ev.sfx("gem");
      this.ev.gem(this.world.gems.filter((g) => g.taken).length, this.world.gems.length, gi);
    }
    // doors
    const b = this.world.doorAt.get(idx(x, y));
    if (b) {
      this.path.length = 0;
      this.pathAction = null;
      this.target = null;
      this.held.length = 0;
      this.ev.sfx("door");
      this.ev.enter(b.zone);
      return;
    }
    if (!this.path.length && this.pathAction) this.finishPath();
    if (!this.path.length) this.target = null;
  }

  private finishPath() {
    const a = this.pathAction;
    this.pathAction = null;
    this.target = null;
    if (!a) return;
    if (a.kind === "talk" && a.id) {
      if (a.face !== undefined) this.p.dir = a.face;
      this.talk(a.id);
    }
  }

  private update(dt: number) {
    this.time += dt;
    this.bumpCool -= dt;
    const p = this.p;
    if (p.moving) {
      p.t += dt / STEP_TIME;
      p.anim += dt;
      if (p.t >= 1) {
        const carry = Math.min(0.5, p.t - 1);
        this.arrive();
        if (!this.paused) this.tryStep();
        if (p.moving) p.t = carry; // keep walking without a hitch
      }
      if (p.moving) {
        const t = Math.min(1, p.t);
        p.fx = p.ox + (p.x - p.ox) * t;
        p.fy = p.oy + (p.y - p.oy) * t;
      }
    } else if (this.held.length || this.path.length) this.tryStep();

    // cat wanders
    this.catT -= dt;
    const cat = this.world.npcs.find((n) => n.id === "cat")!;
    if (this.catT <= 0) {
      this.catT = 1.2 + Math.random() * 2.8;
      const d = Math.floor(Math.random() * 4) as Dir;
      const nx = cat.x + DX[d],
        ny = cat.y + DY[d];
      const i = idx(nx, ny);
      if (
        inb(nx, ny) &&
        !this.world.solid[i] &&
        !this.world.doorAt.has(i) &&
        !(nx === p.x && ny === p.y) &&
        !(p.moving && nx === p.ox && ny === p.oy) &&
        Math.abs(nx - cat.home.x) + Math.abs(ny - cat.home.y) <= 4 &&
        !this.path.some((q) => q.x === nx && q.y === ny)
      ) {
        cat.flip = d === 2;
        cat.x = nx;
        cat.y = ny;
      }
    }
    cat.fx += (cat.x - cat.fx) * Math.min(1, dt * 6);
    cat.fy += (cat.y - cat.fy) * Math.min(1, dt * 6);

    // ambient particles
    if (!this.reduced) {
      this.smokeT -= dt;
      if (this.smokeT <= 0) {
        this.smokeT = 0.45;
        const home = this.world.buildings.find((b) => b.zone === "about")!;
        this.parts.push({ x: (home.x + home.w) * T - 18, y: home.y * T - 2, vx: 3 + Math.random() * 3, vy: -9, g: 0, life: 0, max: 2.6, ch: ".", col: 5 });
      }
      this.fountT -= dt;
      if (this.fountT <= 0) {
        this.fountT = 0.09;
        const f = this.world.fountain;
        this.parts.push({
          x: f.x * T + 16 - 4,
          y: f.y * T + 2,
          vx: (Math.random() - 0.5) * 26,
          vy: -38 - Math.random() * 14,
          g: 90,
          life: 0,
          max: 0.95,
          ch: Math.random() < 0.5 ? "'" : ".",
          col: Math.random() < 0.5 ? 4 : 5,
        });
      }
    }
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const q = this.parts[i];
      q.life += dt;
      if (q.life >= q.max) {
        this.parts.splice(i, 1);
        continue;
      }
      q.vy += q.g * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      if (q.ch === "." && q.g === 0 && q.col === 5) {
        // chimney smoke grows . o O
        const k = q.life / q.max;
        q.ch = k < 0.3 ? "." : k < 0.65 ? "o" : "O";
      }
    }
    for (let i = this.floats.length - 1; i >= 0; i--) {
      this.floats[i].t += dt;
      if (this.floats[i].t > 1.2) this.floats.splice(i, 1);
    }

    // camera
    const vw = this.devW / this.s;
    const vh = this.devH / this.s;
    const top = (this.insetTop * this.dpr) / this.s;
    const bot = (this.insetBottom * this.dpr) / this.s;
    let cx = p.fx * T + 8 - vw / 2;
    let cy = p.fy * T + 8 - (top + vh - bot) / 2;
    cx = Math.max(0, Math.min(W * T - vw, cx));
    cy = Math.max(0, Math.min(H * T - vh, cy));
    if (W * T < vw) cx = (W * T - vw) / 2;
    if (H * T < vh) cy = (H * T - vh) / 2;
    if (!this.camReady || dt === 0) {
      this.cam.x = cx;
      this.cam.y = cy;
      this.camReady = true;
    } else {
      const k = 1 - Math.exp(-dt * 9);
      this.cam.x += (cx - this.cam.x) * k;
      this.cam.y += (cy - this.cam.y) * k;
    }

    this.oceanT += dt;
    if (this.oceanT >= (this.reduced ? 0.5 : OCEAN_TICK)) {
      this.oceanT = 0;
      this.oceanDirty = true;
    }
  }

  private burst(x: number, y: number, chars: string[], cols: number[], n: number, speed: number) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      const v = speed * (0.6 + Math.random() * 0.6);
      this.parts.push({
        x: x - 4,
        y: y - 4,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 20,
        g: 60,
        life: 0,
        max: 0.6 + Math.random() * 0.4,
        ch: chars[i % chars.length],
        col: cols[i % cols.length],
      });
    }
  }

  // ---------------------------------------------------------------- render
  private drawOcean(x0: number, y0: number, x1: number, y1: number) {
    const g = this.octx;
    const w = this.world;
    const t = this.time;
    for (let ty = y0; ty <= y1; ty++)
      for (let tx = x0; tx <= x1; tx++) {
        const i = idx(tx, ty);
        const d = w.depth[i];
        if (d === 0) continue;
        g.fillStyle = OCEAN_BG[d];
        g.fillRect(tx * T, ty * T, T, T);
        for (let sy = 0; sy < 2; sy++)
          for (let sx = 0; sx < 2; sx++) {
            const gx = tx * 2 + sx,
              gy = ty * 2 + sy;
            const v = Math.sin(gx * 0.45 + t * 1.7) + 0.8 * Math.sin(gy * 0.62 - t * 1.25) + 0.7 * Math.sin((gx - gy) * 0.23 + t * 0.85);
            let n = (v + 2.5) / 5 - (d - 2) * 0.07;
            if (d === 1) n += 0.32;
            let lvl = Math.max(0, Math.min(5, Math.floor(n * 6)));
            let ch = OCEAN_CH[lvl];
            let col = OCEAN_COL[lvl];
            if (d === 1 && lvl >= 4) {
              const foam = ((gx * 3 + gy + Math.floor(t * 5)) & 7) === 0;
              ch = foam ? "o" : "~";
              col = foam ? 6 : 5;
            }
            // rare twinkles in the deep
            const tw = Math.sin(gx * 12.9898 + gy * 78.233 + Math.floor(t * 2) * 3.7) * 43758.5453;
            if (d >= 3 && tw - Math.floor(tw) > 0.993) {
              ch = "+";
              col = 8;
              lvl = 5;
            }
            if (lvl === 0) continue;
            this.atlas.draw(g, ch, col, gx * 8, gy * 8);
          }
      }
  }

  private render() {
    const g = this.ctx;
    const s = this.s;
    const camX = Math.round(this.cam.x * s);
    const camY = Math.round(this.cam.y * s);
    const vx0 = Math.floor(camX / s);
    const vy0 = Math.floor(camY / s);
    const vw = Math.ceil(this.devW / s) + 2;
    const vh = Math.ceil(this.devH / s) + 2;

    if (this.oceanDirty) {
      this.oceanDirty = false;
      const tx0 = Math.max(0, Math.floor(vx0 / T) - 1);
      const ty0 = Math.max(0, Math.floor(vy0 / T) - 1);
      const tx1 = Math.min(W - 1, Math.ceil((vx0 + vw) / T) + 1);
      const ty1 = Math.min(H - 1, Math.ceil((vy0 + vh) / T) + 1);
      this.drawOcean(tx0, ty0, tx1, ty1);
    }

    g.setTransform(1, 0, 0, 1, 0, 0);
    g.imageSmoothingEnabled = false;
    g.fillStyle = OCEAN_BG[6];
    g.fillRect(0, 0, this.devW, this.devH);
    const sw = Math.min(W * T - vx0, vw);
    const sh = Math.min(H * T - vy0, vh);
    const ox = camX - vx0 * s;
    const oy = camY - vy0 * s;
    if (sw > 0 && sh > 0) {
      g.drawImage(this.ocean, vx0, vy0, sw, sh, -ox, -oy, sw * s, sh * s);
      g.drawImage(this.land, vx0, vy0, sw, sh, -ox, -oy, sw * s, sh * s);
    }

    g.setTransform(s, 0, 0, s, -camX, -camY);
    this.drawDynamic(g);
  }

  private drawDynamic(g: CanvasRenderingContext2D) {
    const t = this.time;
    const w = this.world;
    const A = this.atlas;
    const blink = Math.floor(t * 2.5) % 2;

    // building animations
    for (const b of w.buildings) this.animBuilding(g, b, t);

    // gems
    for (const gm of w.gems) {
      if (gm.taken) continue;
      const bob = Math.round(Math.sin(t * 3 + gm.x) * 2);
      g.fillStyle = "rgba(27,15,46,0.3)";
      g.fillRect(gm.x * T + 5, gm.y * T + 13, 6, 2);
      g.drawImage(sprite("gem", false, GEM_SWAPS[gm.c]), gm.x * T + 4, gm.y * T + 3 + bob);
      if (((t * 1.5 + gm.x) % 3) < 0.25) A.draw(g, "+", 6, gm.x * T + 8, gm.y * T - 3 + bob);
    }

    // target marker
    if (this.target && blink) A.draw(g, "x", 7, this.target.x * T + 4, this.target.y * T + 4);

    // entities sorted by y
    const ents: { y: number; draw: () => void }[] = [];
    for (const n of w.npcs) {
      ents.push({
        y: n.fy,
        draw: () => {
          const bob = n.id === "robot" ? Math.round(Math.sin(t * 4) * 1) : 0;
          const X = Math.round(n.fx * T),
            Y = Math.round(n.fy * T);
          g.fillStyle = "rgba(27,15,46,0.3)";
          g.fillRect(X + 3, Y + 14, 10, 2);
          g.drawImage(sprite(n.id, n.flip), X, Y + bob);
          if (!this.talked.has(n.id) && n.id !== "cat") {
            const jump = Math.round(Math.abs(Math.sin(t * 4)) * -3);
            A.draw(g, "!", 8, X + 4, Y - 10 + jump);
          }
        },
      });
    }
    const p = this.p;
    ents.push({
      y: p.fy,
      draw: () => {
        const X = Math.round(p.fx * T),
          Y = Math.round(p.fy * T);
        const step = p.moving ? Math.floor(p.anim / (STEP_TIME / 2)) % 2 : 0;
        const bob = p.moving && step ? -1 : 0;
        g.fillStyle = "rgba(27,15,46,0.32)";
        g.fillRect(X + 3, Y + 14, 10, 2);
        const name = p.dir === 0 ? "p_down_" : p.dir === 1 ? "p_up_" : "p_right_";
        g.drawImage(sprite(name + step, p.dir === 2), X, Y + bob);
      },
    });
    ents.sort((a, b) => a.y - b.y);
    for (const e of ents) e.draw();

    // particles (ASCII)
    for (const q of this.parts) {
      if (q.max < 1.5 && q.life > q.max * 0.75 && Math.floor(q.life * 20) % 2) continue;
      A.draw(g, q.ch, q.col, Math.round(q.x), Math.round(q.y));
    }
    for (const f of this.floats) {
      const y = Math.round(f.y - f.t * 18);
      const text = f.text;
      const x0 = Math.round(f.x - (text.length * 8) / 2);
      for (let i = 0; i < text.length; i++) A.draw(g, text[i], f.col, x0 + i * 8, y);
    }
  }

  private animBuilding(g: CanvasRenderingContext2D, b: Building, t: number) {
    const X = b.x * T,
      Y = b.y * T,
      BW = b.w * T;
    const cx = X + BW / 2;
    switch (b.zone) {
      case "arcade": {
        const on = Math.floor(t * 2.5) % 2;
        const c1 = on ? "#ff2e88" : "#00e5ff";
        const c2 = on ? "#00e5ff" : "#ff2e88";
        g.fillStyle = c1;
        g.fillRect(X + 7, Y + 18, BW - 14, 1);
        g.fillRect(X + 7, Y + 33, BW - 14, 1);
        g.fillStyle = c2;
        g.fillRect(X + 7, Y + 18, 1, 16);
        g.fillRect(X + BW - 8, Y + 18, 1, 16);
        // chasing bulbs on the roof
        const k = Math.floor(t * 8);
        for (let i = 0; i < BW / 6; i++) {
          g.fillStyle = (i + k) % 3 === 0 ? "#ffd319" : "#5a3fa0";
          g.fillRect(X + 3 + i * 6, Y + 6, 2, 2);
        }
        // screens flicker
        const h = (Math.sin(t * 9) + 1) * 3;
        g.fillStyle = "#c6fbff";
        g.fillRect(X + 11, Y + 41 + Math.round(h), 10, 1);
        g.fillRect(X + BW - 21, Y + 47 - Math.round(h), 10, 1);
        break;
      }
      case "skills": {
        g.fillStyle = "#1b0f2e";
        g.fillRect(cx, Y - 8, 1, 9);
        g.fillStyle = Math.floor(t * 2) % 2 ? "#ff3b3b" : "#5a1020";
        g.fillRect(cx - 1, Y - 10, 3, 3);
        break;
      }
      case "chess": {
        g.fillStyle = "#1b0f2e";
        g.fillRect(cx, Y - 10, 1, 15);
        const f = Math.floor(t * 4) % 3;
        g.fillStyle = "#ffd319";
        g.fillRect(cx + 1, Y - 10, 8, 5);
        g.fillStyle = "#ff8b3d";
        if (f === 0) g.fillRect(cx + 7, Y - 9, 2, 4);
        if (f === 1) g.fillRect(cx + 5, Y - 6, 4, 1);
        if (f === 2) g.fillRect(cx + 8, Y - 10, 2, 2);
        break;
      }
      case "terminal": {
        const sx = X + 8,
          sy = Y + 8;
        const scroll = Math.floor(t * 6);
        for (let row = 0; row < 6; row++) {
          const seed = Math.sin((row + scroll) * 91.17) * 1000;
          const len = 6 + Math.floor((seed - Math.floor(seed)) * 22);
          g.fillStyle = row === 5 ? "#c6fbff" : "#7cff4f";
          g.fillRect(sx, sy + row * 3, Math.min(len, BW - 18), 1);
        }
        if (Math.floor(t * 3) % 2) {
          g.fillStyle = "#7cff4f";
          g.fillRect(sx + 2, sy + 17, 3, 1);
        }
        break;
      }
      case "about": {
        // window glow pulse
        const a = 0.15 + 0.12 * Math.sin(t * 2);
        g.fillStyle = `rgba(255,211,25,${a.toFixed(2)})`;
        g.fillRect(X + 7, Y + 43, 16, 13);
        g.fillRect(X + BW - 23, Y + 43, 16, 13);
        break;
      }
    }
    // door hint when nearby
    const p = this.p;
    const near = Math.abs(p.x - b.door.x) + Math.abs(p.y - (b.door.y + 1)) <= 2;
    if (near) {
      const jump = Math.round(Math.abs(Math.sin(t * 5)) * 3);
      this.atlas.draw(g, "^", 8, b.door.x * T + 4, (b.door.y + 1) * T + 6 + jump);
    }
  }
}
