let playerCount = 0;

const players = new Map<string, NodeJS.Timeout>();
const lastUpdate = new Map<string, number>();

const RATE_LIMIT = 60_000; // 1 minute rate limit
const TIMEOUT = 65_000; // 65 seconds before auto-removal

export function updatePlayerCount(ip: string) {
  const now = Date.now();
  const last = lastUpdate.get(ip) ?? 0;

  // Check rate limit: only 1 update per minute per IP
  if (now - last < RATE_LIMIT) {
    return {
      success: false,
      playerCount,
      retryAfter: Math.ceil(
        (RATE_LIMIT - (now - last)) / 1000
      ),
    };
  }

  lastUpdate.set(ip, now);

  // New player: increment count
  if (!players.has(ip)) {
    playerCount++;
  }

  // Clear old timeout if exists
  const oldTimeout = players.get(ip);
  if (oldTimeout) {
    clearTimeout(oldTimeout);
  }

  // Auto-remove after 65 seconds of inactivity
  const timeout = setTimeout(() => {
    players.delete(ip);
    lastUpdate.delete(ip);
    playerCount = Math.max(0, playerCount - 1);
  }, TIMEOUT);

  players.set(ip, timeout);

  return {
    success: true,
    playerCount,
  };
}

export function removePlayer(ip: string) {
  if (players.has(ip)) {
    clearTimeout(players.get(ip)!);
    players.delete(ip);
    lastUpdate.delete(ip);
    playerCount = Math.max(0, playerCount - 1);
  }

  return {
    playerCount,
  };
}

export function getPlayerCount() {
  return playerCount;
}
