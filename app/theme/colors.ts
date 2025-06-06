// Theme color configuration for the application
// Define both light and dark theme color palettes

// Define shared color constants
const DARK_PALETTE = {
  darkest: '#06141B',
  darker: '#11212D',
  medium: '#253745',
  light: '#CCD0CF',
  lightAlt: '#A8ADAC'
};

const LIGHT_PALETTE = {
  darkest: '#1E2022',
  darker: '#52616B',
  medium: '#C9D6DF',
  light: '#F0F5F9',
  lightAlt: '#FFFFFF'
};

type ThemeColors = {
  // Base colors
  background: string;
  surface: string;
  surfaceVariant: string;
  headerBackground: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  
  // UI element colors
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Additional UI elements
  border: string;
  divider: string;
  icon: string;
  statusActive: string;
  statusInactive: string;
  
  // Drawer specific
  drawerBackground: string;
  drawerItemBackground: string;
  drawerActiveItemBackground: string;
  drawerHeaderBackground: string;
}

type ThemeConfig = {
  light: ThemeColors;
  dark: ThemeColors;
}

const colors: ThemeConfig = {
  light: {
    // Base colors
    background: LIGHT_PALETTE.lightAlt,
    surface: LIGHT_PALETTE.lightAlt,
    surfaceVariant: LIGHT_PALETTE.light,
    headerBackground: LIGHT_PALETTE.lightAlt,
    
    // Text colors
    text: LIGHT_PALETTE.darkest,
    textSecondary: LIGHT_PALETTE.darker,
    
    // UI element colors - using palette colors
    primary: LIGHT_PALETTE.darker,
    primaryDark: LIGHT_PALETTE.darkest,
    secondary: LIGHT_PALETTE.medium,
    accent: LIGHT_PALETTE.medium,
    
    // Status colors - using palette colors
    success: LIGHT_PALETTE.darker,
    warning: LIGHT_PALETTE.darker,
    error: LIGHT_PALETTE.darkest,
    info: LIGHT_PALETTE.medium,

    // Additional UI elements
    border: LIGHT_PALETTE.medium,
    divider: LIGHT_PALETTE.medium,
    icon: LIGHT_PALETTE.darker,
    statusActive: LIGHT_PALETTE.darker,
    statusInactive: LIGHT_PALETTE.medium,
    
    // Drawer specific
    drawerBackground: LIGHT_PALETTE.lightAlt,
    drawerItemBackground: LIGHT_PALETTE.lightAlt,
    drawerActiveItemBackground: LIGHT_PALETTE.light,
    drawerHeaderBackground: LIGHT_PALETTE.light,
  },
  dark: {
    // Base colors
    background: DARK_PALETTE.darkest,
    surface: DARK_PALETTE.darker,
    surfaceVariant: DARK_PALETTE.medium,
    headerBackground: DARK_PALETTE.darkest,
    
    // Text colors
    text: DARK_PALETTE.light,
    textSecondary: DARK_PALETTE.lightAlt,
    
    // UI element colors - using palette colors
    primary: DARK_PALETTE.light,
    primaryDark: DARK_PALETTE.lightAlt,
    secondary: DARK_PALETTE.medium,
    accent: DARK_PALETTE.medium,
    
    // Status colors - using palette colors
    success: DARK_PALETTE.light,
    warning: DARK_PALETTE.medium,
    error: DARK_PALETTE.lightAlt,
    info: DARK_PALETTE.medium,

    // Additional UI elements
    border: DARK_PALETTE.medium,
    divider: DARK_PALETTE.medium,
    icon: DARK_PALETTE.lightAlt,
    statusActive: DARK_PALETTE.light,
    statusInactive: DARK_PALETTE.medium,
    
    // Drawer specific
    drawerBackground: DARK_PALETTE.darker,
    drawerItemBackground: DARK_PALETTE.darker,
    drawerActiveItemBackground: DARK_PALETTE.medium,
    drawerHeaderBackground: DARK_PALETTE.medium,
  }
};

export default colors; 