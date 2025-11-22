import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { darkTheme, lightTheme } from '../constants/themes';
import { useAppSelector } from '../store/hooks';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const isDark = useAppSelector((state) => state.theme.isDark);
  const theme = isDark ? darkTheme : lightTheme;

  // Animations
  const logoScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0);
  const iconRotation = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });

    // Title fade in
    titleOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });

    // Button entrance
    setTimeout(() => {
      buttonScale.value = withSpring(1, {
        damping: 12,
        stiffness: 150,
      });
    }, 400);

    // Icon rotation animation
    iconRotation.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 1000 }),
        withTiming(-10, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const handleStart = () => {
    router.replace('/auth/login');
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Background decoration */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />

      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Animated.View style={iconAnimatedStyle}>
            <Feather name="activity" size={100} color={theme.colors.primary} />
          </Animated.View>
        </Animated.View>

        {/* Title and subtitle */}
        <Animated.View style={[styles.textContainer, titleAnimatedStyle]}>
          <Text style={styles.title}>FitBuddy</Text>
          <Text style={styles.subtitle}>Your Personal Fitness Companion</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Feather name="check-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.featureText}>Track your exercises</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="check-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.featureText}>Monitor water intake</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="check-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.featureText}>Save favorites</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="check-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.featureText}>Achieve your goals</Text>
            </View>
          </View>
        </Animated.View>

        {/* Start Button */}
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Get Started</Text>
            <Feather name="arrow-right" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      overflow: 'hidden',
    },
    backgroundCircle1: {
      position: 'absolute',
      width: width * 1.5,
      height: width * 1.5,
      borderRadius: width * 0.75,
      backgroundColor: theme.colors.primary + '10',
      top: -width * 0.7,
      right: -width * 0.5,
    },
    backgroundCircle2: {
      position: 'absolute',
      width: width * 1.2,
      height: width * 1.2,
      borderRadius: width * 0.6,
      backgroundColor: theme.colors.primary + '05',
      bottom: -width * 0.5,
      left: -width * 0.4,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      zIndex: 1,
    },
    logoContainer: {
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    textContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl * 2,
    },
    title: {
      fontSize: 48,
      fontWeight: '800',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      letterSpacing: -1,
    },
    subtitle: {
      fontSize: theme.fontSize.lg,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    featuresList: {
      alignItems: 'flex-start',
      marginTop: theme.spacing.lg,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    featureText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      fontWeight: '500',
    },
    startButton: {
      flexDirection: 'row',
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl * 1.5,
      borderRadius: 50,
      alignItems: 'center',
      gap: theme.spacing.sm,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      minWidth: 200,
      justifyContent: 'center',
    },
    startButtonText: {
      fontSize: theme.fontSize.xl,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    footer: {
      position: 'absolute',
      bottom: theme.spacing.xl,
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
  });
