<script lang="ts">
  import { goto } from '$app/navigation';
  import { gameStore } from '$lib/stores/gameStore';
  import { themeStore, isDarkTheme, type Theme } from '$lib/stores/themeStore';
  import { colorThemeStore, type ColorThemeName } from '$lib/stores/colorThemeStore';
  import { toastStore } from '$lib/stores/toastStore';
  import { fade, fly } from 'svelte/transition';
  import ColorThemeSelector from '$lib/components/ColorThemeSelector.svelte';
  import ToastContainer from '$lib/components/ToastContainer.svelte';
  import type { Difficulty } from '$lib/types/game';
  
  let title = "Settings";
  let currentDifficulty: Difficulty = 6;
  let originalDifficulty: Difficulty = 6;
  let colorBlindMode = false;
  let originalColorBlindMode = false;
  let currentTheme: Theme = 'system';
  let originalTheme: Theme = 'system';
  let currentColorTheme: ColorThemeName = 'classic';
  let originalColorTheme: ColorThemeName = 'classic';
  let showResetConfirm = false;
  let showResetStatsConfirm = false;
  
  // Debounce function to prevent excessive saves
  function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function(...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  // Get current settings on mount
  function loadSettings() {
    // Get current difficulty from the game store
    const gameState = gameStore.getState();
    currentDifficulty = gameState.difficulty;
    originalDifficulty = currentDifficulty;
    
    // Get colorblind mode from localStorage
    if (typeof localStorage !== 'undefined') {
      const savedColorBlindMode = localStorage.getItem('mastermind-colorblind-mode');
      if (savedColorBlindMode) {
        colorBlindMode = savedColorBlindMode === 'true';
        originalColorBlindMode = colorBlindMode;
      }
    }
    
    // Get current theme from the theme store
    themeStore.subscribe(state => {
      currentTheme = state.theme;
      originalTheme = currentTheme;
    })();
    
    // Get current color theme from the color theme store
    colorThemeStore.subscribe(theme => {
      currentColorTheme = theme;
      originalColorTheme = currentColorTheme;
    })();
  }
  
  // Save individual settings with debouncing
  const saveDifficulty = debounce((difficulty: Difficulty) => {
    if (difficulty !== originalDifficulty) {
      gameStore.setDifficulty(difficulty);
      originalDifficulty = difficulty;
      toastStore.success('Difficulty updated', 2000, 'bottom');
    }
  }, 300);
  
  const saveColorBlindMode = debounce((enabled: boolean) => {
    if (enabled !== originalColorBlindMode) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('mastermind-colorblind-mode', enabled.toString());
      }
      originalColorBlindMode = enabled;
      toastStore.success('Colorblind mode ' + (enabled ? 'enabled' : 'disabled'), 2000, 'bottom');
    }
  }, 300);
  
  const saveTheme = debounce((theme: Theme) => {
    if (theme !== originalTheme) {
      themeStore.setTheme(theme);
      originalTheme = theme;
      toastStore.success('Theme updated', 2000, 'bottom');
    }
  }, 300);
  
  const saveColorTheme = debounce((theme: ColorThemeName) => {
    if (theme !== originalColorTheme) {
      // Check if color theme has changed
      let colorThemeChanged = theme !== originalColorTheme;
      
      // Save color theme preference
      colorThemeStore.setTheme(theme);
      originalColorTheme = theme;
      
      // If color theme changed, start a new game
      if (colorThemeChanged) {
        gameStore.clearSavedGame();
        gameStore.newGame(currentDifficulty);
      }
      
      toastStore.success('Color theme updated', 2000, 'bottom');
    }
  }, 300);
  
  // Watch for changes in settings
  $: if (currentDifficulty !== originalDifficulty) saveDifficulty(currentDifficulty);
  $: if (colorBlindMode !== originalColorBlindMode) saveColorBlindMode(colorBlindMode);
  $: if (currentTheme !== originalTheme) saveTheme(currentTheme);
  $: if (currentColorTheme !== originalColorTheme) saveColorTheme(currentColorTheme);
  
  // Reset game
  function resetGame() {
    gameStore.clearSavedGame();
    gameStore.newGame(currentDifficulty);
    showResetConfirm = false;
  }
  
  // Reset statistics
  function resetStats() {
    gameStore.resetStats();
    showResetStatsConfirm = false;
  }
  
  // Navigate back to game
  function goBack() {
    goto('..');  // Use relative path to respect the base path
  }
  
  // Load settings on mount
  loadSettings();
</script>

<svelte:head>
  <title>{title} - Mastermind</title>
</svelte:head>

<div class="settings-container">
  <header>
    <button class="btn btn-icon back-btn" on:click={goBack} aria-label="Back to game">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>
    <h1>{title}</h1>
  </header>
  
  <main class="settings-content">
    <section class="settings-section">
      <h2>Game Difficulty</h2>
      <p class="section-description">Select the number of colors available in the game.</p>
      
      <div class="difficulty-options">
        <label class="difficulty-option">
          <input type="radio" name="difficulty" value="6" bind:group={currentDifficulty} />
          <span class="option-label">Easy (6 colors)</span>
        </label>
        
        <label class="difficulty-option">
          <input type="radio" name="difficulty" value="7" bind:group={currentDifficulty} />
          <span class="option-label">Medium (7 colors)</span>
        </label>
        
        <label class="difficulty-option">
          <input type="radio" name="difficulty" value="8" bind:group={currentDifficulty} />
          <span class="option-label">Hard (8 colors)</span>
        </label>
      </div>
    </section>
    
    <section class="settings-section">
      <h2>Appearance</h2>
      <p class="section-description">Choose your preferred theme.</p>
      
      <div class="theme-options">
        <label class="theme-option">
          <input type="radio" name="theme" value="system" bind:group={currentTheme} />
          <span class="option-label">System Default</span>
        </label>
        
        <label class="theme-option">
          <input type="radio" name="theme" value="light" bind:group={currentTheme} />
          <span class="option-label">Light Theme</span>
        </label>
        
        <label class="theme-option">
          <input type="radio" name="theme" value="dark" bind:group={currentTheme} />
          <span class="option-label">Dark Theme</span>
        </label>
      </div>
    </section>
    
    <section class="settings-section">
      <h2>Color Theme</h2>
      <p class="section-description">Choose a color palette for game pieces.</p>
      <ColorThemeSelector bind:selectedTheme={currentColorTheme} />
    </section>
    
    <section class="settings-section">
      <h2>Accessibility</h2>
      <label class="toggle-option">
        <span class="toggle-label">Colorblind Mode</span>
        <div class="toggle-switch">
          <input type="checkbox" bind:checked={colorBlindMode} />
          <span class="toggle-slider"></span>
        </div>
      </label>
      <p class="setting-description">
        Adds patterns and symbols to help distinguish colors.
      </p>
    </section>
    
    <section class="settings-section">
      <h2>Game Data</h2>
      <div class="button-group">
        <button class="btn btn-secondary" on:click={() => showResetConfirm = true}>
          Reset Current Game
        </button>
        <button class="btn btn-secondary" on:click={() => showResetStatsConfirm = true}>
          Reset Statistics
        </button>
      </div>
    </section>
    
    <!-- No save button needed with auto-save -->
  </main>
  
  <!-- Reset game confirmation dialog -->
  {#if showResetConfirm}
    <div class="dialog-backdrop" transition:fade={{ duration: 150 }}>
      <div class="dialog" transition:fly={{ y: -20, duration: 300 }}>
        <h3>Reset Current Game?</h3>
        <p>Your current game progress will be lost and a new game will be started.</p>
        <div class="dialog-buttons">
          <button class="btn btn-secondary" on:click={() => showResetConfirm = false}>Cancel</button>
          <button class="btn btn-danger" on:click={resetGame}>Reset Game</button>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Reset stats confirmation dialog -->
  {#if showResetStatsConfirm}
    <div class="dialog-backdrop" transition:fade={{ duration: 150 }}>
      <div class="dialog" transition:fly={{ y: -20, duration: 300 }}>
        <h3>Reset Statistics?</h3>
        <p>All your game statistics will be permanently deleted.</p>
        <div class="dialog-buttons">
          <button class="btn btn-secondary" on:click={() => showResetStatsConfirm = false}>Cancel</button>
          <button class="btn btn-danger" on:click={resetStats}>Reset Statistics</button>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Toast container for notifications -->
  <ToastContainer />
</div>

<style>
  .settings-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Fallback */
    min-height: calc(var(--vh, 1vh) * 100);
    padding: var(--space-md);
    max-width: 600px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  
  header {
    display: flex;
    align-items: center;
    margin-bottom: var(--space-lg);
    position: relative;
  }
  
  .back-btn {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: var(--space-xs);
    cursor: pointer;
    color: var(--color-text);
  }
  
  h1 {
    color: var(--color-primary);
    font-size: var(--font-size-xl);
    margin: 0 auto;
    text-align: center;
  }
  
  .settings-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
  }
  
  .settings-section {
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    box-shadow: var(--shadow-md);
  }
  
  h2 {
    color: var(--color-text);
    font-size: var(--font-size-lg);
    margin-top: 0;
    margin-bottom: var(--space-sm);
  }
  
  .section-description {
    color: var(--color-text-light);
    margin-top: 0;
    margin-bottom: var(--space-md);
  }
  
  .difficulty-options,
  .theme-options {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }
  
  .difficulty-option,
  .theme-option {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .difficulty-option input,
  .theme-option input {
    margin-right: var(--space-sm);
    cursor: pointer;
  }
  
  .option-label {
    font-size: var(--font-size-md);
  }
  
  .toggle-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-sm);
  }
  
  .toggle-label {
    font-size: var(--font-size-md);
  }
  
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
  }
  
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-secondary-light);
    transition: var(--transition-medium);
    border-radius: 24px;
  }
  
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: var(--transition-medium);
    border-radius: 50%;
  }
  
  input:checked + .toggle-slider {
    background-color: var(--color-primary);
  }
  
  input:checked + .toggle-slider:before {
    transform: translateX(26px);
  }
  
  .setting-description {
    color: var(--color-text-light);
    font-size: var(--font-size-sm);
    margin-top: 0;
  }
  
  .button-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }
  
  .save-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: var(--space-md);
    position: relative;
  }
  
  .save-message {
    position: absolute;
    top: 100%;
    margin-top: var(--space-sm);
    color: var(--color-success);
    font-weight: bold;
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
  
  .btn-danger {
    background-color: var(--color-error);
  }
  
  .btn-danger:hover {
    background-color: color-mix(in srgb, var(--color-error), black 10%);
  }
  
  /* Mobile optimizations */
  @media (max-width: 480px) {
    .settings-container {
      padding: var(--space-sm);
    }
    
    .settings-content {
      gap: var(--space-md);
    }
    
    .dialog {
      padding: var(--space-md);
    }
    
    .dialog-buttons {
      flex-direction: column;
      gap: var(--space-sm);
    }
  }
</style>