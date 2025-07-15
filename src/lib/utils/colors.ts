import type { Color } from '$lib/types/game';
import { get } from 'svelte/store';
import { currentThemeColors } from '$lib/stores/colorThemeStore';

/**
 * Get colors based on difficulty level and current theme
 * @param difficulty Number of colors to include (6-8)
 * @returns Array of Color objects
 */
export function getColorsByDifficulty(difficulty: 6 | 7 | 8): Color[] {
  const themeColors = get(currentThemeColors);
  const allColors = Object.values(themeColors);
  return allColors.slice(0, difficulty);
}