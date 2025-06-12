#!/usr/bin/env node

/**
 * Template Cleanup Script
 * 
 * This script removes template-specific files and configurations
 * when creating a new project from this template. This ensures
 * users get a clean project without template metadata.
 * 
 * Usage: node scripts/clean-template.js
 */

const fs = require('fs');
const path = require('path');

// Files and directories to remove from the new project
const filesToRemove = [
  // Template documentation
  'CHANGELOG.md',
  '.templateignore',
  
  // Template configuration
  'template.config.js',
  
  // Template scripts
  'scripts/setup-template.js',
  'scripts/reset-project.js',
  'scripts/clean-template.js',
  
  // Development and template notes
  'docs/template-notes.md',
  'docs/development-log.md',
  'docs/template-usage.md',
  
  // Demo content that users should replace
  'app/tabs/index.tsx',
  'app/tabs/add-expense.tsx',
  'app/tabs/add-member.tsx', 
  'app/tabs/settle.tsx',
  
  // Example feature screens
  'app/activity.tsx',
  'app/groups.tsx',
  'app/storage-data.tsx',
  'app/subscription.tsx',
  
  // Demo assets
  'assets/images/demo/',
  'assets/icons/demo/',
  
  // Example data files
  'lib/demo-data.ts',
  'lib/sample-data.ts',
  
  // Git and CI specific to template
  '.github/',
  
  // Package lock files (users should generate their own)
  'package-lock.json',
  'yarn.lock'
];

// Directories to completely remove
const dirsToRemove = [
  'app/features/activity/',
  'app/features/groups/', 
  'app/features/subscription/',
  'assets/images/demo/',
  'assets/icons/demo/',
  'docs/template-notes/',
  '.github/'
];

function removeFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ Removed directory: ${filePath}`);
      } else {
        fs.unlinkSync(fullPath);
        console.log(`✅ Removed file: ${filePath}`);
      }
    }
  } catch (error) {
    console.log(`⚠️  Could not remove ${filePath}:`, error.message);
  }
}

function updatePackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Remove template-specific scripts
    delete packageJson.scripts['setup-template'];
    delete packageJson.scripts['reset-project'];
    
    // Update the name to a generic one
    if (packageJson.name === 'react-native-context-template') {
      packageJson.name = 'my-app';
    }
    
    // Remove template-specific keywords
    if (packageJson.keywords) {
      packageJson.keywords = packageJson.keywords.filter(keyword => 
        !['template', 'boilerplate', 'starter'].includes(keyword)
      );
    }
    
    // Update repository URL placeholder
    if (packageJson.repository && packageJson.repository.url) {
      packageJson.repository.url = 'https://github.com/username/my-app.git';
    }
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json');
    
  } catch (error) {
    console.log('⚠️  Could not update package.json:', error.message);
  }
}

function updateAppJson() {
  const appJsonPath = path.join(process.cwd(), 'app.json');
  
  try {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    // Update app configuration to generic values
    appJson.expo.name = 'My App';
    appJson.expo.slug = 'my-app';
    appJson.expo.description = 'A React Native app built with Expo';
    
    // Update bundle identifiers
    if (appJson.expo.ios) {
      appJson.expo.ios.bundleIdentifier = 'com.company.myapp';
    }
    
    if (appJson.expo.android) {
      appJson.expo.android.package = 'com.company.myapp';
    }
    
    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
    console.log('✅ Updated app.json');
    
  } catch (error) {
    console.log('⚠️  Could not update app.json:', error.message);
  }
}

function createCleanReadme() {
  const readmePath = path.join(process.cwd(), 'README.md');
  
  const cleanReadme = `# My App

A React Native app built with Expo and Context-based state management.

## Features

- Authentication system with secure storage
- Dynamic theming (light/dark mode)
- File-based routing with Expo Router
- Context-based state management
- Cross-platform support (iOS, Android, Web)

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`

3. Run on your preferred platform:
   \`\`\`bash
   # iOS
   npm run ios
   
   # Android  
   npm run android
   
   # Web
   npm run web
   \`\`\`

## Project Structure

- \`app/\` - App screens and navigation (Expo Router)
- \`src/\` - Shared components and utilities
- \`contexts/\` - React Context providers for state management
- \`theme/\` - Theme configuration and styling
- \`assets/\` - Images, icons, and fonts

## Customization

- Update app configuration in \`app.json\`
- Customize themes in \`theme/colors.ts\`
- Add your components to \`src/shared/components/\`
- Configure contexts in \`contexts/\` directory

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://expo.github.io/router/)
`;

  try {
    fs.writeFileSync(readmePath, cleanReadme);
    console.log('✅ Created clean README.md');
  } catch (error) {
    console.log('⚠️  Could not update README.md:', error.message);
  }
}

// Run the cleanup
console.log('🧹 Cleaning template files for new project...\n');

// Remove template-specific files
filesToRemove.forEach(removeFile);

// Update configuration files
updatePackageJson();
updateAppJson();
createCleanReadme();

console.log('\n🎉 Template cleanup complete!');
console.log('\n📋 Next steps:');
console.log('1. Update app name and configuration in app.json');
console.log('2. Install dependencies: npm install');
console.log('3. Start development: npm start');
console.log('4. Build your app by customizing the included components and contexts\n'); 