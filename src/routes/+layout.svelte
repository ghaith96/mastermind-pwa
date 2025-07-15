<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount, afterUpdate } from 'svelte';
  import { fade } from 'svelte/transition';
  import { isDarkTheme } from '$lib/stores/themeStore';
  import '$lib/styles/global.css';
  import '$lib/styles/mobile-optimizations.css';
  import '$lib/styles/animations.css';
  import '$lib/styles/theme.css';

  // PWA installation state
  let deferredPrompt: any;
  let showInstallPrompt = false;

  // Update the document theme when isDarkTheme changes
  $: if (browser && typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', $isDarkTheme ? 'dark' : 'light');
  }

  onMount(() => {
    if (browser) {
      // Mark the document as theme-ready after a short delay
      // This ensures the theme is fully applied before showing content
      setTimeout(() => {
        document.documentElement.classList.add('theme-ready');
      }, 50);
      // Unregister any existing service workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (let registration of registrations) {
            registration.unregister();
            console.log('Service Worker unregistered');
          }
        });
      }

      // Register a minimal service worker after a short delay
      // The delay ensures the app is fully initialized first
      setTimeout(() => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
              console.log('Minimal Service Worker registered successfully:', registration);
            })
            .catch((error) => {
              console.log('Service Worker registration failed:', error);
            });
        }
      }, 1000);

      // Handle PWA install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67+ from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show install button
        showInstallPrompt = true;
      });

      // Handle installed PWA
      window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        showInstallPrompt = false;
      });

      // Handle orientation changes for mobile
      window.addEventListener('orientationchange', () => {
        // Force layout recalculation after orientation change
        setTimeout(() => {
          const vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 100);
      });
      
      // Set initial viewport height variable
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Update on resize as well
      window.addEventListener('resize', () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });

      // Prevent zooming on mobile
      document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  });

  // Install PWA function
  function installPWA() {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt
      deferredPrompt = null;
      showInstallPrompt = false;
    });
  }
</script>

<main class="theme-transition">
  <slot />
  
  {#if showInstallPrompt}
    <div class="install-prompt" transition:fade>
      <p>Install Mastermind for the best experience!</p>
      <button on:click={installPWA}>Install</button>
      <button class="close-btn" on:click={() => showInstallPrompt = false}>×</button>
    </div>
  {/if}
</main>

<style>
  main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .install-prompt {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-primary);
    color: var(--color-text-on-dark);
    padding: var(--space-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    z-index: var(--z-index-toast);
  }
  
  .install-prompt p {
    margin: 0;
    flex: 1;
  }
  
  .install-prompt button {
    background-color: var(--color-surface);
    color: var(--color-primary);
    border: none;
    border-radius: var(--radius-sm);
    padding: var(--space-xs) var(--space-md);
    margin-left: var(--space-md);
    font-weight: bold;
    cursor: pointer;
  }
  
  .close-btn {
    background: transparent !important;
    color: var(--color-text-on-dark) !important;
    font-size: 1.5rem;
    padding: 0 !important;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Mobile optimizations for install prompt */
  @media (max-width: 480px) {
    .install-prompt {
      padding: var(--space-sm);
      flex-wrap: wrap;
    }
    
    .install-prompt p {
      margin-bottom: var(--space-xs);
      flex-basis: 100%;
    }
    
    .install-prompt button {
      margin-left: 0;
      margin-right: var(--space-sm);
    }
  }
</style>