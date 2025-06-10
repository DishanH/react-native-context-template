/**
 * Theme Colors Configuration
 * 
 * This file defines the complete color themes for the application.
 * It uses the color palettes to construct consistent light and dark themes.
 */

import type { ThemeConfig } from './types';
import { DARK_PALETTE, LIGHT_PALETTE, STATUS_COLORS, BRAND_COLORS } from './palettes';

/**
 * Complete theme configuration
 * Contains both light and dark theme definitions
 */
const colors: ThemeConfig = {
  /**
   * Light Theme Configuration
   * Uses light palette and appropriate status colors for light backgrounds
   */
  light: {
    // Base colors - main app structure
    background: LIGHT_PALETTE.lightAlt,      // Pure white main background
    surface: LIGHT_PALETTE.lightAlt,         // White for cards, modals
    surfaceVariant: LIGHT_PALETTE.light,     // Light gray for emphasis areas
    headerBackground: LIGHT_PALETTE.lightAlt, // White navigation header
    
    // Text colors - for readability on light backgrounds
    text: LIGHT_PALETTE.darkest,             // Dark text for high contrast
    textSecondary: LIGHT_PALETTE.darker,     // Medium dark for subtitles
    
    // UI element colors - using brand colors and palette
    primary: BRAND_COLORS.primary,           // Main brand color
    primaryDark: BRAND_COLORS.primaryDark,   // Darker brand variant
    secondary: BRAND_COLORS.secondary,       // Secondary brand color
    accent: BRAND_COLORS.accent,             // Accent highlights
    
    // Status colors - optimized for light theme
    success: STATUS_COLORS.success.light,   // Green for positive actions
    warning: STATUS_COLORS.warning.light,   // Orange for warnings
    error: STATUS_COLORS.error.light,       // Red for errors
    info: STATUS_COLORS.info.light,         // Blue for information

    // UI component colors - borders and interactive elements
    border: LIGHT_PALETTE.medium,           // Gray borders for inputs
    divider: LIGHT_PALETTE.medium,          // Gray dividers between sections
    icon: LIGHT_PALETTE.darker,             // Dark icons for visibility
    statusActive: BRAND_COLORS.primary,     // Active state in brand color
    statusInactive: LIGHT_PALETTE.medium,   // Inactive state in gray
    
    // Button variant colors - semantic button styles for light theme
    buttonPrimary: LIGHT_PALETTE.darkest,           // Dark teal primary button
    buttonPrimaryText: LIGHT_PALETTE.lightAlt,      // White text on primary
    buttonSecondary: LIGHT_PALETTE.medium,          // Medium green secondary button
    buttonSecondaryText: LIGHT_PALETTE.darkest,     // Dark teal text on secondary
    buttonOutline: 'transparent',                   // Transparent outline button
    buttonOutlineText: LIGHT_PALETTE.darkest,       // Dark teal outline text
    buttonDestructive: STATUS_COLORS.error.light,   // Red destructive button
    buttonDestructiveText: LIGHT_PALETTE.lightAlt,  // White text on destructive
    buttonGhost: 'transparent',                     // Transparent ghost button
    buttonGhostText: LIGHT_PALETTE.darker,          // Dark teal ghost text
    buttonLink: LIGHT_PALETTE.darker,               // Dark teal link color
    
    // Navigation drawer colors - cohesive with main theme
    drawerBackground: LIGHT_PALETTE.lightAlt,        // White drawer background
    drawerItemBackground: LIGHT_PALETTE.lightAlt,    // White item backgrounds
    drawerActiveItemBackground: LIGHT_PALETTE.medium + '30', // Light green with transparency for active item
    drawerHeaderBackground: LIGHT_PALETTE.darkest + '10',    // Light teal background for profile section
  },

  /**
   * Dark Theme Configuration
   * Uses dark palette and appropriate status colors for dark backgrounds
   */
  dark: {
    // Base colors - main app structure for dark mode
    background: DARK_PALETTE.darkest,        // Deep dark main background
    surface: DARK_PALETTE.darker,            // Dark gray for cards, modals
    surfaceVariant: DARK_PALETTE.medium,     // Medium gray for emphasis areas
    headerBackground: DARK_PALETTE.darkest,  // Dark navigation header
    
    // Text colors - for readability on dark backgrounds
    text: DARK_PALETTE.light,                // Light text for high contrast
    textSecondary: DARK_PALETTE.lightAlt,    // Alternative light for subtitles
    
    // UI element colors - adapted for dark theme
    primary: DARK_PALETTE.light,             // Light primary for visibility
    primaryDark: DARK_PALETTE.lightAlt,      // Alternative light variant
    secondary: DARK_PALETTE.medium,          // Medium gray secondary
    accent: DARK_PALETTE.medium,             // Medium gray accent
    
    // Status colors - optimized for dark theme
    success: STATUS_COLORS.success.dark,    // Lighter green for dark backgrounds
    warning: STATUS_COLORS.warning.dark,    // Lighter orange for warnings
    error: STATUS_COLORS.error.dark,        // Lighter red for errors
    info: STATUS_COLORS.info.dark,          // Lighter blue for information

    // UI component colors - borders and interactive elements
    border: DARK_PALETTE.medium,            // Medium gray borders
    divider: DARK_PALETTE.medium,           // Medium gray dividers
    icon: DARK_PALETTE.lightAlt,            // Light icons for visibility
    statusActive: DARK_PALETTE.light,       // Light active state
    statusInactive: DARK_PALETTE.medium,    // Medium gray inactive state
    
    // Button variant colors - semantic button styles for dark theme
    buttonPrimary: DARK_PALETTE.medium,             // Orange primary button
    buttonPrimaryText: DARK_PALETTE.darkest,        // Black text on orange
    buttonSecondary: DARK_PALETTE.lightAlt,         // Medium orange secondary button
    buttonSecondaryText: DARK_PALETTE.darkest,      // Black text on secondary
    buttonOutline: 'transparent',                   // Transparent outline button
    buttonOutlineText: DARK_PALETTE.light,          // Light orange outline text
    buttonDestructive: STATUS_COLORS.error.dark,    // Red destructive button
    buttonDestructiveText: DARK_PALETTE.darkest,    // Black text on destructive
    buttonGhost: 'transparent',                     // Transparent ghost button
    buttonGhostText: DARK_PALETTE.lightAlt,         // Medium orange ghost text
    buttonLink: DARK_PALETTE.light,                 // Light orange link color
    
    // Navigation drawer colors - cohesive with dark theme
    drawerBackground: DARK_PALETTE.darker,           // Dark gray drawer background
    drawerItemBackground: DARK_PALETTE.darker,       // Dark gray item backgrounds
    drawerActiveItemBackground: DARK_PALETTE.medium + '40', // Orange with transparency for active item
    drawerHeaderBackground: DARK_PALETTE.medium + '20',     // Orange background for profile section
  }
};

export default colors; 