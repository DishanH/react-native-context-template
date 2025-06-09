#!/usr/bin/env node

/**
 * Template Setup Script
 * 
 * This script automatically configures the template based on template.config.js
 * Run with: npm run setup-template
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupTemplate() {
  console.log('🚀 React Native Template Setup\n');
  
  // Get user input
  const appName = await question('App name (e.g., "My Awesome App"): ');
  const packageName = await question('Package name (e.g., "my-awesome-app"): ');
  const bundleId = await question('Bundle ID (e.g., "com.company.myapp"): ');
  const author = await question('Author name: ');
  const description = await question('App description: ');
  
  console.log('\n📝 Updating configuration files...\n');
  
  try {
    // Update package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    packageJson.name = packageName || packageJson.name;
    packageJson.description = description || packageJson.description;
    packageJson.author = author || packageJson.author;
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json');
    
    // Update app.json
    const appJsonPath = path.join(process.cwd(), 'app.json');
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    appJson.expo.name = appName || appJson.expo.name;
    appJson.expo.slug = packageName || appJson.expo.slug;
    appJson.expo.description = description || appJson.expo.description;
    
    if (bundleId) {
      appJson.expo.ios.bundleIdentifier = bundleId;
      appJson.expo.android.package = bundleId;
    }
    
    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
    console.log('✅ Updated app.json');
    
    // Update README.md
    const readmePath = path.join(process.cwd(), 'README.md');
    let readme = fs.readFileSync(readmePath, 'utf8');
    
    if (appName) {
      readme = readme.replace(/# React Native Template with Context/g, `# ${appName}`);
    }
    if (description) {
      readme = readme.replace(/A production-ready React Native template.*?Context patterns\./g, description);
    }
    
    fs.writeFileSync(readmePath, readme);
    console.log('✅ Updated README.md');
    
    console.log('\n🎉 Template setup complete!\n');
    console.log('Next steps:');
    console.log('1. Update theme colors in theme/colors.ts');
    console.log('2. Configure API endpoints in contexts/AuthContext.tsx');
    console.log('3. Add your app icons to assets/images/');
    console.log('4. Start development: npm start\n');
    
  } catch (error) {
    console.error('❌ Error setting up template:', error.message);
  }
  
  rl.close();
}

// Run the setup
setupTemplate(); 