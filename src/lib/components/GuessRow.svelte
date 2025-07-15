<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Color, Feedback } from '$lib/types/game';
  import ColorSwatch from './ColorSwatch.svelte';
  import FeedbackPegs from './FeedbackPegs.svelte';
  
  // Props
  export let colors: (Color | null)[] = [null, null, null, null];
  export let feedback: Feedback = [];
  export let isActive: boolean = false;
  export let isComplete: boolean = false;
  export let rowIndex: number = 0;
  export let showFeedback: boolean = true;
  export let colorBlindMode: boolean = false;
  
  // Event dispatcher
  const dispatch = createEventDispatcher<{
    placeColor: { position: number };
  }>();
  
  // Handle clicking on a peg slot
  function handlePegClick(position: number) {
    if (isActive && !isComplete) {
      dispatch('placeColor', { position });
    }
  }
  
  // Determine if all positions are filled
  $: isGuessComplete = colors.every(color => color !== null);
</script>

<div 
  class="guess-row {isActive ? 'active' : ''} {isComplete ? 'complete' : ''}"
  data-row-index={rowIndex}
  aria-label={isActive ? 'Current guess row' : `Guess row ${rowIndex + 1}`}
>
  <div class="row-number">
    <span>{rowIndex + 1}</span>
  </div>
  
  <div class="pegs">
    {#each colors as color, i}
      <div 
        class="peg-slot {isActive ? 'interactive' : ''}"
        on:click={() => handlePegClick(i)}
        role={isActive ? 'button' : 'presentation'}
        tabindex={isActive ? 0 : -1}
        aria-label={isActive ? `Place color in position ${i + 1}` : undefined}
      >
        <ColorSwatch {color} size="md" selectable={false} {colorBlindMode} />
      </div>
    {/each}
  </div>
  
  {#if showFeedback}
    <div class="feedback-container">
      <FeedbackPegs 
        {feedback} 
        size="md" 
        showEmpty={true} 
        animated={isComplete} 
        {colorBlindMode}
      />
    </div>
  {/if}
</div>

<style>
  .guess-row {
    display: flex;
    align-items: center;
    padding: var(--space-sm);
    border-radius: var(--radius-md);
    background-color: transparent;
    margin-bottom: var(--space-sm);
    transition: all var(--transition-medium);
    position: relative;
  }
  
  .guess-row.active {
    background-color: var(--color-surface-alt);
    border: 1px solid var(--color-secondary-light);
  }
  
  .guess-row.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: var(--color-primary);
    border-top-left-radius: var(--radius-md);
    border-bottom-left-radius: var(--radius-md);
  }
  
  .guess-row.complete {
    background-color: var(--color-surface);
  }
  
  .row-number {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
    margin-right: var(--space-sm);
  }
  
  .pegs {
    display: flex;
    gap: var(--space-sm);
    flex: 1;
  }
  
  .peg-slot {
    padding: var(--space-xs);
    border-radius: var(--radius-circle);
  }
  
  .peg-slot.interactive {
    cursor: pointer;
    transition: background-color var(--transition-fast);
  }
  
  .peg-slot.interactive:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .peg-slot.interactive:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .feedback-container {
    margin-left: var(--space-md);
    min-width: 40px;
    display: flex;
    align-items: center;
  }
  
  /* Mobile optimizations */
  @media (max-width: 480px) {
    .guess-row {
      padding: var(--space-xs);
    }
    
    .pegs {
      gap: var(--space-xs);
    }
    
    .feedback {
      width: 32px;
      height: 32px;
      margin-left: var(--space-sm);
    }
  }
</style>