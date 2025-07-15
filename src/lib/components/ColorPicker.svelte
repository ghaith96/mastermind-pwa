<script lang="ts">
  import { spring } from 'svelte/motion';
  import { fade, scale } from 'svelte/transition';
  import type { Color } from '$lib/types/game';
  import ColorSwatch from './ColorSwatch.svelte';
  
  // Props
  export let colors: Color[] = [];
  export let selectedColor: Color | null = null;
  export let onSelectColor: (color: Color) => void;
  export let position: 'top' | 'bottom' = 'bottom';
  export let compact: boolean = false;
  export let colorBlindMode: boolean = false;
  
  // Animation spring for selected color
  const selectedSpring = spring({ scale: 1 });
  
  // Handle color selection
  function handleColorSelect(color: Color) {
    // Animate the selected color
    selectedSpring.set({ scale: 1.2 });
    setTimeout(() => selectedSpring.set({ scale: 1 }), 200);
    
    // Call the callback
    onSelectColor(color);
    
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }
  
  // Determine grid columns based on number of colors
  $: gridColumns = compact ? 
    `repeat(${Math.min(colors.length, 4)}, 1fr)` : 
    `repeat(${Math.min(colors.length, 6)}, 1fr)`;
    
  // Determine size based on compact mode
  $: size = compact ? 'md' : 'lg';
</script>

<div 
  class="color-picker {position} {compact ? 'compact' : ''}"
  role="listbox"
  aria-label="Color selection"
>
  <div class="color-grid" style="grid-template-columns: {gridColumns};">
    {#each colors as color (color.id)}
      <div 
        class="color-item"
        style={selectedColor?.id === color.id ? `transform: scale(${$selectedSpring.scale})` : ''}
        transition:scale|local={{ duration: 150 }}
      >
        <ColorSwatch 
          {color} 
          {size} 
          selectable={true} 
          selected={selectedColor?.id === color.id}
          onClick={() => handleColorSelect(color)}
          {colorBlindMode}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .color-picker {
    width: 100%;
    padding: var(--space-md);
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    box-sizing: border-box;
    z-index: var(--z-index-above);
  }
  
  .color-picker.top {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: var(--shadow-md);
  }
  
  .color-picker.bottom {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    box-shadow: var(--shadow-md);
  }
  
  .color-picker.compact {
    padding: var(--space-sm);
  }
  
  .color-grid {
    display: grid;
    gap: var(--space-md);
    justify-items: center;
  }
  
  .color-item {
    transition: transform var(--transition-fast);
  }
  
  /* Mobile optimizations */
  @media (max-width: 480px) {
    .color-picker {
      padding: var(--space-sm);
    }
    
    .color-grid {
      gap: var(--space-sm);
    }
  }
  
  /* Ensure touch targets are large enough */
  @media (pointer: coarse) {
    .color-item {
      min-width: var(--touch-target-min);
      min-height: var(--touch-target-min);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>