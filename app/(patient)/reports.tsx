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
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { Report } from '@/types';
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Eye,
} from 'lucide-react-native';

interface ReportWithDoctor extends Report {
  doctorName: string;
}

function PatientReports() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [reports, setReports] = React.useState<ReportWithDoctor[]>([]);

  const fetchReports = React.useCallback(async () => {
    if (!user?.userId) return;
    try {
      const { getReportsByPatient, getDoctor } = await import('@/services/reportService');
      const fetchedReports = await getReportsByPatient(user.userId);

      // Add doctor name to each report
      const reportsWithDoctors = await Promise.all(
        fetchedReports.map(async (report) => {
          const doctor = await getDoctor(report.doctorId);
          return {
            ...report,
            doctorName: doctor?.displayName || 'Unknown Doctor',
          };
        })
      );

      setReports(reportsWithDoctors);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load reports:', err);
      setError('Failed to load reports');
    }
  }, [user]);

  const loadReports = React.useCallback(async () => {
    setLoading(true);
    await fetchReports();
    setLoading(false);
  }, [fetchReports]);

  React.useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  }, [fetchReports]);

  const handleViewReport = (reportId: string) => {
    // Navigate to report detail view
    router.push({
      pathname: "/report-detail",
      params: { id: reportId }
    } as any);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const renderReport = ({ item }: { item: ReportWithDoctor }) => (
    <Card style={styles.reportCard}>
      <TouchableOpacity
        style={styles.reportContent}
        onPress={() => handleViewReport(item.id)}
      >
        <View style={styles.reportHeader}>
          <View style={styles.reportIcon}>
            <FileText size={24} color={colors.primary.main} />
          </View>
          <View style={styles.reportInfo}>
            <Text style={styles.reportTitle}>X-Ray Report</Text>
            <Text style={styles.reportDoctor}>Dr. {item.doctorName}</Text>
          </View>
          <View style={[styles.statusBadge, {
            backgroundColor: item.status === 'completed'
              ? colors.status.success + '20'
              : colors.status.warning + '20'
          }]}>
            <Text style={[styles.statusText, {
              color: item.status === 'completed'
                ? colors.status.success
                : colors.status.warning
            }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.reportMeta}>
          <Text style={styles.reportDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewReport(item.id)}
          >
            <Eye size={16} color={colors.primary.main} />
            <Text style={styles.viewButtonText}>View Report</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Reports</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color={colors.status.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadReports}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FileText size={48} color={colors.text.secondary} />
          <Text style={styles.emptyText}>No reports found</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReport}
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
  reportCard: {
    marginBottom: spacing.md,
  },
  reportContent: {
    padding: spacing.md,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.main + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  reportDoctor: {
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
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  reportDate: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: fontSize.sm,
    color: colors.primary.main,
    marginLeft: spacing.xs,
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

export default function WrappedPatientReports() {
  return (
    <ErrorBoundary>
      <PatientReports />
    </ErrorBoundary>
  );
}
