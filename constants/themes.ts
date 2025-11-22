export const lightTheme = {
  colors: {
    primary: '#4CAF50',
    secondary: '#FF9800',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    card: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    primary: '#66BB6A',
    secondary: '#FFB74D',
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2C2C2C',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FFB74D',
    info: '#42A5F5',
    shadow: '#000000',
  },
};

export type Theme = typeof lightTheme;

// Helper to get difficulty color
export const getDifficultyColor = (difficulty: string, theme: Theme) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return theme.colors.success;
    case 'intermediate':
      return theme.colors.warning;
    case 'expert':
      return theme.colors.error;
    default:
      return theme.colors.textSecondary;
  }
};

// Helper to get muscle group icon
export const getMuscleIcon = (muscle: string): string => {
  const muscleIconMap: { [key: string]: string } = {
    chest: 'activity',
    back: 'shield',
    lats: 'shield',
    shoulders: 'sun',
    biceps: 'zap',
    triceps: 'zap',
    forearms: 'zap',
    abdominals: 'target',
    quadriceps: 'trending-up',
    hamstrings: 'trending-down',
    calves: 'trending-down',
    glutes: 'trending-down',
    lower_back: 'shield',
    full_body: 'maximize',
  };
  return muscleIconMap[muscle.toLowerCase()] || 'activity';
};
