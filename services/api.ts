import axios from 'axios';

// API Configuration
const FITNESS_API_BASE = 'https://api.api-ninjas.com/v1';
const FITNESS_API_KEY = 'YOUR_API_KEY_HERE'; // Users should get their own key from https://api-ninjas.com

// Mock DummyJSON for authentication
const DUMMYJSON_BASE = 'https://dummyjson.com';

// Create axios instances
const fitnessAPI = axios.create({
  baseURL: FITNESS_API_BASE,
  headers: {
    'X-Api-Key': FITNESS_API_KEY,
  },
});

const authAxios = axios.create({
  baseURL: DUMMYJSON_BASE,
});

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    try {
      const response = await authAxios.post('/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    // Mock registration - in production, use real API
    // For demo purposes, we'll create a mock user
    return {
      id: Math.floor(Math.random() * 10000),
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      token: `mock_token_${Date.now()}`,
    };
  },
};

// Exercise API
export const exerciseAPI = {
  getExercises: async (muscle: string = '', difficulty: string = '') => {
    try {
      // Build query parameters
      const params: any = {};
      if (muscle && muscle !== 'all') params.muscle = muscle;
      if (difficulty && difficulty !== 'all') params.difficulty = difficulty;
      
      // If no specific params, get exercises for common muscles
      if (!muscle || muscle === 'all') {
        params.muscle = 'biceps';
      }

      const response = await fitnessAPI.get('/exercises', { params });
      
      // If API key is not configured, return mock data
      if (response.status === 401 || response.status === 403) {
        return getMockExercises(muscle, difficulty);
      }
      
      return response.data;
    } catch (error) {
      console.log('Using mock data - API key not configured');
      return getMockExercises(muscle, difficulty);
    }
  },
};

// Mock data fallback when API is not configured
const getMockExercises = (muscle: string = '', difficulty: string = '') => {
  const mockExercises = [
    {
      name: 'Barbell Bench Press',
      type: 'strength',
      muscle: 'chest',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Lie on a flat bench with feet on the floor. Grip the bar with hands slightly wider than shoulder-width apart. Lower the bar to your chest, then press it back up to the starting position.',
    },
    {
      name: 'Dumbbell Bicep Curls',
      type: 'strength',
      muscle: 'biceps',
      equipment: 'dumbbell',
      difficulty: 'beginner',
      instructions: 'Stand with feet shoulder-width apart, holding dumbbells at your sides. Curl the weights up to shoulder level, keeping elbows stationary. Lower back down with control.',
    },
    {
      name: 'Squats',
      type: 'strength',
      muscle: 'quadriceps',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Stand with feet shoulder-width apart. Lower your body by bending knees and hips, keeping back straight. Push through heels to return to starting position.',
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
      name: 'Deadlifts',
      type: 'strength',
      muscle: 'lower_back',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Stand with feet hip-width apart, barbell over feet. Bend at hips and knees to grip bar. Lift by extending hips and knees, keeping back straight.',
    },
    {
      name: 'Plank',
      type: 'strength',
      muscle: 'abdominals',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Get into a forearm plank position with elbows under shoulders. Keep body in a straight line from head to heels, engaging core muscles.',
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
      name: 'Tricep Dips',
      type: 'strength',
      muscle: 'triceps',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Place hands on parallel bars or bench. Lower body by bending elbows until upper arms are parallel to floor, then push back up.',
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
      name: 'Shoulder Press',
      type: 'strength',
      muscle: 'shoulders',
      equipment: 'dumbbell',
      difficulty: 'intermediate',
      instructions: 'Sit or stand with dumbbells at shoulder height. Press weights overhead until arms are fully extended, then lower back to starting position.',
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
      name: 'Burpees',
      type: 'cardio',
      muscle: 'full_body',
      equipment: 'body_only',
      difficulty: 'intermediate',
      instructions: 'Start standing, drop into a squat with hands on ground. Jump feet back into plank, do a push-up, jump feet to hands, then jump up with arms overhead.',
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
      name: 'Leg Press',
      type: 'strength',
      muscle: 'quadriceps',
      equipment: 'machine',
      difficulty: 'beginner',
      instructions: 'Sit in leg press machine with feet on platform. Push platform away by extending legs, then slowly return to starting position.',
    },
    {
      name: 'Lat Pulldown',
      type: 'strength',
      muscle: 'lats',
      equipment: 'cable',
      difficulty: 'beginner',
      instructions: 'Sit at lat pulldown machine. Grip bar wider than shoulders and pull down to upper chest, squeezing shoulder blades together.',
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
