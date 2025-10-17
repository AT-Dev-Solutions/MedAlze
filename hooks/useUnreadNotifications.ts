import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useUnreadNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchUnreadCount = useCallback(async () => {
    if (!user?.userId) {
      setUnreadCount(0);
      return;
    }

    try {
      const { getUnreadNotificationCount } = await import('@/services/notificationService');
      const count = await getUnreadNotificationCount(user.userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread notifications count:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchUnreadCount();
    // Set up polling for unread count
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    refresh: fetchUnreadCount
  };
}