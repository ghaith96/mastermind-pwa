import { writable, derived, get } from 'svelte/store';
import type { GameState, Color, Guess, Difficulty, GameStatus } from '$lib/types/game';
import { getColorsByDifficulty } from '$lib/utils/colors';
import { generateSecretCode, evaluateGuess, checkWinCondition, isValidGuess } from '$lib/utils/gameLogic';
import { browser } from '$app/environment';
import { colorThemeStore } from './colorThemeStore';

// Game statistics type
type GameStats = {
  gamesPlayed: number;
  gamesWon: number;
  bestStreak: number;
  currentStreak: number;
  winsByDifficulty: Record<Difficulty, number>;
  averageGuesses: number;
  totalGuesses: number;
};

// Create empty guesses
function createEmptyGuesses(count: number): Guess[] {
  return Array(count).fill(null).map(() => ({
    colors: [null, null, null, null],
    feedback: [],
    isComplete: false
  }));
}

// Initialize game state
function createInitialState(difficulty: Difficulty = 6): GameState {
  return {
    secretCode: generateSecretCode(difficulty),
    guesses: createEmptyGuesses(10),
    currentGuessIndex: 0,
    gameStatus: 'playing',
    difficulty,
    maxGuesses: 10
  };
}

// Initialize game statistics
function createInitialStats(): GameStats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    bestStreak: 0,
    currentStreak: 0,
    winsByDifficulty: {
      6: 0,
      7: 0,
      8: 0
    },
    averageGuesses: 0,
    totalGuesses: 0
  };
}

// Load saved settings from localStorage
function loadSettings(): { difficulty: Difficulty } {
  if (!browser) return { difficulty: 6 };
  
  try {
    const savedSettings = localStorage.getItem('mastermind-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return {
        difficulty: parsed.difficulty || 6
      };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  
  return { difficulty: 6 };
}

// Load saved game state from localStorage
function loadSavedGame(): GameState | null {
  if (!browser) return null;
  
  try {
    const savedGame = localStorage.getItem('mastermind-game');
    if (savedGame) {
      return JSON.parse(savedGame);
    }
  } catch (e) {
    console.error('Failed to load saved game:', e);
  }
  
  return null;
}

// Load game statistics from localStorage
function loadStats(): GameStats {
  if (!browser) return createInitialStats();
  
  try {
    const savedStats = localStorage.getItem('mastermind-stats');
    if (savedStats) {
      return JSON.parse(savedStats);
    }
  } catch (e) {
    console.error('Failed to load game statistics:', e);
  }
  
  return createInitialStats();
}

// Create the game store
function createGameStore() {
  // Initialize with a default state first
  const settings = loadSettings();
  const defaultState = createInitialState(settings.difficulty);
  
  // Create the store with the default state
  const { subscribe, set, update } = writable<GameState>(defaultState);
  
  // Function to initialize the store with saved game state
  function initializeStore() {
    if (browser) {
      const savedGame = loadSavedGame();
      if (savedGame) {
        set(savedGame);
      }
    }
  }
  
  // Initialize the store if we're in the browser
  if (browser) {
    initializeStore();
  }
  
  // Save settings to localStorage
  function saveSettings(difficulty: Difficulty) {
    if (!browser) return;
    
    try {
      localStorage.setItem('mastermind-settings', JSON.stringify({ difficulty }));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }
  
  // Save current game state to localStorage
  function saveGameState(state: GameState) {
    if (!browser) return;
    
    try {
      localStorage.setItem('mastermind-game', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }
  
  // Update game statistics
  function updateStats(won: boolean, difficulty: Difficulty, guessCount: number) {
    if (!browser) return;
    
    try {
      const stats = loadStats();
      
      stats.gamesPlayed += 1;
      
      if (won) {
        stats.gamesWon += 1;
        stats.currentStreak += 1;
        stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
        stats.winsByDifficulty[difficulty] += 1;
        stats.totalGuesses += guessCount;
        stats.averageGuesses = stats.totalGuesses / stats.gamesWon;
      } else {
        stats.currentStreak = 0;
      }
      
      localStorage.setItem('mastermind-stats', JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to update game statistics:', e);
    }
  }
  
  return {
    subscribe,
    
    // Start a new game
    newGame: (difficulty?: Difficulty) => {
      update(state => {
        const newDifficulty = difficulty || state.difficulty;
        if (difficulty) {
          saveSettings(difficulty);
        }
        const newState = createInitialState(newDifficulty);
        saveGameState(newState);
        return newState;
      });
    },
    
    // Make a guess
    makeGuess: (colors: (Color | null)[]) => {
      update(state => {
        if (state.gameStatus !== 'playing' || !isValidGuess(colors)) {
          return state;
        }
        
        // Create a copy of the state
        const newState = { ...state };
        
        // Update the current guess
        newState.guesses[state.currentGuessIndex] = {
          colors: [...colors],
          feedback: evaluateGuess(colors as Color[], state.secretCode as Color[]),
          isComplete: true
        };
        
        // Check for win condition
        const isWin = checkWinCondition(colors as Color[], state.secretCode as Color[]);
        
        if (isWin) {
          newState.gameStatus = 'won';
          updateStats(true, state.difficulty, state.currentGuessIndex + 1);
        } else if (state.currentGuessIndex === state.maxGuesses - 1) {
          // Last guess and not a win
          newState.gameStatus = 'lost';
          updateStats(false, state.difficulty, state.maxGuesses);
        } else {
          // Move to next guess
          newState.currentGuessIndex += 1;
        }
        
        saveGameState(newState);
        return newState;
      });
    },
    
    // Update a color in the current guess
    updateGuessColor: (position: number, color: Color | null) => {
      update(state => {
        if (state.gameStatus !== 'playing') {
          return state;
        }
        
        const newState = { ...state };
        const currentGuess = { ...newState.guesses[state.currentGuessIndex] };
        
        // Create a new colors array with the updated color
        const newColors = [...currentGuess.colors];
        newColors[position] = color;
        
        // Update the current guess
        newState.guesses[state.currentGuessIndex] = {
          ...currentGuess,
          colors: newColors
        };
        
        saveGameState(newState);
        return newState;
      });
    },
    
    // Change difficulty setting
    setDifficulty: (difficulty: Difficulty) => {
      saveSettings(difficulty);
      update(state => {
        const newState = { ...state, difficulty };
        saveGameState(newState);
        return newState;
      });
    },
    
    // Reset the current game
    resetGame: () => {
      update(state => {
        const newState = createInitialState(state.difficulty);
        saveGameState(newState);
        return newState;
      });
    },
    
    // Get the current secret code (for debugging or game over)
    getSecretCode: () => {
      const state = get(gameStore);
      return state.secretCode as Color[];
    },
    
    // Get completed guesses
    getCompletedGuesses: () => {
      const state = get(gameStore);
      return state.guesses.filter(guess => guess.isComplete);
    },
    
    // Clear saved game (for starting fresh)
    clearSavedGame: () => {
      if (browser) {
        localStorage.removeItem('mastermind-game');
      }
      update(state => {
        return createInitialState(state.difficulty);
      });
    },
    
    // Get game statistics
    getStats: (): GameStats => {
      return loadStats();
    },
    
    // Reset game statistics
    resetStats: () => {
      if (browser) {
        localStorage.setItem('mastermind-stats', JSON.stringify(createInitialStats()));
      }
    },
    
    // Get current game state
    getState: () => {
      return get(gameStore);
    }
  };
}

// Create and export the game store
export const gameStore = createGameStore();

// Derived stores for convenience
export const currentGuess = derived(gameStore, $gameStore => 
  $gameStore.guesses[$gameStore.currentGuessIndex]
);

// Make availableColors react to both difficulty and color theme changes
export const availableColors = derived(
  [gameStore, colorThemeStore], 
  ([$gameStore]) => getColorsByDifficulty($gameStore.difficulty)
);

export const gameStatus = derived(gameStore, $gameStore => $gameStore.gameStatus);

export const completedGuesses = derived(gameStore, $gameStore => 
  $gameStore.guesses.filter(guess => guess.isComplete)
);

export const currentGuessIndex = derived(gameStore, $gameStore => $gameStore.currentGuessIndex);

export const isGameOver = derived(gameStore, $gameStore => 
  $gameStore.gameStatus === 'won' || $gameStore.gameStatus === 'lost'
);

export const secretCode = derived(gameStore, $gameStore => $gameStore.secretCode);

// Helper function to get a readable game status message
export function getGameStatusMessage(status: GameStatus): string {
  switch (status) {
    case 'playing':
      return 'Game in progress';
    case 'won':
      return 'Congratulations! You cracked the code!';
    case 'lost':
      return 'Game over! Better luck next time!';
    default:
      return 'Unknown game status';
  }
}