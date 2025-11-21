import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchExercises, setFilter, clearFilters } from '../store/slices/exercisesSlice';
import { lightTheme, darkTheme, getDifficultyColor, getMuscleIcon } from '../constants/themes';
import { Exercise } from '../store/slices/exercisesSlice';

interface HomeScreenProps {
  navigation: any;
}

const MUSCLES = ['all', 'chest', 'back', 'biceps', 'triceps', 'shoulders', 'quadriceps', 'abdominals', 'lats'];
const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'expert'];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const dispatch = useAppDispatch();
  const { filteredExercises, isLoading, currentFilter } = useAppSelector((state) => state.exercises);
  const { user } = useAppSelector((state) => state.auth);
  const isDark = useAppSelector((state) => state.theme.isDark);
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const theme = isDark ? darkTheme : lightTheme;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    await dispatch(fetchExercises({}));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExercises();
    setRefreshing(false);
  };

  const handleFilterMuscle = (muscle: string) => {
    dispatch(setFilter({ muscle }));
  };

  const handleFilterDifficulty = (difficulty: string) => {
    dispatch(setFilter({ difficulty }));
  };

  const isFavorite = (exerciseName: string) => {
    return favorites.some((fav) => fav.name === exerciseName);
  };

  const filteredBySearch = filteredExercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles(theme).card}
      onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
      activeOpacity={0.7}
    >
      <View style={styles(theme).cardHeader}>
        <View style={styles(theme).iconContainer}>
          <Feather
            name={getMuscleIcon(item.muscle) as any}
            size={32}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles(theme).cardHeaderContent}>
          <Text style={styles(theme).cardTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles(theme).cardMeta}>
            <View style={[styles(theme).badge, { backgroundColor: getDifficultyColor(item.difficulty, theme) + '20' }]}>
              <Text style={[styles(theme).badgeText, { color: getDifficultyColor(item.difficulty, theme) }]}>
                {item.difficulty}
              </Text>
            </View>
            <View style={[styles(theme).badge, { backgroundColor: theme.colors.info + '20' }]}>
              <Text style={[styles(theme).badgeText, { color: theme.colors.info }]}>
                {item.type}
              </Text>
            </View>
          </View>
        </View>
        {isFavorite(item.name) && (
          <Feather name="heart" size={24} color={theme.colors.error} style={{ marginLeft: 8 }} />
        )}
      </View>
      
      <Text style={styles(theme).cardDescription} numberOfLines={2}>
        Target: {item.muscle} • Equipment: {item.equipment}
      </Text>
      
      <View style={styles(theme).cardFooter}>
        <Feather name="chevron-right" size={20} color={theme.colors.primary} />
      </View>
    </TouchableOpacity>
  );

  const styles = createStyles;

  return (
    <View style={styles(theme).container}>
      {/* Header */}
      <View style={styles(theme).header}>
        <View>
          <Text style={styles(theme).greeting}>Hello, {user?.firstName || 'User'}!</Text>
          <Text style={styles(theme).headerTitle}>Ready to workout?</Text>
        </View>
        <Feather name="activity" size={32} color={theme.colors.primary} />
      </View>

      {/* Search Bar */}
      <View style={styles(theme).searchContainer}>
        <Feather name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={styles(theme).searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Muscle Filter */}
      <View style={styles(theme).filterSection}>
        <Text style={styles(theme).filterLabel}>Muscle Group</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={MUSCLES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles(theme).filterChip,
                currentFilter.muscle === item && styles(theme).filterChipActive,
              ]}
              onPress={() => handleFilterMuscle(item)}
            >
              <Text
                style={[
                  styles(theme).filterChipText,
                  currentFilter.muscle === item && styles(theme).filterChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles(theme).filterList}
        />
      </View>

      {/* Difficulty Filter */}
      <View style={styles(theme).filterSection}>
        <Text style={styles(theme).filterLabel}>Difficulty</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DIFFICULTIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles(theme).filterChip,
                currentFilter.difficulty === item && styles(theme).filterChipActive,
              ]}
              onPress={() => handleFilterDifficulty(item)}
            >
              <Text
                style={[
                  styles(theme).filterChipText,
                  currentFilter.difficulty === item && styles(theme).filterChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles(theme).filterList}
        />
      </View>

      {/* Exercise List */}
      {isLoading && !refreshing ? (
        <View style={styles(theme).loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles(theme).loadingText}>Loading exercises...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBySearch}
          renderItem={renderExerciseCard}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles(theme).listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles(theme).emptyContainer}>
              <Feather name="inbox" size={64} color={theme.colors.textSecondary} />
              <Text style={styles(theme).emptyText}>No exercises found</Text>
              <Text style={styles(theme).emptySubtext}>Try adjusting your filters</Text>
            </View>
          }
        />
      )}
    </View>
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
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
    },
    greeting: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    headerTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginTop: theme.spacing.xs,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      marginLeft: theme.spacing.sm,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    filterSection: {
      marginBottom: theme.spacing.md,
    },
    filterLabel: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      textTransform: 'uppercase',
    },
    filterList: {
      paddingHorizontal: theme.spacing.lg,
    },
    filterChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.sm,
    },
    filterChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterChipText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
      textTransform: 'capitalize',
    },
    filterChipTextActive: {
      color: '#FFFFFF',
      fontWeight: theme.fontWeight.semibold,
    },
    listContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardHeaderContent: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    cardTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    cardMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    badge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    badgeText: {
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.medium,
      textTransform: 'capitalize',
    },
    cardDescription: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm,
      textTransform: 'capitalize',
    },
    cardFooter: {
      alignItems: 'flex-end',
      marginTop: theme.spacing.xs,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl * 2,
    },
    emptyText: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginTop: theme.spacing.md,
    },
    emptySubtext: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
  });
