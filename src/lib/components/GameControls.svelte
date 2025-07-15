<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { gameStore, gameStatus, isGameOver, secretCode } from '$lib/stores/gameStore';
  import type { Color } from '$lib/types/game';
  import ColorSwatch from './ColorSwatch.svelte';
  
  // Props
  export let colorBlindMode: boolean = false;
  
  // Local state
  let showConfirmDialog = false;
  let showSecretCode = false;
  let showGameStats = false;
  
  // Handle new game button click
  function handleNewGameClick() {
    if ($isGameOver) {
      // If game is already over, start new game immediately
      startNewGame();
    } else {
      // Otherwise, show confirmation dialog
      showConfirmDialog = true;
    }
  }
  
  // Start a new game
  function startNewGame() {
    gameStore.newGame();
    showConfirmDialog = false;
    showSecretCode = false;
    showGameStats = false;
  }
  
  // Cancel new game
  function cancelNewGame() {
    showConfirmDialog = false;
  }
  
  // Toggle showing the secret code (for game over state)
  function toggleSecretCode() {
    showSecretCode = !showSecretCode;
  }
  
  // Toggle showing game statistics
  function toggleGameStats() {
    showGameStats = !showGameStats;
  }
  
  // Get game statistics
  function getStats() {
    return gameStore.getStats();
  }
  
  // Get game status message
  $: statusMessage = $gameStatus === 'playing' 
    ? 'Game in progress' 
    : $gameStatus === 'won' 
      ? 'Congratulations! You cracked the code!' 
      : 'Game over! Better luck next time!';
</script>

<div class="game-controls">
  <!-- Game status message -->
  <div class="status-message" class:won={$gameStatus === 'won'} class:lost={$gameStatus === 'lost'}>
    {#if $isGameOver}
      <p transition:fade>{statusMessage}</p>
    {/if}
  </div>
  
  <!-- Game over controls -->
  {#if $isGameOver}
    <div class="game-over-controls" transition:fade>
      <div class="control-buttons">
        <button class="btn" on:click={startNewGame}>New Game</button>
        <button class="btn btn-secondary" on:click={toggleSecretCode}>
          {showSecretCode ? 'Hide Secret Code' : 'Show Secret Code'}
        </button>
        <button class="btn btn-secondary" on:click={toggleGameStats}>
          {showGameStats ? 'Hide Stats' : 'Show Stats'}
        </button>
      </div>
      
      <!-- Secret code display -->
      {#if showSecretCode}
        <div class="secret-code" transition:fly={{ y: 20, duration: 300 }}>
          <h3>Secret Code</h3>
          <div class="code-display">
            {#each $secretCode as color}
              <ColorSwatch {color} size="md" {colorBlindMode} />
            {/each}
          </div>
        </div>
      {/if}
      
      <!-- Game statistics -->
      {#if showGameStats}
        {@const stats = getStats()}
        <div class="game-stats" transition:fly={{ y: 20, duration: 300 }}>
          <h3>Game Statistics</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Games Played</span>
              <span class="stat-value">{stats.gamesPlayed}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Games Won</span>
              <span class="stat-value">{stats.gamesWon}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Win Rate</span>
              <span class="stat-value">
                {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Current Streak</span>
              <span class="stat-value">{stats.currentStreak}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Best Streak</span>
              <span class="stat-value">{stats.bestStreak}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Avg. Guesses</span>
              <span class="stat-value">
                {stats.gamesWon > 0 ? stats.averageGuesses.toFixed(1) : '-'}
              </span>
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
  
  <!-- New game confirmation dialog -->
  {#if showConfirmDialog}
    <div class="dialog-backdrop" transition:fade={{ duration: 150 }}>
      <div class="dialog" transition:fly={{ y: -20, duration: 300 }}>
        <h3>Start New Game?</h3>
        <p>Your current game progress will be lost.</p>
        <div class="dialog-buttons">
          <button class="btn btn-secondary" on:click={cancelNewGame}>Cancel</button>
          <button class="btn" on:click={startNewGame}>New Game</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .game-controls {
    width: 100%;
    position: relative;
  }
  
  .status-message {
    text-align: center;
    margin-bottom: var(--space-md);
    font-size: var(--font-size-lg);
    font-weight: bold;
  }
  
  .status-message.won {
    color: var(--color-success);
  }
  
  .status-message.lost {
    color: var(--color-error);
  }
  
  .game-over-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-md);
  }
  
  .control-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-sm);
  }
  
  .secret-code {
    background-color: var(--color-background);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    text-align: center;
    width: 100%;
    box-sizing: border-box;
  }
  
  .secret-code h3 {
    margin-top: 0;
    margin-bottom: var(--space-sm);
    color: var(--color-text);
  }
  
  .code-display {
    display: flex;
    justify-content: center;
    gap: var(--space-sm);
  }
  
  .game-stats {
    background-color: var(--color-background);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    width: 100%;
    box-sizing: border-box;
  }
  
  .game-stats h3 {
    margin-top: 0;
    margin-bottom: var(--space-md);
    text-align: center;
    color: var(--color-text);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--space-md);
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .stat-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
    margin-bottom: var(--space-xs);
  }
  
  .stat-value {
    font-size: var(--font-size-lg);
    font-weight: bold;
    color: var(--color-text);
  }
  
  .in-game-controls {
    display: flex;
    justify-content: center;
    margin-bottom: var(--space-md);
  }
  
  /* Dialog styles */
  .dialog-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-index-modal);
  }
  
  .dialog {
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    box-shadow: var(--shadow-lg);
    max-width: 90%;
    width: 320px;
    text-align: center;
  }
  
  .dialog h3 {
    margin-top: 0;
    color: var(--color-text);
  }
  
  .dialog-buttons {
    display: flex;
    justify-content: center;
    gap: var(--space-md);
    margin-top: var(--space-lg);
  }
  
  /* Mobile optimizations */
  @media (max-width: 480px) {
    .control-buttons {
      flex-direction: column;
      width: 100%;
    }
    
    .control-buttons .btn {
      width: 100%;
    }
    
    .dialog {
      padding: var(--space-md);
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>