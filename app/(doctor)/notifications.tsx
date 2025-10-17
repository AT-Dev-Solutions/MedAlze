import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import type { Notification } from '@/types';
import { Bell, ChevronRight, AlertTriangle } from 'lucide-react-native';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface NotificationSection {
  title: string;
  data: Notification[];
}

function DoctorNotifications() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const fetchNotifications = React.useCallback(async () => {
    if (!user?.userId) return;
    try {
      const { getNotificationsByUser } = await import('@/services/notificationService');
      const data = await getNotificationsByUser(user.userId);
      setNotifications(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load notifications:', err);
      setError('Failed to load notifications');
    }
  }, [user]);

  const loadNotifications = React.useCallback(async () => {
    setLoading(true);
    await fetchNotifications();
    setLoading(false);
  }, [fetchNotifications]);

  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, [fetchNotifications]);

  const handleNotificationPress = React.useCallback(async (notification: Notification) => {
    try {
      const { markNotificationsAsRead } = await import('@/services/notificationService');
      await markNotificationsAsRead([notification.id]);
      
      // Update local state
      setNotifications(current =>
        current.map(n =>
          n.id === notification.id
            ? { ...n, isRead: true }
            : n
        )
      );

      // Navigate to report if reportId exists
      if (notification.reportId) {
        router.push({
          pathname: '/(doctor)/reports',
          params: { reportId: notification.reportId }
        });
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, [router]);

  const groupNotificationsByDate = (notifications: Notification[]): NotificationSection[] => {
    const groups = notifications.reduce((acc: { [key: string]: Notification[] }, notification) => {
      const date = notification.createdAt;
      if (!date) return acc;

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey: string;
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else if (date.getFullYear() === today.getFullYear()) {
        dateKey = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
      } else {
        dateKey = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      }

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(notification);
      return acc;
    }, {});

    return Object.entries(groups).map(([title, data]) => ({
      title,
      data: data.sort((a, b) => 
        (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
      )
    }));
  };

  const getNotificationIcon = (type: Notification['type'], isRead: boolean) => {
    const color = isRead ? colors.text.secondary : colors.primary.main;
    switch (type) {
      case 'new_report':
        return <AlertTriangle size={24} color={color} />;
      default:
        return <Bell size={24} color={color} />;
    }
  };

  const renderNotification = ({ item: notification }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationIcon}>
        {getNotificationIcon(notification.type, notification.isRead)}
      </View>
      <View style={styles.notificationContent}>
        <Text style={[
          styles.notificationMessage,
          !notification.isRead && styles.unreadText
        ]}>
          {notification.message}
        </Text>
        <Text style={styles.notificationTime}>
          {notification.createdAt?.toLocaleTimeString()}
        </Text>
      </View>
      {notification.reportId && (
        <ChevronRight size={20} color={colors.text.secondary} />
      )}
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }: { section: NotificationSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  const sections = groupNotificationsByDate(notifications);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {notifications.some(n => !n.isRead) && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {notifications.filter(n => !n.isRead).length}
            </Text>
          </View>
        )}
      </View>

      {error ? (
        <View style={styles.centerContent}>
          <AlertTriangle size={48} color={colors.primary.main} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadNotifications}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centerContent}>
          <Bell size={48} color={colors.text.secondary} />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          renderItem={renderNotification}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary.main]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  list: {
    paddingVertical: spacing.sm,
  },
  sectionHeader: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  unreadNotification: {
    backgroundColor: colors.primary.main + '10',
  },
  notificationIcon: {
    marginRight: spacing.md,
  },
  notificationContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  notificationMessage: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: fontWeight.semibold,
  },
  notificationTime: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  unreadBadge: {
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  unreadBadgeText: {
    color: colors.text.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: fontSize.md,
    color: 'red',
    marginBottom: spacing.md,
  },
  retryButton: {
    padding: spacing.md,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.sm,
  },
  retryText: {
    color: colors.text.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});

export default function WrappedDoctorNotifications() {
  return (
    <ErrorBoundary>
      <DoctorNotifications />
    </ErrorBoundary>
  );
}
