import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
    withDelay,
} from 'react-native-reanimated';
import { darkTheme, lightTheme } from '../constants/themes';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addWaterIntake, loadWaterData, removeLastWaterIntake } from '../store/slices/waterSlice';

const WATER_AMOUNTS = [250, 500, 750, 1000]; // ml

export default function WaterTracker() {
  const dispatch = useAppDispatch();
  const { dailyGoal, today } = useAppSelector((state) => state.water);
  const isDark = useAppSelector((state) => state.theme.isDark);
  const theme = isDark ? darkTheme : lightTheme;

  const waterLevel = useSharedValue(0);
  const waveAnimation = useSharedValue(0);
  const rippleScale = useSharedValue(1);
  const bubble1Y = useSharedValue(0);
  const bubble2Y = useSharedValue(0);
  const bubble3Y = useSharedValue(0);
  const glassScale = useSharedValue(1);

  useEffect(() => {
    dispatch(loadWaterData());
  }, []);

  useEffect(() => {
    // Animate water level
    const percentage = Math.min((today.amount / dailyGoal) * 100, 100);
    waterLevel.value = withSpring(percentage, {
      damping: 15,
      stiffness: 100,
    });

    // Wave animation
    waveAnimation.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Bubble animations
    if (percentage > 0) {
      bubble1Y.value = withRepeat(
        withSequence(
          withTiming(-250, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      );
      
      bubble2Y.value = withRepeat(
        withSequence(
          withDelay(800, withTiming(-250, { duration: 3500, easing: Easing.inOut(Easing.ease) })),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      );
      
      bubble3Y.value = withRepeat(
        withSequence(
          withDelay(1500, withTiming(-250, { duration: 2800, easing: Easing.inOut(Easing.ease) })),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      );
    }
  }, [today.amount, dailyGoal]);

  const handleAddWater = (amount: number) => {
    // Trigger ripple animation
    rippleScale.value = 0;
    rippleScale.value = withSequence(
      withTiming(1.5, { duration: 600 }),
      withTiming(0, { duration: 0 })
    );

    // Trigger glass scale animation
    glassScale.value = withSequence(
      withSpring(1.05, { damping: 10, stiffness: 100 }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );

    dispatch(addWaterIntake(amount));
  };

  const handleUndo = () => {
    dispatch(removeLastWaterIntake());
  };

  const waterLevelStyle = useAnimatedStyle(() => {
    return {
      height: `${waterLevel.value}%`,
    };
  });

  const waveStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      waveAnimation.value,
      [0, 1],
      [-10, 10]
    );

    return {
      transform: [{ translateY }],
    };
  });

  const rippleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: rippleScale.value }],
      opacity: interpolate(rippleScale.value, [0, 1, 1.5], [0, 0.5, 0]),
    };
  });

  const glassAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: glassScale.value }],
    };
  });

  const bubble1Style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: bubble1Y.value }],
      opacity: interpolate(bubble1Y.value, [0, -125, -250], [1, 0.7, 0]),
    };
  });

  const bubble2Style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: bubble2Y.value }],
      opacity: interpolate(bubble2Y.value, [0, -125, -250], [1, 0.7, 0]),
    };
  });

  const bubble3Style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: bubble3Y.value }],
      opacity: interpolate(bubble3Y.value, [0, -125, -250], [1, 0.7, 0]),
    };
  });

  const percentage = Math.round((today.amount / dailyGoal) * 100);
  const remainingAmount = Math.max(dailyGoal - today.amount, 0);

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Feather name="droplet" size={24} color={theme.colors.primary} />
          <Text style={styles.title}>Water Intake</Text>
        </View>
        <Text style={styles.subtitle}>Stay hydrated throughout the day</Text>
      </View>

      {/* Water Glass Visualization */}
      <View style={styles.glassContainer}>
        <Animated.View style={[styles.glass, glassAnimatedStyle]}>
          <Animated.View style={[styles.ripple, rippleStyle]} />
          
          <Animated.View style={[styles.waterFill, waterLevelStyle, waveStyle]}>
            <View style={styles.waveTop} />
            
            {/* Animated Bubbles */}
            {percentage > 0 && (
              <>
                <Animated.View style={[styles.bubble, styles.bubble1, bubble1Style]} />
                <Animated.View style={[styles.bubble, styles.bubble2, bubble2Style]} />
                <Animated.View style={[styles.bubble, styles.bubble3, bubble3Style]} />
              </>
            )}
          </Animated.View>

          {/* Measurement Lines */}
          <View style={styles.measurements}>
            {[0, 25, 50, 75, 100].map((mark) => (
              <View key={mark} style={styles.measurementLine}>
                <View style={styles.line} />
                <Text style={styles.measurementText}>{mark}%</Text>
              </View>
            ))}
          </View>

          {/* Center Text */}
          <View style={styles.centerInfo}>
            <Text style={styles.percentageText}>{percentage}%</Text>
            <Text style={styles.amountText}>
              {today.amount}ml / {dailyGoal}ml
            </Text>
            {remainingAmount > 0 && (
              <Text style={styles.remainingText}>
                {remainingAmount}ml to go
              </Text>
            )}
            {percentage >= 100 && (
              <View style={styles.goalBadge}>
                <Feather name="check-circle" size={20} color="#10B981" />
                <Text style={styles.goalText}>Goal Reached! 🎉</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </View>

      {/* Quick Add Buttons */}
      <View style={styles.buttonsContainer}>
        <Text style={styles.sectionTitle}>Quick Add</Text>
        <View style={styles.buttonRow}>
          {WATER_AMOUNTS.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={styles.amountButton}
              onPress={() => handleAddWater(amount)}
            >
              <Feather name="plus" size={20} color={theme.colors.primary} />
              <Text style={styles.amountButtonText}>{amount}ml</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* History */}
      {today.entries.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Today's Log</Text>
            {today.entries.length > 0 && (
              <TouchableOpacity onPress={handleUndo} style={styles.undoButton}>
                <Feather name="rotate-ccw" size={18} color={theme.colors.primary} />
                <Text style={styles.undoText}>Undo</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView style={styles.entriesList} showsVerticalScrollIndicator={false}>
            {today.entries.slice().reverse().map((entry, index) => (
              <View key={`${entry.time}-${index}`} style={styles.entryItem}>
                <View style={styles.entryIcon}>
                  <Feather name="droplet" size={16} color={theme.colors.primary} />
                </View>
                <Text style={styles.entryTime}>{entry.time}</Text>
                <Text style={styles.entryAmount}>+{entry.amount}ml</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing.xl,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    glassContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    glass: {
      width: 200,
      height: 300,
      borderWidth: 3,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: theme.colors.surface,
    },
    waterFill: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.primary,
      opacity: 0.3,
    },
    waveTop: {
      position: 'absolute',
      top: -10,
      left: 0,
      right: 0,
      height: 20,
      backgroundColor: theme.colors.primary,
      opacity: 0.5,
      borderRadius: 100,
    },
    ripple: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 200,
      height: 200,
      marginLeft: -100,
      marginTop: -100,
      borderRadius: 100,
      backgroundColor: theme.colors.primary,
      opacity: 0.3,
    },
    measurements: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
    },
    measurementLine: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
    },
    line: {
      width: 15,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    measurementText: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    centerInfo: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      transform: [{ translateY: -40 }],
      alignItems: 'center',
      zIndex: 10,
    },
    percentageText: {
      fontSize: 42,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    amountText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    remainingText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      marginTop: theme.spacing.xs,
      fontWeight: theme.fontWeight.semibold,
    },
    goalBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      backgroundColor: '#10B98120',
      borderRadius: theme.borderRadius.full,
    },
    goalText: {
      fontSize: theme.fontSize.sm,
      color: '#10B981',
      marginLeft: theme.spacing.xs,
      fontWeight: theme.fontWeight.semibold,
    },
    buttonsContainer: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    buttonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    amountButton: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing.xs,
    },
    amountButtonText: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.primary,
    },
    historyContainer: {
      marginTop: theme.spacing.md,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    undoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    undoText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.semibold,
    },
    entriesList: {
      maxHeight: 200,
    },
    entryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
    },
    entryIcon: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    entryTime: {
      flex: 1,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    entryAmount: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.primary,
    },
    bubble: {
      position: 'absolute',
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    bubble1: {
      bottom: 20,
      left: 40,
      width: 10,
      height: 10,
    },
    bubble2: {
      bottom: 10,
      left: 100,
      width: 14,
      height: 14,
    },
    bubble3: {
      bottom: 30,
      left: 150,
      width: 8,
      height: 8,
    },
  });
