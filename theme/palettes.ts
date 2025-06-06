/**
 * Color Palettes
 * 
 * This file contains the base color palettes used to construct the light and dark themes.
 * Separating palettes allows for easy customization and consistency across themes.
 */

import type { ColorPalette } from './types';

/**
 * Dark theme color palette
 * Used as the base colors for constructing the dark theme
 */
export const DARK_PALETTE: ColorPalette = {
  darkest: '#06141B',    // Deep dark blue-gray for backgrounds
  darker: '#11212D',     // Dark blue-gray for surfaces
  medium: '#253745',     // Medium blue-gray for borders/dividers
  light: '#CCD0CF',      // Light gray for primary text
  lightAlt: '#A8ADAC'    // Alternative light gray for secondary text
};

/**
 * Light theme color palette
 * Used as the base colors for constructing the light theme
 */
export const LIGHT_PALETTE: ColorPalette = {
  darkest: '#1E2022',    // Very dark gray for primary text
  darker: '#52616B',     // Dark gray for secondary text and primary elements
  medium: '#C9D6DF',     // Medium gray for borders and dividers
  light: '#F0F5F9',      // Light gray for surface variants
  lightAlt: '#FFFFFF'    // Pure white for main backgrounds
};

/**
 * Status colors that work well with both themes
 * These can be used directly or adjusted based on the theme
 */
export const STATUS_COLORS = {
  success: {
    light: '#16A34A',    // Green for light theme
    dark: '#22C55E'      // Lighter green for dark theme
  },
  warning: {
    light: '#D97706',    // Orange for light theme
    dark: '#F59E0B'      // Lighter orange for dark theme
  },
  error: {
    light: '#DC2626',    // Red for light theme
    dark: '#EF4444'      // Lighter red for dark theme
  },
  info: {
    light: '#2563EB',    // Blue for light theme
    dark: '#3B82F6'      // Lighter blue for dark theme
  }
};

/**
 * Brand colors - consistent across all themes
 * These represent your app's brand identity
 */
export const BRAND_COLORS = {
  primary: '#52616B',      // Main brand color
  primaryDark: '#3F4E57',  // Darker variant for interactions
  secondary: '#C9D6DF',    // Secondary brand color
  accent: '#8FA3AD'        // Accent color for highlights
}; 