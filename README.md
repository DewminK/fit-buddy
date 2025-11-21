# FitBuddy - Your Personal Fitness Companion 💪

FitBuddy is a comprehensive mobile fitness application built with **React Native** and **Expo**. Track exercises, manage your workout favorites, and achieve your wellness goals with a beautifully designed, user-friendly interface.

## 📱 Features

### Core Functionality

- **User Authentication**
  - Secure login and registration with form validation
  - Password strength requirements
  - Token-based authentication with AsyncStorage
  - Demo credentials available for quick testing

- **Exercise Library**
  - Browse comprehensive exercise database
  - Filter by muscle group (chest, back, biceps, shoulders, etc.)
  - Filter by difficulty level (beginner, intermediate, expert)
  - Search functionality for quick exercise lookup
  - Detailed exercise information with instructions

- **Favorites Management**
  - Add/remove exercises to favorites
  - Persistent storage using AsyncStorage
  - Quick access to saved exercises
  - Visual indicators for favorited exercises

- **User Profile**
  - Display user information
  - Track workout statistics
  - Settings and preferences

- **Dark Mode**
  - Toggle between light and dark themes
  - Persistent theme preference
  - Smooth theme transitions

### Technical Highlights

- **State Management**: Redux Toolkit for efficient state management
- **Navigation**: Expo Router with Stack and Tab navigation
- **Form Validation**: Yup schema validation with Formik
- **Data Persistence**: AsyncStorage for secure local storage
- **Icons**: Feather Icons for consistent iconography
- **API Integration**: Axios for API calls with mock data fallback
- **Responsive Design**: Adapts to various screen sizes

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

   Required packages include:
   - `@reduxjs/toolkit` - State management
   - `react-redux` - React bindings for Redux
   - `@react-native-async-storage/async-storage` - Data persistence
   - `axios` - HTTP client
   - `yup` - Schema validation
   - `formik` - Form management

   If you encounter issues, install manually:
   ```bash
   npm install @reduxjs/toolkit react-redux @react-native-async-storage/async-storage axios yup formik
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Run the app**

   - **iOS Simulator**: Press `i`
   - **Android Emulator**: Press `a`
   - **Physical Device**: Scan QR code with Expo Go app

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
│   │   ├── index.tsx           # Home screen
│   │   ├── favorites.tsx       # Favorites screen
│   │   └── profile.tsx         # Profile screen
│   ├── auth/                    # Authentication screens
│   │   ├── login.tsx           # Login screen
│   │   └── register.tsx        # Register screen
│   ├── exercise-detail.tsx     # Exercise detail modal
│   └── _layout.tsx             # Root layout with Redux Provider
├── screens/                     # Screen components
│   ├── auth/                   # Auth screen implementations
│   ├── HomeScreen.tsx          # Main exercise list
│   ├── FavoritesScreen.tsx     # Favorites management
│   ├── ProfileScreen.tsx       # User profile & settings
│   └── ExerciseDetailScreen.tsx # Exercise details
├── store/                       # Redux state management
│   ├── slices/                 # Redux slices
│   │   ├── authSlice.ts       # Authentication state
│   │   ├── exercisesSlice.ts  # Exercise data state
│   │   ├── favoritesSlice.ts  # Favorites state
│   │   └── themeSlice.ts      # Theme state
│   ├── index.ts               # Store configuration
│   └── hooks.ts               # Typed Redux hooks
├── services/                    # API services
│   └── api.ts                  # API client & endpoints
├── utils/                       # Utility functions
│   └── validation.ts           # Yup validation schemas
├── constants/                   # Constants & themes
│   └── themes.ts               # Theme configuration
└── components/                  # Reusable components

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

To use real exercise data, get a free API key from [API Ninjas](https://api-ninjas.com):

1. Sign up at API Ninjas
2. Get your API key
3. Update `services/api.ts`:
   ```typescript
   const FITNESS_API_KEY = 'YOUR_API_KEY_HERE';
   ```

The app includes comprehensive mock data, so an API key is not required for development.

## 📱 Screens Overview

### Authentication
- **Login Screen**: Email/password authentication with validation
- **Register Screen**: New user registration with strong password requirements

### Main App (Bottom Tabs)
- **Home**: Browse and search exercises with filters
- **Favorites**: Manage saved exercises
- **Profile**: User info, stats, and settings (including dark mode toggle)

### Modals
- **Exercise Detail**: Comprehensive exercise information with tips

## 🧪 Testing

### Manual Testing Checklist
- [ ] User can register with valid credentials
- [ ] User can login with demo credentials
- [ ] Exercise list loads and displays correctly
- [ ] Filters work properly (muscle group, difficulty)
- [ ] Search functionality works
- [ ] User can add/remove favorites
- [ ] Favorites persist after app restart
- [ ] Dark mode toggle works
- [ ] Theme persists after app restart
- [ ] Navigation between screens works smoothly

## 🛠️ Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Expo Router** - File-based routing
- **AsyncStorage** - Data persistence
- **Axios** - HTTP client
- **Yup** - Schema validation
- **Formik** - Form management
- **Feather Icons** - Icon library

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
