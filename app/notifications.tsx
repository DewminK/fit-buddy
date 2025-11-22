import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomModal from '../components/CustomModal';
import { darkTheme, lightTheme } from '../constants/themes';
import { useCustomModal } from '../hooks/useCustomModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearAllNotifications, deleteNotification, markAllAsRead, markAsRead } from '../store/slices/notificationsSlice';

export default function NotificationsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);
  const isDark = useAppSelector((state) => state.theme.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  const { modalConfig, hideModal, showConfirm } = useCustomModal();

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteNotification(id));
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllAsRead());
    }
  };

  const handleClearAll = () => {
    if (notifications.length > 0) {
      showConfirm(
        'Clear All Notifications',
        'Are you sure you want to delete all notifications? This action cannot be undone.',
        () => dispatch(clearAllNotifications()),
        'Clear All',
        'Cancel'
      );
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'favorite':
        return { name: 'heart', color: theme.colors.error };
      case 'workout':
        return { name: 'activity', color: theme.colors.primary };
      case 'achievement':
        return { name: 'award', color: theme.colors.success };
      default:
        return { name: 'bell', color: theme.colors.text };
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderNotification = ({ item }: { item: any }) => {
    const icon = getNotificationIcon(item.type);
    
    return (
      <TouchableOpacity
        style={[
          styles(theme).notificationCard,
          !item.read && styles(theme).unreadCard,
        ]}
        onPress={() => !item.read && handleMarkAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles(theme).iconContainer, { backgroundColor: icon.color + '20' }]}>
          <Feather name={icon.name as any} size={24} color={icon.color} />
        </View>
        
        <View style={styles(theme).notificationContent}>
          <View style={styles(theme).notificationHeader}>
            <Text style={styles(theme).notificationTitle}>{item.title}</Text>
            {!item.read && <View style={styles(theme).unreadDot} />}
          </View>
          <Text style={styles(theme).notificationMessage}>{item.message}</Text>
          <Text style={styles(theme).notificationTime}>{formatTime(item.timestamp)}</Text>
        </View>
        
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles(theme).deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="x" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const styles = createStyles;

  return (
    <SafeAreaView style={styles(theme).container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles(theme).header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles(theme).backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles(theme).headerCenter}>
          <Text style={styles(theme).headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles(theme).headerBadge}>
              <Text style={styles(theme).headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles(theme).headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              style={styles(theme).headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="check-circle" size={22} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles(theme).headerButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="trash-2" size={22} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View style={styles(theme).emptyContainer}>
          <Feather name="bell-off" size={64} color={theme.colors.textSecondary} />
          <Text style={styles(theme).emptyText}>No notifications</Text>
          <Text style={styles(theme).emptySubtext}>
            You'll see notifications when you add favorites or complete workouts
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles(theme).listContent}
        />
      )}

      <CustomModal
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={hideModal}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        isDark={isDark}
      />
    </SafeAreaView>
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
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.xs,
    },
    headerCenter: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
    },
    headerTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    headerBadge: {
      backgroundColor: theme.colors.error,
      borderRadius: 12,
      minWidth: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    headerBadgeText: {
      color: '#FFFFFF',
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.bold,
    },
    headerActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    headerButton: {
      padding: theme.spacing.xs,
    },
    listContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    notificationCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    unreadCard: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    notificationContent: {
      flex: 1,
    },
    notificationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    notificationTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      flex: 1,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginLeft: theme.spacing.xs,
    },
    notificationMessage: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      lineHeight: 20,
    },
    notificationTime: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
    },
    deleteButton: {
      padding: theme.spacing.xs,
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
  });

// Add CustomModal before closing component
// This should be added in the return statement before </SafeAreaView>
