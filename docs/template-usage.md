# Template Usage Guide

This document explains how to properly create new projects from this React Native Context Template and handle template-specific files.

## The Template File Exclusion Issue

### Problem
When creating a new project from this template, you may notice that template-specific files like `CHANGELOG.md`, `README.md`, and `template.config.js` are still present in your new project. This happens because different template creation tools handle file exclusions differently.

### Why This Happens
1. **Different Template Systems**: Various tools (create-expo-app, create-react-native-app, git clone, etc.) handle `.templateignore` files differently
2. **Platform Differences**: Some platforms use `.gitignore` patterns, others use custom ignore files
3. **Tool-Specific Behavior**: Not all template creation tools recognize `.templateignore` files

## Solutions

### Solution 1: Manual Cleanup Script (Recommended)

After creating your project from the template, run the cleanup script:

```bash
# After creating your project
npx create-expo-app MyApp --template https://github.com/dishanh/react-native-context-template
cd MyApp

# Run the cleanup script to remove template files
npm run clean-template
```

This script will:
- Remove `CHANGELOG.md`, `.templateignore`, and `template.config.js`
- Clean up template-specific scripts
- Update `package.json` with your project name
- Create a clean `README.md` for your project
- Remove demo screens and example data

### Solution 2: Manual File Removal

If you prefer to manually clean up, remove these files/directories:

```bash
# Template documentation
rm CHANGELOG.md
rm .templateignore
rm template.config.js

# Template scripts
rm scripts/setup-template.js
rm scripts/reset-project.js
rm scripts/clean-template.js

# Demo content (optional - you can keep these for reference)
rm app/tabs/add-expense.tsx
rm app/tabs/add-member.tsx
rm app/tabs/settle.tsx
rm app/activity.tsx
rm app/groups.tsx
rm app/storage-data.tsx
rm app/subscription.tsx

# Clean up package.json scripts
# Remove: "setup-template", "reset-project", "clean-template"
```

### Solution 3: Fork and Customize

For organizations or repeated use:

1. Fork this repository
2. Remove template-specific files manually
3. Customize the base configuration
4. Use your fork as the template source

## What to Keep vs Remove

### Keep These (Core Template Features)
- `src/` - All shared components and utilities
- `contexts/` - React Context providers (core architecture)
- `theme/` - Theming system and color configurations
- `app/_layout.tsx` - Root layout and navigation setup
- `app/auth/` - Authentication screens and flow
- `app/onboarding/` - Onboarding flow (customize content)
- `assets/` - Base icons and images (replace with yours)
- Core configuration files (`app.json`, `package.json`, etc.)

### Remove These (Template-Specific)
- `CHANGELOG.md` - Template version history
- `.templateignore` - Template exclusion rules
- `template.config.js` - Template configuration
- `scripts/setup-template.js` - Template setup script
- `scripts/reset-project.js` - Template reset script
- `docs/template-*.md` - Template documentation
- Demo screens in `app/tabs/` (replace with your screens)
- Example feature screens (replace with your features)

### Customize These
- `README.md` - Write your project documentation
- `app.json` - Update app name, bundle ID, description
- `package.json` - Update name, description, repository
- `app/tabs/` - Replace demo tabs with your app's navigation
- `theme/colors.ts` - Customize your app's color scheme

## Best Practices for New Projects

### 1. Initial Setup
```bash
# Create project
npx create-expo-app MyApp --template https://github.com/dishanh/react-native-context-template
cd MyApp

# Clean template files
npm run clean-template

# Install dependencies
npm install
```

### 2. Configuration
```bash
# Update app.json with your app details
# Update package.json with your project info
# Customize theme/colors.ts for your brand
```

### 3. Development
```bash
# Start development
npm start

# Keep the core architecture (contexts, theme, navigation)
# Replace demo screens with your app screens
# Add your business logic to contexts
```

## Understanding the Template Architecture

### Core Components to Leverage
- **AuthContext**: Complete authentication state management
- **ThemeContext**: Dynamic theming with persistence  
- **BottomSheetProvider**: Modal and sheet management
- **Navigation Setup**: File-based routing with Expo Router

### Demo Components (Replace These)
- **Expense Tracking Screens**: Example of state management patterns
- **Group Management**: Example of list management and CRUD operations
- **Subscription Management**: Example of user preference management

## Troubleshooting

### Template Files Still Present
If template files are still present after using `create-expo-app`, it's because the template creation tool doesn't recognize `.templateignore`. Use the cleanup script:

```bash
npm run clean-template
```

### Missing Dependencies
If you encounter dependency issues:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or for Expo specifically
expo install --fix
```

### Navigation Issues
If you remove demo screens and have navigation errors:

1. Update the `RootNavigator.tsx` to remove references to deleted screens
2. Check `app/(tabs)/_layout.tsx` for tab references
3. Update any deep links or navigation references

### "User not authenticated" Console Messages
You may see console messages like "User not authenticated, saving preferences locally only" when:

1. **First app launch**: Before user signs up or logs in
2. **User logged out**: When preferences are updated while not authenticated
3. **Theme changes**: When system theme changes trigger preference updates

**This is normal behavior**, not an error. The app automatically:
- Saves preferences to local storage when not authenticated
- Syncs to database once user logs in
- Preserves user preferences across sessions

**Note**: The previous error message "No user ID available for saving preferences" has been updated to be more user-friendly in recent versions.

### SecureStore Size Limit Warnings
You may see warnings about data being larger than 2048 bytes in SecureStore:

**What it means**: Expo SecureStore has a 2048-byte limit per item. Large objects (like complete user sessions) can exceed this limit.

**How we handle it**:
- **User data optimization**: The app automatically excludes large session objects from storage
- **Aggressive optimization**: If data is still too large, only essential fields (id, email, name, isAuthenticated) are stored
- **Sync queue limiting**: Background sync queue is limited to 100 items maximum
- **Field truncation**: Long text fields are automatically truncated for storage
- **Full data in memory**: Complete user profile and session data remain available in app memory

**No action needed**: These are informational warnings. The app will continue to work normally and automatically optimize data for storage constraints.

## Creating Your Own Template

To create your own template based on this one:

1. Fork this repository
2. Run the cleanup script to remove template files
3. Customize the base configuration for your needs
4. Add your own boilerplate code
5. Create a new `.templateignore` with your exclusions
6. Test the template creation process

## Support

If you encounter issues with template file exclusions:

1. Use the cleanup script: `npm run clean-template`
2. Check the template creation tool documentation
3. Consider using a different template creation method
4. Report issues to help improve the template

## Contributing

When contributing to the template:

1. Test template creation with multiple tools
2. Update `.templateignore` for new exclusions
3. Update the cleanup script for new files
4. Document any new template-specific files 