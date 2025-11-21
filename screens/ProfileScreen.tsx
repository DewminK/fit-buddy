import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { toggleTheme, saveTheme } from '../store/slices/themeSlice';
import { lightTheme, darkTheme } from '../constants/themes';

interface ProfileScreenProps {
  navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isDark = useAppSelector((state) => state.theme.isDark);
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const theme = isDark ? darkTheme : lightTheme;

  const handleThemeToggle = async () => {
    dispatch(toggleTheme());
    await dispatch(saveTheme(!isDark));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Feather name="user" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.username}>@{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Feather name="heart" size={24} color={theme.colors.error} />
          <Text style={styles.statValue}>{favorites.length}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statBox}>
          <Feather name="activity" size={24} color={theme.colors.success} />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statBox}>
          <Feather name="trending-up" size={24} color={theme.colors.info} />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Feather name={isDark ? 'moon' : 'sun'} size={20} color={theme.colors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleThemeToggle}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingInfo}>
            <Feather name="bell" size={20} color={theme.colors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>Manage notification preferences</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingInfo}>
            <Feather name="target" size={20} color={theme.colors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Fitness Goals</Text>
              <Text style={styles.settingDescription}>Set your fitness objectives</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* App Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingInfo}>
            <Feather name="info" size={20} color={theme.colors.info} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>About FitBuddy</Text>
              <Text style={styles.settingDescription}>Version 1.0.0</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingInfo}>
            <Feather name="help-circle" size={20} color={theme.colors.info} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingDescription}>Get help and contact support</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingInfo}>
            <Feather name="shield" size={20} color={theme.colors.info} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>Read our privacy policy</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      alignItems: 'center',
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    name: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    username: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    email: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      padding: theme.spacing.lg,
      justifyContent: 'space-around',
    },
    statBox: {
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      flex: 1,
      marginHorizontal: theme.spacing.xs,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    statValue: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginTop: theme.spacing.sm,
    },
    statLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    section: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
      textTransform: 'uppercase',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingTextContainer: {
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    settingTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    },
    settingDescription: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 2,
      borderColor: theme.colors.error,
    },
    logoutText: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.error,
      marginLeft: theme.spacing.sm,
    },
  });
