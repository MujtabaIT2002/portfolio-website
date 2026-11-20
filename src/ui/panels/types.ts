import type { Progress } from "../progress";
import type { ChessData } from "@/lib/chess";
import type { Sfx } from "@/game/audio";
import type { ZoneId } from "@/data/cv";

export interface PanelProps {
  progress: Progress;
  update: (fn: (p: Progress) => Progress) => void;
  unlock: (a: string) => void;
  chess: ChessData;
  play: (s: Sfx) => void;
  close: () => void;
  open: (id: ZoneId) => void;
}
