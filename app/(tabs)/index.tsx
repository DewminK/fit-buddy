import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import ExerciseCard from '../../components/ExerciseCard';
import { darkTheme, lightTheme } from '../../constants/themes';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Exercise, fetchExercises, setFilter } from '../../store/slices/exercisesSlice';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { addNotification } from '../../store/slices/notificationsSlice';

const MUSCLES = ['all', 'chest', 'back', 'biceps', 'triceps', 'shoulders', 'quadriceps', 'abdominals', 'lats', 'hamstrings', 'calves'];
const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'expert'];

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { filteredExercises, isLoading, currentFilter } = useAppSelector((state: any) => state.exercises);
  const { user } = useAppSelector((state: any) => state.auth);
  const isDark = useAppSelector((state: any) => state.theme.isDark);
  const favorites = useAppSelector((state: any) => state.favorites.favorites);
  const unreadCount = useAppSelector((state: any) => state.notifications?.unreadCount || 0);
  const theme = isDark ? darkTheme : lightTheme;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

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
    return favorites.some((fav: any) => fav.name === exerciseName);
  };

  const filteredBySearch = filteredExercises.filter((exercise: any) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFavoritePress = (exercise: Exercise) => {
    const isFavorite = favorites.some((fav) => fav.name === exercise.name);
    dispatch(toggleFavorite(exercise));
    
    // Add notification when adding to favorites
    if (!isFavorite) {
      dispatch(addNotification({
        type: 'favorite',
        title: 'Added to Favorites',
        message: `${exercise.name} has been added to your favorites!`,
        exerciseName: exercise.name,
      }));
    }
  };

  const renderExerciseCard = ({ item, index }: { item: Exercise; index: number }) => (
    <ExerciseCard
      exercise={item}
      onPress={() => router.push({ pathname: '/exercise-detail', params: { exercise: JSON.stringify(item) } })}
      onFavoritePress={() => handleFavoritePress(item)}
      isFavorite={isFavorite(item.name)}
      theme={theme}
      index={index}
    />
  );

  const styles = createStyles;

  return (
    <SafeAreaView style={styles(theme).container} edges={['bottom']}>
      {/* Header with theme toggle */}
      <AppHeader 
        notificationCount={unreadCount}
        onNotificationPress={handleNotificationPress}
      />

      {/* Spacing after header */}
      <View style={styles(theme).headerSpacer} />

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

      {/* Filter Dropdowns Row */}
      <View style={styles(theme).filtersRow}>
        {/* Muscle Group Dropdown */}
        <View style={styles(theme).dropdownContainer}>
          <Text style={styles(theme).dropdownLabel}>Muscle Group</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles(theme).dropdownScroll}
          >
            <TouchableOpacity
              style={[
                styles(theme).dropdownChip,
                !currentFilter.muscle && styles(theme).dropdownChipActive,
              ]}
              onPress={() => handleFilterMuscle('')}
            >
              <Text
                style={[
                  styles(theme).dropdownChipText,
                  !currentFilter.muscle && styles(theme).dropdownChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {MUSCLES.filter(m => m !== 'all').map((muscle) => (
              <TouchableOpacity
                key={muscle}
                style={[
                  styles(theme).dropdownChip,
                  currentFilter.muscle === muscle && styles(theme).dropdownChipActive,
                ]}
                onPress={() => handleFilterMuscle(muscle)}
              >
                <Text
                  style={[
                    styles(theme).dropdownChipText,
                    currentFilter.muscle === muscle && styles(theme).dropdownChipTextActive,
                  ]}
                >
                  {muscle}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Difficulty Dropdown */}
        <View style={styles(theme).dropdownContainer}>
          <Text style={styles(theme).dropdownLabel}>Difficulty</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles(theme).dropdownScroll}
          >
            <TouchableOpacity
              style={[
                styles(theme).dropdownChip,
                !currentFilter.difficulty && styles(theme).dropdownChipActive,
              ]}
              onPress={() => handleFilterDifficulty('')}
            >
              <Text
                style={[
                  styles(theme).dropdownChipText,
                  !currentFilter.difficulty && styles(theme).dropdownChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {DIFFICULTIES.filter(d => d !== 'all').map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles(theme).dropdownChip,
                  currentFilter.difficulty === difficulty && styles(theme).dropdownChipActive,
                ]}
                onPress={() => handleFilterDifficulty(difficulty)}
              >
                <Text
                  style={[
                    styles(theme).dropdownChipText,
                    currentFilter.difficulty === difficulty && styles(theme).dropdownChipTextActive,
                  ]}
                >
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerSpacer: {
      height: theme.spacing.md,
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
    filtersRow: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      gap: theme.spacing.md,
    },
    dropdownContainer: {
      marginBottom: theme.spacing.sm,
    },
    dropdownLabel: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    dropdownScroll: {
      flexGrow: 0,
    },
    dropdownChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      marginRight: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minWidth: 70,
      alignItems: 'center',
    },
    dropdownChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    dropdownChipText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
      textTransform: 'capitalize',
    },
    dropdownChipTextActive: {
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
