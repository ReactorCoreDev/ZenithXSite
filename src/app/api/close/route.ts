import { NextResponse } from "next/server";
import { removePlayer } from "@/lib/player-count";

export async function GET(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    "unknown";

  const result = removePlayer(ip);

  return NextResponse.json({
    success: true,
    playerCount: result.playerCount,
    message: "Player removed.",
  });
}
