export const DUPLICATE_NAME_ERROR = 'Player names must be unique.';

export const normalizePlayerName = (name) => name.trim();

export const isDuplicatePlayerName = (players, name, excludePlayerId = null) => {
  const normalized = normalizePlayerName(name).toLowerCase();
  if (!normalized) return false;

  return players.some(
    (player) =>
      player.id !== excludePlayerId &&
      player.name.toLowerCase() === normalized
  );
};
