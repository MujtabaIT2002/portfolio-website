import type { ChessData } from "@/lib/chess";

export interface DialogScript {
  who: string;
  color: string;
  lines: string[];
}

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export function script(id: string, chess: ChessData, touch: boolean, visits: number): DialogScript {
  switch (id) {
    case "welcome":
      return {
        who: "SIGNPOST",
        color: "#ffd319",
        lines: [
          "WELCOME TO MUJTABA ISLAND — a portfolio you can walk around in.",
          touch
            ? "Drag the joystick (or tap anywhere) to walk. Press A to talk or enter. The bar below fast-travels."
            : "WASD / ARROWS to walk · E to talk · 1–7 to fast-travel · ` opens the terminal.",
          "12 gems are hidden around the island. Achievements are saved in your browser.",
        ],
      };
    case "robot": {
      const pool = [
        "BEEP. I was fine-tuned on 400 samples with QLoRA on a 4GB GTX 1650. Mujtaba squeezed me in with 4-bit NF4.",
        "BOOP. My creator wires Shopify, news APIs and local LLMs into reports that write themselves.",
        "Did you know? The ocean around this island is pure ASCII, redrawn ~9 times a second.",
        "Fun fact: this whole world renders in about a millisecond per frame. Press P to see for yourself.",
      ];
      return {
        who: "R0-B0",
        color: "#00e5ff",
        lines: visits === 0 ? ["HELLO, HUMAN. I am R0-B0, Mujtaba's AI assistant.", pool[0], "The QUESTS hall up north holds his work history."] : [pick(pool)],
      };
    }
    case "knight": {
      const m = Object.fromEntries(chess.modes.map((x) => [x.key, x]));
      const rapid = m.rapid,
        blitz = m.blitz,
        bullet = m.bullet;
      const lines = [
        "HALT! I guard the CHESS TOWER of " + (chess.profile.username || "mujju2002") + ".",
        [rapid && `Rapid ${rapid.rating} (peak ${rapid.best})`, blitz && `Blitz ${blitz.rating}`, bullet && `Bullet ${bullet.rating}`]
          .filter(Boolean)
          .join(" · ") + (chess.source === "live" ? " — live from chess.com!" : "."),
        "Think you can find mate in one? Step inside and press PLAY.",
      ];
      return { who: "SIR BLITZ", color: "#ffd319", lines: visits === 0 ? lines : [pick(lines.slice(1))] };
    }
    case "cat":
      return { who: "PIXEL THE CAT", color: "#ff8b3d", lines: [pick(["Mrrrp.", "Meow! (=^･ω･^=)", "*purrs in 8-bit*", "*knocks a gem into the ocean*"])] };
    default:
      return { who: "???", color: "#fff", lines: ["..."] };
  }
}
