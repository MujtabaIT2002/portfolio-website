// 8x8 bitmap font (ASCII 32..126) rasterised from Press Start 2P.
// One byte per row, MSB = leftmost pixel. Used for in-world signs and the ASCII ocean.
const B64 = "AAAAAAAAAAA4ODgwMAAwAGxsbAAAAAAAbP5sbGz+bAAQfNB8FvwQAGKkyBAmSowAcNjYcNrMfgAwMDAAAAAAAAwYMDAwGAwAYDAYGBgwYAAAbDj+OGwAAAAYGH4YGAAAAAAAAAAwMGAAAAB+AAAAAAAAAAAAMDAAAgQIECBAgAA4TMbGxmQ4ABg4GBgYGH4AfMYOPHjg/gB+DBg8BsZ8ABw8bMz+DAwA/MD8BgbGfAA8YMD8xsZ8AP7GDBgwMDAAeMTkeJ6GfAB8xsZ+Bgx4AAAwMAAwMAAAADAwADAwYAAMGDBgMBgMAAAA/gD+AAAAYDAYDBgwYAB8/sYMOAA4AHyCuqq+gHwAOGzGxv7GxgD8xsb8xsb8ADxmwMDAZjwA+MzGxsbM+AD+wMD8wMD+AP7AwPzAwMAAPmDAzsZmPgDGxsb+xsbGAH4YGBgYGH4ABgYGBgbGfADGzNjw+NzOAGBgYGBgYH4Axu7+1tbGxgDG5vbezsbGAHzGxsbGxnwA/MbGxvzAwAB8xsbG3sx6APzGxs743M4AfMbAfAbGfAB+GBgYGBgYAMbGxsbGxnwAxsbG7nw4EADW1tbW/u5EAMbGbDhsxsYAZmZmPBgYGAD+Dhw4cOD+ADwwMDAwMDwAgEAgEAgEAgB4GBgYGBh4ADhsAAAAAAAAAAAAAAAAAP4QCAAAAAAAAAAAfAZ+xn4AwMD8xsbGfAAAAH7AwMB+AAYGfsbGxn4AAAB8xv7AfAAOGH4YGBgYAAAAfsbGfgZ8wMD8xsbGxgAYADgYGBh+AAwAHAwMDAx4wMDGzPjMxgA4GBgYGBh+AAAA/La2trYAAAD8xsbGxgAAAHzGxsZ8AAAA/MbG/MDAAAB+xsZ+BgYAAG5wYGBgAAAAfMB8BvwAGBh+GBgYGAAAAMbGxsZ+AAAAZmZmPBgAAADW1tbWbAAAAMZsOGzGAAAAxsbGfgZ8AAD+HDhw/gAMGBgwGBgMABgYGBgYGBgAYDAwGDAwYAAAAHC6HAAAAA==";

let rows: Uint8Array | null = null;
export function fontRows(): Uint8Array {
  if (!rows) {
    const bin = atob(B64);
    rows = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) rows[i] = bin.charCodeAt(i);
  }
  return rows;
}

/** Paint a glyph at 1x into a 2D context with the current fillStyle. */
export function drawGlyph(ctx: CanvasRenderingContext2D, ch: string, x: number, y: number) {
  const code = ch.charCodeAt(0);
  if (code < 33 || code > 126) return;
  const r = fontRows();
  const o = (code - 32) * 8;
  for (let gy = 0; gy < 8; gy++) {
    const b = r[o + gy];
    if (!b) continue;
    // merge horizontal runs into one rect
    let gx = 0;
    while (gx < 8) {
      if ((b >> (7 - gx)) & 1) {
        let run = 1;
        while (gx + run < 8 && (b >> (7 - gx - run)) & 1) run++;
        ctx.fillRect(x + gx, y + gy, run, 1);
        gx += run;
      } else gx++;
    }
  }
}

export function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing = 0) {
  for (let i = 0; i < text.length; i++) drawGlyph(ctx, text[i], x + i * (8 + spacing), y);
}

export function textWidth(text: string, spacing = 0) {
  return text.length * (8 + spacing) - spacing;
}
