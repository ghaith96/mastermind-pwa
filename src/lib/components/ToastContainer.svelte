<script lang="ts">
  import { toastStore, type ToastMessage } from '$lib/stores/toastStore';
  import Toast from './Toast.svelte';
  
  // Group toasts by position
  $: topToasts = $toastStore.filter(toast => toast.position === 'top');
  $: bottomToasts = $toastStore.filter(toast => toast.position !== 'top');
  
  // Handle toast dismissal
  function handleDismiss(id: string) {
    toastStore.remove(id);
  }
</script>

{#if topToasts.length > 0}
  <div class="toast-group top">
    {#each topToasts as toast (toast.id)}
      <Toast 
        message={toast.message}
        type={toast.type}
        duration={toast.duration || 3000}
        position="top"
        on:dismiss={() => handleDismiss(toast.id)}
      />
    {/each}
  </div>
{/if}

{#if bottomToasts.length > 0}
  <div class="toast-group bottom">
    {#each bottomToasts as toast (toast.id)}
      <Toast 
        message={toast.message}
        type={toast.type}
        duration={toast.duration || 3000}
        position="bottom"
        on:dismiss={() => handleDismiss(toast.id)}
      />
    {/each}
  </div>
{/if}

<style>
  .toast-group {
    position: fixed;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: var(--z-index-toast, 1000);
    pointer-events: none;
    padding: var(--space-md);
  }
  
  .top {
    top: 0;
  }
  
  .bottom {
    bottom: 0;
  }
</style>