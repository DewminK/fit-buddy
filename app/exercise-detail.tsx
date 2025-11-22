import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomModal from '../components/CustomModal';
import { darkTheme, getDifficultyColor, getMuscleIcon, lightTheme } from '../constants/themes';
import { useCustomModal } from '../hooks/useCustomModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Exercise } from '../store/slices/exercisesSlice';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { addExerciseToWorkout } from '../store/slices/workoutsSlice';

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state: any) => state.theme.isDark);
  const favorites = useAppSelector((state: any) => state.favorites.favorites);
  const currentWorkout = useAppSelector((state: any) => state.workouts.currentWorkout);
  const theme = isDark ? darkTheme : lightTheme;
  const { modalConfig, showWarning, showConfirm, hideModal } = useCustomModal();

  const exercise: Exercise = params.exercise ? JSON.parse(params.exercise as string) : null;

  if (!exercise) {
    return (
      <View style={styles(theme).container}>
        <Text style={styles(theme).errorText}>Exercise not found</Text>
      </View>
    );
  }

  const isFavorite = favorites.some((fav: any) => fav.name === exercise.name);
  const isInWorkout = currentWorkout.some((ex: any) => ex.name === exercise.name);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(exercise));
  };

  const handleAddToWorkout = () => {
    if (isInWorkout) {
      showWarning(
        'Already Added',
        'This exercise is already in your current workout.'
      );
    } else {
      dispatch(addExerciseToWorkout(exercise));
      showConfirm(
        'Success! 🎉',
        `${exercise.name} added to your workout.`,
        () => {
          hideModal();
          router.push('/(tabs)/profile');
        },
        'View Workout',
        'Continue'
      );
    }
  };

  const styles = createStyles;

  return (
    <SafeAreaView style={styles(theme).container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles(theme).header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles(theme).backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles(theme).favoriteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather
            name={isFavorite ? 'heart' : 'heart'}
            size={24}
            color={isFavorite ? theme.colors.error : theme.colors.text}
            fill={isFavorite ? theme.colors.error : 'none'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles(theme).content}>
        {/* Hero Section */}
        <View style={styles(theme).hero}>
          <View style={styles(theme).heroIcon}>
            <Feather
              name={getMuscleIcon(exercise.muscle) as any}
              size={64}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles(theme).title}>{exercise.name}</Text>
          <View style={styles(theme).badges}>
            <View style={[styles(theme).badge, { backgroundColor: getDifficultyColor(exercise.difficulty, theme) + '20' }]}>
              <Text style={[styles(theme).badgeText, { color: getDifficultyColor(exercise.difficulty, theme) }]}>
                {exercise.difficulty}
              </Text>
            </View>
            <View style={[styles(theme).badge, { backgroundColor: theme.colors.info + '20' }]}>
              <Text style={[styles(theme).badgeText, { color: theme.colors.info }]}>
                {exercise.type}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles(theme).infoGrid}>
          <View style={styles(theme).infoCard}>
            <Feather name="target" size={24} color={theme.colors.primary} />
            <Text style={styles(theme).infoLabel}>Muscle</Text>
            <Text style={styles(theme).infoValue}>{exercise.muscle}</Text>
          </View>
          <View style={styles(theme).infoCard}>
            <Feather name="tool" size={24} color={theme.colors.success} />
            <Text style={styles(theme).infoLabel}>Equipment</Text>
            <Text style={styles(theme).infoValue}>{exercise.equipment}</Text>
          </View>
        </View>

        {/* Instructions Section */}
        <View style={styles(theme).section}>
          <View style={styles(theme).sectionHeader}>
            <Feather name="list" size={24} color={theme.colors.primary} />
            <Text style={styles(theme).sectionTitle}>Instructions</Text>
          </View>
          <Text style={styles(theme).instructionsText}>{exercise.instructions}</Text>
        </View>

        {/* Tips Section */}
        <View style={styles(theme).section}>
          <View style={styles(theme).sectionHeader}>
            <Feather name="alert-circle" size={24} color={theme.colors.warning} />
            <Text style={styles(theme).sectionTitle}>Tips</Text>
          </View>
          <View style={styles(theme).tipCard}>
            <Feather name="check-circle" size={20} color={theme.colors.success} />
            <Text style={styles(theme).tipText}>
              Focus on proper form over weight
            </Text>
          </View>
          <View style={styles(theme).tipCard}>
            <Feather name="check-circle" size={20} color={theme.colors.success} />
            <Text style={styles(theme).tipText}>
              Breathe steadily throughout the movement
            </Text>
          </View>
          <View style={styles(theme).tipCard}>
            <Feather name="check-circle" size={20} color={theme.colors.success} />
            <Text style={styles(theme).tipText}>
              Start with lighter weights to master technique
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles(theme).bottomAction}>
        <TouchableOpacity
          style={[
            styles(theme).actionButton,
            {
              flex: 1,
              backgroundColor: isInWorkout ? theme.colors.success : theme.colors.primary,
            },
          ]}
          activeOpacity={0.7}
          onPress={handleAddToWorkout}
        >
          <Feather
            name={isInWorkout ? 'check-circle' : 'plus-circle'}
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles(theme).actionButtonText}>
            {isInWorkout ? 'Added to Workout' : 'Add to Workout'}
          </Text>
        </TouchableOpacity>
      </View>

      <CustomModal {...modalConfig} />
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    favoriteButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
    },
    hero: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    heroIcon: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    badges: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    badge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginHorizontal: theme.spacing.xs,
    },
    badgeText: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      textTransform: 'capitalize',
    },
    infoGrid: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    infoCard: {
      flex: 1,
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing.xs,
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    infoLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm,
    },
    infoValue: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginTop: theme.spacing.xs,
      textTransform: 'capitalize',
      textAlign: 'center',
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    instructionsText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      lineHeight: 24,
      backgroundColor: theme.colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tipCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tipText: {
      flex: 1,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    bottomAction: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.card,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      marginLeft: theme.spacing.sm,
    },
    errorText: {
      fontSize: theme.fontSize.lg,
      color: theme.colors.error,
      textAlign: 'center',
      marginTop: theme.spacing.xl,
    },
  });
