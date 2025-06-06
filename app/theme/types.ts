// Define ThemeColors interface to use throughout the app
export interface ThemeColors {
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

// Define theme types
export type ThemeType = 'light' | 'dark';

// Define theme context type
export interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

// Default export for the module to fix the warning
// This is a dummy component that satisfies the requirement for a default export
const ThemeTypes = () => null;
export default ThemeTypes; 