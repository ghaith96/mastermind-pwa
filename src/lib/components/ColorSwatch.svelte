<script lang="ts">
  import type { Color } from '$lib/types/game';
  
  export let color: Color | null = null;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let selectable: boolean = false;
  export let selected: boolean = false;
  export let onClick: (() => void) | null = null;
  export let colorBlindMode: boolean = false;
  
  // Determine the CSS variable for size
  const sizeVar = size === 'sm' ? 'var(--peg-size-sm)' : 
                  size === 'lg' ? 'var(--peg-size-lg)' : 
                  'var(--peg-size-md)';
  
  // Handle click event
  function handleClick() {
    if (selectable && onClick) {
      onClick();
    }
  }
  
  // Handle keyboard events for accessibility
  function handleKeyDown(event: KeyboardEvent) {
    if (selectable && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  }
  
  // Get color blind pattern based on color
  function getColorBlindPattern(colorId: string): string {
    // Extract the base color from the ID
    const baseColor = colorId.toLowerCase().split('-').pop() || colorId.toLowerCase();
    
    switch (baseColor) {
      case 'red':
      case 'dark_red':
      case 'darkred':
      case 'dark-red':
        return 'diagonal-lines';
      
      case 'blue':
      case 'light_blue':
      case 'lightblue':
      case 'light-blue':
      case 'ice_blue':
      case 'iceblue':
      case 'ice-blue':
      case 'ocean_blue':
      case 'oceanblue':
      case 'ocean-blue':
      case 'sky_blue':
      case 'skyblue':
      case 'sky-blue':
        return 'horizontal-lines';
      
      case 'green':
      case 'leaf_green':
      case 'leafgreen':
      case 'leaf-green':
      case 'forest_green':
      case 'forestgreen':
      case 'forest-green':
        return 'vertical-lines';
      
      case 'yellow':
        return 'dots';
      
      case 'purple':
      case 'violet':
      case 'indigo':
      case 'mountain_purple':
      case 'mountainpurple':
      case 'mountain-purple':
        return 'cross-hatch';
      
      case 'orange':
      case 'sunset_orange':
      case 'sunsetorange':
      case 'sunset-orange':
        return 'zigzag';
      
      case 'brown':
      case 'sandy_brown':
      case 'sandybrown':
      case 'sandy-brown':
        return 'grid';
      
      case 'pink':
        return 'circles';
      
      case 'gray':
      case 'grey':
      case 'light_gray':
      case 'lightgray':
      case 'light-gray':
      case 'dim_gray':
      case 'dimgray':
      case 'dim-gray':
      case 'dark_gray':
      case 'darkgray':
      case 'dark-gray':
      case 'charcoal':
      case 'stone_gray':
      case 'stonegray':
      case 'stone-gray':
      case 'silver':
        return 'diagonal-lines';
      
      case 'white':
      case 'black':
        return 'cross-hatch';
      
      case 'mint':
      case 'pastel_mint':
      case 'pastelmint':
      case 'pastel-mint':
        return 'vertical-lines';
      
      case 'lavender':
      case 'pastel_lavender':
      case 'pastellavender':
      case 'pastel-lavender':
        return 'circles';
      
      default:
        // For any other colors, determine pattern based on the first letter
        const firstChar = colorId.charAt(0).toLowerCase();
        if (firstChar >= 'a' && firstChar <= 'c') return 'diagonal-lines';
        if (firstChar >= 'd' && firstChar <= 'f') return 'horizontal-lines';
        if (firstChar >= 'g' && firstChar <= 'i') return 'vertical-lines';
        if (firstChar >= 'j' && firstChar <= 'l') return 'dots';
        if (firstChar >= 'm' && firstChar <= 'o') return 'cross-hatch';
        if (firstChar >= 'p' && firstChar <= 'r') return 'zigzag';
        if (firstChar >= 's' && firstChar <= 'u') return 'grid';
        return 'circles'; // v-z
    }
  }
  
  // Get color blind symbol based on color
  function getColorBlindSymbol(colorId: string): string {
    // Extract the base color from the ID
    const baseColor = colorId.toLowerCase().split('-').pop() || colorId.toLowerCase();
    
    switch (baseColor) {
      case 'red':
      case 'dark_red':
      case 'darkred':
      case 'dark-red':
        return 'R';
      
      case 'blue':
      case 'light_blue':
      case 'lightblue':
      case 'light-blue':
      case 'ice_blue':
      case 'iceblue':
      case 'ice-blue':
      case 'ocean_blue':
      case 'oceanblue':
      case 'ocean-blue':
      case 'sky_blue':
      case 'skyblue':
      case 'sky-blue':
        return 'B';
      
      case 'green':
      case 'leaf_green':
      case 'leafgreen':
      case 'leaf-green':
      case 'forest_green':
      case 'forestgreen':
      case 'forest-green':
        return 'G';
      
      case 'yellow':
        return 'Y';
      
      case 'purple':
      case 'violet':
      case 'mountain_purple':
      case 'mountainpurple':
      case 'mountain-purple':
        return 'P';
      
      case 'orange':
      case 'sunset_orange':
      case 'sunsetorange':
      case 'sunset-orange':
        return 'O';
      
      case 'brown':
      case 'sandy_brown':
      case 'sandybrown':
      case 'sandy-brown':
        return 'N';
      
      case 'pink':
        return 'K';
      
      case 'indigo':
        return 'I';
      
      case 'gray':
      case 'grey':
      case 'light_gray':
      case 'lightgray':
      case 'light-gray':
      case 'dim_gray':
      case 'dimgray':
      case 'dim-gray':
      case 'dark_gray':
      case 'darkgray':
      case 'dark-gray':
      case 'charcoal':
      case 'stone_gray':
      case 'stonegray':
      case 'stone-gray':
      case 'silver':
        return 'S'; // S for Silver/Stone
      
      case 'white':
        return 'W';
      
      case 'black':
        return 'K'; // K for blacK
      
      case 'mint':
      case 'pastel_mint':
      case 'pastelmint':
      case 'pastel-mint':
        return 'M';
      
      case 'lavender':
      case 'pastel_lavender':
      case 'pastellavender':
      case 'pastel-lavender':
        return 'L';
      
      default:
        // For any other colors, use the first letter
        return colorId.charAt(0).toUpperCase();
    }
  }
  
  // Get pattern class if colorblind mode is enabled
  $: patternClass = colorBlindMode && color ? getColorBlindPattern(color.id) : '';
  
  // Get symbol if colorblind mode is enabled
  $: symbol = colorBlindMode && color ? getColorBlindSymbol(color.id) : '';
</script>

<div 
  class="color-swatch {size} {selectable ? 'selectable' : ''} {selected ? 'selected' : ''}"
  style="background-color: {color ? color.hex : 'transparent'}; width: {sizeVar}; height: {sizeVar};"
  on:click={handleClick}
  on:keydown={handleKeyDown}
  role={selectable ? 'button' : 'presentation'}
  tabindex={selectable ? 0 : -1}
  aria-label={color ? color.name : 'Empty color slot'}
  aria-selected={selected}
>
  {#if !color}
    <div class="empty-slot"></div>
  {:else if colorBlindMode}
    <div class="pattern-overlay {patternClass}"></div>
    <span class="colorblind-symbol">{symbol}</span>
  {/if}
</div>

<style>
  .color-swatch {
    border-radius: var(--radius-circle);
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    transition: transform var(--transition-fast);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .selectable {
    cursor: pointer;
  }
  
  .selectable:hover {
    transform: scale(1.05);
  }
  
  .selectable:active {
    transform: scale(0.95);
  }
  
  .selected {
    border: 2px solid var(--color-primary);
  }
  
  .empty-slot {
    width: 100%;
    height: 100%;
    border-radius: var(--radius-circle);
    border: 2px dashed var(--color-secondary-light);
    box-sizing: border-box;
  }
  
  /* Pattern overlay container */
  .pattern-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: var(--radius-circle);
    z-index: 0;
  }
  
  /* Colorblind patterns with enhanced contrast */
  .pattern-overlay.diagonal-lines {
    background-image: linear-gradient(45deg, rgba(255,255,255,1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 75%, transparent 75%, transparent);
    background-size: 8px 8px;
    border: 2px solid rgba(0,0,0,0.5);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
  }
  
  .pattern-overlay.horizontal-lines {
    background-image: linear-gradient(0deg, rgba(255,255,255,1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 75%, transparent 75%, transparent);
    background-size: 8px 8px;
    border: 2px solid rgba(0,0,0,0.5);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
  }
  
  .pattern-overlay.vertical-lines {
    background-image: linear-gradient(90deg, rgba(255,255,255,1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 75%, transparent 75%, transparent);
    background-size: 8px 8px;
    border: 2px solid rgba(0,0,0,0.5);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
  }
  
  .pattern-overlay.dots {
    background-image: radial-gradient(rgba(255,255,255,1) 25%, transparent 25%);
    background-size: 6px 6px;
    border: 2px solid rgba(0,0,0,0.5);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
  }
  
  .pattern-overlay.cross-hatch {
    background-image: 
      linear-gradient(45deg, rgba(255,255,255,1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 75%, transparent 75%, transparent),
      linear-gradient(-45deg, rgba(255,255,255,1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 75%, transparent 75%, transparent);
    background-size: 8px 8px;
    border: 2px solid rgba(0,0,0,0.5);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
  }
  
  .pattern-overlay.zigzag {
    background-image: 
      linear-gradient(135deg, rgba(255,255,255,1) 25%, transparent 25%), 
      linear-gradient(225deg, rgba(255,255,255,1) 25%, transparent 25%), 
      linear-gradient(315deg, rgba(255,255,255,1) 25%, transparent 25%), 
      linear-gradient(45deg, rgba(255,255,255,1) 25%, transparent 25%);
    background-size: 8px 8px;
    border: 2px solid rgba(0,0,0,0.5);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
  }
  
  .pattern-overlay.grid {
    background-image: 
      linear-gradient(0deg, rgba(255,255,255,1) 2px, transparent 2px), 
      linear-gradient(90deg, rgba(255,255,255,1) 2px, transparent 2px);
    background-size: 8px 8px;
    border: 2px solid rgba(0,0,0,0.5);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
  }
  
  .pattern-overlay.circles {
    background-image: radial-gradient(circle, rgba(255,255,255,1) 25%, transparent 25%), radial-gradient(circle, rgba(255,255,255,1) 25%, transparent 25%);
    background-position: 0 0, 4px 4px;
    background-size: 8px 8px;
    border: 2px solid rgba(0,0,0,0.5);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
  }
  
  .colorblind-symbol {
    color: rgba(0, 0, 0, 0.9);
    font-weight: bold;
    font-size: 0.8rem;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    width: 70%;
    height: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
  
  /* Accessibility */
  .selectable:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  /* Size variations */
  .sm .colorblind-symbol {
    font-size: 0.6rem;
  }
  
  .lg .colorblind-symbol {
    font-size: 1rem;
  }
</style>