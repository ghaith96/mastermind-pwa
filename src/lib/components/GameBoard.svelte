<script lang="ts">
  import { fade } from 'svelte/transition';
  import { gameStore, gameStatus, currentGuessIndex, availableColors, currentGuess, isGameOver, completedGuesses } from '$lib/stores/gameStore';
  import type { Color } from '$lib/types/game';
  import GuessRow from './GuessRow.svelte';
  import ColorPicker from './ColorPicker.svelte';
  import GameControls from './GameControls.svelte';
  
  // Props
  export let colorBlindMode: boolean = false;
  
  // Local state
  let selectedColor: Color | null = null;
  
  // Handle color selection
  function handleColorSelect(color: Color) {
    selectedColor = color;
    
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }
  
  // Handle placing a color in a guess position
  function handlePlaceColor(position: number) {
    if (selectedColor) {
      gameStore.updateGuessColor(position, selectedColor);
    }
  }
  
  // Check if the current guess is complete (all positions filled)
  $: isGuessComplete = $currentGuess.colors.every(color => color !== null);
  
  // Handle guess submission
  function submitGuess() {
    if (isGuessComplete) {
      // Provide stronger haptic feedback for guess submission
      if (navigator.vibrate) {
        navigator.vibrate([15, 10, 15]);
      }
      
      gameStore.makeGuess($currentGuess.colors);
    }
  }
</script>

<div class="game-board">
  <!-- Game status header -->
  <div class="game-status">
    {#if $gameStatus === 'playing'}
      <div class="guess-progress">
        <div class="guess-counter">
          <span class="guess-number">{$currentGuessIndex + 1}</span>
          <span class="guess-label">of 10</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: {($currentGuessIndex / 10) * 100}%"></div>
          <div class="progress-markers">
            {#each Array(10) as _, i}
              <div class="marker {i <= $currentGuessIndex ? 'active' : ''}" title="Guess {i + 1}"></div>
            {/each}
          </div>
        </div>
        <div class="guess-message">
          {#if $currentGuessIndex === 0}
            Let's crack the code!
          {:else if $currentGuessIndex < 3}
            Great start! Keep going!
          {:else if $currentGuessIndex < 6}
            You're making progress!
          {:else if $currentGuessIndex < 9}
            Almost there! You can do it!
          {:else}
            Final guess! Make it count!
          {/if}
        </div>
      </div>
    {:else if $gameStatus === 'won'}
      <p class="status-text">
        <span class="status-won" transition:fade>You won! 🎉</span>
      </p>
    {:else if $gameStatus === 'lost'}
      <p class="status-text">
        <span class="status-lost" transition:fade>Game over! Try again.</span>
      </p>
    {/if}
  </div>
  
  <!-- Game controls -->
  <GameControls {colorBlindMode} />
  
  <!-- Previous guesses -->
  <div class="previous-guesses">
    {#if $currentGuessIndex > 0}
      <div class="guess-history">
        {#each $completedGuesses as guess, i}
          <GuessRow 
            colors={guess.colors} 
            feedback={guess.feedback}
            isComplete={true}
            isActive={false}
            rowIndex={i}
            {colorBlindMode}
          />
        {/each}
      </div>
    {:else}
      <p class="no-guesses">No guesses yet. Make your first guess below!</p>
    {/if}
  </div>
  
  <!-- Current guess row (only shown when game is in progress) -->
  {#if $gameStatus === 'playing'}
    <div class="current-guess">
      <GuessRow 
        colors={$currentGuess.colors}
        isActive={true}
        isComplete={false}
        rowIndex={$currentGuessIndex}
        showFeedback={false}
        {colorBlindMode}
        on:placeColor={e => handlePlaceColor(e.detail.position)}
      />
      
      <div class="submit-container">
        <button 
          class="btn submit-btn" 
          on:click={submitGuess} 
          disabled={!isGuessComplete}
          aria-label="Submit guess"
        >
          Submit Guess
        </button>
      </div>
    </div>
    
    <!-- Color picker (only shown when game is in progress) -->
    <div class="color-picker-container">
      <ColorPicker 
        colors={$availableColors} 
        {selectedColor} 
        onSelectColor={handleColorSelect} 
        position="bottom"
        {colorBlindMode}
      />
      
      <div class="selected-color">
        {#if selectedColor}
          <p>Selected: <span class="color-name">{selectedColor.name}</span></p>
        {:else}
          <p>Select a color from above</p>
        {/if}
      </div>
    </div>
  {/if}
  
  <!-- Game instructions (only shown for new players) -->
  {#if $currentGuessIndex === 0 && $gameStatus === 'playing'}
    <div class="instructions" transition:fade>
      <p>Tap a color to select it, then tap a position in the guess row to place it.</p>
      <p>When your guess is complete, you'll be able to submit it.</p>
      <p>Black pegs mean correct color and position. White pegs mean correct color but wrong position.</p>
    </div>
  {/if}
</div>

<style>
  .game-board {
    width: 100%;
    background-color: transparent;
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  
  .game-status {
    text-align: center;
    margin-bottom: var(--space-md);
  }
  
  .status-text {
    font-size: var(--font-size-lg);
    margin: 0;
  }
  
  .status-won {
    color: var(--color-success);
    font-weight: bold;
  }
  
  .status-lost {
    color: var(--color-error);
    font-weight: bold;
  }
  
  .guess-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
  }
  
  .guess-counter {
    display: flex;
    align-items: baseline;
    gap: var(--space-xs);
  }
  
  .guess-number {
    font-size: var(--font-size-xl);
    font-weight: bold;
    color: var(--color-primary);
  }
  
  .guess-label {
    font-size: var(--font-size-md);
    color: var(--color-text-light);
  }
  
  .progress-bar-container {
    width: 100%;
    max-width: 300px;
    height: 8px;
    background-color: var(--color-surface-alt);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }
  
  .progress-bar {
    height: 100%;
    background-color: var(--color-primary);
    border-radius: 4px;
    transition: width 0.5s ease;
  }
  
  .progress-markers {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 2px;
  }
  
  .marker {
    width: 4px;
    height: 4px;
    margin-top: 2px;
    border-radius: 50%;
    background-color: var(--color-surface);
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  
  .marker.active {
    background-color: var(--color-primary-light);
    transform: scale(1.5);
  }
  
  .guess-message {
    font-size: var(--font-size-sm);
    color: var(--color-text);
    font-weight: 500;
    margin-top: var(--space-xs);
    min-height: 1.5em;
  }
  
  .previous-guesses {
    margin-bottom: var(--space-md);
    flex: 1;
    overflow-y: visible; /* Let the parent container handle scrolling */
    padding-right: var(--space-xs);
  }
  
  .guess-history {
    display: flex;
    flex-direction: column;
  }
  
  .no-guesses {
    color: var(--color-text-light);
    font-style: italic;
    text-align: center;
    padding: var(--space-md);
    margin: 0;
  }
  
  .current-guess {
    margin-bottom: var(--space-md);
  }
  
  .submit-container {
    display: flex;
    justify-content: center;
    margin-top: var(--space-md);
  }
  
  .submit-btn {
    min-width: 150px;
    background-color: var(--color-primary);
    border-radius: 28px;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 0.5px;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }
  
  .submit-btn:hover {
    background-color: var(--color-primary-dark);
    transform: translateY(-1px);
  }
  
  .submit-btn:disabled {
    background-color: var(--color-secondary);
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }
  
  .color-picker-container {
    margin-bottom: var(--space-md);
  }
  
  .selected-color {
    text-align: center;
    margin-top: var(--space-sm);
    font-size: var(--font-size-md);
    color: var(--color-text-light);
  }
  
  .color-name {
    font-weight: bold;
    color: var(--color-text);
  }
  
  .game-over-actions {
    display: flex;
    justify-content: center;
    margin: var(--space-md) 0;
  }
  
  .instructions {
    margin-top: var(--space-md);
    padding: var(--space-md);
    background-color: var(--color-surface-alt);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
    border: 1px solid var(--color-secondary-light);
  }
  
  .instructions p {
    margin: var(--space-xs) 0;
    line-height: 1.5;
  }
  
  /* Custom scrollbar for previous guesses */
  .previous-guesses::-webkit-scrollbar {
    width: 6px;
  }
  
  .previous-guesses::-webkit-scrollbar-track {
    background: var(--color-background);
    border-radius: 3px;
  }
  
  .previous-guesses::-webkit-scrollbar-thumb {
    background-color: var(--color-secondary-light);
    border-radius: 3px;
  }
  
  /* Mobile optimizations */
  @media (max-width: 480px) {
    .game-board {
      padding: var(--space-sm);
    }
    
    .status-text {
      font-size: var(--font-size-md);
    }
    
    .instructions {
      font-size: var(--font-size-xs);
      padding: var(--space-sm);
    }
  }
  
  /* Landscape mode optimizations */
  @media (max-height: 500px) and (orientation: landscape) {
    .game-board {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: var(--space-sm);
      align-items: start;
    }
    
    .game-status {
      grid-column: 1 / -1;
    }
    
    .previous-guesses {
      grid-row: span 3;
    }
    
    .current-guess,
    .color-picker-container,
    .instructions {
      grid-column: 2;
    }
  }
</style>