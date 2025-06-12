# 🚀 React Native Context Template

A comprehensive, production-ready React Native template built with Expo. Features complete authentication system, advanced theming, navigation, and robust Context-based state management patterns for building scalable mobile applications.

## ✨ Features

### 🔐 Authentication & Security
- **Complete Auth Flow**: Email/password, social login (Google, Apple), and biometric authentication
- **Secure Storage**: Encrypted data storage using Expo SecureStore
- **Session Management**: Automatic token refresh and session persistence
- **Password Recovery**: Built-in forgot password functionality
- **Multi-factor Authentication**: Ready for 2FA implementation

### 🎨 Design & UI/UX
- **Modern Design System**: Clean, professional UI with consistent styling
- **Advanced Theming**: Dynamic light/dark themes with custom color schemes
- **Responsive Layout**: Optimized for phones, tablets, and web
- **Gesture Support**: Smooth animations and intuitive gesture handling
- **Accessibility**: WCAG compliant with screen reader support
- **Custom Components**: Rich library of reusable UI components

### 🧭 Navigation & Routing
- **File-based Routing**: Expo Router for intuitive navigation structure
- **Drawer + Tab Navigation**: Comprehensive navigation patterns
- **Deep Linking**: URL scheme support for web and mobile
- **Navigation Guards**: Protected routes with authentication checks
- **Breadcrumb Support**: Easy navigation tracking

### 🔄 Context-Based State Management
- **AuthContext**: Complete user authentication state management
- **ThemeContext**: Advanced theming with persistence
- **BottomSheetProvider**: Modal and sheet management
- **NotificationContext**: Push notification handling
- **Custom Context Patterns**: Scalable state management architecture

### 📱 Platform Support
- **iOS**: Native iOS experience with platform-specific features
- **Android**: Material Design with edge-to-edge support
- **Web**: Progressive Web App (PWA) ready
- **Desktop**: Electron support for desktop apps

### 🔧 Developer Experience
- **TypeScript**: Full TypeScript support with strict mode
- **ESLint & Prettier**: Pre-configured code formatting
- **Testing Setup**: Jest and React Native Testing Library
- **CI/CD Ready**: GitHub Actions workflow templates
- **Hot Reload**: Fast development with Expo tools
- **Debug Tools**: Comprehensive debugging utilities

## 📦 What's Included

### 🖥️ Screens & Features
```
📱 Onboarding
├── Welcome carousel
├── Feature highlights
├── Permission requests
└── Account setup

🔐 Authentication
├── Sign in / Sign up
├── Social authentication
├── Password recovery
├── Biometric login
└── Profile management

📊 Dashboard
├── Overview interface
├── Quick actions
├── Recent activity
└── Notifications

⚙️ Settings
├── Theme customization
├── Notification preferences
├── Privacy controls
├── Data management
└── Account settings

📋 Legal
├── Privacy Policy
├── Terms of Service
├── About page
└── Help center
```

### 🧩 Context Providers
- **AuthContext**: Complete authentication state management
- **ThemeContext**: Advanced theming with persistence
- **BottomSheetProvider**: Modal and sheet management
- **NotificationContext**: Push notification handling
- **Custom Context Patterns**: Scalable architecture examples

### 🛠️ Utilities & Services
- **Storage Service**: Secure, encrypted storage wrapper
- **API Service**: HTTP client with interceptors
- **Navigation Helpers**: Type-safe navigation utilities
- **Theme System**: Comprehensive design tokens
- **Analytics**: User behavior tracking
- **Error Handling**: Global error boundary and reporting

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ 
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (macOS) or **Android Studio**

### Installation

1. **Create new project from template**:
   ```bash
   npx create-expo-app MyApp --template https://github.com/dishanh/react-native-context-template
   cd MyApp
   ```

2. **Clean up template files (Important!)**:
   ```bash
   npm run clean-template
   ```
   This will:
   - Remove template-specific files (CHANGELOG.md, .templateignore, etc.)
   - Update package.json and app.json with generic project settings
   - Create a clean README for your project
   - Remove demo content (optional - keep for learning)

   > **Note**: If you see template files like `CHANGELOG.md` in your new project, run this cleanup script. Different template creation tools handle file exclusions differently.

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables** (optional):
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. **Start development server**:
   ```bash
   npm start
   ```

6. **Run on device/simulator**:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🏗️ Project Architecture

```
react-native-context-template/
├── 📁 app/                           # App screens (Expo Router)
│   ├── 📁 tabs/                      # Tab navigation screens
│   │   ├── index.tsx                 # Main dashboard/home
│   │   ├── add-expense.tsx           # Add expense screen
│   │   ├── add-member.tsx            # Add member screen
│   │   ├── settle.tsx                # Settle expenses screen
│   │   └── _layout.tsx               # Tab layout configuration
│   ├── 📁 auth/                      # Authentication screens
│   │   └── (auth flow screens)
│   ├── 📁 onboarding/                # Onboarding flow
│   │   └── (onboarding screens)
│   ├── 📁 features/                  # Feature-specific screens
│   │   ├── 📁 activity/              # Activity tracking
│   │   ├── 📁 groups/                # Group management
│   │   ├── 📁 help/                  # Help & support
│   │   ├── 📁 legal/                 # Legal pages (privacy, terms)
│   │   ├── 📁 profile/               # User profile
│   │   ├── 📁 settings/              # App settings
│   │   └── 📁 subscription/          # Subscription management
│   ├── about.tsx                     # About screen
│   ├── activity.tsx                  # Activity screen
│   ├── edit-profile.tsx              # Profile editing
│   ├── groups.tsx                    # Groups screen
│   ├── help-faq.tsx                  # Help & FAQ
│   ├── privacy-policy.tsx            # Privacy policy
│   ├── settings.tsx                  # Settings screen
│   ├── storage-data.tsx              # Storage management
│   ├── subscription.tsx              # Subscription screen
│   ├── terms-of-service.tsx          # Terms of service
│   ├── index.tsx                     # Root index
│   ├── _layout.tsx                   # Root layout
│   └── +not-found.tsx                # 404 page
├── 📁 src/                           # Source code
│   ├── 📁 shared/                    # Shared components & utilities
│   │   └── 📁 components/            # Reusable UI components
│   │       ├── 📁 ui/               # Basic UI elements
│   │       ├── 📁 layout/           # Layout components
│   │       ├── 📁 feedback/         # Feedback components
│   │       └── index.ts             # Component exports
│   ├── 📁 navigation/                # Navigation components
│   └── 📁 providers/                 # Provider components
├── 📁 contexts/                      # React Context providers
│   ├── AuthContext.tsx               # Authentication state
│   ├── ThemeContext.tsx              # Theme management
│   ├── DataContext.tsx               # Data management
│   ├── SettingsContext.tsx           # Settings state
│   ├── SubscriptionContext.tsx       # Subscription state
│   ├── HeaderContext.tsx             # Header state
│   ├── ScrollContext.tsx             # Scroll state
│   └── index.ts                      # Context exports
├── 📁 theme/                         # Theme configuration
│   ├── colors.ts                     # Color schemes
│   ├── typography.ts                 # Font styles
│   └── spacing.ts                    # Layout spacing
├── 📁 lib/                          # External libraries config
├── 📁 assets/                       # Static assets
│   ├── 📁 images/                   # Image files
│   ├── 📁 icons/                    # Icon files
│   └── 📁 fonts/                    # Font files
├── 📁 hooks/                        # Global custom hooks
├── 📁 scripts/                      # Build and setup scripts
├── 📁 docs/                         # Documentation
├── app.json                          # Expo configuration
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── babel.config.js                   # Babel configuration
├── metro.config.js                   # Metro bundler config
├── eslint.config.js                  # ESLint configuration
├── template.config.js                # Template configuration
└── README.md                         # Project documentation
```

## 🎨 Customization Guide

### 🎯 App Configuration

1. **Update app identity**:
   ```json
   // app.json
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

2. **Update package information**:
   ```json
   // package.json
   {
     "name": "your-app-name",
     "description": "Your app description",
     "author": "Your Name",
     "repository": "https://github.com/yourusername/your-repo"
   }
   ```

### 🎨 Theme Customization

Create your brand theme in `theme/colors.ts`:

```typescript
export const lightTheme = {
  primary: '#6366F1',           # Your brand color
  secondary: '#EC4899',         # Secondary accent
  background: '#FFFFFF',        # Main background
  surface: '#F8FAFC',          # Card backgrounds
  text: '#0F172A',             # Primary text
  textSecondary: '#64748B',    # Secondary text
  success: '#10B981',          # Success states
  warning: '#F59E0B',          # Warning states
  error: '#EF4444',            # Error states
  info: '#3B82F6',             # Info states
};
```

### 🔌 API Integration

Configure your backend in `src/services/api/client.ts`:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 🔄 Context Integration

Add custom contexts following the established patterns:

```typescript
// contexts/YourContext.tsx
import React, { createContext, useContext, useReducer } from 'react';

const YourContext = createContext();

export const useYour = () => {
  const context = useContext(YourContext);
  if (!context) {
    throw new Error('useYour must be used within YourProvider');
  }
  return context;
};

export const YourProvider = ({ children }) => {
  // Your context logic here
  return (
    <YourContext.Provider value={value}>
      {children}
    </YourContext.Provider>
  );
};
```

## 📱 Platform-Specific Features

### iOS
- **Apple Sign-In**: Native Apple authentication
- **Biometric Authentication**: Face ID / Touch ID
- **Push Notifications**: APNs integration
- **Navigation Patterns**: iOS-specific UI patterns
- **App Store Connect**: Ready for deployment

### Android
- **Google Sign-In**: Native Google authentication
- **Biometric Authentication**: Fingerprint / Face unlock
- **Push Notifications**: FCM integration
- **Material Design**: Native Android UI patterns
- **Google Play**: Ready for deployment

### Web
- **Progressive Web App**: Offline functionality
- **Web Authentication**: WebAuthn support
- **Responsive Design**: Desktop and mobile layouts
- **SEO Optimized**: Meta tags and structured data

## 🚀 Deployment

### 🏗️ EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure builds
eas build:configure

# Build for all platforms
eas build --platform all

# Submit to app stores
eas submit --platform all
```

### 📦 Classic Expo Build

```bash
# Build for production
expo build:ios
expo build:android
expo build:web
```

### 🌐 Web Deployment

```bash
# Build for web
npm run build:web

# Deploy to Vercel
vercel deploy

# Deploy to Netlify
netlify deploy --prod --dir web-build
```

## 🧪 Testing

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Testing Features

- **Authentication Flow**: Automated login/logout tests
- **Navigation**: Screen transition testing
- **API Integration**: Mock API response testing
- **Theme Switching**: UI consistency testing
- **Context Providers**: State management testing

## 🔧 Environment Variables

Create `.env` file with required configurations:

```env
# API Configuration
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_WS_URL=wss://your-websocket.com

# Authentication
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
EXPO_PUBLIC_APPLE_CLIENT_ID=your_apple_client_id

# Analytics
EXPO_PUBLIC_ANALYTICS_ID=your_analytics_id

# Push Notifications
EXPO_PUBLIC_FCM_SENDER_ID=your_fcm_sender_id

# Feature Flags
EXPO_PUBLIC_ENABLE_BIOMETRIC_AUTH=true
EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true
```

## 📊 Performance Optimization

### Bundle Size Optimization
- **Code Splitting**: Lazy loading for non-critical screens
- **Tree Shaking**: Automatic dead code elimination
- **Image Optimization**: WebP format with fallbacks
- **Font Subsetting**: Only load required font weights

### Runtime Performance
- **Memo Components**: Optimized re-rendering
- **Virtual Lists**: Efficient large list rendering
- **Image Caching**: Automatic image caching
- **Network Optimization**: Request batching and caching

## 🛡️ Security Best Practices

### Data Protection
- **Encrypted Storage**: All sensitive data encrypted
- **Token Security**: Secure token storage and rotation
- **API Security**: Request signing and validation
- **Privacy Controls**: GDPR and CCPA compliance

### Authentication Security
- **Multi-factor Authentication**: 2FA support
- **Biometric Authentication**: Device-based security
- **Session Management**: Automatic session timeout
- **Password Policies**: Configurable password requirements

## 📖 Documentation

### Developer Guides
- [Architecture Overview](docs/architecture.md)
- [Component Library](docs/components.md)
- [Context Patterns](docs/context-patterns.md)
- [API Integration](docs/api-integration.md)
- [Deployment Guide](docs/deployment.md)
- [Testing Guide](docs/testing.md)

### User Guides
- [Getting Started](docs/getting-started.md)
- [Customization](docs/customization.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Write comprehensive tests
- Document new features

## 📞 Support & Community

### Get Help
- 📧 **Email**: oracle@outlook.com
- 📖 **Documentation**: [Full docs](https://docs.react-native-context-template.dev)
- 🐛 **Issues**: [GitHub Issues](https://github.com/dishanh/react-native-context-template/issues)


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the amazing development platform
- **React Native Community**: For continuous innovation
- **Open Source Contributors**: For making this template possible

---

**Made with ❤️ by Dishan Hewage**

[⭐ Star us on GitHub](https://github.com/dishanh/react-native-context-template) | [🚀 Deploy Now](https://react-native-context-template.dev/deploy) | [📖 Read the Docs](https://docs.react-native-context-template.dev) 
