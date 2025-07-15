<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  
  // Props
  export let show: boolean = false;
  export let onClose: () => void;
  export let colorBlindMode: boolean = false;
  
  // Handle keyboard events for accessibility
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose();
    }
  }
  
  // Handle click outside to close
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

{#if show}
  <div 
    class="modal-backdrop" 
    transition:fade={{ duration: 150 }}
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="help-title"
  >
    <div class="modal-content" transition:fly={{ y: -20, duration: 300 }}>
      <button class="close-btn" on:click={onClose} aria-label="Close help">×</button>
      
      <h2 id="help-title">How to Play Mastermind</h2>
      
      <div class="help-section">
        <h3>Game Objective</h3>
        <p>
          Mastermind is a code-breaking game. Your goal is to guess the secret code consisting of 4 colored pegs.
          You have 10 attempts to crack the code.
        </p>
      </div>
      
      <div class="help-section">
        <h3>How to Play</h3>
        <ol>
          <li>Select a color from the color palette at the bottom.</li>
          <li>Click on a position in the current guess row to place the selected color.</li>
          <li>Fill all 4 positions in the row.</li>
          <li>Click "Submit Guess" to check your guess.</li>
          <li>Use the feedback pegs to refine your next guess.</li>
        </ol>
      </div>
      
      <div class="help-section">
        <h3>Understanding Feedback</h3>
        <div class="feedback-explanation">
          <div class="feedback-item">
            <div class="feedback-peg black"></div>
            <p>Black peg: Correct color in the correct position</p>
          </div>
          <div class="feedback-item">
            <div class="feedback-peg white"></div>
            <p>White peg: Correct color but in the wrong position</p>
          </div>
          <p class="note">Note: The order of the feedback pegs does not correspond to the positions in your guess.</p>
        </div>
      </div>
      
      <div class="help-section">
        <h3>Difficulty Levels</h3>
        <ul>
          <li><strong>Easy:</strong> 6 colors to choose from</li>
          <li><strong>Medium:</strong> 7 colors to choose from</li>
          <li><strong>Hard:</strong> 8 colors to choose from</li>
        </ul>
        <p>You can change the difficulty in the Settings page.</p>
      </div>
      
      {#if colorBlindMode}
        <div class="help-section">
          <h3>Colorblind Mode</h3>
          <p>
            Colorblind mode is currently enabled. Each color has a unique pattern and letter
            to help distinguish between colors:
          </p>
          <div class="colorblind-guide">
            <div class="color-item diagonal-lines"><span>R</span> - Red</div>
            <div class="color-item horizontal-lines"><span>B</span> - Blue</div>
            <div class="color-item vertical-lines"><span>G</span> - Green</div>
            <div class="color-item dots"><span>Y</span> - Yellow</div>
            <div class="color-item cross-hatch"><span>P</span> - Purple</div>
            <div class="color-item zigzag"><span>O</span> - Orange</div>
            <div class="color-item grid"><span>N</span> - Brown</div>
            <div class="color-item circles"><span>K</span> - Pink</div>
          </div>
        </div>
      {/if}
      
      <div class="help-section">
        <h3>Keyboard Navigation</h3>
        <p>
          You can use the keyboard to play the game:
        </p>
        <ul>
          <li>Use <kbd>Tab</kbd> to navigate between interactive elements</li>
          <li>Use <kbd>Enter</kbd> or <kbd>Space</kbd> to select colors and positions</li>
          <li>Use <kbd>Escape</kbd> to close dialogs</li>
        </ul>
      </div>
      
      <div class="button-container">
        <button class="btn" on:click={onClose}>Got it!</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
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
    padding: var(--space-md);
    box-sizing: border-box;
  }
  
  .modal-content {
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    box-shadow: var(--shadow-lg);
    max-width: 90%;
    width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }
  
  .close-btn {
    position: absolute;
    top: var(--space-md);
    right: var(--space-md);
    background: transparent;
    border: none;
    font-size: 1.5rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-text);
    padding: 0;
  }
  
  h2 {
    color: var(--color-primary);
    margin-top: 0;
    margin-bottom: var(--space-md);
    text-align: center;
  }
  
  h3 {
    color: var(--color-text);
    margin-top: var(--space-md);
    margin-bottom: var(--space-sm);
  }
  
  .help-section {
    margin-bottom: var(--space-lg);
  }
  
  .feedback-explanation {
    background-color: var(--color-background);
    padding: var(--space-md);
    border-radius: var(--radius-md);
  }
  
  .feedback-item {
    display: flex;
    align-items: center;
    margin-bottom: var(--space-sm);
  }
  
  .feedback-peg {
    width: var(--feedback-peg-size-md);
    height: var(--feedback-peg-size-md);
    border-radius: 50%;
    margin-right: var(--space-md);
  }
  
  .feedback-peg.black {
    background-color: var(--color-black-peg);
  }
  
  .feedback-peg.white {
    background-color: var(--color-white-peg);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .note {
    font-style: italic;
    color: var(--color-text-light);
    font-size: var(--font-size-sm);
  }
  
  .colorblind-guide {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--space-md);
    margin-top: var(--space-sm);
  }
  
  .color-item {
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    text-align: center;
    color: rgba(0, 0, 0, 0.7);
    font-weight: bold;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .color-item span {
    font-size: 1.2rem;
    margin-bottom: var(--space-xs);
  }
  
  /* Colorblind patterns */
  .diagonal-lines {
    background-image: linear-gradient(45deg, rgba(255,0,0,0.5) 25%, transparent 25%, transparent 50%, rgba(255,0,0,0.5) 50%, rgba(255,0,0,0.5) 75%, transparent 75%, transparent);
    background-size: 8px 8px;
  }
  
  .horizontal-lines {
    background-image: linear-gradient(0deg, rgba(0,0,255,0.5) 25%, transparent 25%, transparent 50%, rgba(0,0,255,0.5) 50%, rgba(0,0,255,0.5) 75%, transparent 75%, transparent);
    background-size: 8px 8px;
  }
  
  .vertical-lines {
    background-image: linear-gradient(90deg, rgba(0,255,0,0.5) 25%, transparent 25%, transparent 50%, rgba(0,255,0,0.5) 50%, rgba(0,255,0,0.5) 75%, transparent 75%, transparent);
    background-size: 8px 8px;
  }
  
  .dots {
    background-image: radial-gradient(rgba(255,255,0,0.5) 25%, transparent 25%);
    background-size: 8px 8px;
  }
  
  .cross-hatch {
    background-image: 
      linear-gradient(45deg, rgba(255,0,255,0.5) 25%, transparent 25%, transparent 50%, rgba(255,0,255,0.5) 50%, rgba(255,0,255,0.5) 75%, transparent 75%, transparent),
      linear-gradient(-45deg, rgba(255,0,255,0.5) 25%, transparent 25%, transparent 50%, rgba(255,0,255,0.5) 50%, rgba(255,0,255,0.5) 75%, transparent 75%, transparent);
    background-size: 8px 8px;
  }
  
  .zigzag {
    background-image: 
      linear-gradient(135deg, rgba(255,128,0,0.5) 25%, transparent 25%), 
      linear-gradient(225deg, rgba(255,128,0,0.5) 25%, transparent 25%), 
      linear-gradient(315deg, rgba(255,128,0,0.5) 25%, transparent 25%), 
      linear-gradient(45deg, rgba(255,128,0,0.5) 25%, transparent 25%);
    background-size: 8px 8px;
  }
  
  .grid {
    background-image: 
      linear-gradient(0deg, rgba(139,69,19,0.5) 1px, transparent 1px), 
      linear-gradient(90deg, rgba(139,69,19,0.5) 1px, transparent 1px);
    background-size: 8px 8px;
  }
  
  .circles {
    background-image: radial-gradient(circle, rgba(255,182,193,0.5) 25%, transparent 25%), radial-gradient(circle, rgba(255,182,193,0.5) 25%, transparent 25%);
    background-position: 0 0, 4px 4px;
    background-size: 8px 8px;
  }
  
  kbd {
    background-color: var(--color-background);
    border: 1px solid var(--color-secondary-light);
    border-radius: var(--radius-sm);
    padding: 0 var(--space-xs);
    font-family: monospace;
  }
  
  .button-container {
    display: flex;
    justify-content: center;
    margin-top: var(--space-lg);
  }
  
  /* Mobile optimizations */
  @media (max-width: 480px) {
    .modal-content {
      padding: var(--space-md);
      width: 100%;
    }
    
    .colorblind-guide {
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: var(--space-sm);
    }
  }
</style>