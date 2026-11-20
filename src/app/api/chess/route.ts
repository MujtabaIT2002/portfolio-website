import { NextResponse } from "next/server";
import { fetchChessServer } from "@/lib/chess";
import { CHESS_SNAPSHOT } from "@/lib/chessSnapshot";

// Runs on request (never during `next build`), then Vercel's CDN caches the
// response for 30 minutes, so chess.com is hit at most ~48 times a day.
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  try {
    const data = await fetchChessServer();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json(CHESS_SNAPSHOT, { headers: { "Cache-Control": "public, s-maxage=300" } });
  }
}
