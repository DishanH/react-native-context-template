/**
 * Color Palettes
 * 
 * This file contains the base color palettes used to construct the light and dark themes.
 * Separating palettes allows for easy customization and consistency across themes.
 */

import type { ColorPalette } from './types';

// ========================================
// ORIGINAL PALETTES (commented out for testing)
// ========================================

// export const DARK_PALETTE: ColorPalette = {
//   darkest: '#06141B',    // Deep dark blue-gray for backgrounds
//   darker: '#11212D',     // Dark blue-gray for surfaces
//   medium: '#253745',     // Medium blue-gray for borders/dividers
//   light: '#CCD0CF',      // Light gray for primary text
//   lightAlt: '#A8ADAC'    // Alternative light gray for secondary text
// };

// export const LIGHT_PALETTE: ColorPalette = {
//   darkest: '#1E2022',    // Very dark gray for primary text
//   darker: '#52616B',     // Dark gray for secondary text and primary elements
//   medium: '#C9D6DF',     // Medium gray for borders and dividers
//   light: '#F0F5F9',      // Light gray for surface variants
//   lightAlt: '#FFFFFF'    // Pure white for main backgrounds
// };

// ========================================
// TESTING PALETTES - Option 1: Warm Neutral
// ========================================

/**
 * Dark theme - Black and Orange
 */
export const DARK_PALETTE: ColorPalette = {
  darkest: '#000000',    // Pure black background
  darker: '#1A0A00',     // Very dark orange-black
  medium: '#FF6B35',     // Vibrant orange for accents
  light: '#FFB894',      // Light orange for primary text
  lightAlt: '#FF8A50'    // Medium orange for secondary text
};

/**
 * Light theme - Custom green to dark teal gradient
 */
export const LIGHT_PALETTE: ColorPalette = {
  darkest: '#051F20',    // Deep dark teal for text
  darker: '#0A3E3F',     // Dark teal for secondary text
  medium: '#7FB069',     // Medium green for borders
  light: '#DAF1DE',      // Light green background
  lightAlt: '#FFFFFF'    // Pure white
};

// ========================================
// ALTERNATIVE OPTIONS (uncomment to try)
// ========================================

// Option 2: Cool Blue-Gray
// export const DARK_PALETTE: ColorPalette = {
//   darkest: '#0F1419',    // Deep navy
//   darker: '#1E2A3A',     // Dark blue-gray
//   medium: '#374357',     // Medium slate
//   light: '#E1E8F0',      // Cool light blue-gray
//   lightAlt: '#B8C5D1'    // Soft blue-gray
// };

// export const LIGHT_PALETTE: ColorPalette = {
//   darkest: '#1B2332',    // Deep blue-gray text
//   darker: '#4A5568',     // Slate for secondary text
//   medium: '#CBD5E0',     // Light blue-gray borders
//   light: '#F7FAFC',      // Very light blue-gray
//   lightAlt: '#FFFFFF'    // Pure white
// };

// Option 3: Purple Elegance
// export const DARK_PALETTE: ColorPalette = {
//   darkest: '#1A0B1E',    // Deep purple-black
//   darker: '#2D1B35',     // Dark purple-gray
//   medium: '#4A3B57',     // Medium purple-gray
//   light: '#E8DDF0',      // Light lavender
//   lightAlt: '#C4B5D0'    // Soft purple-gray
// };

// export const LIGHT_PALETTE: ColorPalette = {
//   darkest: '#2D1B3D',    // Deep purple for text
//   darker: '#553C7B',     // Purple for secondary text
//   medium: '#D6C7E8',     // Light purple for borders
//   light: '#FAFAFC',      // Very light purple tint
//   lightAlt: '#FFFFFF'    // Pure white
// };

// Option 4: Forest Green
// export const DARK_PALETTE: ColorPalette = {
//   darkest: '#0F1B0F',    // Deep forest
//   darker: '#1C2E1C',     // Dark green-gray
//   medium: '#334233',     // Medium forest green
//   light: '#E8F0E8',      // Light mint
//   lightAlt: '#C8D8C8'    // Soft sage
// };

// export const LIGHT_PALETTE: ColorPalette = {
//   darkest: '#1B2E1B',    // Deep green for text
//   darker: '#2F5233',     // Forest green for secondary
//   medium: '#B8D4B8',     // Light green for borders
//   light: '#F8FCF8',      // Very light green tint
//   lightAlt: '#FFFFFF'    // Pure white
// };

// Option 5: Sunset Orange
// export const DARK_PALETTE: ColorPalette = {
//   darkest: '#1F0F0A',    // Deep burnt orange
//   darker: '#2F1A10',     // Dark orange-brown
//   medium: '#4D2F1A',     // Medium burnt orange
//   light: '#FFF2E8',      // Light peach
//   lightAlt: '#E8D0B8'    // Soft orange-beige
// };

// export const LIGHT_PALETTE: ColorPalette = {
//   darkest: '#2D1810',    // Deep brown for text
//   darker: '#8B4513',     // Warm brown for secondary
//   medium: '#E8C4A0',     // Light orange for borders
//   light: '#FFFAF7',      // Very light orange tint
//   lightAlt: '#FFFFFF'    // Pure white
// };

// ========================================
// STATUS COLORS AND BRAND COLORS (unchanged)
// ========================================

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