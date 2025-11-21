import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavorite, saveFavorites } from '../store/slices/favoritesSlice';
import { Exercise } from '../store/slices/exercisesSlice';
import { lightTheme, darkTheme, getDifficultyColor, getMuscleIcon } from '../constants/themes';

interface FavoritesScreenProps {
  navigation: any;
}

export default function FavoritesScreen({ navigation }: FavoritesScreenProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const isDark = useAppSelector((state) => state.theme.isDark);
  const theme = isDark ? darkTheme : lightTheme;

  const handleRemoveFavorite = async (exercise: Exercise) => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${exercise.name} from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            dispatch(toggleFavorite(exercise));
            await dispatch(saveFavorites([...favorites.filter(fav => fav.name !== exercise.name)]));
          },
        },
      ]
    );
  };

  const renderFavoriteCard = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles(theme).card}
      onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
      activeOpacity={0.7}
    >
      <View style={styles(theme).cardContent}>
        <View style={styles(theme).iconContainer}>
          <Feather
            name={getMuscleIcon(item.muscle) as any}
            size={32}
            color={theme.colors.primary}
          />
        </View>
        
        <View style={styles(theme).cardInfo}>
          <Text style={styles(theme).cardTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles(theme).cardMeta}>
            <View style={[styles(theme).badge, { backgroundColor: getDifficultyColor(item.difficulty, theme) + '20' }]}>
              <Text style={[styles(theme).badgeText, { color: getDifficultyColor(item.difficulty, theme) }]}>
                {item.difficulty}
              </Text>
            </View>
            <Text style={styles(theme).cardDescription}>
              {item.muscle} • {item.type}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles(theme).removeButton}
          onPress={() => handleRemoveFavorite(item)}
        >
          <Feather name="heart" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const styles = createStyles;

  return (
    <View style={styles(theme).container}>
      {favorites.length === 0 ? (
        <View style={styles(theme).emptyContainer}>
          <Feather name="heart" size={80} color={theme.colors.textSecondary} />
          <Text style={styles(theme).emptyTitle}>No Favorites Yet</Text>
          <Text style={styles(theme).emptySubtitle}>
            Start adding exercises to your favorites to see them here
          </Text>
          <TouchableOpacity
            style={styles(theme).exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Feather name="search" size={20} color="#FFFFFF" />
            <Text style={styles(theme).exploreButtonText}>Explore Exercises</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles(theme).header}>
            <Text style={styles(theme).headerTitle}>My Favorites</Text>
            <View style={styles(theme).countBadge}>
              <Text style={styles(theme).countText}>{favorites.length}</Text>
            </View>
          </View>
          
          <FlatList
            data={favorites}
            renderItem={renderFavoriteCard}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles(theme).listContent}
          />
        </>
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
    headerTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    countBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
    },
    countText: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.bold,
      color: '#FFFFFF',
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
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardInfo: {
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
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    badge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm,
    },
    badgeText: {
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.medium,
      textTransform: 'capitalize',
    },
    cardDescription: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },
    removeButton: {
      padding: theme.spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginTop: theme.spacing.lg,
    },
    emptySubtitle: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    exploreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    exploreButtonText: {
      color: '#FFFFFF',
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      marginLeft: theme.spacing.sm,
    },
  });
