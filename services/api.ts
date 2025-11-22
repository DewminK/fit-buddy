import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get environment variables from Expo's environment
const FITNESS_API_BASE = process.env.EXPO_PUBLIC_FITNESS_API_BASE || 'https://api.api-ninjas.com/v1';
const FITNESS_API_KEY = process.env.EXPO_PUBLIC_FITNESS_API_KEY || '';
const AUTH_API_BASE = process.env.EXPO_PUBLIC_AUTH_API_BASE || 'https://dummyjson.com';

// Storage key for registered users
const REGISTERED_USERS_KEY = 'fitbuddy_registered_users';

// Log configuration status (without exposing the key)
if (!FITNESS_API_KEY) {
  console.warn('⚠️ FITNESS_API_KEY not found in environment variables. Using mock data.');
} else {
  console.log('✅ API configuration loaded successfully');
}

// Create axios instances
const fitnessAPI = axios.create({
  baseURL: FITNESS_API_BASE,
  headers: {
    'X-Api-Key': FITNESS_API_KEY,
  },
  timeout: 10000, // 10 second timeout
});

const authAxios = axios.create({
  baseURL: AUTH_API_BASE,
  timeout: 10000,
});

// Local user storage helper functions
const getRegisteredUsers = async (): Promise<any[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error reading registered users:', error);
    return [];
  }
};

const saveRegisteredUser = async (user: any): Promise<void> => {
  try {
    const users = await getRegisteredUsers();
    users.push(user);
    await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    console.log('✅ User registered successfully:', user.username);
  } catch (error) {
    console.error('Error saving registered user:', error);
    throw error;
  }
};

const findUserByCredentials = async (username: string, password: string): Promise<any | null> => {
  try {
    const users = await getRegisteredUsers();
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    return user || null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    console.log('🔐 Attempting login for:', username);
    
    // First, try to find user in local registered users
    const localUser = await findUserByCredentials(username, password);
    
    if (localUser) {
      console.log('✅ Login successful with local user:', localUser.username);
      // Return user data without password
      const { password: _, ...userWithoutPassword } = localUser;
      return {
        ...userWithoutPassword,
        token: `local_token_${Date.now()}`,
      };
    }
    
    // If not found locally, try DummyJSON API (for demo users like "emilys")
    try {
      console.log('🔄 Trying DummyJSON API for demo user...');
      const response = await authAxios.post('/auth/login', {
        username,
        password,
      });
      console.log('✅ Login successful with DummyJSON demo user');
      return response.data;
    } catch (error) {
      console.log('❌ Login failed - user not found in local storage or DummyJSON');
      throw new Error('Invalid username or password. Please check your credentials or sign up for a new account.');
    }
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    console.log('📝 Attempting registration for:', userData.username);
    
    // Check if username already exists
    const users = await getRegisteredUsers();
    const existingUser = users.find(
      (u) => u.username.toLowerCase() === userData.username.toLowerCase()
    );
    
    if (existingUser) {
      console.log('❌ Registration failed - username already exists');
      throw new Error('Username already taken. Please choose a different username.');
    }
    
    // Check if email already exists
    const existingEmail = users.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );
    
    if (existingEmail) {
      console.log('❌ Registration failed - email already exists');
      throw new Error('Email already registered. Please use a different email or login.');
    }
    
    // Create new user
    const newUser = {
      id: Math.floor(Math.random() * 10000) + 1000,
      username: userData.username,
      email: userData.email,
      password: userData.password, // In production, this should be hashed!
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: new Date().toISOString(),
    };
    
    // Save to local storage
    await saveRegisteredUser(newUser);
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      ...userWithoutPassword,
      token: `local_token_${Date.now()}`,
    };
  },
};

// Exercise API
export const exerciseAPI = {
  getExercises: async (muscle: string = '', difficulty: string = '') => {
    // If no API key, use mock data directly
    if (!FITNESS_API_KEY) {
      console.log('📦 Using mock data - API key not configured');
      return getMockExercises(muscle, difficulty);
    }

    try {
      // Build query parameters
      const params: any = {};
      if (muscle && muscle !== 'all') params.muscle = muscle;
      if (difficulty && difficulty !== 'all') params.difficulty = difficulty;
      
      // If no specific params, get exercises for common muscles
      if (!muscle || muscle === 'all') {
        params.muscle = 'biceps';
      }

      console.log('🔄 Fetching exercises from API...', params);
      const response = await fitnessAPI.get('/exercises', { params });
      
      console.log('✅ API response received:', response.data.length, 'exercises');
      return response.data;
    } catch (error: any) {
      console.log('⚠️ API error, falling back to mock data:', error.message);
      
      // Check for specific error types
      if (error.response) {
        console.log('API Error Status:', error.response.status);
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('❌ Invalid API key. Please check your EXPO_PUBLIC_FITNESS_API_KEY in .env file');
        }
      }
      
      return getMockExercises(muscle, difficulty);
    }
  },

  searchExercises: async (searchTerm: string) => {
    const allExercises = getMockExercises('', '');
    return allExercises.filter(exercise => 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
};

// Mock data fallback when API is not configured
const getMockExercises = (muscle: string = '', difficulty: string = '') => {
  const mockExercises = [
    // Chest Exercises
    {
      name: 'Barbell Bench Press',
      type: 'strength',
      muscle: 'chest',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Lie on a flat bench with feet on the floor. Grip the bar with hands slightly wider than shoulder-width apart. Lower the bar to your chest, then press it back up to the starting position.',
    },
    {
      name: 'Push-ups',
      type: 'strength',
      muscle: 'chest',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Start in a plank position with hands under shoulders. Lower your body until chest nearly touches the floor, then push back up.',
    },
    {
      name: 'Incline Dumbbell Press',
      type: 'strength',
      muscle: 'chest',
      equipment: 'dumbbell',
      difficulty: 'intermediate',
      instructions: 'Lie on an incline bench with dumbbells. Press weights up until arms are extended, then lower with control back to chest level.',
    },
    {
      name: 'Chest Fly',
      type: 'strength',
      muscle: 'chest',
      equipment: 'dumbbell',
      difficulty: 'beginner',
      instructions: 'Lie on a bench with dumbbells extended above chest. Lower weights out to sides in wide arc, then bring back together.',
    },

    // Biceps Exercises
    {
      name: 'Dumbbell Bicep Curls',
      type: 'strength',
      muscle: 'biceps',
      equipment: 'dumbbell',
      difficulty: 'beginner',
      instructions: 'Stand with feet shoulder-width apart, holding dumbbells at your sides. Curl the weights up to shoulder level, keeping elbows stationary. Lower back down with control.',
    },
    {
      name: 'Hammer Curls',
      type: 'strength',
      muscle: 'biceps',
      equipment: 'dumbbell',
      difficulty: 'beginner',
      instructions: 'Hold dumbbells with palms facing each other. Curl weights up while maintaining neutral grip throughout the movement.',
    },
    {
      name: 'Barbell Curls',
      type: 'strength',
      muscle: 'biceps',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Stand holding barbell with underhand grip. Curl bar up to shoulder level, keeping elbows close to body.',
    },

    // Triceps Exercises
    {
      name: 'Tricep Dips',
      type: 'strength',
      muscle: 'triceps',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Place hands on parallel bars or bench. Lower body by bending elbows until upper arms are parallel to floor, then push back up.',
    },
    {
      name: 'Overhead Tricep Extension',
      type: 'strength',
      muscle: 'triceps',
      equipment: 'dumbbell',
      difficulty: 'intermediate',
      instructions: 'Hold dumbbell overhead with both hands. Lower weight behind head by bending elbows, then extend back to start.',
    },
    {
      name: 'Tricep Kickbacks',
      type: 'strength',
      muscle: 'triceps',
      equipment: 'dumbbell',
      difficulty: 'beginner',
      instructions: 'Bend forward at waist with dumbbell in hand. Extend arm back and up, squeezing tricep at top of movement.',
    },

    // Leg Exercises
    {
      name: 'Squats',
      type: 'strength',
      muscle: 'quadriceps',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Stand with feet shoulder-width apart. Lower your body by bending knees and hips, keeping back straight. Push through heels to return to starting position.',
    },
    {
      name: 'Lunges',
      type: 'strength',
      muscle: 'quadriceps',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Step forward with one leg, lowering hips until both knees are bent at 90 degrees. Push back to starting position and repeat with other leg.',
    },
    {
      name: 'Leg Press',
      type: 'strength',
      muscle: 'quadriceps',
      equipment: 'machine',
      difficulty: 'beginner',
      instructions: 'Sit in leg press machine with feet on platform. Push platform away by extending legs, then slowly return to starting position.',
    },
    {
      name: 'Bulgarian Split Squats',
      type: 'strength',
      muscle: 'quadriceps',
      equipment: 'body_only',
      difficulty: 'intermediate',
      instructions: 'Place back foot on elevated surface. Lower front knee until thigh is parallel to ground, then push back up.',
    },
    {
      name: 'Romanian Deadlifts',
      type: 'strength',
      muscle: 'hamstrings',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Hold barbell with straight arms. Hinge at hips, lowering weight along legs while keeping back straight.',
    },
    {
      name: 'Calf Raises',
      type: 'strength',
      muscle: 'calves',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Stand on edge of step. Lower heels below step level, then raise up onto toes as high as possible.',
    },

    // Back Exercises
    {
      name: 'Deadlifts',
      type: 'strength',
      muscle: 'lower_back',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Stand with feet hip-width apart, barbell over feet. Bend at hips and knees to grip bar. Lift by extending hips and knees, keeping back straight.',
    },
    {
      name: 'Pull-ups',
      type: 'strength',
      muscle: 'lats',
      equipment: 'pull_up_bar',
      difficulty: 'intermediate',
      instructions: 'Hang from a pull-up bar with hands shoulder-width apart. Pull yourself up until chin is over the bar, then lower with control.',
    },
    {
      name: 'Lat Pulldown',
      type: 'strength',
      muscle: 'lats',
      equipment: 'cable',
      difficulty: 'beginner',
      instructions: 'Sit at lat pulldown machine. Grip bar wider than shoulders and pull down to upper chest, squeezing shoulder blades together.',
    },
    {
      name: 'Bent Over Rows',
      type: 'strength',
      muscle: 'middle_back',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Bend forward at waist with barbell. Pull bar to lower chest, squeezing shoulder blades together.',
    },
    {
      name: 'Face Pulls',
      type: 'strength',
      muscle: 'shoulders',
      equipment: 'cable',
      difficulty: 'beginner',
      instructions: 'Pull rope attachment toward face, separating hands at end of movement. Great for rear delts and posture.',
    },

    // Shoulder Exercises
    {
      name: 'Shoulder Press',
      type: 'strength',
      muscle: 'shoulders',
      equipment: 'dumbbell',
      difficulty: 'intermediate',
      instructions: 'Sit or stand with dumbbells at shoulder height. Press weights overhead until arms are fully extended, then lower back to starting position.',
    },
    {
      name: 'Lateral Raises',
      type: 'strength',
      muscle: 'shoulders',
      equipment: 'dumbbell',
      difficulty: 'beginner',
      instructions: 'Hold dumbbells at sides. Raise arms out to sides until parallel to ground, then lower with control.',
    },
    {
      name: 'Front Raises',
      type: 'strength',
      muscle: 'shoulders',
      equipment: 'dumbbell',
      difficulty: 'beginner',
      instructions: 'Hold dumbbells in front of thighs. Raise arms straight forward to shoulder height, then lower slowly.',
    },

    // Core/Abs Exercises
    {
      name: 'Plank',
      type: 'strength',
      muscle: 'abdominals',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Get into a forearm plank position with elbows under shoulders. Keep body in a straight line from head to heels, engaging core muscles.',
    },
    {
      name: 'Russian Twists',
      type: 'strength',
      muscle: 'abdominals',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Sit on floor with knees bent and feet lifted. Lean back slightly and rotate torso from side to side, touching the floor beside you.',
    },
    {
      name: 'Mountain Climbers',
      type: 'cardio',
      muscle: 'abdominals',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Start in plank position. Alternate bringing knees to chest in a running motion, keeping core engaged and hips level.',
    },
    {
      name: 'Bicycle Crunches',
      type: 'strength',
      muscle: 'abdominals',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Lie on back with hands behind head. Alternate bringing opposite elbow to knee in a pedaling motion.',
    },
    {
      name: 'Hanging Leg Raises',
      type: 'strength',
      muscle: 'abdominals',
      equipment: 'pull_up_bar',
      difficulty: 'intermediate',
      instructions: 'Hang from bar with straight arms. Raise legs to parallel with ground, then lower with control.',
    },
    {
      name: 'Dead Bug',
      type: 'strength',
      muscle: 'abdominals',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Lie on back with arms extended up and knees at 90 degrees. Lower opposite arm and leg, then return. Great for core stability.',
    },

    // Cardio Exercises
    {
      name: 'Burpees',
      type: 'cardio',
      muscle: 'full_body',
      equipment: 'body_only',
      difficulty: 'intermediate',
      instructions: 'Start standing, drop into a squat with hands on ground. Jump feet back into plank, do a push-up, jump feet to hands, then jump up with arms overhead.',
    },
    {
      name: 'Jumping Jacks',
      type: 'cardio',
      muscle: 'full_body',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Start with feet together. Jump while spreading legs and raising arms overhead. Return to start position.',
    },
    {
      name: 'High Knees',
      type: 'cardio',
      muscle: 'quadriceps',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Run in place while bringing knees up to hip level. Pump arms vigorously for maximum effect.',
    },
    {
      name: 'Jump Rope',
      type: 'cardio',
      muscle: 'calves',
      equipment: 'jump_rope',
      difficulty: 'beginner',
      instructions: 'Jump over rope as it passes under feet. Stay on balls of feet and maintain steady rhythm.',
    },
    {
      name: 'Box Jumps',
      type: 'plyometrics',
      muscle: 'quadriceps',
      equipment: 'box',
      difficulty: 'intermediate',
      instructions: 'Stand facing box. Jump onto box landing softly with knees bent. Step down and repeat.',
    },

    // Flexibility & Recovery
    {
      name: 'Cat-Cow Stretch',
      type: 'stretching',
      muscle: 'lower_back',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'On hands and knees, alternate between arching back (cow) and rounding spine (cat). Great for spinal mobility.',
    },
    {
      name: 'Childs Pose',
      type: 'stretching',
      muscle: 'lower_back',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Kneel and sit back on heels, extending arms forward on ground. Relax and breathe deeply.',
    },
    {
      name: 'Downward Dog',
      type: 'stretching',
      muscle: 'hamstrings',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Start in plank, push hips up forming inverted V. Press heels toward ground and relax head.',
    },
  ];

  // Filter by muscle and difficulty if specified
  return mockExercises.filter((exercise) => {
    const muscleMatch = !muscle || muscle === 'all' || exercise.muscle === muscle;
    const difficultyMatch = !difficulty || difficulty === 'all' || exercise.difficulty === difficulty;
    return muscleMatch && difficultyMatch;
  });
};

export default {
  authAPI,
  exerciseAPI,
};
