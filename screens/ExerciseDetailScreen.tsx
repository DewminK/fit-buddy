import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavorite, saveFavorites } from '../store/slices/favoritesSlice';
import { Exercise } from '../store/slices/exercisesSlice';
import { lightTheme, darkTheme, getDifficultyColor, getMuscleIcon } from '../constants/themes';

interface ExerciseDetailScreenProps {
  route: any;
  navigation: any;
}

export default function ExerciseDetailScreen({ route, navigation }: ExerciseDetailScreenProps) {
  const { exercise } = route.params as { exercise: Exercise };
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const isDark = useAppSelector((state) => state.theme.isDark);
  const theme = isDark ? darkTheme : lightTheme;

  const isFavorite = favorites.some((fav) => fav.name === exercise.name);

  const handleToggleFavorite = async () => {
    dispatch(toggleFavorite(exercise));
    await dispatch(saveFavorites([...favorites]));
    
    if (!isFavorite) {
      Alert.alert('Added to Favorites', `${exercise.name} has been added to your favorites`);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.iconContainer}>
            <Feather
              name={getMuscleIcon(exercise.muscle) as any}
              size={64}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.title}>{exercise.name}</Text>
          
          <View style={styles.metaContainer}>
            <View style={[styles.badge, { backgroundColor: getDifficultyColor(exercise.difficulty, theme) + '20' }]}>
              <Feather name="bar-chart-2" size={16} color={getDifficultyColor(exercise.difficulty, theme)} />
              <Text style={[styles.badgeText, { color: getDifficultyColor(exercise.difficulty, theme) }]}>
                {exercise.difficulty}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.colors.info + '20' }]}>
              <Feather name="activity" size={16} color={theme.colors.info} />
              <Text style={[styles.badgeText, { color: theme.colors.info }]}>
                {exercise.type}
              </Text>
            </View>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercise Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Feather name="target" size={24} color={theme.colors.primary} />
              <Text style={styles.detailLabel}>Target Muscle</Text>
              <Text style={styles.detailValue}>{exercise.muscle}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Feather name="tool" size={24} color={theme.colors.secondary} />
              <Text style={styles.detailLabel}>Equipment</Text>
              <Text style={styles.detailValue}>{exercise.equipment}</Text>
            </View>
          </View>
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="list" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Instructions</Text>
          </View>
          <Text style={styles.instructions}>{exercise.instructions}</Text>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="alert-circle" size={20} color={theme.colors.warning} />
            <Text style={styles.sectionTitle}>Tips & Safety</Text>
          </View>
          <View style={styles.tipContainer}>
            <Feather name="check-circle" size={16} color={theme.colors.success} />
            <Text style={styles.tipText}>Maintain proper form throughout the exercise</Text>
          </View>
          <View style={styles.tipContainer}>
            <Feather name="check-circle" size={16} color={theme.colors.success} />
            <Text style={styles.tipText}>Breathe consistently - exhale on exertion</Text>
          </View>
          <View style={styles.tipContainer}>
            <Feather name="check-circle" size={16} color={theme.colors.success} />
            <Text style={styles.tipText}>Start with lighter weights to master technique</Text>
          </View>
          <View style={styles.tipContainer}>
            <Feather name="check-circle" size={16} color={theme.colors.success} />
            <Text style={styles.tipText}>Warm up before and stretch after</Text>
          </View>
        </View>
      </ScrollView>

      {/* Favorite Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
          onPress={handleToggleFavorite}
          activeOpacity={0.8}
        >
          <Feather
            name={isFavorite ? 'heart' : 'heart'}
            size={24}
            color={isFavorite ? '#FFFFFF' : theme.colors.error}
            fill={isFavorite ? '#FFFFFF' : 'transparent'}
          />
          <Text style={[styles.favoriteButtonText, isFavorite && styles.favoriteButtonTextActive]}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    headerCard: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.xl,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    metaContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing.xs,
      marginVertical: theme.spacing.xs,
    },
    badgeText: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
      marginLeft: theme.spacing.xs,
      textTransform: 'capitalize',
    },
    section: {
      padding: theme.spacing.lg,
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
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    detailItem: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
    detailLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm,
    },
    detailValue: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginTop: theme.spacing.xs,
      textTransform: 'capitalize',
    },
    instructions: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      lineHeight: 24,
    },
    tipContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    tipText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    footer: {
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    favoriteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 2,
      borderColor: theme.colors.error,
    },
    favoriteButtonActive: {
      backgroundColor: theme.colors.error,
      borderColor: theme.colors.error,
    },
    favoriteButtonText: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.error,
      marginLeft: theme.spacing.sm,
    },
    favoriteButtonTextActive: {
      color: '#FFFFFF',
    },
  });
