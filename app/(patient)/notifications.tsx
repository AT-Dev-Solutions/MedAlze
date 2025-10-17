import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { Notification } from '@/types';
import {
  AlertCircle,
  Bell,
  Calendar,
  FileText,
  ClipboardList,
} from 'lucide-react-native';

function PatientNotifications() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const fetchNotifications = React.useCallback(async () => {
    if (!user?.userId) return;
    try {
      const { getNotificationsByUser, markNotificationsAsRead } = await import('@/services/notificationService');
      const fetchedNotifications = await getNotificationsByUser(user.userId);
      setNotifications(fetchedNotifications);

      // Mark notifications as read
      const unreadIds = fetchedNotifications
        .filter(n => !n.isRead)
        .map(n => n.id);
      
      if (unreadIds.length > 0) {
        await markNotificationsAsRead(unreadIds);
      }

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FileText size={24} color={colors.primary.main} />;
      case 'appointment':
        return <Calendar size={24} color={colors.secondary.main} />;
      case 'prescription':
        return <ClipboardList size={24} color={colors.primary.main} />;
      default:
        return <Bell size={24} color={colors.primary.main} />;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const renderNotification = ({ item }: { item: Notification }) => (
    <Card style={{
      ...styles.notificationCard,
      ...(item.isRead ? {} : styles.unreadCard)
    }}>
      <View style={styles.notificationContent}>
        <View style={styles.notificationIcon}>
          {getNotificationIcon(item.type)}
        </View>
        <View style={styles.notificationInfo}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationBody}>{item.body}</Text>
          <Text style={styles.notificationTime}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color={colors.status.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadNotifications}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Bell size={48} color={colors.text.secondary} />
          <Text style={styles.emptyText}>No notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
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
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  list: {
    padding: spacing.md,
  },
  notificationCard: {
    marginBottom: spacing.md,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  notificationContent: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.main + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  notificationTime: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.status.error,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    fontSize: fontSize.md,
    color: colors.text.white,
    fontWeight: fontWeight.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});

export default function WrappedPatientNotifications() {
  return (
    <ErrorBoundary>
      <PatientNotifications />
    </ErrorBoundary>
  );
}
