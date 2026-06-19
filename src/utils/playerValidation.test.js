import {
  DUPLICATE_NAME_ERROR,
  isDuplicatePlayerName,
  normalizePlayerName,
} from './playerValidation';

const players = [
  { id: 1, name: 'Alex', gamesPlayed: 0 },
  { id: 2, name: 'Jordan', gamesPlayed: 1 },
];

describe('playerValidation', () => {
  test('normalizePlayerName trims whitespace', () => {
    expect(normalizePlayerName('  Alex  ')).toBe('Alex');
  });

  test('detects duplicate names case-insensitively', () => {
    expect(isDuplicatePlayerName(players, 'alex')).toBe(true);
    expect(isDuplicatePlayerName(players, 'ALEX')).toBe(true);
  });

  test('ignores the player being edited', () => {
    expect(isDuplicatePlayerName(players, 'Alex', 1)).toBe(false);
  });

  test('allows unique names', () => {
    expect(isDuplicatePlayerName(players, 'Sam')).toBe(false);
  });

  test('exports duplicate error message', () => {
    expect(DUPLICATE_NAME_ERROR).toBe('Player names must be unique.');
  });
});
