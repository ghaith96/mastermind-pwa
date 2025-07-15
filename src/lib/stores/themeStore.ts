import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  systemPrefersDark: boolean;
}

// Initialize theme state
function createThemeStore() {
  // Default state
  const defaultState: ThemeState = {
    theme: 'system',
    systemPrefersDark: false
  };
  
  // Load saved theme from localStorage
  function loadSavedTheme(): ThemeState {
    if (!browser) return defaultState;
    
    try {
      const savedTheme = localStorage.getItem('mastermind-theme');
      if (savedTheme) {
        return {
          theme: JSON.parse(savedTheme) as Theme,
          systemPrefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches
        };
      }
    } catch (e) {
      console.error('Failed to load theme:', e);
    }
    
    return {
      theme: 'system',
      systemPrefersDark: browser ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
    };
  }
  
  // Create the store
  const { subscribe, update, set } = writable<ThemeState>(loadSavedTheme());
  
  // Save theme to localStorage
  function saveTheme(theme: Theme) {
    if (!browser) return;
    
    try {
      localStorage.setItem('mastermind-theme', JSON.stringify(theme));
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }
  
  // Initialize system theme detection
  function initSystemThemeDetection() {
    if (!browser) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Update the store when system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      update(state => ({
        ...state,
        systemPrefersDark: e.matches
      }));
    };
    
    // Add event listener for system theme changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Initial check
    update(state => ({
      ...state,
      systemPrefersDark: mediaQuery.matches
    }));
    
    // Cleanup function (not used in this case but good practice)
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }
  
  // Initialize system theme detection if in browser
  if (browser) {
    initSystemThemeDetection();
  }
  
  return {
    subscribe,
    
    // Set theme
    setTheme: (theme: Theme) => {
      update(state => {
        saveTheme(theme);
        return { ...state, theme };
      });
    },
    
    // Toggle between light and dark
    toggleTheme: () => {
      update(state => {
        const currentTheme = state.theme === 'system' 
          ? (state.systemPrefersDark ? 'light' : 'dark')
          : (state.theme === 'light' ? 'dark' : 'light');
        
        saveTheme(currentTheme);
        return { ...state, theme: currentTheme };
      });
    },
    
    // Reset to system preference
    resetToSystem: () => {
      update(state => {
        saveTheme('system');
        return { ...state, theme: 'system' };
      });
    }
  };
}

// Create and export the theme store
export const themeStore = createThemeStore();

// Derived store for the actual theme (light or dark)
export const isDarkTheme = derived(themeStore, $themeStore => 
  $themeStore.theme === 'system' 
    ? $themeStore.systemPrefersDark 
    : $themeStore.theme === 'dark'
);