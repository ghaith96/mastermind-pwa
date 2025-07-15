<script lang="ts">
  import { colorThemeStore, COLOR_THEMES, type ColorThemeName } from '$lib/stores/colorThemeStore';
  
  // Get all available themes
  const themes = Object.values(COLOR_THEMES);
  
  // Export selected theme as a prop with two-way binding
  export let selectedTheme: ColorThemeName = $colorThemeStore;
</script>

<div class="theme-selector">
  <div class="theme-options">
    {#each themes as theme}
      <button 
        class="theme-option" 
        class:selected={selectedTheme === theme.id}
        on:click={() => selectedTheme = theme.id}
        aria-label="Select {theme.name} theme"
      >
        <div class="theme-preview">
          {#each Object.values(theme.colors).slice(0, 8) as color}
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

<style>
  .theme-options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--space-md);
  }
  
  .theme-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-sm);
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    background: var(--color-surface-alt);
    cursor: pointer;
    transition: var(--transition-medium);
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
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
    margin-bottom: var(--space-sm);
    width: 100%;
    max-width: 120px;
  }
  
  .color-sample {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .theme-name {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text);
  }
  
  @media (max-width: 480px) {
    .theme-options {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .color-sample {
      width: 16px;
      height: 16px;
    }
  }
</style>