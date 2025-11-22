# FitBuddy Setup & Configuration Guide

## 🚀 Quick Start

This guide will help you set up and run the FitBuddy application with all features enabled.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Expo CLI** - Install globally with: `npm install -g expo-cli`
- **Git** (optional, for cloning)

### For Mobile Development:
- **iOS**: macOS with Xcode and iOS Simulator
- **Android**: Android Studio with Android Emulator
- **Physical Device**: Expo Go app from App Store or Play Store

## 📦 Installation Steps

### 1. Navigate to Project Directory

```bash
cd "d:\Mobile Apps\fit-buddy"
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Core dependencies (React Native, Expo)
- State management (Redux Toolkit)
- Navigation (Expo Router)
- Animations (React Native Reanimated)
- Storage (AsyncStorage, Expo SecureStore)
- Forms & Validation (Formik, Yup)
- API client (Axios)

### 3. Environment Configuration

#### Create .env file:

```bash
# If .env doesn't exist, copy from example
copy .env.example .env
```

#### Edit .env file with your configuration:

```env
# API Configuration
# Get your API key from https://api-ninjas.com/
EXPO_PUBLIC_FITNESS_API_KEY=your_api_ninjas_key_here

# API Base URLs (leave as is)
EXPO_PUBLIC_FITNESS_API_BASE=https://api.api-ninjas.com/v1
EXPO_PUBLIC_AUTH_API_BASE=https://dummyjson.com

# App Configuration
EXPO_PUBLIC_APP_NAME=FitBuddy
EXPO_PUBLIC_APP_VERSION=1.0.0

# Environment
EXPO_PUBLIC_ENVIRONMENT=development
```

**Important Notes:**
- The app works with mock data even without an API key
- To get a free API key, visit [https://api-ninjas.com/](https://api-ninjas.com/)
- Never commit your `.env` file to version control

## 🔧 Running the Application

### Start Development Server

```bash
npx expo start
```

This will start the Metro bundler and show a QR code.

### Run on Different Platforms

Once the development server is running:

#### iOS Simulator (Mac only)
Press `i` in the terminal or run:
```bash
npm run ios
```

#### Android Emulator
Press `a` in the terminal or run:
```bash
npm run android
```

#### Web Browser
Press `w` in the terminal or run:
```bash
npm run web
```

#### Physical Device
1. Install **Expo Go** app from App Store or Play Store
2. Scan the QR code with your camera (iOS) or Expo Go app (Android)

## 🔐 Authentication Setup

### Demo Credentials

The app uses DummyJSON for authentication. Use these demo credentials:

```
Username: emilys
Password: emilyspass
```

### Creating New Account

You can also register a new account through the app. Note that registration creates mock users since this is a demo application.

### Secure Storage

The app uses:
- **Expo SecureStore** on native platforms (iOS/Android) for token storage
- **AsyncStorage** on web platform for development

## 🏋️ Exercise Data Configuration

### Using Mock Data (Recommended for Development)

The app includes 35+ built-in exercises with:
- Multiple muscle groups (chest, back, biceps, triceps, shoulders, legs, abs, etc.)
- All difficulty levels (beginner, intermediate, expert)
- Different exercise types (strength, cardio, stretching)
- Complete instructions for each exercise

**No API key needed!** The app automatically falls back to mock data.

### Using API Ninjas (Optional)

For real-time exercise data:

1. Visit [API Ninjas](https://api-ninjas.com)
2. Sign up for a free account
3. Go to your profile and copy your API key
4. Update `.env` file:
   ```env
   EXPO_PUBLIC_FITNESS_API_KEY=your_actual_api_key_here
   ```
5. Restart the Expo server

The app will automatically detect the API key and fetch live data.

## 💧 Water Tracker Feature

The water tracker is built-in and doesn't require any configuration:

- **Default Goal**: 2000ml (2 liters) per day
- **Storage**: Automatic persistence with AsyncStorage
- **Reset**: Automatically resets daily at midnight
- **Quick Add Options**: 250ml, 500ml, 750ml, 1000ml

## 🎨 Theme Configuration

### Default Themes

The app includes:
- **Light Theme**: Clean, modern design
- **Dark Theme**: Easy on the eyes for night use

### Changing Theme

Users can toggle between light and dark mode in the Profile tab. The preference is saved and persists across app restarts.

## 📁 Project Structure

```
fit-buddy/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Main app tabs
│   └── auth/              # Authentication flow
├── components/             # Reusable components
│   ├── WaterTracker.tsx   # Water intake tracker
│   └── ExerciseCard.tsx   # Animated exercise card
├── store/                  # Redux store
│   └── slices/            # State slices
├── services/              # API services
│   └── api.ts             # API client with mock data
├── utils/                 # Utilities
│   ├── validation.ts      # Form validation schemas
│   └── secureStorage.ts   # Secure storage wrapper
├── constants/             # Theme & constants
├── .env                   # Environment variables (create this)
└── .env.example          # Example configuration
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Dependencies Installation Failed

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### 2. Metro Bundler Cache Issues

```bash
# Clear Expo cache
npx expo start -c
```

#### 3. Environment Variables Not Loading

- Ensure `.env` file is in the project root
- Restart the Expo development server
- Check that variables start with `EXPO_PUBLIC_`

#### 4. Reanimated Warnings

If you see warnings about Reanimated, they're usually safe to ignore. The library is properly configured.

#### 5. SecureStore Errors on Web

This is expected! The app automatically falls back to AsyncStorage on web platforms.

## 📱 Building for Production

### Android APK

```bash
eas build --platform android
```

### iOS IPA

```bash
eas build --platform ios
```

You'll need to set up Expo Application Services (EAS) first:
```bash
npm install -g eas-cli
eas login
eas build:configure
```

## 🔒 Security Best Practices

### What's Implemented:

✅ Secure token storage with Expo SecureStore
✅ Environment variables for API keys
✅ Password validation with strength requirements
✅ No sensitive data in source code
✅ Proper error handling

### Additional Recommendations:

- Never commit `.env` file
- Use proper authentication backend in production
- Implement refresh tokens
- Add rate limiting
- Use HTTPS for all API calls

## 📊 Feature Testing

### Test Each Feature:

1. **Authentication**
   - [ ] Login with demo credentials
   - [ ] Register new account
   - [ ] Logout and login again
   - [ ] Session persists after app restart

2. **Exercise Library**
   - [ ] Browse exercises
   - [ ] Apply muscle group filters
   - [ ] Apply difficulty filters
   - [ ] Search for specific exercise
   - [ ] View exercise details
   - [ ] Pull to refresh

3. **Favorites**
   - [ ] Add exercise to favorites (heart icon)
   - [ ] Remove from favorites
   - [ ] View favorites tab
   - [ ] Favorites persist after restart

4. **Water Tracker**
   - [ ] Add water with quick buttons
   - [ ] Watch glass fill animation
   - [ ] Undo last entry
   - [ ] Check persistence
   - [ ] Reach daily goal

5. **Theme**
   - [ ] Toggle dark mode
   - [ ] All screens adapt to theme
   - [ ] Theme persists after restart

## 🎯 Performance Tips

### For Best Performance:

1. **Use Production Mode for Testing**:
   ```bash
   npx expo start --no-dev --minify
   ```

2. **Enable Hermes** (already configured):
   - Improves startup time
   - Reduces memory usage

3. **Optimize Images**:
   - Use appropriate sizes
   - Consider using expo-image

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [API Ninjas Fitness API](https://api-ninjas.com/api/exercises)

## 💬 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the error messages carefully
3. Check Expo documentation
4. Ensure all dependencies are installed correctly
5. Try clearing cache and reinstalling

## 🎉 You're Ready!

Your FitBuddy app should now be running with:
- ✅ Secure authentication
- ✅ Exercise library with 35+ exercises
- ✅ Animated water tracker
- ✅ Favorites management
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Persistent storage

Enjoy building your fitness journey! 💪🏋️‍♀️
