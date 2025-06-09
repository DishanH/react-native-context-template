# React Native Template with Context

A production-ready React Native template built with Expo, featuring authentication, theming, navigation, and persistent storage using React Context patterns.

## 🚀 Features

### Core Features
- **🔐 Authentication System**: Complete auth flow with sign-in, sign-up, and social authentication
- **🎨 Theme System**: Light/dark theme support with React Context
- **📱 Navigation**: Drawer + Tab navigation with Expo Router
- **📋 Onboarding**: Multi-step onboarding flow for new users
- **💾 Persistent Storage**: Secure storage using Expo SecureStore
- **⚡ TypeScript**: Full TypeScript support with strict mode
- **🎯 Production Ready**: Optimized for production deployment

### UI/UX Features
- **Modern Design**: Clean, professional UI with consistent styling
- **Responsive Layout**: Works on phones and tablets
- **Gesture Support**: Smooth animations and gesture handling
- **Safe Areas**: Proper safe area handling for all devices
- **Loading States**: Comprehensive loading and error states

### Developer Experience
- **ESLint Configuration**: Pre-configured linting rules
- **File-based Routing**: Expo Router for intuitive navigation
- **Context Patterns**: Well-structured React Context usage
- **Error Handling**: Comprehensive error handling throughout
- **Debug Tools**: Built-in debugging utilities

## 📦 What's Included

### Screens
- **Onboarding**: Multi-step introduction flow
- **Authentication**: Sign-in, sign-up with email/password and social auth
- **Dashboard**: Main app interface with drawer navigation
- **Settings**: User preferences and app configuration
- **Profile**: User profile management
- **Help & FAQ**: Support documentation

### Context Providers
- **AuthContext**: User authentication state management
- **ThemeContext**: Light/dark theme switching
- **BottomSheetProvider**: Modal and bottom sheet management

### Utilities
- **Storage**: Cross-platform secure storage wrapper
- **Navigation**: Type-safe navigation helpers
- **Theme**: Comprehensive theme system with color schemes

## 🛠 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Quick Start

1. **Clone or use this template**:
   ```bash
   # Option 1: Clone the repository
   git clone https://github.com/yourusername/react-native-template-with-context.git
   cd react-native-template-with-context
   
   # Option 2: Use as template (if published)
   npx create-expo-app MyApp --template react-native-template-with-context
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**:
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on your preferred platform**:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🏗 Project Structure

```
├── app/                          # App screens and layouts
│   ├── (tabs)/                   # Tab navigation screens
│   ├── auth/                     # Authentication screens
│   ├── onboarding/               # Onboarding flow
│   ├── components/               # Reusable components
│   ├── _layout.tsx               # Root layout with navigation
│   └── [other screens]
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx           # Authentication state
│   ├── ThemeContext.tsx          # Theme management
│   └── index.ts                  # Context exports
├── lib/                          # Utilities and helpers
│   └── storage.ts                # Secure storage wrapper
├── theme/                        # Theme configuration
├── assets/                       # Images, fonts, etc.
└── [config files]
```

## 🎨 Customization

### Updating App Information

1. **Update package.json**:
   ```json
   {
     "name": "your-app-name",
     "description": "Your app description"
   }
   ```

2. **Update app.json**:
   ```json
   {
     "expo": {
       "name": "Your App Name",
       "slug": "your-app-slug",
       "ios": {
         "bundleIdentifier": "com.yourcompany.yourapp"
       },
       "android": {
         "package": "com.yourcompany.yourapp"
       }
     }
   }
   ```

### Customizing Theme

Edit `theme/colors.ts` to customize your app's color scheme:

```typescript
export const lightTheme = {
  primary: '#007AFF',      // Your brand color
  secondary: '#5856D6',    // Secondary brand color
  background: '#FFFFFF',   // Background color
  // ... other colors
};
```

### Adding New Screens

1. Create a new file in the `app/` directory
2. Export a React component as default
3. The file-based routing will automatically handle navigation

### Modifying Authentication

The authentication system is in `contexts/AuthContext.tsx`. Update the sign-in/sign-up logic to integrate with your backend:

```typescript
const signIn = async (email: string, password: string): Promise<boolean> => {
  // Replace with your API call
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  // Handle response...
};
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
API_BASE_URL=https://your-api.com
GOOGLE_CLIENT_ID=your-google-client-id
APPLE_CLIENT_ID=your-apple-client-id
```

### Social Authentication

To enable social authentication:

1. **Google Sign-In**: Configure in `app.json` and add your client ID
2. **Apple Sign-In**: Automatically configured for iOS

## 📱 Platform-Specific Notes

### iOS
- Requires iOS 13.0 or higher
- Apple Sign-In is automatically available
- Uses iOS-specific navigation patterns

### Android
- Requires Android API level 21 (Android 5.0)
- Edge-to-edge display support
- Material Design components

### Web
- Responsive design for desktop and mobile browsers
- Uses localStorage instead of SecureStore
- Progressive Web App (PWA) ready

## 🚀 Deployment

### Building for Production

```bash
# Build for all platforms
npx expo build

# Build for specific platform
npx expo build:ios
npx expo build:android
```

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for production
eas build --platform all
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Authentication Flow

The template includes utilities for testing the authentication flow:

1. Use the onboarding reset functionality
2. Test with different user states
3. Verify storage persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [React Navigation](https://reactnavigation.org/) for navigation solutions
- [React Native](https://reactnative.dev/) for the framework

## 📞 Support

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/react-native-template-with-context/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/react-native-template-with-context/wiki)

---

**Happy coding! 🎉** 