import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { lightTheme, darkTheme, getDifficultyColor, getMuscleIcon } from '../../constants/themes';
import { Exercise } from '../../store/slices/exercisesSlice';
import AppHeader from '../../components/AppHeader';

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state: any) => state.favorites.favorites);
  const isDark = useAppSelector((state: any) => state.theme.isDark);
  const theme = isDark ? darkTheme : lightTheme;

  const handleRemoveFavorite = (exercise: Exercise) => {
    dispatch(toggleFavorite(exercise));
  };

  const renderFavoriteCard = ({ item }: { item: Exercise }) => (
    <View style={styles(theme).card}>
      <TouchableOpacity
        style={styles(theme).cardContent}
        onPress={() => router.push({ pathname: '/exercise-detail', params: { exercise: JSON.stringify(item) } })}
        activeOpacity={0.7}
      >
        <View style={styles(theme).cardHeader}>
          <View style={styles(theme).iconContainer}>
            <Feather
              name={getMuscleIcon(item.muscle) as any}
              size={28}
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
        </View>
        
        <Text style={styles(theme).cardDescription} numberOfLines={2}>
          Target: {item.muscle} • Equipment: {item.equipment}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles(theme).removeButton}
        onPress={() => handleRemoveFavorite(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="x-circle" size={24} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  );

  const styles = createStyles;

  return (
    <SafeAreaView style={styles(theme).container} edges={['bottom']}>
      <AppHeader 
        title="Favorites" 
        subtitle={`${favorites.length} ${favorites.length === 1 ? 'exercise' : 'exercises'}`}
        rightComponent={
          <Feather name="heart" size={28} color={theme.colors.error} />
        }
      />

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <View style={styles(theme).emptyContainer}>
          <Feather name="heart" size={64} color={theme.colors.textSecondary} />
          <Text style={styles(theme).emptyText}>No favorites yet</Text>
          <Text style={styles(theme).emptySubtext}>
            Start adding exercises to your favorites!
          </Text>
          <TouchableOpacity
            style={styles(theme).exploreButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles(theme).exploreButtonText}>Explore Exercises</Text>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteCard}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles(theme).listContent}
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
    listContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardContent: {
      flex: 1,
      padding: theme.spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    iconContainer: {
      width: 50,
      height: 50,
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
      marginTop: theme.spacing.xs,
      textTransform: 'capitalize',
    },
    removeButton: {
      padding: theme.spacing.md,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    emptyText: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginTop: theme.spacing.md,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
    exploreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.xl,
    },
    exploreButtonText: {
      color: '#FFFFFF',
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      marginRight: theme.spacing.sm,
    },
  });
