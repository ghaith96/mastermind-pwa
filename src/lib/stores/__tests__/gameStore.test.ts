import { describe, it, expect } from 'vitest';
import { getGameStatusMessage } from '../gameStore';

describe('getGameStatusMessage', () => {
  it('should return correct message for each game status', () => {
    expect(getGameStatusMessage('playing')).toBe('Game in progress');
    expect(getGameStatusMessage('won')).toBe('Congratulations! You cracked the code!');
    expect(getGameStatusMessage('lost')).toBe('Game over! Better luck next time!');
    expect(getGameStatusMessage('unknown' as any)).toBe('Unknown game status');
  });
});