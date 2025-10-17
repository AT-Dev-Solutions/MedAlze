import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Modal,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ReportDetail } from '@/components/ReportDetail';
import { ReportCard } from '@/components/ReportCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { Report, Patient, Prescription } from '@/types';
import { FileText, AlertCircle, Search, CheckCircle } from 'lucide-react-native';

interface ReportWithPatient extends Report {
  patientName: string;
}

function DoctorReports() {
  const router = useRouter();
  const { reportId } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [reports, setReports] = React.useState<ReportWithPatient[]>([]);
  const [selectedReport, setSelectedReport] = React.useState<ReportWithPatient | null>(null);
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);
  const [selectedPrescription, setSelectedPrescription] = React.useState<Prescription | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const fetchReports = React.useCallback(async () => {
    if (!user?.userId) return;
    try {
      const [{ getReportsByDoctor }, { getPatientById }] = await Promise.all([
        import('@/services/reportService'),
        import('@/services/patientService')
      ]);

      const reports = await getReportsByDoctor(user.userId);
      
      // Fetch patient names in parallel
      const reportsWithPatients = await Promise.all(
        reports.map(async (report) => {
          const patient = await getPatientById(report.patientId);
          return {
            ...report,
            patientName: patient?.fullName || 'Unknown Patient'
          };
        })
      );

      setReports(reportsWithPatients);
      setError(null);

      // If there's a reportId in the URL params, select that report
      if (reportId) {
        const report = reportsWithPatients.find(r => r.id === reportId);
        if (report) {
          handleReportSelect(report);
        }
      }
    } catch (err: any) {
      console.error('Failed to load reports:', err);
      setError('Failed to load reports');
    }
  }, [user, reportId]);

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

  const handleReportSelect = async (report: ReportWithPatient) => {
    setSelectedReport(report);
    try {
      const [{ getPatientById }, { getPrescriptionByReportId }] = await Promise.all([
        import('@/services/patientService'),
        import('@/services/prescriptionService')
      ]);

      const [patient, prescription] = await Promise.all([
        getPatientById(report.patientId),
        getPrescriptionByReportId(report.id)
      ]);

      setSelectedPatient(patient);
      setSelectedPrescription(prescription);
    } catch (err) {
      console.error('Failed to load report details:', err);
    }
  };

  const handleCreatePrescription = React.useCallback(() => {
    if (selectedReport) {
      // TODO: Implement prescription creation route
      console.log('Creating prescription for report:', selectedReport.id);
      setSelectedReport(null);
    }
  }, [selectedReport]);

  const handleSendToPatient = React.useCallback(async () => {
    if (!selectedReport) return;
    try {
      const { markReportAsCompleted } = await import('@/services/reportService');
      const { createNotification } = await import('@/services/notificationService');
      
      await markReportAsCompleted(selectedReport.id);
      await createNotification(
        selectedReport.patientId,
        'report',
        'Your medical report is ready to view.',
        selectedReport.id
      );
      
      // Update local state
      setReports(current =>
        current.map(r =>
          r.id === selectedReport.id
            ? { ...r, status: 'completed', sentToPatient: true }
            : r
        )
      );
      setSelectedReport(prev => prev ? { ...prev, status: 'completed', sentToPatient: true } : null);
    } catch (err) {
      console.error('Failed to send report to patient:', err);
    }
  }, [selectedReport]);

  const renderReport = ({ item: report }: { item: ReportWithPatient }) => (
    <ReportCard
      report={report}
      onPress={handleReportSelect}
    />
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.centerContent}>
          <AlertCircle size={48} color={colors.primary.main} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadReports}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.centerContent}>
          <FileText size={48} color={colors.text.secondary} />
          <Text style={styles.emptyText}>No reports found</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReport}
          keyExtractor={item => item.id}
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

      <Modal
        visible={!!selectedReport}
        animationType="slide"
        onRequestClose={() => setSelectedReport(null)}
      >
        {selectedReport && (
          <ReportDetail
            report={selectedReport}
            patient={selectedPatient || undefined}
            prescription={selectedPrescription || undefined}
            onCreatePrescription={handleCreatePrescription}
            onSendToPatient={handleSendToPatient}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </Modal>
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
  searchButton: {
    padding: spacing.sm,
  },
  list: {
    padding: spacing.sm,
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
    color: colors.status.error,
    marginTop: spacing.md,
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

export default function WrappedDoctorReports() {
  return (
    <ErrorBoundary>
      <DoctorReports />
    </ErrorBoundary>
  );
}
