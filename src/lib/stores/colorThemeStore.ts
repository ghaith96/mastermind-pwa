import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { Color } from '$lib/types/game';

// Define the available color themes
export type ColorThemeName = 'classic' | 'rainbow' | 'fire-ice' | 'pastel' | 'monochrome' | 'nature';

// Define the color theme interface
export interface ColorTheme {
  id: ColorThemeName;
  name: string;
  colors: Record<string, Color>;
}

// Define the color themes
export const COLOR_THEMES: Record<ColorThemeName, ColorTheme> = {
  'classic': {
    id: 'classic',
    name: 'Classic',
    colors: {
      RED: { id: 'red', hex: '#FF4444', name: 'Red', accessible: true },
      BLUE: { id: 'blue', hex: '#4444FF', name: 'Blue', accessible: true },
      GREEN: { id: 'green', hex: '#44FF44', name: 'Green', accessible: true },
      YELLOW: { id: 'yellow', hex: '#FFFF44', name: 'Yellow', accessible: true },
      PURPLE: { id: 'purple', hex: '#FF44FF', name: 'Purple', accessible: true },
      ORANGE: { id: 'orange', hex: '#FF8844', name: 'Orange', accessible: true },
      BROWN: { id: 'brown', hex: '#8B4513', name: 'Brown', accessible: true },
      PINK: { id: 'pink', hex: '#FFB6C1', name: 'Pink', accessible: true }
    }
  },
  'rainbow': {
    id: 'rainbow',
    name: 'Rainbow',
    colors: {
      RED: { id: 'red', hex: '#FF0000', name: 'Red', accessible: true },
      ORANGE: { id: 'orange', hex: '#FF7F00', name: 'Orange', accessible: true },
      YELLOW: { id: 'yellow', hex: '#FFFF00', name: 'Yellow', accessible: true },
      GREEN: { id: 'green', hex: '#00FF00', name: 'Green', accessible: true },
      BLUE: { id: 'blue', hex: '#0000FF', name: 'Blue', accessible: true },
      INDIGO: { id: 'indigo', hex: '#4B0082', name: 'Indigo', accessible: true },
      VIOLET: { id: 'violet', hex: '#9400D3', name: 'Violet', accessible: true },
      PINK: { id: 'pink', hex: '#FF1493', name: 'Pink', accessible: true }
    }
  },
  'fire-ice': {
    id: 'fire-ice',
    name: 'Fire & Ice',
    colors: {
      ICE_BLUE: { id: 'ice-blue', hex: '#A5F2F3', name: 'Ice Blue', accessible: true },
      LIGHT_BLUE: { id: 'light-blue', hex: '#00BFFF', name: 'Light Blue', accessible: true },
      BLUE: { id: 'blue', hex: '#0000FF', name: 'Blue', accessible: true },
      PURPLE: { id: 'purple', hex: '#800080', name: 'Purple', accessible: true },
      PINK: { id: 'pink', hex: '#FF69B4', name: 'Pink', accessible: true },
      ORANGE: { id: 'orange', hex: '#FF7F00', name: 'Orange', accessible: true },
      RED: { id: 'red', hex: '#FF0000', name: 'Red', accessible: true },
      DARK_RED: { id: 'dark-red', hex: '#8B0000', name: 'Dark Red', accessible: true }
    }
  },
  'pastel': {
    id: 'pastel',
    name: 'Pastel',
    colors: {
      PASTEL_PINK: { id: 'pastel-pink', hex: '#FFD1DC', name: 'Pastel Pink', accessible: true },
      PASTEL_ORANGE: { id: 'pastel-orange', hex: '#FFB347', name: 'Pastel Orange', accessible: true },
      PASTEL_YELLOW: { id: 'pastel-yellow', hex: '#FDFD96', name: 'Pastel Yellow', accessible: true },
      PASTEL_GREEN: { id: 'pastel-green', hex: '#77DD77', name: 'Pastel Green', accessible: true },
      PASTEL_BLUE: { id: 'pastel-blue', hex: '#AEC6CF', name: 'Pastel Blue', accessible: true },
      PASTEL_PURPLE: { id: 'pastel-purple', hex: '#B39EB5', name: 'Pastel Purple', accessible: true },
      PASTEL_MINT: { id: 'pastel-mint', hex: '#99FFCC', name: 'Pastel Mint', accessible: true },
      PASTEL_LAVENDER: { id: 'pastel-lavender', hex: '#C8A2C8', name: 'Pastel Lavender', accessible: true }
    }
  },
  'monochrome': {
    id: 'monochrome',
    name: 'Monochrome',
    colors: {
      WHITE: { id: 'white', hex: '#FFFFFF', name: 'White', accessible: true },
      LIGHT_GRAY: { id: 'light-gray', hex: '#D3D3D3', name: 'Light Gray', accessible: true },
      SILVER: { id: 'silver', hex: '#C0C0C0', name: 'Silver', accessible: true },
      GRAY: { id: 'gray', hex: '#808080', name: 'Gray', accessible: true },
      DIM_GRAY: { id: 'dim-gray', hex: '#696969', name: 'Dim Gray', accessible: true },
      DARK_GRAY: { id: 'dark-gray', hex: '#404040', name: 'Dark Gray', accessible: true },
      CHARCOAL: { id: 'charcoal', hex: '#2F4F4F', name: 'Charcoal', accessible: true },
      BLACK: { id: 'black', hex: '#000000', name: 'Black', accessible: true }
    }
  },
  'nature': {
    id: 'nature',
    name: 'Nature',
    colors: {
      LEAF_GREEN: { id: 'leaf-green', hex: '#4F7942', name: 'Leaf Green', accessible: true },
      SKY_BLUE: { id: 'sky-blue', hex: '#87CEEB', name: 'Sky Blue', accessible: true },
      SANDY_BROWN: { id: 'sandy-brown', hex: '#F4A460', name: 'Sandy Brown', accessible: true },
      OCEAN_BLUE: { id: 'ocean-blue', hex: '#1E90FF', name: 'Ocean Blue', accessible: true },
      FOREST_GREEN: { id: 'forest-green', hex: '#228B22', name: 'Forest Green', accessible: true },
      SUNSET_ORANGE: { id: 'sunset-orange', hex: '#FD5E53', name: 'Sunset Orange', accessible: true },
      MOUNTAIN_PURPLE: { id: 'mountain-purple', hex: '#9678B6', name: 'Mountain Purple', accessible: true },
      STONE_GRAY: { id: 'stone-gray', hex: '#8D8C8C', name: 'Stone Gray', accessible: true }
    }
  }
};

// Create the color theme store
function createColorThemeStore() {
  // Default theme
  const defaultTheme: ColorThemeName = 'classic';
  
  // Load saved theme from localStorage
  function loadSavedTheme(): ColorThemeName {
    if (!browser) return defaultTheme;
    
    try {
      const savedTheme = localStorage.getItem('mastermind-color-theme');
      if (savedTheme && Object.keys(COLOR_THEMES).includes(savedTheme)) {
        return savedTheme as ColorThemeName;
      }
    } catch (e) {
      console.error('Failed to load color theme:', e);
    }
    
    return defaultTheme;
  }
  
  // Create the store
  const { subscribe, set } = writable<ColorThemeName>(loadSavedTheme());
  
  // Save theme to localStorage
  function saveTheme(theme: ColorThemeName) {
    if (!browser) return;
    
    try {
      localStorage.setItem('mastermind-color-theme', theme);
    } catch (e) {
      console.error('Failed to save color theme:', e);
    }
  }
  
  return {
    subscribe,
    
    // Set theme
    setTheme: (theme: ColorThemeName) => {
      saveTheme(theme);
      set(theme);
    },
    
    // Get all available themes
    getAllThemes: () => COLOR_THEMES
  };
}

// Create and export the color theme store
export const colorThemeStore = createColorThemeStore();

// Derived store for the current theme object
export const currentTheme = derived(colorThemeStore, $colorThemeStore => 
  COLOR_THEMES[$colorThemeStore]
);

// Derived store for the current theme colors
export const currentThemeColors = derived(currentTheme, $currentTheme => 
  $currentTheme.colors
);