#!/usr/bin/env node

/**
 * Template Setup Script
 * 
 * This script automatically configures the template based on user input.
 * Demo files and examples are kept for users to learn from and customize.
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
  console.log('🚀 React Native Context Template Setup\n');
  console.log('This script will help you configure your new project.');
  console.log('Demo screens and examples will be kept for you to learn from and customize.\n');
  
  // Get user input for configuration
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
    
    if (packageName) packageJson.name = packageName;
    if (description) packageJson.description = description;
    if (author) packageJson.author = author;
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json');
    
    // Update app.json
    const appJsonPath = path.join(process.cwd(), 'app.json');
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    if (appName) appJson.expo.name = appName;
    if (packageName) appJson.expo.slug = packageName;
    if (description) appJson.expo.description = description;
    
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
      readme = readme.replace(/# 🚀 React Native Context Template/g, `# 🚀 ${appName}`);
    }
    if (description) {
      readme = readme.replace(/A comprehensive, production-ready React Native template.*?mobile applications\./g, description);
    }
    
    fs.writeFileSync(readmePath, readme);
    console.log('✅ Updated README.md');
    
    console.log('\n🎉 Template setup complete!\n');
    console.log('📋 Next steps:');
    console.log('1. Explore the demo screens in app/tabs/ and app/features/');
    console.log('2. Customize the demo screens for your app needs');
    console.log('3. Update theme colors in theme/colors.ts');
    console.log('4. Configure API endpoints in contexts/ files');
    console.log('5. Add your app icons to assets/images/');
    console.log('6. Start development: npm start\n');
    
    console.log('💡 Tips:');
    console.log('- Demo screens show best practices for Context usage');
    console.log('- Check app/features/ for organized feature examples');
    console.log('- All contexts in contexts/ folder demonstrate state management patterns');
    console.log('- Customize components in src/shared/components/ as needed\n');
    
  } catch (error) {
    console.error('❌ Error setting up template:', error.message);
  }
  
  rl.close();
}

// Run the setup
setupTemplate(); 