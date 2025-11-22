import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { darkTheme, lightTheme } from '../constants/themes';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme } from '../store/slices/themeSlice';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  showNotification?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
}

export default function AppHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightComponent,
  showNotification = true,
  notificationCount = 0,
  onNotificationPress,
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

        {/* Center - Title or User info */}
        <View style={styles.centerSection}>
          {title ? (
            <View>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          ) : user ? (
            <View>
              <Text style={styles.greeting}>Hello, {user.firstName}</Text>
              <Text style={styles.subtitle}>Ready to workout?</Text>
            </View>
          ) : null}
        </View>

        {/* Right side - Notification, Theme toggle and custom component */}
        <View style={styles.rightSection}>
          {rightComponent}
          {showNotification && (
            <TouchableOpacity
              onPress={onNotificationPress}
              style={styles.notificationButton}
              activeOpacity={0.7}
            >
              <Feather name="bell" size={22} color={theme.colors.text} />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
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
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      minHeight: 56,
      paddingVertical: theme.spacing.sm,
    },
    leftSection: {
      width: 80,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    centerSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      width: 80,
      justifyContent: 'flex-end',
    },
    backButton: {
      padding: theme.spacing.sm,
      marginLeft: -theme.spacing.sm,
    },
    logoContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: 24,
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 4,
      lineHeight: 18,
    },
    greeting: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: 22,
    },
    notificationButton: {
      padding: theme.spacing.sm,
      position: 'relative',
      marginRight: -theme.spacing.xs,
    },
    badge: {
      position: 'absolute',
      top: 6,
      right: 6,
      backgroundColor: theme.colors.error,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
      borderWidth: 2,
      borderColor: theme.colors.background,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '700',
    },
    themeToggle: {
      padding: theme.spacing.sm,
      marginRight: -theme.spacing.sm,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: 50,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    iconContainer: {
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
