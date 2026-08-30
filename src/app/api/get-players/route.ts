import { NextResponse } from "next/server";
import { getPlayerCount } from "@/lib/player-count";

export async function GET() {
  return NextResponse.json({
    playerCount: getPlayerCount(),
  });
}
