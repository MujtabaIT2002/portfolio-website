// Tiny WebAudio chiptune synth: zero audio files, zero decode latency.
let ac: AudioContext | null = null;
let master: GainNode | null = null;
let sfxOn = true;
let musicTimer: ReturnType<typeof setInterval> | null = null;

function ctx() {
  if (!ac) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ac = new AC({ latencyHint: "interactive" });
    master = ac.createGain();
    master.gain.value = 0.18;
    master.connect(ac.destination);
  }
  if (ac.state === "suspended") ac.resume();
  return ac;
}

export function unlockAudio() {
  ctx();
}

export function setSfx(on: boolean) {
  sfxOn = on;
  if (!on) setMusic(false);
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "square", vol = 0.5, slideTo?: number) {
  const a = ac!;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  o.connect(g);
  g.connect(master!);
  o.start(start);
  o.stop(start + dur + 0.02);
}

const N = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

export type Sfx = "gem" | "bump" | "warp" | "door" | "open" | "close" | "type" | "win" | "error" | "talk" | "step" | "achieve" | "click";

export function sfx(name: Sfx) {
  if (!sfxOn) return;
  const a = ctx();
  if (!a) return;
  const t = a.currentTime + 0.001;
  switch (name) {
    case "gem":
      tone(N(88), t, 0.07, "square", 0.35);
      tone(N(95), t + 0.07, 0.14, "square", 0.35);
      break;
    case "bump":
      tone(110, t, 0.07, "square", 0.25, 80);
      break;
    case "warp":
      tone(180, t, 0.28, "sawtooth", 0.25, 1400);
      tone(N(84), t + 0.2, 0.12, "square", 0.25);
      break;
    case "door":
    case "open":
      tone(N(72), t, 0.06, "square", 0.3);
      tone(N(79), t + 0.06, 0.1, "square", 0.3);
      break;
    case "close":
      tone(N(79), t, 0.06, "square", 0.25);
      tone(N(72), t + 0.06, 0.09, "square", 0.25);
      break;
    case "type":
      tone(N(96 + Math.floor(Math.random() * 5)), t, 0.018, "square", 0.08);
      break;
    case "click":
      tone(N(84), t, 0.03, "square", 0.15);
      break;
    case "talk":
      tone(N(76 + Math.floor(Math.random() * 4)), t, 0.03, "triangle", 0.25);
      break;
    case "step":
      tone(90, t, 0.02, "triangle", 0.08);
      break;
    case "win":
    case "achieve":
      [72, 76, 79, 84, 88].forEach((n, i) => tone(N(n), t + i * 0.07, 0.16, "square", 0.3));
      break;
    case "error":
      tone(N(64), t, 0.09, "square", 0.3);
      tone(N(58), t + 0.1, 0.16, "square", 0.3);
      break;
  }
}

// ---- background loop: bass + arpeggio + lead, scheduled ahead for zero jitter
const BASS = [45, 45, 52, 52, 41, 41, 48, 48];
const ARP = [0, 7, 12, 7];
const LEAD = [81, 0, 79, 76, 0, 74, 76, 0, 72, 0, 74, 76, 79, 0, 76, 0];

export function setMusic(on: boolean) {
  if (!on) {
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
    return;
  }
  const a = ctx();
  if (!a || musicTimer) return;
  const stepDur = 0.15;
  let step = 0;
  let next = a.currentTime + 0.05;
  musicTimer = setInterval(() => {
    while (next < a.currentTime + 0.25) {
      const bar = Math.floor(step / 8) % BASS.length;
      const root = BASS[bar];
      if (step % 2 === 0) tone(N(root), next, stepDur * 1.8, "triangle", 0.45);
      tone(N(root + 24 + ARP[step % 4]), next, stepDur * 0.7, "square", 0.07);
      const l = LEAD[step % LEAD.length];
      if (l && Math.floor(step / 16) % 2 === 1) tone(N(l), next, stepDur * 1.4, "square", 0.12);
      next += stepDur;
      step++;
    }
  }, 60);
}
