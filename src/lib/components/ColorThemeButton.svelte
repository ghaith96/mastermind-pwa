<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { colorThemeStore, COLOR_THEMES, type ColorThemeName } from '$lib/stores/colorThemeStore';
  import { fade, fly } from 'svelte/transition';
  
  // Current theme
  let currentTheme: ColorThemeName = $colorThemeStore;
  let showThemeSelector = false;
  
  // Get all available themes
  const themes = Object.values(COLOR_THEMES);
  
  // Event dispatcher
  const dispatch = createEventDispatcher<{
    themeChange: { theme: ColorThemeName };
  }>();
  
  // Handle theme selection
  function selectTheme(theme: ColorThemeName) {
    currentTheme = theme;
    colorThemeStore.setTheme(theme);
    showThemeSelector = false;
    dispatch('themeChange', { theme });
  }
  
  // Toggle theme selector
  function toggleThemeSelector() {
    showThemeSelector = !showThemeSelector;
  }
  
  // Close theme selector when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.theme-button') && !target.closest('.theme-selector-popup')) {
      showThemeSelector = false;
    }
  }
  
  onMount(() => {
    // Add click outside listener
    document.addEventListener('click', handleClickOutside);
    
    // Subscribe to theme changes
    const unsubscribe = colorThemeStore.subscribe(theme => {
      currentTheme = theme;
    });
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleClickOutside);
      unsubscribe();
    };
  });
</script>

<div class="theme-button-container">
  <button 
    class="btn btn-icon theme-button" 
    on:click={toggleThemeSelector} 
    aria-label="Change color theme"
    aria-expanded={showThemeSelector}
    aria-controls="theme-selector-popup"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  </button>
  
  {#if showThemeSelector}
    <div 
      id="theme-selector-popup"
      class="theme-selector-popup"
      transition:fly={{ y: 10, duration: 200 }}
    >
      <div class="theme-options">
        {#each themes as theme}
          <button 
            class="theme-option" 
            class:selected={currentTheme === theme.id}
            on:click={() => selectTheme(theme.id)}
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
    </div>
  {/if}
</div>

<style>
  .theme-button-container {
    position: relative;
  }
  
  .theme-selector-popup {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 10px;
    background-color: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    padding: var(--space-md);
    z-index: 100;
    width: 280px;
    max-width: 90vw;
  }
  
  .theme-selector-popup::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 8px;
    border-style: solid;
    border-color: var(--color-surface) transparent transparent transparent;
  }
  
  .theme-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
    max-height: 300px;
    overflow-y: auto;
  }
  
  .theme-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-xs);
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    background: var(--color-surface-alt);
    cursor: pointer;
    transition: var(--transition-medium);
    width: 100%;
  }
  
  .theme-option:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  .theme-option.selected {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary-light);
  }
  
  .theme-preview {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-bottom: var(--space-xs);
    width: 100%;
  }
  
  .color-sample {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .theme-name {
    font-size: var(--font-size-xs);
    font-weight: 500;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    text-align: center;
  }
</style>