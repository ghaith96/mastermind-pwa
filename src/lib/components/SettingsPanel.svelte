<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { gameStore } from '$lib/stores/gameStore';
  import { themeStore, type Theme } from '$lib/stores/themeStore';
  import { colorThemeStore, COLOR_THEMES, type ColorThemeName } from '$lib/stores/colorThemeStore';
  import { toastStore } from '$lib/stores/toastStore';
  import type { Difficulty } from '$lib/types/game';
  
  // Props
  export let show: boolean = false;
  export let onClose: () => void;
  
  // Local state
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
  
  // Event dispatcher
  const dispatch = createEventDispatcher<{
    settingChange: { type: string; value: any };
  }>();
  
  // Debounce function to prevent excessive saves
  function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function(...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  // Load settings
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
      dispatch('settingChange', { type: 'difficulty', value: difficulty });
    }
  }, 300);
  
  const saveColorBlindMode = debounce((enabled: boolean) => {
    if (enabled !== originalColorBlindMode) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('mastermind-colorblind-mode', enabled.toString());
      }
      originalColorBlindMode = enabled;
      toastStore.success('Colorblind mode ' + (enabled ? 'enabled' : 'disabled'), 2000, 'bottom');
      dispatch('settingChange', { type: 'colorBlindMode', value: enabled });
    }
  }, 300);
  
  const saveTheme = debounce((theme: Theme) => {
    if (theme !== originalTheme) {
      themeStore.setTheme(theme);
      originalTheme = theme;
      toastStore.success('Theme updated', 2000, 'bottom');
      dispatch('settingChange', { type: 'theme', value: theme });
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
      dispatch('settingChange', { type: 'colorTheme', value: theme });
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
    toastStore.success('Game reset', 2000, 'bottom');
  }
  
  // Reset statistics
  function resetStats() {
    gameStore.resetStats();
    showResetStatsConfirm = false;
    toastStore.success('Statistics reset', 2000, 'bottom');
  }
  
  // Handle keyboard events for accessibility
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && show) {
      onClose();
    }
  }
  
  // Handle click outside to close
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (show && !target.closest('.settings-panel') && !target.closest('.settings-trigger')) {
      onClose();
    }
  }
  
  // Load settings on mount
  onMount(() => {
    loadSettings();
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });
  
  // Add click outside handler when panel is shown
  $: if (show) {
    // Use setTimeout to ensure this runs after the current event loop
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
</script>

{#if show}
  <div 
    class="settings-panel-container"
    transition:fade={{ duration: 150 }}
  >
    <div 
      class="settings-panel"
      transition:fly={{ x: 300, duration: 300 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <header class="panel-header">
        <h2 id="settings-title">Settings</h2>
        <button class="btn-close" on:click={onClose} aria-label="Close settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>
      
      <div class="panel-content">
        <section class="settings-section">
          <h3>Game Difficulty</h3>
          
          <div class="setting-buttons">
            <button 
              class="setting-btn" 
              class:active={currentDifficulty === 6}
              on:click={() => currentDifficulty = 6}
            >
              Easy (6 colors)
            </button>
            
            <button 
              class="setting-btn" 
              class:active={currentDifficulty === 7}
              on:click={() => currentDifficulty = 7}
            >
              Medium (7 colors)
            </button>
            
            <button 
              class="setting-btn" 
              class:active={currentDifficulty === 8}
              on:click={() => currentDifficulty = 8}
            >
              Hard (8 colors)
            </button>
          </div>
        </section>
        
        <section class="settings-section">
          <h3>Appearance</h3>
          
          <div class="setting-buttons">
            <button 
              class="setting-btn" 
              class:active={currentTheme === 'system'}
              on:click={() => currentTheme = 'system'}
            >
              System Default
            </button>
            
            <button 
              class="setting-btn" 
              class:active={currentTheme === 'light'}
              on:click={() => currentTheme = 'light'}
            >
              Light Theme
            </button>
            
            <button 
              class="setting-btn" 
              class:active={currentTheme === 'dark'}
              on:click={() => currentTheme = 'dark'}
            >
              Dark Theme
            </button>
          </div>
        </section>
        
        <section class="settings-section">
          <h3>Color Theme</h3>
          
          <div class="color-theme-buttons">
            {#each Object.entries(COLOR_THEMES) as [id, theme]}
              <button 
                class="color-theme-btn" 
                class:active={currentColorTheme === id}
                on:click={() => currentColorTheme = id as ColorThemeName}
                aria-label="Select {theme.name} theme"
              >
                <div class="theme-preview">
                  {#each Object.values(theme.colors).slice(0, 4) as color}
                    <div 
                      class="color-sample" 
                      style="background-color: {color.hex};" 
                      title={color.name}
                    ></div>
                  {/each}
                </div>
                <div class="theme-name">{theme.name}</div>
              </button>
            {/each}
          </div>
        </section>
        
        <section class="settings-section">
          <h3>Accessibility</h3>
          
          <div class="toggle-setting">
            <span class="toggle-label">Colorblind Mode</span>
            <label class="toggle-switch">
              <input type="checkbox" bind:checked={colorBlindMode} />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <p class="setting-description">
            Adds patterns and symbols to help distinguish colors.
          </p>
        </section>
        
        <section class="settings-section">
          <h3>Game Data</h3>
          
          <div class="setting-buttons">
            <button class="setting-btn danger" on:click={() => showResetConfirm = true}>
              Reset Current Game
            </button>
            
            <button class="setting-btn danger" on:click={() => showResetStatsConfirm = true}>
              Reset Statistics
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
{/if}

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

<style>
  .settings-panel-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--z-index-modal);
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: flex-end;
  }
  
  .settings-panel {
    width: 320px;
    max-width: 90vw;
    height: 100%;
    background-color: var(--color-surface);
    border-left: 1px solid var(--color-secondary-light);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    border-bottom: 1px solid var(--color-secondary-light);
    position: sticky;
    top: 0;
    background-color: var(--color-surface);
    z-index: 1;
  }
  
  h2 {
    margin: 0;
    font-size: var(--font-size-lg);
    color: var(--color-primary);
  }
  
  .btn-close {
    background: transparent;
    border: none;
    color: var(--color-text);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }
  
  .btn-close:hover {
    background-color: var(--color-secondary-light);
  }
  
  .panel-content {
    flex: 1;
    padding: var(--space-md);
    overflow-y: auto;
  }
  
  .settings-section {
    margin-bottom: var(--space-lg);
  }
  
  h3 {
    font-size: var(--font-size-md);
    margin-top: 0;
    margin-bottom: var(--space-sm);
    color: var(--color-text);
  }
  
  .setting-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }
  
  .setting-btn {
    padding: var(--space-sm) var(--space-md);
    background-color: var(--color-surface-alt);
    border: 1px solid var(--color-secondary-light);
    border-radius: var(--radius-md);
    color: var(--color-text);
    font-size: var(--font-size-md);
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }
  
  .setting-btn:hover {
    background-color: var(--color-secondary-light);
    transform: translateY(-1px);
  }
  
  .setting-btn.active {
    background-color: var(--color-primary-light);
    border-color: var(--color-primary);
    color: var(--color-primary);
    font-weight: 500;
  }
  
  .setting-btn.danger {
    color: var(--color-error);
    border-color: var(--color-error);
  }
  
  .setting-btn.danger:hover {
    background-color: rgba(211, 47, 47, 0.1);
  }
  
  .color-theme-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
    margin-top: var(--space-sm);
  }
  
  .color-theme-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-xs);
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    background: var(--color-surface-alt);
    cursor: pointer;
    transition: var(--transition-medium);
  }
  
  .color-theme-btn:hover {
    transform: translateY(-2px);
  }
  
  .color-theme-btn.active {
    border-color: var(--color-primary);
    background-color: var(--color-primary-light);
  }
  
  .theme-preview {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-bottom: var(--space-xs);
    width: 100%;
  }
  
  .color-sample {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .theme-name {
    font-size: var(--font-size-xs);
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    text-align: center;
  }
  
  .toggle-setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xs);
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
    z-index: calc(var(--z-index-modal) + 1);
  }
  
  .dialog {
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    border: 1px solid var(--color-secondary-light);
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
    .settings-panel {
      width: 280px;
    }
    
    .panel-content {
      padding: var(--space-sm);
    }
    
    .toggle-setting {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-sm);
    }
    
    .toggle-switch {
      align-self: flex-start;
    }
    
    .color-theme-buttons {
      grid-template-columns: 1fr;
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