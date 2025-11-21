import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { lightTheme, darkTheme } from '../../constants/themes';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: any) => state.auth);
  const isDark = useAppSelector((state: any) => state.theme.isDark);
  const favorites = useAppSelector((state: any) => state.favorites.favorites);
  const theme = isDark ? darkTheme : lightTheme;

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
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
          onPress: async () => {
            await dispatch(logout());
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const styles = createStyles;

  return (
    <ScrollView style={styles(theme).container}>
      {/* Header */}
      <View style={styles(theme).header}>
        <View style={styles(theme).avatarContainer}>
          <Feather name="user" size={48} color={theme.colors.primary} />
        </View>
        <Text style={styles(theme).name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles(theme).email}>{user?.email}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles(theme).statsContainer}>
        <View style={styles(theme).statCard}>
          <Feather name="heart" size={24} color={theme.colors.error} />
          <Text style={styles(theme).statNumber}>{favorites.length}</Text>
          <Text style={styles(theme).statLabel}>Favorites</Text>
        </View>
        <View style={styles(theme).statCard}>
          <Feather name="activity" size={24} color={theme.colors.success} />
          <Text style={styles(theme).statNumber}>0</Text>
          <Text style={styles(theme).statLabel}>Workouts</Text>
        </View>
        <View style={styles(theme).statCard}>
          <Feather name="trending-up" size={24} color={theme.colors.primary} />
          <Text style={styles(theme).statNumber}>0</Text>
          <Text style={styles(theme).statLabel}>Streak</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>Settings</Text>

        <View style={styles(theme).settingCard}>
          <View style={styles(theme).settingLeft}>
            <Feather
              name={isDark ? 'moon' : 'sun'}
              size={22}
              color={theme.colors.text}
            />
            <Text style={styles(theme).settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleToggleTheme}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity style={styles(theme).settingCard}>
          <View style={styles(theme).settingLeft}>
            <Feather name="bell" size={22} color={theme.colors.text} />
            <Text style={styles(theme).settingText}>Notifications</Text>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles(theme).settingCard}>
          <View style={styles(theme).settingLeft}>
            <Feather name="lock" size={22} color={theme.colors.text} />
            <Text style={styles(theme).settingText}>Privacy</Text>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>Account</Text>

        <TouchableOpacity style={styles(theme).settingCard}>
          <View style={styles(theme).settingLeft}>
            <Feather name="edit" size={22} color={theme.colors.text} />
            <Text style={styles(theme).settingText}>Edit Profile</Text>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles(theme).settingCard}>
          <View style={styles(theme).settingLeft}>
            <Feather name="help-circle" size={22} color={theme.colors.text} />
            <Text style={styles(theme).settingText}>Help & Support</Text>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles(theme).settingCard}>
          <View style={styles(theme).settingLeft}>
            <Feather name="info" size={22} color={theme.colors.text} />
            <Text style={styles(theme).settingText}>About</Text>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles(theme).logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Feather name="log-out" size={20} color="#FFFFFF" />
        <Text style={styles(theme).logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles(theme).version}>FitBuddy v1.0.0</Text>
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
      paddingTop: theme.spacing.xl * 1.5,
    },
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primary + '20',
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
    email: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    statCard: {
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      flex: 1,
      marginHorizontal: theme.spacing.xs,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statNumber: {
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
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    settingCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
    },
    logoutButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.error,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    logoutText: {
      color: '#FFFFFF',
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      marginLeft: theme.spacing.sm,
    },
    version: {
      textAlign: 'center',
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
    },
  });
