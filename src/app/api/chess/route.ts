import { NextResponse } from "next/server";
import { fetchChessServer } from "@/lib/chess";
import { CHESS_SNAPSHOT } from "@/lib/chessSnapshot";

// Cached at the edge and refreshed every 30 minutes (ISR).
export const revalidate = 1800;

export async function GET() {
  try {
    const data = await fetchChessServer();
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ ...CHESS_SNAPSHOT, fetchedAt: CHESS_SNAPSHOT.fetchedAt }, { headers: { "Cache-Control": "public, s-maxage=300" } });
  }
}
