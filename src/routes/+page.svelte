<script lang="ts">
  import { onMount } from 'svelte';
  import { gameStore, gameStatus } from '$lib/stores/gameStore';
  import { colorThemeStore, type ColorThemeName } from '$lib/stores/colorThemeStore';
  import { toastStore } from '$lib/stores/toastStore';
  import GameBoard from '$lib/components/GameBoard.svelte';
  import HelpModal from '$lib/components/HelpModal.svelte';
  import ColorThemeButton from '$lib/components/ColorThemeButton.svelte';
  import SettingsPanel from '$lib/components/SettingsPanel.svelte';
  import ToastContainer from '$lib/components/ToastContainer.svelte';
  
  let title = "Mastermind";
  let colorBlindMode = false;
  let showHelpModal = false;
  let showSettingsPanel = false;
  
  // Handle new game button click
  function startNewGame() {
    gameStore.newGame();
  }
  
  // Toggle settings panel
  function toggleSettingsPanel() {
    showSettingsPanel = !showSettingsPanel;
  }
  
  // Toggle colorblind mode
  function toggleColorBlindMode() {
    colorBlindMode = !colorBlindMode;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mastermind-colorblind-mode', colorBlindMode.toString());
    }
  }
  
  // Handle theme change
  function handleThemeChange(event: CustomEvent<{theme: ColorThemeName}>) {
    // Start a new game when theme changes
    gameStore.clearSavedGame();
    gameStore.newGame();
  }
  
  // Handle setting change from settings panel
  function handleSettingChange(event: CustomEvent<{type: string; value: any}>) {
    if (event.detail.type === 'colorBlindMode') {
      colorBlindMode = event.detail.value;
    }
  }
  
  onMount(() => {
    // Initialize a new game if needed
    if ($gameStatus === 'won' || $gameStatus === 'lost') {
      gameStore.newGame();
    }
    
    // Load colorblind mode setting from localStorage
    if (typeof localStorage !== 'undefined') {
      const savedColorBlindMode = localStorage.getItem('mastermind-colorblind-mode');
      if (savedColorBlindMode) {
        colorBlindMode = savedColorBlindMode === 'true';
      }
    }
  });
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="container">
  <header class="game-header">
    <div class="header-buttons">
      <button 
        class="btn btn-icon" 
        on:click={startNewGame} 
        aria-label="New Game"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 2v6h6"></path>
          <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
        </svg>
      </button>
      
      <button 
        class="btn btn-icon" 
        on:click={() => showHelpModal = true} 
        aria-label="Help"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </button>
      
      <button 
        class="btn btn-icon settings-trigger" 
        on:click={toggleSettingsPanel} 
        aria-label="Settings"
        aria-expanded={showSettingsPanel}
        aria-controls="settings-panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
    </div>
  </header>
  
  <main class="game-container">
    <GameBoard {colorBlindMode} />
  </main>
  
  <!-- Footer removed as buttons moved to header -->
  
  <HelpModal 
    show={showHelpModal} 
    onClose={() => showHelpModal = false} 
    {colorBlindMode} 
  />
  
  <SettingsPanel 
    show={showSettingsPanel} 
    onClose={() => showSettingsPanel = false}
    on:settingChange={handleSettingChange}
  />
  
  <ToastContainer />
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh; /* Use full viewport height */
    height: calc(var(--vh, 1vh) * 100);
    padding: var(--space-md);
    max-width: 600px;
    margin: 0 auto;
    box-sizing: border-box;
    overflow: hidden; /* Prevent container from scrolling */
  }
  
  .game-header {
    display: flex;
    justify-content: flex-end; /* Align buttons to the right */
    align-items: center;
    position: relative;
    margin-bottom: var(--space-md);
    flex-shrink: 0; /* Prevent header from shrinking */
  }
  
  .header-buttons {
    display: flex;
    gap: var(--space-sm);
  }
  
  .game-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow-y: auto; /* Allow scrolling within the game container */
    scrollbar-width: thin; /* For Firefox */
    scrollbar-color: var(--color-secondary-light) var(--color-background); /* For Firefox */
  }
  
  footer {
    display: flex;
    justify-content: center;
    margin-top: var(--space-md);
    padding: var(--space-md) 0;
    gap: var(--space-xl);
  }
  
  .btn-icon {
    background: transparent;
    color: var(--color-primary);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease, transform 0.2s ease;
    box-shadow: none;
  }
  
  .btn-icon:hover {
    background-color: var(--color-primary-light);
    transform: translateY(-2px);
  }
  
  .btn-icon:active {
    transform: translateY(0);
  }
  
  /* Mobile-first responsive design */
  @media (max-width: 480px) {
    .container {
      padding: var(--space-sm);
    }
  }
</style>
