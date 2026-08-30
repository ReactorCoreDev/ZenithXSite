import { NextResponse } from "next/server";
import { keepAlive } from "@/lib/player-count";

export async function GET(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    "unknown";

  const result = keepAlive(ip);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        playerCount: result.playerCount,
        message: "Please wait before triggering again.",
        retryAfter: result.retryAfter,
      },
      { status: 429 }
    );
  }

  return NextResponse.json(result);
}
