import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { lightTheme } from '../constants/themes';
import { Exercise } from '../store/slices/exercisesSlice';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
  theme: typeof lightTheme;
  index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ExerciseCard({
  exercise,
  onPress,
  onFavoritePress,
  isFavorite,
  theme,
  index,
}: ExerciseCardProps) {
  const scale = useSharedValue(1);
  const favoriteScale = useSharedValue(1);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);

  // Entry animation
  React.useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 300 + index * 100 });
    cardTranslateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleFavoritePress = () => {
    favoriteScale.value = withSpring(1.3, {}, () => {
      favoriteScale.value = withSpring(1);
    });
    onFavoritePress();
  };

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: cardTranslateY.value },
      ],
      opacity: cardOpacity.value,
    };
  });

  const favoriteAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: favoriteScale.value }],
    };
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '#10B981';
      case 'intermediate':
        return '#F59E0B';
      case 'expert':
        return '#EF4444';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getEquipmentIcon = (equipment: string) => {
    const equipmentLower = equipment.toLowerCase();
    if (equipmentLower.includes('dumbbell')) return 'disc';
    if (equipmentLower.includes('barbell')) return 'minus';
    if (equipmentLower.includes('body')) return 'user';
    if (equipmentLower.includes('cable') || equipmentLower.includes('machine')) return 'settings';
    if (equipmentLower.includes('pull')) return 'arrow-up';
    return 'circle';
  };

  const getMuscleIcon = (muscle: string) => {
    const muscleLower = muscle.toLowerCase();
    if (muscleLower.includes('chest')) return 'heart';
    if (muscleLower.includes('biceps') || muscleLower.includes('triceps')) return 'zap';
    if (muscleLower.includes('leg') || muscleLower.includes('quad') || muscleLower.includes('calf')) return 'trending-up';
    if (muscleLower.includes('back') || muscleLower.includes('lat')) return 'shield';
    if (muscleLower.includes('shoulder')) return 'octagon';
    if (muscleLower.includes('abs') || muscleLower.includes('core')) return 'square';
    return 'activity';
  };

  const getStatusBadge = () => {
    // Popular: beginner difficulty exercises
    if (exercise.difficulty.toLowerCase() === 'beginner') {
      return { label: 'Popular', icon: 'star', color: '#F59E0B' };
    }
    // Trending: cardio exercises
    if (exercise.type.toLowerCase() === 'cardio') {
      return { label: 'Trending', icon: 'trending-up', color: '#10B981' };
    }
    // Active: if it's in favorites
    if (isFavorite) {
      return { label: 'Active', icon: 'check-circle', color: '#3B82F6' };
    }
    // Upcoming: expert exercises
    if (exercise.difficulty.toLowerCase() === 'expert') {
      return { label: 'Upcoming', icon: 'clock', color: '#8B5CF6' };
    }
    return null;
  };

  const statusBadge = getStatusBadge();
  const styles = createStyles(theme);

  return (
    <AnimatedPressable
      style={[styles.card, cardAnimatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {statusBadge && (
        <View style={[styles.statusBadge, { backgroundColor: statusBadge.color }]}>
          <Feather name={statusBadge.icon as any} size={12} color="#FFFFFF" />
          <Text style={styles.statusBadgeText}>{statusBadge.label}</Text>
        </View>
      )}
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Feather name={getMuscleIcon(exercise.muscle)} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.exerciseName} numberOfLines={2}>
            {exercise.name}
          </Text>
          <View style={styles.tags}>
            <View style={[styles.tag, { backgroundColor: getDifficultyColor(exercise.difficulty) + '20' }]}>
              <Text style={[styles.tagText, { color: getDifficultyColor(exercise.difficulty) }]}>
                {exercise.difficulty}
              </Text>
            </View>
            <View style={styles.tag}>
              <Feather name={getEquipmentIcon(exercise.equipment)} size={12} color={theme.colors.textSecondary} />
              <Text style={styles.tagText}>{exercise.equipment.replace('_', ' ')}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton}>
          <Animated.View style={favoriteAnimatedStyle}>
            <Feather
              name={isFavorite ? 'heart' : 'heart'}
              size={24}
              color={isFavorite ? '#EF4444' : theme.colors.textSecondary}
              fill={isFavorite ? '#EF4444' : 'none'}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="target" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>{exercise.muscle}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="activity" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>{exercise.type}</Text>
          </View>
        </View>
        
        <Text style={styles.instructions} numberOfLines={2}>
          {exercise.instructions}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.viewDetailsText}>Tap to view details</Text>
        <Feather name="chevron-right" size={20} color={theme.colors.primary} />
      </View>
    </AnimatedPressable>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      overflow: 'hidden',
    },
    statusBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderBottomLeftRadius: theme.borderRadius.md,
      gap: 4,
      zIndex: 10,
    },
    statusBadgeText: {
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.semibold,
      color: '#FFFFFF',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    cardHeader: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    headerInfo: {
      flex: 1,
    },
    exerciseName: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.sm,
      gap: 4,
    },
    tagText: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },
    favoriteButton: {
      padding: theme.spacing.xs,
    },
    cardBody: {
      marginBottom: theme.spacing.md,
    },
    metaRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    metaText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },
    instructions: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    viewDetailsText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.semibold,
    },
  });
