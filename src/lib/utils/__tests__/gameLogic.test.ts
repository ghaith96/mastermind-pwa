import { describe, it, expect } from 'vitest';
import { generateSecretCode, evaluateGuess, checkWinCondition, isValidGuess } from '../gameLogic';
import { COLORS } from '../colors';
import type { Color } from '$lib/types/game';

// Create test colors for consistent testing
const RED = COLORS.RED;
const BLUE = COLORS.BLUE;
const GREEN = COLORS.GREEN;
const YELLOW = COLORS.YELLOW;
const PURPLE = COLORS.PURPLE;
const ORANGE = COLORS.ORANGE;

describe('generateSecretCode', () => {
  it('should generate a code with 4 colors', () => {
    const code = generateSecretCode(6);
    expect(code).toHaveLength(4);
    expect(code.every(color => color !== null)).toBe(true);
  });

  it('should only use colors from the available set based on difficulty', () => {
    const code = generateSecretCode(6);
    const availableColorIds = Object.values(COLORS).slice(0, 6).map(c => c.id);
    expect(code.every(color => availableColorIds.includes(color.id))).toBe(true);
  });
});

describe('evaluateGuess', () => {
  it('should return 4 black pegs for a correct guess', () => {
    const secret = [RED, BLUE, GREEN, YELLOW];
    const guess = [RED, BLUE, GREEN, YELLOW];
    const feedback = evaluateGuess(guess, secret);
    expect(feedback).toEqual(['black', 'black', 'black', 'black']);
  });

  it('should return no pegs for a completely wrong guess', () => {
    const secret = [RED, BLUE, GREEN, YELLOW];
    const guess = [PURPLE, ORANGE, PURPLE, ORANGE];
    const feedback = evaluateGuess(guess, secret);
    expect(feedback).toEqual([]);
  });

  it('should return black pegs for correct colors in correct positions', () => {
    const secret = [RED, BLUE, GREEN, YELLOW];
    const guess = [RED, PURPLE, GREEN, ORANGE];
    const feedback = evaluateGuess(guess, secret);
    expect(feedback).toEqual(['black', 'black']);
  });

  it('should return white pegs for correct colors in wrong positions', () => {
    const secret = [RED, BLUE, GREEN, YELLOW];
    const guess = [BLUE, RED, YELLOW, PURPLE];
    const feedback = evaluateGuess(guess, secret);
    expect(feedback).toEqual(['white', 'white', 'white']);
  });

  it('should handle mixed black and white pegs', () => {
    const secret = [RED, BLUE, GREEN, YELLOW];
    const guess = [RED, GREEN, BLUE, PURPLE];
    const feedback = evaluateGuess(guess, secret);
    // 1 black (RED) + 2 white (BLUE, GREEN)
    expect(feedback).toEqual(['black', 'white', 'white']);
  });

  it('should handle duplicate colors in guess correctly', () => {
    const secret = [RED, BLUE, GREEN, YELLOW];
    const guess = [RED, RED, RED, RED];
    const feedback = evaluateGuess(guess, secret);
    // Only one RED in secret, so only one black peg
    expect(feedback).toEqual(['black']);
  });

  it('should handle duplicate colors in secret correctly', () => {
    const secret = [RED, RED, GREEN, GREEN];
    const guess = [RED, BLUE, GREEN, YELLOW];
    const feedback = evaluateGuess(guess, secret);
    // One RED and one GREEN in correct positions
    expect(feedback).toEqual(['black', 'black']);
  });
});

describe('checkWinCondition', () => {
  it('should return true for a matching guess', () => {
    const secret = [RED, BLUE, GREEN, YELLOW];
    const guess = [RED, BLUE, GREEN, YELLOW];
    expect(checkWinCondition(guess, secret)).toBe(true);
  });

  it('should return false for a non-matching guess', () => {
    const secret = [RED, BLUE, GREEN, YELLOW];
    const guess = [RED, BLUE, GREEN, PURPLE];
    expect(checkWinCondition(guess, secret)).toBe(false);
  });
});

describe('isValidGuess', () => {
  it('should return true for a complete guess', () => {
    const guess = [RED, BLUE, GREEN, YELLOW];
    expect(isValidGuess(guess)).toBe(true);
  });

  it('should return false for an incomplete guess', () => {
    const guess = [RED, BLUE, null, YELLOW];
    expect(isValidGuess(guess)).toBe(false);
  });

  it('should return false for a guess with wrong length', () => {
    const guess = [RED, BLUE, GREEN];
    expect(isValidGuess(guess as (Color | null)[])).toBe(false);
  });
});