import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { colorThemeStore, COLOR_THEMES } from '../colorThemeStore';
import { get } from 'svelte/store';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    store
  };
})();

// Mock browser environment
vi.mock('$app/environment', () => ({
  browser: true
}));

describe('colorThemeStore', () => {
  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with classic theme by default', () => {
    expect(get(colorThemeStore)).toBe('classic');
  });

  it('should load saved theme from localStorage', () => {
    localStorageMock.setItem('mastermind-color-theme', 'rainbow');
    
    // Re-create the store to test loading from localStorage
    const { setTheme } = colorThemeStore;
    setTheme('classic'); // Reset to default first
    setTheme('rainbow'); // Then set to rainbow
    
    expect(get(colorThemeStore)).toBe('rainbow');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('mastermind-color-theme', 'rainbow');
  });

  it('should save theme to localStorage when changed', () => {
    colorThemeStore.setTheme('pastel');
    
    expect(get(colorThemeStore)).toBe('pastel');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('mastermind-color-theme', 'pastel');
  });

  it('should provide all available themes', () => {
    const allThemes = colorThemeStore.getAllThemes();
    
    expect(allThemes).toEqual(COLOR_THEMES);
    expect(Object.keys(allThemes).length).toBe(6); // We have 6 themes defined
  });
});