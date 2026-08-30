import { NextResponse } from "next/server";

let playerCount = 0;

const players = new Map<string, NodeJS.Timeout>();
const lastTrigger = new Map<string, number>();

const COOLDOWN = 20_000;
const TIMEOUT = 25_000;

export async function GET(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    "unknown";

  const now = Date.now();
  const last = lastTrigger.get(ip) ?? 0;

  if (now - last < COOLDOWN) {
    return NextResponse.json(
      {
        success: false,
        playerCount,
        message: "Please wait before triggering again.",
        retryAfter: Math.ceil(
          (COOLDOWN - (now - last)) / 1000
        ),
      },
      { status: 429 }
    );
  }

  lastTrigger.set(ip, now);

  if (!players.has(ip)) {
    playerCount++;
  }

  const oldTimeout = players.get(ip);

  if (oldTimeout) {
    clearTimeout(oldTimeout);
  }

  const timeout = setTimeout(() => {
    players.delete(ip);
    lastTrigger.delete(ip);

    playerCount = Math.max(0, playerCount - 1);
  }, TIMEOUT);

  players.set(ip, timeout);

  return NextResponse.json({
    success: true,
    playerCount,
  });
}
