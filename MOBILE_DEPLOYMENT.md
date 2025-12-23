# Mobile App Deployment Guide (iOS & Android)

This guide explains how to convert your Binti Health web app into native iOS and Android apps using Capacitor.

## Why This Works

Your app is built as a **Progressive Web App (PWA)** using vanilla JavaScript, HTML, and CSS. This architecture is **perfect** for mobile conversion because:

1. **No Framework Lock-in** - Works with any web technology
2. **Native Performance** - Capacitor wraps your web app in a native container
3. **Native Features** - Access camera, Bluetooth, push notifications, etc.
4. **Single Codebase** - Same code runs on web, iOS, and Android
5. **App Store Ready** - Generates real native apps for submission

## Architecture

```
Your Web App (HTML/CSS/JS)
        ↓
    Capacitor
        ↓
    ├── iOS App (Swift/Objective-C wrapper)
    └── Android App (Kotlin/Java wrapper)
```

## Prerequisites

### For iOS Development
- **macOS** (required for iOS builds)
- **Xcode** (latest version from Mac App Store)
- **CocoaPods** (`sudo gem install cocoapods`)
- **Apple Developer Account** ($99/year for App Store)

### For Android Development
- **Android Studio** (any OS)
- **Java JDK 11+**
- **Google Play Developer Account** ($25 one-time fee)

### For Both
- **Node.js 18+** (already installed)
- **npm** (comes with Node.js)

## Step 1: Install Capacitor

```bash
npm install
```

This installs Capacitor CLI and core packages (already in package.json).

## Step 2: Initialize Capacitor

```bash
npm run mobile:init
```

This creates the Capacitor configuration (already created as `capacitor.config.json`).

## Step 3: Add iOS Platform

**On macOS only:**

```bash
npm run mobile:add:ios
```

This creates an `ios/` folder with your Xcode project.

## Step 4: Add Android Platform

**On any OS:**

```bash
npm run mobile:add:android
```

This creates an `android/` folder with your Android Studio project.

## Step 5: Sync Your Web App

After making changes to your web app:

```bash
npm run mobile:sync
```

This copies your web files to the native projects.

## Step 6: Build for iOS

### Open in Xcode

```bash
npm run mobile:open:ios
```

### In Xcode:
1. Select your development team (Apple Developer Account)
2. Choose a device or simulator
3. Click **Run** (▶️) to build and test
4. For App Store: **Product > Archive** then upload

### App Store Submission
1. Create app in App Store Connect
2. Archive your app in Xcode
3. Upload to App Store Connect
4. Fill out app metadata, screenshots
5. Submit for review

## Step 7: Build for Android

### Open in Android Studio

```bash
npm run mobile:open:android
```

### In Android Studio:
1. Let Gradle sync complete
2. Select a device or emulator
3. Click **Run** (▶️) to build and test
4. For Play Store: **Build > Generate Signed Bundle/APK**

### Play Store Submission
1. Create app in Google Play Console
2. Generate signed APK/Bundle
3. Upload to Play Console
4. Fill out app metadata, screenshots
5. Submit for review

## Configuration

### Update Server URL

In `capacitor.config.json`, update the server URL to your production URL:

```json
{
  "server": {
    "url": "https://your-actual-app.vercel.app"
  }
}
```

### App Icons & Splash Screens

1. **Generate Assets**: Use a tool like [Capacitor Assets Generator](https://github.com/ionic-team/capacitor-assets)
2. **Place Icons**:
   - iOS: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Android: `android/app/src/main/res/mipmap-*/`
3. **Splash Screens**:
   - iOS: `ios/App/App/Assets.xcassets/Splash.imageset/`
   - Android: `android/app/src/main/res/drawable-*/`

### App Permissions

#### iOS (Info.plist)
Add to `ios/App/App/Info.plist`:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>We need Bluetooth to connect to your Binti Smart Pad</string>
<key>NSCameraUsageDescription</key>
<string>Take photos for your health journal</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Choose photos for your profile</string>
```

#### Android (AndroidManifest.xml)
Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## Native Features

### Bluetooth (Smart Pad Connection)

Your existing Bluetooth code will work! Capacitor provides native Bluetooth access.

### Push Notifications

Install plugin:
```bash
npm install @capacitor/push-notifications
npx cap sync
```

### Camera

Install plugin:
```bash
npm install @capacitor/camera
npx cap sync
```

### Local Storage

Already works! Your app's localStorage persists in the native app.

## Development Workflow

### Web Development
1. Make changes to HTML/CSS/JS
2. Test in browser: `python -m http.server 8082`
3. When ready, sync to mobile: `npm run mobile:sync`

### Mobile Testing
1. Open in Xcode/Android Studio
2. Run on simulator/emulator
3. Test native features (Bluetooth, camera, etc.)
4. Debug using native dev tools

### Production Build
1. Update version in `package.json`
2. Sync: `npm run mobile:sync`
3. Build signed apps in Xcode/Android Studio
4. Submit to App Store/Play Store

## App Store Requirements

### iOS App Store
- **Screenshots**: 6.7", 6.5", 5.5" iPhone sizes
- **App Icon**: 1024x1024 PNG
- **Privacy Policy**: Required URL
- **Age Rating**: Complete questionnaire
- **App Description**: Up to 4000 characters

### Google Play Store
- **Screenshots**: Phone and tablet sizes
- **Feature Graphic**: 1024x500 PNG
- **App Icon**: 512x512 PNG
- **Privacy Policy**: Required URL
- **Content Rating**: Complete questionnaire
- **App Description**: Up to 4000 characters

## Testing Checklist

- [ ] App launches successfully
- [ ] Login/registration works
- [ ] All screens navigate properly
- [ ] API calls work (check network)
- [ ] Bluetooth connects to smart pad
- [ ] Camera/photo picker works
- [ ] Push notifications work
- [ ] Offline mode works
- [ ] Data persists after app restart
- [ ] App doesn't crash on background/foreground

## Common Issues

### iOS Build Fails
- Update Xcode to latest version
- Run `pod install` in `ios/App/` folder
- Clean build folder: Xcode > Product > Clean Build Folder

### Android Build Fails
- Update Android Studio
- Sync Gradle files
- Invalidate caches: File > Invalidate Caches / Restart

### API Not Working
- Check `capacitor.config.json` server URL
- Ensure CORS allows your app domain
- Check network permissions in manifest

### Bluetooth Not Working
- Add permissions to Info.plist/AndroidManifest.xml
- Request permissions at runtime
- Test on real device (not simulator)

## Benefits of This Approach

✅ **Single Codebase** - One app for web, iOS, and Android
✅ **Native Performance** - Runs as fast as native apps
✅ **App Store Distribution** - Real apps in App Store and Play Store
✅ **Native Features** - Full access to device capabilities
✅ **Easy Updates** - Update web code, sync to mobile
✅ **No React/Framework Required** - Works with vanilla JS
✅ **PWA + Native** - Best of both worlds

## Cost Summary

- **Development**: $0 (use existing web app)
- **Apple Developer**: $99/year
- **Google Play**: $25 one-time
- **Total First Year**: $124

## Timeline Estimate

- **Setup Capacitor**: 1 hour
- **iOS Build & Test**: 2-4 hours
- **Android Build & Test**: 2-4 hours
- **App Store Submission**: 1-2 days (review time: 1-3 days)
- **Play Store Submission**: 1-2 days (review time: 1-7 days)

**Total**: Can have apps in stores within 1-2 weeks!

---

Your Binti Health app is **already mobile-ready**. Just follow these steps when you're ready to deploy to iOS and Android app stores.
