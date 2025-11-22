# FitBuddy - Your Personal Fitness Companion 💪🏋️

FitBuddy is a comprehensive mobile fitness application built with **React Native** and **Expo**. Track exercises, monitor water intake, manage your workout favorites, and achieve your wellness goals with a beautifully designed, animated, user-friendly interface.

## 📱 Features

### Core Functionality

- **User Authentication** 🔐
  - Secure login and registration with form validation
  - Password strength requirements
  - Token-based authentication with **Expo SecureStore** (native) and AsyncStorage (web)
  - Demo credentials available for quick testing
  - Persistent sessions with automatic login

- **Exercise Library** 💪
  - Browse comprehensive exercise database (35+ exercises)
  - Filter by muscle group (chest, back, biceps, triceps, shoulders, legs, abs, etc.)
  - Filter by difficulty level (beginner, intermediate, expert)
  - Search functionality for quick exercise lookup
  - Detailed exercise information with instructions
  - Animated exercise cards with smooth transitions
  - Exercise categories: Strength, Cardio, Flexibility & Stretching

- **Water Intake Tracker** 💧
  - Beautiful animated water glass visualization
  - Track daily water consumption with customizable goals
  - Quick add buttons (250ml, 500ml, 750ml, 1000ml)
  - Real-time progress tracking with wave animations
  - Daily log with timestamps
  - Undo last entry functionality
  - Persistent storage across app restarts
  - Visual ripple effects when adding water

- **Favorites Management** ❤️
  - Add/remove exercises to favorites with animated heart icon
  - Persistent storage using AsyncStorage
  - Quick access to saved exercises
  - Visual indicators for favorited exercises
  - Favorite count in dedicated tab

- **User Profile** 👤
  - Display user information
  - Track workout statistics
  - Settings and preferences
  - Logout functionality

- **Dark Mode** 🌙
  - Toggle between light and dark themes
  - Persistent theme preference
  - Smooth theme transitions
  - Consistent styling across all screens

### Technical Highlights

- **State Management**: Redux Toolkit for efficient state management
- **Navigation**: Expo Router with Stack and Tab navigation
- **Animations**: React Native Reanimated for smooth 60fps animations
- **Form Validation**: Yup schema validation with Formik
- **Data Persistence**: 
  - Expo SecureStore for sensitive data (tokens) on native platforms
  - AsyncStorage for general data and web platform
- **Icons**: Feather Icons for consistent iconography
- **API Integration**: 
  - Environment variables with .env files
  - Axios for API calls with mock data fallback
  - API Ninjas for exercise data (optional)
- **Responsive Design**: Adapts to various screen sizes
- **Type Safety**: Full TypeScript implementation

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app (for physical device testing)

### Installation

1. **Clone the repository** (or use the provided project)

   ```bash
   cd fit-buddy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   Key packages include:
   - `@reduxjs/toolkit` - State management
   - `react-redux` - React bindings for Redux
   - `@react-native-async-storage/async-storage` - Data persistence
   - `expo-secure-store` - Secure token storage
   - `react-native-reanimated` - Animations
   - `axios` - HTTP client
   - `yup` - Schema validation
   - `formik` - Form management
   - `@dotenvx/dotenvx` - Environment variables

3. **Environment Configuration**

   Copy the example environment file and configure your API keys:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file:
   ```env
   EXPO_PUBLIC_FITNESS_API_KEY=your_api_ninjas_key_here
   EXPO_PUBLIC_FITNESS_API_BASE=https://api.api-ninjas.com/v1
   EXPO_PUBLIC_AUTH_API_BASE=https://dummyjson.com
   ```

   **Note**: The app works with mock data if no API key is provided. To get a free API key:
   - Visit [https://api-ninjas.com/](https://api-ninjas.com/)
   - Sign up for a free account
   - Copy your API key to the `.env` file

4. **Start the development server**

   ```bash
   npx expo start
   ```

5. **Run the app**

   - **iOS Simulator**: Press `i`
   - **Android Emulator**: Press `a`
   - **Physical Device**: Scan QR code with Expo Go app
   - **Web Browser**: Press `w`

## 🔐 Demo Credentials

For quick testing, use these credentials:

```
Username: emilys
Password: emilyspass
```

Or create a new account with the registration form.

## 📂 Project Structure

```
fit-buddy/
├── app/                          # Expo Router screens
│   ├── (tabs)/                  # Bottom tab navigation
│   │   ├── _layout.tsx         # Tab navigator
│   │   ├── index.tsx           # Home screen (Exercise list)
│   │   ├── explore.tsx         # Explore screen (Water tracker)
│   │   ├── favorites.tsx       # Favorites screen
│   │   └── profile.tsx         # Profile screen
│   ├── auth/                    # Authentication screens
│   │   ├── _layout.tsx         # Auth stack navigator
│   │   ├── login.tsx           # Login screen
│   │   └── register.tsx        # Register screen
│   ├── exercise-detail.tsx     # Exercise detail modal
│   └── _layout.tsx             # Root layout with Redux Provider
├── screens/                     # Legacy screen components
│   ├── auth/                   # Auth screen implementations
│   ├── HomeScreen.tsx          # Main exercise list
│   ├── FavoritesScreen.tsx     # Favorites management
│   ├── ProfileScreen.tsx       # User profile & settings
│   └── ExerciseDetailScreen.tsx # Exercise details
├── components/                  # Reusable components
│   ├── WaterTracker.tsx        # Animated water intake tracker
│   ├── ExerciseCard.tsx        # Animated exercise card
│   └── ui/                     # UI components
├── store/                       # Redux state management
│   ├── slices/                 # Redux slices
│   │   ├── authSlice.ts       # Authentication state
│   │   ├── exercisesSlice.ts  # Exercise data state
│   │   ├── favoritesSlice.ts  # Favorites state
│   │   ├── themeSlice.ts      # Theme state
│   │   └── waterSlice.ts      # Water tracking state
│   ├── index.ts               # Store configuration
│   └── hooks.ts               # Typed Redux hooks
├── services/                    # API services
│   └── api.ts                  # API client & endpoints with mock data
├── utils/                       # Utility functions
│   ├── validation.ts           # Yup validation schemas
│   └── secureStorage.ts        # Secure storage wrapper
├── constants/                   # Constants & themes
│   ├── themes.ts               # Theme configuration
│   └── theme.ts                # Additional theme constants
├── .env                         # Environment variables (not in git)
├── .env.example                # Example environment configuration
├── .gitignore                  # Git ignore rules
└── package.json                # Dependencies and scripts

```

## 🏗️ Architecture & Best Practices

### State Management
- **Redux Toolkit** with TypedUseSelectorHook for type safety
- Separate slices for different concerns (auth, exercises, favorites, theme)
- Async thunks for API calls and data persistence
- Middleware for serialization checks

### Data Persistence
- **AsyncStorage** for secure local storage
- Token-based authentication
- Persistent favorites and theme preferences
- Automatic data loading on app launch

### Form Validation
- **Yup** schemas for robust validation
- Password strength requirements (uppercase, lowercase, numbers)
- Email format validation
- Username character restrictions
- Real-time error messages

### Navigation
- **Expo Router** for file-based routing
- Protected routes with authentication guards
- Stack navigation for screen hierarchy
- Tab navigation for main app sections

### Styling
- Theme-based styling system
- Consistent color palette and spacing
- Responsive design patterns
- Dark mode support

### API Integration
- **API Ninjas Fitness API** for exercise data
- **DummyJSON** for authentication
- Mock data fallback when API unavailable
- Error handling and loading states

## 🎨 UI/UX Features

- **Clean, modern interface** with card-based design
- **Smooth animations** and transitions
- **Visual feedback** for user interactions
- **Loading states** and error handling
- **Empty states** with helpful messages
- **Responsive layout** for various screen sizes
- **Accessibility** considerations

## 🔧 Configuration

### API Setup (Optional)

The app works perfectly with built-in mock data containing **35+ exercises**. However, to use real-time data from API Ninjas:

1. Visit [API Ninjas](https://api-ninjas.com) and sign up for a free account
2. Navigate to your profile and copy your API key
3. Update your `.env` file:
   ```env
   EXPO_PUBLIC_FITNESS_API_KEY=your_actual_api_key_here
   ```
4. Restart the Expo development server

**Mock Data Includes:**
- 35+ exercises across all major muscle groups
- Beginner, intermediate, and expert difficulties
- Strength training, cardio, and flexibility exercises
- Detailed instructions for each exercise
- Equipment requirements and muscle targets

## 📱 Screens Overview

### Authentication
- **Login Screen**: Username/password authentication with validation
- **Register Screen**: New user registration with strong password requirements

### Main App (Bottom Tabs)
- **Home Tab** 🏠: 
  - Browse and search exercises with animated cards
  - Filter by muscle group and difficulty
  - Quick search functionality
  - Animated exercise cards with smooth transitions
  - Pull-to-refresh
  
- **Explore Tab** 🔍: 
  - Animated water intake tracker
  - Visual glass with wave effects
  - Quick add buttons (250ml - 1000ml)
  - Daily log with timestamps
  - Goal tracking with progress indicator
  
- **Favorites Tab** ❤️: 
  - All favorited exercises in one place
  - Same filtering and search capabilities
  - Quick access to your workout routines
  
- **Profile Tab** 👤: 
  - User info and stats
  - Dark mode toggle with smooth transition
  - Settings and preferences
  - Logout functionality

### Modals
- **Exercise Detail**: Comprehensive exercise information with instructions, muscle groups, equipment, and difficulty level

## 🧪 Testing

### Manual Testing Checklist
- [ ] User can register with valid credentials
- [ ] User can login with demo credentials (emilys / emilyspass)
- [ ] Exercise list loads with animated cards
- [ ] Filters work properly (muscle group, difficulty)
- [ ] Search functionality works
- [ ] User can add/remove favorites with animation
- [ ] Favorites persist after app restart
- [ ] Water tracker displays and animates correctly
- [ ] Water intake can be added with ripple effect
- [ ] Water intake persists daily and resets next day
- [ ] Undo last water entry works
- [ ] Dark mode toggle works with smooth transition
- [ ] Theme persists after app restart
- [ ] Navigation between screens works smoothly
- [ ] Animations run at 60fps
- [ ] Pull-to-refresh works on exercise list
- [ ] Authentication persists across app restarts
- [ ] Secure storage works on native platforms

## 🛠️ Technologies Used

- **React Native** (0.81.5) - Mobile framework
- **Expo** (SDK 54) - Development platform
- **TypeScript** (5.9.2) - Type safety
- **Redux Toolkit** (2.10.1) - State management
- **Expo Router** (6.0.15) - File-based routing
- **React Native Reanimated** (4.1.1) - 60fps animations
- **Expo SecureStore** - Secure token storage
- **AsyncStorage** (2.2.0) - Data persistence
- **Axios** (1.13.2) - HTTP client
- **Yup** (1.7.1) - Schema validation
- **Formik** (2.4.9) - Form management
- **Feather Icons** - Icon library
- **Expo Constants** - Environment variables

## 📝 Development Notes

### Key Considerations Implemented

✅ **Feature-based commits**: Organized by functionality
✅ **Proper validations**: Yup schemas with comprehensive rules
✅ **Decoupled code**: Modular architecture with separation of concerns
✅ **Testable code**: Pure functions and isolated logic
✅ **Reusable components**: Styled components with theme support
✅ **Best practices**: Following React Native and Redux guidelines
✅ **Industry standards**: ESLint configuration and TypeScript

### Security Best Practices

- Secure token storage using AsyncStorage
- Password validation with strength requirements
- No sensitive data in source code
- Proper error handling without exposing system details

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## 👨‍💻 Author

**Health & Wellness Project** - Index Number ending in 6
Mobile Application Development Course

## 📄 License

This project is developed for educational purposes as part of a mobile application development course.

## 🙏 Acknowledgments

- Exercise data from API Ninjas
- Authentication demo from DummyJSON
- UI inspiration from modern fitness apps
- Icons by Feather Icons

---

**Built with ❤️ using React Native and Expo**
