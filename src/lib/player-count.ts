let playerCount = 0;

const players = new Map<string, NodeJS.Timeout>();
const lastTrigger = new Map<string, number>();

const COOLDOWN = 20_000; // 20 seconds
const TIMEOUT = 25_000;  // 25 seconds

export function keepAlive(ip: string) {
  const now = Date.now();
  const last = lastTrigger.get(ip) ?? 0;

  // Player triggered too soon
  if (now - last < COOLDOWN) {
    return {
      success: false,
      playerCount,
      retryAfter: Math.ceil(
        (COOLDOWN - (now - last)) / 1000
      ),
    };
  }

  lastTrigger.set(ip, now);

  // New player
  if (!players.has(ip)) {
    playerCount++;
  }

  // Reset their 25 second timeout
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

  return {
    success: true,
    playerCount,
  };
}

export function getPlayerCount() {
  return playerCount;
}
