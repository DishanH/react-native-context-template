/**
 * Theme System Main Export
 * 
 * This file serves as the main entry point for the theme system.
 * It exports all theme-related types, colors, and utilities.
 */

// Export all type definitions
export type { 
  ThemeType, 
  ThemeColors, 
  ThemeConfig, 
  ThemeContextType, 
  ColorPalette, 
  ThemeProviderProps 
} from './types';

// Export color configurations
export { default as colors } from './colors';

// Export color palettes for advanced usage
export { 
  DARK_PALETTE, 
  LIGHT_PALETTE, 
  STATUS_COLORS, 
  BRAND_COLORS 
} from './palettes';

// Re-export commonly used types for convenience
export type { ThemeColors as Colors } from './types'; 