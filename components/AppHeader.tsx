import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme } from '../store/slices/themeSlice';
import { lightTheme, darkTheme } from '../constants/themes';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export default function AppHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightComponent,
}: AppHeaderProps) {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.theme.isDark);
  const { user } = useAppSelector((state) => state.auth);
  const theme = isDark ? darkTheme : lightTheme;

  const moonScale = useSharedValue(isDark ? 1 : 0.8);
  const sunScale = useSharedValue(isDark ? 0.8 : 1);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    moonScale.value = withSpring(isDark ? 0.8 : 1);
    sunScale.value = withSpring(isDark ? 1 : 0.8);
  };

  const moonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: moonScale.value }],
    opacity: isDark ? 1 : 0.5,
  }));

  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sunScale.value }],
    opacity: isDark ? 0.5 : 1,
  }));

  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.topRow}>
        {/* Left side - Back button or Logo */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ) : (
            <View style={styles.logoContainer}>
              <Feather name="activity" size={28} color={theme.colors.primary} />
            </View>
          )}
        </View>

        {/* Center - Title or User info */}
        <View style={styles.centerSection}>
          {title ? (
            <View>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          ) : user ? (
            <View>
              <Text style={styles.greeting}>Hello, {user.firstName}! 👋</Text>
              <Text style={styles.subtitle}>Ready to workout?</Text>
            </View>
          ) : null}
        </View>

        {/* Right side - Theme toggle and custom component */}
        <View style={styles.rightSection}>
          {rightComponent}
          <TouchableOpacity
            onPress={handleThemeToggle}
            style={styles.themeToggle}
            activeOpacity={0.7}
          >
            <View style={styles.toggleContainer}>
              <Animated.View style={[styles.iconContainer, sunStyle]}>
                <Feather name="sun" size={20} color={theme.colors.primary} />
              </Animated.View>
              <Animated.View style={[styles.iconContainer, moonStyle]}>
                <Feather name="moon" size={20} color={theme.colors.primary} />
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      minHeight: 50,
    },
    leftSection: {
      minWidth: 50,
      justifyContent: 'center',
    },
    centerSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xs,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      minWidth: 50,
      justifyContent: 'flex-end',
    },
    backButton: {
      padding: theme.spacing.xs,
    },
    logoContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 2,
    },
    greeting: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
    },
    themeToggle: {
      padding: theme.spacing.xs,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: 50,
      padding: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    iconContainer: {
      width: 28,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
