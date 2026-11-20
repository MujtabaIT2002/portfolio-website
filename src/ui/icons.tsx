// 8x8 pixel icons rendered as crisp SVG rects. '.' transparent, 'k' outline, 'a' accent, 'y' yellow.
const MAPS: Record<string, string[]> = {
  about: ["...kk...", "..kaak..", ".kaaaak.", "kaaaaaak", ".k....k.", ".k.aa.k.", ".k.aa.k.", ".kkkkkk."],
  quests: [".....kk.", "....kak.", "...kak..", "k.kak...", ".kak....", "..kk....", ".k.k....", "k......."],
  arcade: ["..kk....", ".kaak...", "..kk....", "...k....", "...k....", "kkkkkkk.", "k.a.y.k.", "kkkkkkk."],
  skills: ["....kk..", "...kak..", "..kak...", ".kaaaak.", "...kak..", "..kak...", "..kk....", "........"],
  chess: [".k.k.k..", ".kkkkk..", "..kak...", "..kak...", "..kak...", ".kaaak..", ".kkkkk..", "........"],
  mail: ["........", "kkkkkkkk", "kak..kak", "k.akka.k", "k......k", "k......k", "kkkkkkkk", "........"],
  terminal: ["kkkkkkkk", "k......k", "ka.....k", "k.a....k", "ka.....k", "k...aa.k", "kkkkkkkk", "........"],
  sound: ["....k...", "...kk.a.", "kkkkk..a", "kk.kk.a.", "kk.kk.a.", "kkkkk..a", "...kk.a.", "....k..."],
  mute: ["....k...", "...kk...", "kkkkk...", "kk.kka.a", "kk.kk.a.", "kkkkka.a", "...kk...", "....k..."],
  music: ["...kkkkk", "...kaaak", "...k...k", "...k...k", ".kkk.kkk", "kaak.kak", "kaak.kak", ".kk...k."],
  help: ["..kkkk..", ".kaaaak.", ".kk..ak.", "....kak.", "...kak..", "...kk...", "........", "...kk..."],
  trophy: ["kkkkkkkk", "kayyyyak", ".kyyyyk.", "..kyyk..", "...kk...", "...kk...", "..kkkk..", ".kkkkkk."],
};

export function PixIcon({ name, color }: { name: string; color: string }) {
  const rows = MAPS[name];
  const rects: React.ReactNode[] = [];
  rows.forEach((r, y) => {
    for (let x = 0; x < 8; x++) {
      const ch = r[x];
      if (ch === ".") continue;
      const fill = ch === "k" ? "#e9e0ff" : ch === "a" ? color : ch === "y" ? "#ffd319" : "#ffffff";
      rects.push(<rect key={x + "-" + y} x={x} y={y} width={1.02} height={1.02} fill={fill} />);
    }
  });
  return (
    <svg viewBox="0 0 8 8" shapeRendering="crispEdges" aria-hidden="true">
      {rects}
    </svg>
  );
}
