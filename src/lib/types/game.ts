/**
 * Type definitions for the Mastermind game
 */

export type Color = {
  id: string;
  hex: string;
  name: string;
  accessible: boolean;
};

export type FeedbackPeg = 'black' | 'white' | 'none';

export type Feedback = FeedbackPeg[];

export type Guess = {
  colors: (Color | null)[];
  feedback: Feedback;
  isComplete: boolean;
};

export type GameStatus = 'playing' | 'won' | 'lost';

export type Difficulty = 6 | 7 | 8;

export type GameState = {
  secretCode: (Color | null)[];
  guesses: Guess[];
  currentGuessIndex: number;
  gameStatus: GameStatus;
  difficulty: Difficulty;
  maxGuesses: number;
};