# FitBuddy - Project Architecture & Features

## Architecture Overview

FitBuddy follows a **modular, scalable architecture** with clear separation of concerns, implementing industry best practices for React Native applications.

## State Management

### Redux Toolkit Implementation

The app uses Redux Toolkit for centralized state management with four main slices:

#### 1. Auth Slice (`authSlice.ts`)
**Responsibilities:**
- User authentication state
- Login/logout functionality
- Token management
- User data persistence

**State Structure:**
```typescript
{
  user: User | null,
  isLoading: boolean,
  isAuthenticated: boolean,
  error: string | null
}
```

**Async Thunks:**
- `login`: Authenticate user with API
- `register`: Create new user account
- `loadUser`: Restore user from AsyncStorage
- `logout`: Clear user session

#### 2. Exercises Slice (`exercisesSlice.ts`)
**Responsibilities:**
- Exercise data management
- Filtering by muscle group and difficulty
- Search functionality

**State Structure:**
```typescript
{
  exercises: Exercise[],
  filteredExercises: Exercise[],
  isLoading: boolean,
  error: string | null,
  currentFilter: { muscle: string, difficulty: string }
}
```

**Async Thunks:**
- `fetchExercises`: Fetch exercises from API

#### 3. Favorites Slice (`favoritesSlice.ts`)
**Responsibilities:**
- Favorite exercises management
- Persistent storage
- Add/remove favorites

**State Structure:**
```typescript
{
  favorites: Exercise[],
  isLoading: boolean
}
```

**Async Thunks:**
- `loadFavorites`: Load from AsyncStorage
- `saveFavorites`: Persist to AsyncStorage

#### 4. Theme Slice (`themeSlice.ts`)
**Responsibilities:**
- Dark/light mode toggle
- Theme persistence

**State Structure:**
```typescript
{
  isDark: boolean
}
```

**Async Thunks:**
- `loadTheme`: Load theme preference
- `saveTheme`: Persist theme preference

## Navigation Structure

### File-Based Routing (Expo Router)

```
app/
├── _layout.tsx              # Root layout with Redux Provider
├── auth/
│   ├── _layout.tsx         # Auth stack navigator
│   ├── login.tsx           # Login screen
│   └── register.tsx        # Register screen
├── (tabs)/
│   ├── _layout.tsx         # Bottom tab navigator
│   ├── index.tsx           # Home (Exercise List)
│   ├── favorites.tsx       # Favorites screen
│   └── profile.tsx         # Profile screen
└── exercise-detail.tsx     # Modal for exercise details
```

### Navigation Flow

1. **Unauthenticated:** Login/Register screens
2. **Authenticated:** Bottom tabs (Home, Favorites, Profile)
3. **Modal Navigation:** Exercise details as stack screen

### Route Protection

Implemented in root `_layout.tsx`:
- Checks authentication state
- Redirects unauthenticated users to login
- Redirects authenticated users from auth screens to main app

## Data Flow

### Authentication Flow
```
User Input → Formik Validation → Yup Schema → 
Redux Async Thunk → API Call → AsyncStorage → 
State Update → Navigation
```

### Exercise Data Flow
```
App Launch → Fetch Exercises → API/Mock Data → 
Redux Store → Filter/Search → UI Rendering
```

### Favorites Flow
```
User Action → Redux Action → State Update → 
AsyncStorage Persist → UI Update
```

## API Integration

### Services Layer (`services/api.ts`)

**API Ninjas Integration:**
```typescript
GET /exercises?muscle={muscle}&difficulty={difficulty}
```

**DummyJSON Authentication:**
```typescript
POST /auth/login
Body: { username, password }
```

**Mock Data Fallback:**
- Comprehensive exercise database (15+ exercises)
- Covers all major muscle groups
- Multiple difficulty levels
- Detailed instructions

## Form Validation

### Yup Schemas (`utils/validation.ts`)

**Login Validation:**
- Username: min 3 characters, required
- Password: min 6 characters, required

**Registration Validation:**
- First Name: min 2 characters, required
- Last Name: min 2 characters, required
- Username: min 3 characters, alphanumeric + underscore
- Email: valid email format
- Password: min 6 characters, uppercase, lowercase, number
- Confirm Password: must match password

## Data Persistence

### AsyncStorage Strategy

**Stored Data:**
1. **User Token** (`@fitbuddy_userToken`)
   - JWT or session token
   - Used for API authentication

2. **User Data** (`@fitbuddy_userData`)
   - User profile information
   - Loaded on app startup

3. **Favorites** (`@fitbuddy_favorites`)
   - Array of favorite exercises
   - Synced on every change

4. **Theme Preference** (`@fitbuddy_theme`)
   - 'light' or 'dark'
   - Applied immediately on load

## Theming System

### Theme Configuration (`constants/themes.ts`)

**Light Theme:**
- Primary: #4CAF50 (Green)
- Secondary: #FF9800 (Orange)
- Background: #FFFFFF
- Text: #212121

**Dark Theme:**
- Primary: #66BB6A (Light Green)
- Secondary: #FFB74D (Light Orange)
- Background: #121212
- Text: #FFFFFF

**Theme Properties:**
- Colors (16 semantic colors)
- Spacing (5 sizes: xs to xl)
- Border Radius (4 sizes)
- Font Sizes (6 sizes)
- Font Weights (4 weights)

**Utility Functions:**
- `getDifficultyColor()`: Color coding for difficulty levels
- `getMuscleIcon()`: Icon mapping for muscle groups

## Component Structure

### Screen Components

**HomeScreen.tsx**
- Exercise list with cards
- Search functionality
- Dual filters (muscle + difficulty)
- Pull-to-refresh
- Empty state handling

**ExerciseDetailScreen.tsx**
- Full exercise information
- Instructions and tips
- Favorite toggle button
- Safety guidelines

**FavoritesScreen.tsx**
- Favorited exercises list
- Remove favorites functionality
- Empty state with CTA
- Quick navigation to details

**ProfileScreen.tsx**
- User information display
- Statistics (favorites, workouts)
- Dark mode toggle
- Settings menu
- Logout functionality

**LoginScreen.tsx**
- Email/password inputs
- Form validation
- Demo credentials display
- Registration link

**RegisterScreen.tsx**
- Multi-field registration form
- Strong validation
- Password confirmation
- Login link

## Best Practices Implemented

### 1. Code Organization
- ✅ Feature-based folder structure
- ✅ Separation of concerns
- ✅ Reusable utility functions
- ✅ Centralized constants

### 2. Type Safety
- ✅ TypeScript throughout
- ✅ Typed Redux hooks
- ✅ Interface definitions
- ✅ Strict type checking

### 3. Error Handling
- ✅ Try-catch blocks
- ✅ User-friendly error messages
- ✅ Loading states
- ✅ Empty states

### 4. Performance
- ✅ Memoization where appropriate
- ✅ Lazy loading
- ✅ Efficient list rendering (FlatList)
- ✅ Optimized re-renders

### 5. User Experience
- ✅ Loading indicators
- ✅ Pull-to-refresh
- ✅ Smooth transitions
- ✅ Visual feedback
- ✅ Empty states with CTAs
- ✅ Error recovery

### 6. Security
- ✅ Secure token storage
- ✅ Password validation
- ✅ No hardcoded secrets (API keys)
- ✅ Safe data handling

### 7. Maintainability
- ✅ Clear naming conventions
- ✅ Consistent code style
- ✅ Documented complex logic
- ✅ Modular architecture

## Testing Strategy

### Manual Testing Checklist

**Authentication:**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Register new user
- [ ] Password validation
- [ ] Token persistence
- [ ] Logout functionality

**Exercise Features:**
- [ ] Load exercises
- [ ] Apply filters
- [ ] Search exercises
- [ ] View exercise details
- [ ] Pull to refresh

**Favorites:**
- [ ] Add to favorites
- [ ] Remove from favorites
- [ ] Favorites persistence
- [ ] Empty state handling

**Theme:**
- [ ] Toggle dark mode
- [ ] Theme persistence
- [ ] Theme consistency

**Navigation:**
- [ ] Tab navigation
- [ ] Stack navigation
- [ ] Route protection
- [ ] Back navigation

## Performance Considerations

### Optimization Techniques

1. **List Virtualization**
   - FlatList for efficient rendering
   - Key extraction for stable IDs

2. **State Updates**
   - Immutable updates with Redux Toolkit
   - Selective re-renders with useSelector

3. **Network Requests**
   - Caching strategy with Redux
   - Mock data fallback
   - Error boundary implementation

4. **Asset Management**
   - Vector icons (Feather)
   - Optimized images
   - Lazy loading where appropriate

## Scalability Considerations

The architecture supports:

1. **Additional Features**
   - Easy to add new Redux slices
   - Modular screen structure
   - Extensible theme system

2. **API Integration**
   - Centralized API service
   - Easy to swap endpoints
   - Mock data for development

3. **Internationalization**
   - Centralized text in components
   - Easy to extract to i18n

4. **Testing**
   - Decoupled business logic
   - Pure functions for utilities
   - Testable Redux thunks

## Future Enhancements

Potential additions:

1. **Workout Plans**
   - Create custom workout routines
   - Schedule workouts
   - Track progress

2. **Progress Tracking**
   - Log completed workouts
   - Track weight/reps
   - View statistics and graphs

3. **Social Features**
   - Share workouts
   - Friend system
   - Leaderboards

4. **Notifications**
   - Workout reminders
   - Achievement notifications
   - Motivational messages

5. **Offline Support**
   - Full offline functionality
   - Sync when online
   - Conflict resolution

---

This architecture provides a solid foundation for a production-ready fitness application with room for growth and enhancement.
