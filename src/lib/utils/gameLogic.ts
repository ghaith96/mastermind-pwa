import type { Color, Feedback, Difficulty } from '$lib/types/game';
import { getColorsByDifficulty } from './colors';

/**
 * Generate a random secret code for the game
 * @param difficulty Number of colors to use (6-8)
 * @returns Array of 4 randomly selected colors
 */
export function generateSecretCode(difficulty: Difficulty): Color[] {
  const colors = getColorsByDifficulty(difficulty);
  const secretCode: Color[] = [];
  
  // Generate 4 random colors (can repeat)
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    secretCode.push(colors[randomIndex]);
  }
  
  return secretCode;
}

/**
 * Evaluate a guess against the secret code
 * @param guess Array of guessed colors
 * @param secret Array of secret colors
 * @returns Feedback array with black and white pegs
 */
export function evaluateGuess(guess: Color[], secret: Color[]): Feedback {
  // Create copies to work with
  const secretCopy = [...secret];
  const guessCopy = [...guess];
  const feedback: Feedback = [];
  
  // First pass: find exact matches (black pegs)
  for (let i = 0; i < 4; i++) {
    if (guessCopy[i]?.id === secretCopy[i]?.id) {
      feedback.push('black');
      // Mark as matched
      guessCopy[i] = null as any;
      secretCopy[i] = null as any;
    }
  }
  
  // Second pass: find color matches in wrong positions (white pegs)
  for (let i = 0; i < 4; i++) {
    if (guessCopy[i] === null) continue;
    
    const colorIndex = secretCopy.findIndex(
      color => color !== null && color.id === guessCopy[i]?.id
    );
    
    if (colorIndex !== -1) {
      feedback.push('white');
      // Mark as matched
      secretCopy[colorIndex] = null as any;
    }
  }
  
  // Sort feedback to avoid giving away positions
  return feedback.sort() as Feedback;
}

/**
 * Check if a guess matches the secret code exactly
 * @param guess Array of guessed colors
 * @param secret Array of secret colors
 * @returns True if the guess matches the secret code
 */
export function checkWinCondition(guess: Color[], secret: Color[]): boolean {
  return guess.every((color, index) => color.id === secret[index].id);
}

/**
 * Check if a guess is valid (all positions filled)
 * @param guess Array of colors or nulls
 * @returns True if the guess is valid
 */
export function isValidGuess(guess: (Color | null)[]): boolean {
  return guess.length === 4 && guess.every(color => color !== null);
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param array Array to shuffle
 * @returns Shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}