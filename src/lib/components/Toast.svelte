<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  
  export let message: string;
  export let type: 'success' | 'error' | 'info' | 'warning' = 'info';
  export let duration: number = 3000;
  export let position: 'top' | 'bottom' = 'bottom';
  
  const dispatch = createEventDispatcher();
  
  // Auto-dismiss after duration
  let timer: ReturnType<typeof setTimeout>;
  
  function startTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dismiss();
    }, duration);
  }
  
  function dismiss() {
    dispatch('dismiss');
  }
  
  // Start timer on mount
  import { onMount, onDestroy } from 'svelte';
  
  onMount(() => {
    startTimer();
  });
  
  onDestroy(() => {
    clearTimeout(timer);
  });
</script>

<div 
  class="toast-container"
  class:top={position === 'top'}
  class:bottom={position === 'bottom'}
>
  <div 
    class="toast {type}"
    on:click={dismiss}
    in:fly={{ y: position === 'top' ? -20 : 20, duration: 300 }}
    out:fade={{ duration: 200 }}
  >
    <div class="toast-content">
      <div class="toast-icon">
        {#if type === 'success'}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        {:else if type === 'error'}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        {:else if type === 'warning'}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        {/if}
      </div>
      <div class="toast-message">{message}</div>
    </div>
  </div>
</div>

<style>
  .toast-container {
    position: fixed;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    pointer-events: none;
    z-index: var(--z-index-toast, 1000);
    padding: var(--space-md);
  }
  
  .top {
    top: 0;
  }
  
  .bottom {
    bottom: 0;
  }
  
  .toast {
    background-color: var(--color-surface);
    color: var(--color-text);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-secondary-light);
    padding: var(--space-sm) var(--space-md);
    margin: var(--space-xs) 0;
    pointer-events: auto;
    cursor: pointer;
    max-width: 90%;
    width: auto;
    min-width: 250px;
  }
  
  .toast.success {
    border-left: 4px solid var(--color-success);
  }
  
  .toast.error {
    border-left: 4px solid var(--color-error);
  }
  
  .toast.warning {
    border-left: 4px solid var(--color-warning, #ff9800);
  }
  
  .toast.info {
    border-left: 4px solid var(--color-primary);
  }
  
  .toast-content {
    display: flex;
    align-items: center;
  }
  
  .toast-icon {
    margin-right: var(--space-sm);
    display: flex;
    align-items: center;
  }
  
  .success .toast-icon {
    color: var(--color-success);
  }
  
  .error .toast-icon {
    color: var(--color-error);
  }
  
  .warning .toast-icon {
    color: var(--color-warning, #ff9800);
  }
  
  .info .toast-icon {
    color: var(--color-primary);
  }
  
  .toast-message {
    font-size: var(--font-size-sm);
    flex: 1;
  }
  
  @media (max-width: 480px) {
    .toast {
      min-width: auto;
      width: 90%;
    }
  }
</style>