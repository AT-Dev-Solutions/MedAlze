import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import type { Report, Patient } from '@/types';
import { LogOut } from 'lucide-react-native';

export default function DoctorDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [reports, setReports] = React.useState<Report[]>([]);
  const [patientNames, setPatientNames] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState<string | null>(null);

  const fetchReports = React.useCallback(async () => {
    if (!user?.userId) return;
    setLoading(true);
    setError(null);
    try {
      const { getReportsByDoctor } = await import('@/services/reportService');
      const docs = await getReportsByDoctor(user.userId);
      setReports(docs);
      
      // Fetch patient names for recent reports
      const recent = docs.slice(0, 5);
      const { getPatientById } = await import('@/services/patientService');
      const names: Record<string, string> = {};
      
      await Promise.all(
        recent.map(async (report) => {
          try {
            const patient = await getPatientById(report.patientId);
            if (patient) {
              names[report.patientId] = patient.fullName;
            }
          } catch (err) {
            console.error('Failed to load patient name:', err);
          }
        })
      );
      
      setPatientNames(names);
    } catch (err: any) {
      console.error('Failed to load reports for doctor dashboard', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const completedCount = reports.filter(r => r.status === 'completed').length;

  const recent = reports.slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, Dr.</Text>
          <Text style={styles.userName}>{user?.displayName}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut}>
          <LogOut size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(doctor)/reports')}
          >
            <Text style={styles.actionText}>View all</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.recentCard}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>

          {loading ? (
            <LoadingScreen />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : recent.length === 0 ? (
            <Text style={styles.emptyText}>No reports assigned yet.</Text>
          ) : (
            recent.map(report => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportRow}
                onPress={() => router.push({
                  pathname: '/(doctor)/reports',
                  params: { reportId: report.id }
                })}
              >
                <View style={styles.reportLeft}>
                  <Text style={styles.reportPatient} numberOfLines={1}>
                    {patientNames[report.patientId] || 'Loading patient...'}
                  </Text>
                  <Text style={styles.reportMeta}>{report.createdAt ? new Date(report.createdAt).toLocaleString() : ''}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  report.status === 'completed' ? styles.statusCompleted : styles.statusPending
                ]}>
                  <Text style={[
                    styles.reportStatus,
                    report.status === 'completed' ? styles.statusCompletedText : styles.statusPendingText
                  ]}>
                    {report.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Card>

        <View style={styles.buttonsRow}>
          <Button title="Reports" onPress={() => router.push('/(doctor)/reports')} />
          <Button title="Notifications" onPress={() => router.push('/(doctor)/notifications')} variant="secondary" />
        </View>
      </View>
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
  greeting: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  body: {
    flex: 1,
    padding: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    padding: spacing.md,
    marginRight: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  actionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary.main,
    borderRadius: 8,
    marginLeft: spacing.sm,
  },
  actionText: {
    color: colors.text.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  recentCard: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    color: colors.text.secondary,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  borderBottomColor: '#eee',
  },
  reportLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  reportPatient: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    fontWeight: fontWeight.semibold,
  },
  reportMeta: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: colors.primary.main + '20',
  },
  statusPending: {
    backgroundColor: colors.secondary.main + '20',
  },
  reportStatus: {
    fontSize: fontSize.sm,
    textTransform: 'capitalize',
  },
  statusCompletedText: {
    color: colors.primary.main,
  },
  statusPendingText: {
    color: colors.secondary.main,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
});
