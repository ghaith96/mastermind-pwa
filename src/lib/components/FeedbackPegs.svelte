<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import type { Feedback } from '$lib/types/game';
  
  // Props
  export let feedback: Feedback = [];
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let showEmpty: boolean = true;
  export let animated: boolean = true;
  export let colorBlindMode: boolean = false;
  
  // Determine the CSS variable for size
  const sizeVar = size === 'sm' ? 'var(--feedback-peg-size-sm)' : 
                  size === 'lg' ? 'var(--feedback-peg-size-lg)' : 
                  'var(--feedback-peg-size-md)';
  
  // Count of each type of peg
  $: blackPegs = feedback.filter(peg => peg === 'black').length;
  $: whitePegs = feedback.filter(peg => peg === 'white').length;
  
  // Total number of pegs to display (including empty)
  $: totalPegs = showEmpty ? 4 : feedback.length;
  
  // Accessibility labels
  $: blackLabel = `${blackPegs} correct color${blackPegs !== 1 ? 's' : ''} in correct position${blackPegs !== 1 ? 's' : ''}`;
  $: whiteLabel = `${whitePegs} correct color${whitePegs !== 1 ? 's' : ''} in wrong position${whitePegs !== 1 ? 's' : ''}`;
</script>

<div 
  class="feedback-pegs {size} {colorBlindMode ? 'colorblind' : ''}"
  role="region"
  aria-label="Feedback: {blackLabel}, {whiteLabel}"
>
  {#if feedback.length > 0}
    <div class="pegs-grid">
      {#each feedback as peg, i (i)}
        <div 
          class="feedback-peg {peg} {colorBlindMode ? 'colorblind' : ''}"
          style="width: {sizeVar}; height: {sizeVar};"
          in:scale|local={{ duration: animated ? 200 : 0, delay: animated ? i * 100 : 0 }}
          aria-label={peg === 'black' ? 'Correct color and position' : 'Correct color but wrong position'}
        >
          {#if colorBlindMode}
            <span class="colorblind-indicator">
              {peg === 'black' ? '●' : '○'}
            </span>
          {/if}
        </div>
      {/each}
      
      {#if showEmpty}
        {#each Array(4 - feedback.length) as _, i (i + feedback.length)}
          <div 
            class="feedback-peg empty"
            style="width: {sizeVar}; height: {sizeVar};"
          ></div>
        {/each}
      {/if}
    </div>
  {:else if showEmpty}
    <div class="pegs-grid">
      {#each Array(4) as _, i}
        <div 
          class="feedback-peg empty"
          style="width: {sizeVar}; height: {sizeVar};"
        ></div>
      {/each}
    </div>
  {:else}
    <div class="feedback-placeholder" aria-label="No feedback yet">
      <span>?</span>
    </div>
  {/if}
  
  {#if feedback.length > 0}
    <div class="feedback-summary" aria-hidden="true">
      <div class="summary-item">
        <span class="summary-dot black"></span>
        <span class="summary-count">{blackPegs}</span>
      </div>
      <div class="summary-item">
        <span class="summary-dot white"></span>
        <span class="summary-count">{whitePegs}</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .feedback-pegs {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .pegs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: var(--space-xs);
    margin-bottom: var(--space-xs);
  }
  
  .feedback-peg {
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
  }
  
  .feedback-peg.black {
    background-color: var(--color-black-peg);
    border: 1px solid rgba(0, 0, 0, 0.8);
  }
  
  .feedback-peg.white {
    background-color: var(--color-white-peg);
    border: 1px solid var(--color-white-peg-border);
  }
  
  .feedback-peg.empty {
    background-color: transparent;
    border: 1px dashed var(--color-secondary-light);
  }
  
  .feedback-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-light);
    font-size: var(--font-size-lg);
    font-weight: bold;
  }
  
  /* Colorblind mode */
  .feedback-peg.colorblind {
    background-color: var(--color-surface);
    border: 3px solid var(--color-black-peg);
    position: relative;
  }
  
  /* Black peg in colorblind mode */
  .feedback-peg.colorblind.black::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 70%;
    background-color: var(--color-black-peg);
    border-radius: 50%;
  }
  
  /* White peg in colorblind mode */
  .feedback-peg.colorblind.white::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 70%;
    border: 3px solid var(--color-black-peg);
    border-radius: 50%;
    box-sizing: border-box;
  }
  
  /* Hide the text indicators since we're using ::after pseudo-elements */
  .feedback-peg.colorblind .colorblind-indicator {
    display: none;
  }
  
  /* Feedback summary */
  .feedback-summary {
    display: flex;
    gap: var(--space-sm);
    margin-top: var(--space-xs);
    font-size: var(--font-size-sm);
  }
  
  .summary-item {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }
  
  .summary-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  
  .summary-dot.black {
    background-color: var(--color-black-peg);
    border: 1px solid rgba(0, 0, 0, 0.8);
  }
  
  .summary-dot.white {
    background-color: var(--color-white-peg);
    border: 1px solid var(--color-white-peg-border);
  }
  
  .summary-count {
    color: var(--color-text);
  }
  
  /* Size variations */
  .feedback-pegs.sm .pegs-grid {
    gap: 2px;
  }
  
  .feedback-pegs.lg .pegs-grid {
    gap: var(--space-sm);
  }
  
  /* Mobile optimizations */
  @media (max-width: 480px) {
    .pegs-grid {
      gap: 2px;
    }
  }
</style>