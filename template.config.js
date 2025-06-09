/**
 * Template Configuration
 * 
 * This file contains configuration options for customizing the template
 * when creating new projects. Update these values to match your project needs.
 */

module.exports = {
  // App Information
  app: {
    name: "React Native Template",
    slug: "react-native-template-with-context",
    description: "A production-ready React Native template with authentication, theming, navigation, and persistent storage using React Context",
    version: "1.0.0",
    scheme: "reactnativetemplate"
  },

  // Package Information
  package: {
    name: "react-native-template-with-context",
    author: "Your Name",
    repository: "https://github.com/yourusername/react-native-template-with-context.git"
  },

  // Bundle Identifiers
  bundleId: {
    ios: "com.template.reactnative",
    android: "com.template.reactnative"
  },

  // Theme Configuration
  theme: {
    primaryColor: "#007AFF",
    secondaryColor: "#5856D6",
    accentColor: "#FF9500"
  },

  // Features to include/exclude
  features: {
    authentication: true,
    onboarding: true,
    theming: true,
    socialAuth: true,
    bottomSheet: true,
    secureStorage: true
  },

  // Social Authentication
  socialAuth: {
    google: {
      enabled: true,
      clientId: "your-google-client-id"
    },
    apple: {
      enabled: true,
      clientId: "your-apple-client-id"
    }
  },

  // API Configuration
  api: {
    baseUrl: "https://your-api.com",
    timeout: 10000
  }
};

/**
 * Usage Instructions:
 * 
 * 1. Update the values above to match your project
 * 2. Run the setup script: npm run setup-template
 * 3. The script will update all relevant files with your configuration
 * 
 * Files that will be updated:
 * - package.json
 * - app.json
 * - theme/colors.ts
 * - contexts/AuthContext.tsx (API endpoints)
 */ 