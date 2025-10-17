import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { Report, Prescription } from '@/types';
import {
  LogOut,
  FileText,
  Bell,
  ClipboardList,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react-native';

interface ReportWithPatient extends Report {
  patientName: string;
}

function PatientDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [reports, setReports] = React.useState<ReportWithPatient[]>([]);
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const [unreadNotifications, setUnreadNotifications] = React.useState(0);

  const fetchDashboardData = React.useCallback(async () => {
    if (!user?.userId) return;
    try {
      const [{ getReportsByPatient }, { getPrescriptionsByPatient }, { getUnreadNotificationCount }] = await Promise.all([
        import('@/services/reportService'),
        import('@/services/prescriptionService'),
        import('@/services/notificationService')
      ]);

      const [fetchedReports, fetchedPrescriptions, notificationCount] = await Promise.all([
        getReportsByPatient(user.userId),
        getPrescriptionsByPatient(user.userId),
        getUnreadNotificationCount(user.userId)
      ]);

      // Add patient name to reports
      const reportsWithPatient = fetchedReports.map(report => ({
        ...report,
        patientName: user.displayName || 'Unknown Patient'
      }));

      setReports(reportsWithPatient);
      setPrescriptions(fetchedPrescriptions);
      setUnreadNotifications(notificationCount);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data');
    }
  }, [user]);

  const loadDashboardData = React.useCallback(async () => {
    setLoading(true);
    await fetchDashboardData();
    setLoading(false);
  }, [fetchDashboardData]);

  React.useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, [fetchDashboardData]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const latestPrescription = prescriptions[0];
  const latestReport = reports[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.userName}>{user?.displayName}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <LogOut size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary.main]}
          />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <AlertCircle size={48} color={colors.status.error} />
            <Text style={styles.errorText}>{error}</Text>
            <Button
              title="Retry"
              onPress={loadDashboardData}
              variant="primary"
            />
          </View>
        ) : (
          <>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/(patient)/reports')}
              >
                <FileText size={32} color={colors.primary.main} />
                <Text style={styles.actionTitle}>Reports</Text>
                <Text style={styles.actionCount}>
                  {pendingReports > 0 ? `${pendingReports} pending` : 'All reviewed'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/(patient)/notifications')}
              >
                <Bell size={32} color={colors.secondary.main} />
                <Text style={styles.actionTitle}>Notifications</Text>
                <Text style={styles.actionCount}>
                  {unreadNotifications > 0 ? `${unreadNotifications} unread` : 'All read'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push("/prescriptions" as any)}
              >
                <ClipboardList size={32} color={colors.primary.main} />
                <Text style={styles.actionTitle}>Prescriptions</Text>
                <Text style={styles.actionCount}>
                  {prescriptions.length} total
                </Text>
              </TouchableOpacity>
            </View>

            {latestReport && (
              <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Latest Report</Text>
                  <TouchableOpacity
                    onPress={() => router.push('/(patient)/reports')}
                    style={styles.seeAllButton}
                  >
                    <Text style={styles.seeAllText}>See all</Text>
                    <ArrowRight size={16} color={colors.primary.main} />
                  </TouchableOpacity>
                </View>

                <View style={styles.reportCard}>
                  <View style={styles.reportStatus}>
                    {latestReport.status === 'completed' ? (
                      <CheckCircle size={20} color={colors.primary.main} />
                    ) : (
                      <AlertCircle size={20} color={colors.secondary.main} />
                    )}
                  </View>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportTitle}>X-Ray Report</Text>
                    <Text style={styles.reportDate}>
                      {latestReport.createdAt?.toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, {
                    backgroundColor: latestReport.status === 'completed'
                      ? colors.primary.main + '20'
                      : colors.secondary.main + '20'
                  }]}>
                    <Text style={[styles.statusText, {
                      color: latestReport.status === 'completed'
                        ? colors.primary.main
                        : colors.secondary.main
                    }]}>
                      {latestReport.status}
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            {latestPrescription && (
              <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Latest Prescription</Text>
                  <TouchableOpacity
                    onPress={() => router.push("/prescriptions" as any)}
                    style={styles.seeAllButton}
                  >
                    <Text style={styles.seeAllText}>See all</Text>
                    <ArrowRight size={16} color={colors.primary.main} />
                  </TouchableOpacity>
                </View>

                <View style={styles.prescriptionContent}>
                  <Text style={styles.prescriptionTitle}>{latestPrescription.diagnosis}</Text>
                  {latestPrescription.medications.length > 0 && (
                    <View style={styles.medicationList}>
                      {latestPrescription.medications.slice(0, 2).map((med, index) => (
                        <Text key={index} style={styles.medicationItem}>
                          • {med.name}: {med.dosage}
                        </Text>
                      ))}
                      {latestPrescription.medications.length > 2 && (
                        <Text style={styles.moreMeds}>
                          +{latestPrescription.medications.length - 2} more medications
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </Card>
            )}
          </>
        )}
      </ScrollView>
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
  greeting: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  signOutButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.sm,
    marginBottom: 2,
  },
  actionCount: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: fontSize.sm,
    color: colors.primary.main,
    marginRight: 4,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  reportStatus: {
    marginRight: spacing.sm,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  reportDate: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textTransform: 'capitalize',
  },
  prescriptionContent: {
    backgroundColor: colors.background.secondary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  prescriptionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  medicationList: {
    marginTop: spacing.xs,
  },
  medicationItem: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    marginBottom: 2,
  },
  moreMeds: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
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
});

export default function WrappedPatientDashboard() {
  return (
    <ErrorBoundary>
      <PatientDashboard />
    </ErrorBoundary>
  );
}
