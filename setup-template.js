#!/usr/bin/env node

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
  console.log('🚀 Welcome to React Native Template Setup!\n');
  
  try {
    // Get project details
    const appName = await question('Enter your app name: ');
    const appSlug = await question('Enter your app slug (lowercase, no spaces): ');
    const description = await question('Enter app description: ');
    const bundleId = await question('Enter bundle identifier (com.yourcompany.appname): ');
    
    // Update app.json
    const appJsonPath = path.join(__dirname, 'app.json');
    if (fs.existsSync(appJsonPath)) {
      const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
      
      appJson.expo.name = appName;
      appJson.expo.slug = appSlug;
      appJson.expo.description = description;
      
      if (appJson.expo.ios) {
        appJson.expo.ios.bundleIdentifier = bundleId;
      }
      
      if (appJson.expo.android) {
        appJson.expo.android.package = bundleId;
      }
      
      fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
      console.log('✅ Updated app.json');
    }
    
    // Update package.json
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      packageJson.name = appSlug;
      packageJson.description = description;
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Updated package.json');
    }
    
    // Update welcome message in dashboard
    const dashboardPath = path.join(__dirname, 'app', 'tabs', 'index.tsx');
    if (fs.existsSync(dashboardPath)) {
      let dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
      dashboardContent = dashboardContent.replace(
        'Welcome to your template',
        `Welcome to ${appName}`
      );
      dashboardContent = dashboardContent.replace(
        'This is your React Native template with authentication, theming, and navigation ready to go.',
        `Welcome to ${appName}! This app is built with React Native and includes authentication, theming, and navigation.`
      );
      
      fs.writeFileSync(dashboardPath, dashboardContent);
      console.log('✅ Updated dashboard welcome message');
    }
    
    console.log('\n🎉 Template setup complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm start');
    console.log('3. Start building your amazing app!');
    console.log('\n📝 Don\'t forget to:');
    console.log('- Update colors in app/theme/colors.ts');
    console.log('- Replace placeholder content with your app\'s content');
    console.log('- Configure your authentication endpoints');
    console.log('- Add your app icons and splash screen');
    
  } catch (error) {
    console.error('❌ Error setting up template:', error.message);
  } finally {
    rl.close();
  }
}

setupTemplate(); 