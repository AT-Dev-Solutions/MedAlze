import { Tabs } from 'expo-router';
import { Hop as Home, FileText, Bell } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { View } from 'react-native';
import { NotificationBadge } from '@/components/NotificationBadge';
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications';

export default function DoctorLayout() {
  const { unreadCount } = useUnreadNotifications();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ size, color }) => <FileText size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ size, color }) => (
            <View>
              <Bell size={size} color={color} />
              <NotificationBadge count={unreadCount} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
