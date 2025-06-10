/**
 * Theme Type Definitions
 * 
 * This file contains all TypeScript type definitions related to theming.
 * It defines the structure of theme colors, theme variants, and context types.
 */

/**
 * Available theme variants
 */
export type ThemeType = 'light' | 'dark';

/**
 * Theme color palette interface
 * Defines all available colors for both light and dark themes
 */
export interface ThemeColors {
  // Base colors - main backgrounds and surfaces
  background: string;           // Main app background
  surface: string;             // Card, modal, and component backgrounds
  surfaceVariant: string;      // Alternative surface color for emphasis
  headerBackground: string;    // Navigation header background
  
  // Text colors - for all text elements
  text: string;               // Primary text color
  textSecondary: string;      // Secondary/subtitle text color
  
  // UI element colors - main brand and interaction colors
  primary: string;            // Primary brand color
  primaryDark: string;        // Darker variant of primary color
  secondary: string;          // Secondary accent color
  accent: string;             // Highlight and accent color
  
  // Status colors - for notifications, alerts, and states
  success: string;            // Success messages and positive actions
  warning: string;            // Warning messages and caution states
  error: string;              // Error messages and negative actions
  info: string;               // Information messages and neutral states

  // UI component colors - borders, dividers, and interactive elements
  border: string;             // Input borders, card outlines
  divider: string;            // Section dividers, separators
  icon: string;               // Default icon color
  statusActive: string;       // Active state indicator
  statusInactive: string;     // Inactive state indicator
  
  // Button variant colors - semantic button styles
  buttonPrimary: string;           // Primary button background
  buttonPrimaryText: string;       // Primary button text
  buttonSecondary: string;         // Secondary button background
  buttonSecondaryText: string;     // Secondary button text
  buttonOutline: string;           // Outline button border
  buttonOutlineText: string;       // Outline button text
  buttonDestructive: string;       // Destructive button background
  buttonDestructiveText: string;   // Destructive button text
  buttonGhost: string;             // Ghost button background (transparent)
  buttonGhostText: string;         // Ghost button text
  buttonLink: string;              // Link button text color
  
  // Navigation drawer specific colors
  drawerBackground: string;           // Drawer main background
  drawerItemBackground: string;       // Individual drawer item background
  drawerActiveItemBackground: string; // Active drawer item background
  drawerHeaderBackground: string;     // Drawer header background
}

/**
 * Theme configuration interface
 * Contains both light and dark theme color definitions
 */
export interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
}

/**
 * Theme context interface
 * Defines the structure of the theme context provider
 */
export interface ThemeContextType {
  theme: ThemeType;                    // Current active theme
  colors: ThemeColors;                 // Current theme colors
  toggleTheme: () => void;             // Function to toggle between themes
  setTheme: (theme: ThemeType) => void; // Function to set specific theme
}

/**
 * Color palette type for theme definitions
 * Used internally for organizing color constants
 */
export interface ColorPalette {
  darkest: string;
  darker: string;
  medium: string;
  light: string;
  lightAlt: string;
}

/**
 * Theme provider props interface
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
} 