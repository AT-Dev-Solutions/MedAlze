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
import { useLocalSearchParams } from 'expo-router';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Card } from '@/components/Card';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { Prescription } from '@/types';
import { ClipboardList, AlertCircle, Search, Filter, Clock, CheckCircle } from 'lucide-react-native';

function PatientPrescriptions() {
  const { reportId } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = React.useState<Prescription | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const fetchPrescriptions = React.useCallback(async () => {
    if (!user?.userId) return;
    try {
      const { getPrescriptionsByPatient } = await import('@/services/prescriptionService');
      const data = await getPrescriptionsByPatient(user.userId);
      setPrescriptions(data);
      setError(null);

      // If there's a reportId in the URL params, select that prescription
      if (reportId) {
        const reportIdStr = Array.isArray(reportId) ? reportId[0] : reportId;
        const { getPrescriptionByReportId } = await import('@/services/prescriptionService');
        const prescription = await getPrescriptionByReportId(reportIdStr);
        if (prescription) {
          setSelectedPrescription(prescription);
        }
      }
    } catch (err: any) {
      console.error('Failed to load prescriptions:', err);
      setError('Failed to load prescriptions');
    }
  }, [user, reportId]);

  const loadPrescriptions = React.useCallback(async () => {
    setLoading(true);
    await fetchPrescriptions();
    setLoading(false);
  }, [fetchPrescriptions]);

  React.useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchPrescriptions();
    setRefreshing(false);
  }, [fetchPrescriptions]);

  const renderPrescription = ({ item: prescription }: { item: Prescription }) => (
    <Card style={styles.prescriptionCard}>
      <View style={styles.prescriptionHeader}>
        <View style={styles.prescriptionIcon}>
          <ClipboardList size={24} color={colors.primary.main} />
        </View>
        <View style={styles.prescriptionInfo}>
          <Text style={styles.diagnosis} numberOfLines={1}>
            {prescription.diagnosis}
          </Text>
          <View style={styles.dateRow}>
            <Clock size={16} color={colors.text.secondary} />
            <Text style={styles.date}>
              {prescription.createdAt?.toLocaleDateString()}
            </Text>
          </View>
        </View>
        <CheckCircle size={20} color={colors.primary.main} />
      </View>

      <View style={styles.medications}>
        {prescription.medications.slice(0, 2).map((med, index) => (
          <View key={index} style={styles.medication}>
            <Text style={styles.medicationName}>{med.name}</Text>
            <Text style={styles.medicationDetails}>
              {med.dosage} - {med.frequency} for {med.duration}
            </Text>
          </View>
        ))}
        {prescription.medications.length > 2 && (
          <Text style={styles.moreMeds}>
            +{prescription.medications.length - 2} more medications
          </Text>
        )}
      </View>

      {prescription.precautions && (
        <View style={styles.precautions}>
          <Text style={styles.precautionsLabel}>Precautions:</Text>
          <Text style={styles.precautionsText} numberOfLines={2}>
            {prescription.precautions}
          </Text>
        </View>
      )}
    </Card>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prescriptions</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {error ? (
        <View style={styles.centerContent}>
          <AlertCircle size={48} color={colors.status.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadPrescriptions}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : prescriptions.length === 0 ? (
        <View style={styles.centerContent}>
          <ClipboardList size={48} color={colors.text.secondary} />
          <Text style={styles.emptyText}>No prescriptions found</Text>
        </View>
      ) : (
        <FlatList
          data={prescriptions}
          renderItem={renderPrescription}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  iconButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  list: {
    padding: spacing.sm,
  },
  prescriptionCard: {
    marginBottom: spacing.md,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  prescriptionIcon: {
    marginRight: spacing.md,
  },
  prescriptionInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  diagnosis: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  medications: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: spacing.sm,
  },
  medication: {
    marginBottom: spacing.sm,
  },
  medicationName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  medicationDetails: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  moreMeds: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  precautions: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.status.warning + '10',
    borderRadius: borderRadius.sm,
  },
  precautionsLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    marginBottom: 2,
  },
  precautionsText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
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

export default function WrappedPatientPrescriptions() {
  return (
    <ErrorBoundary>
      <PatientPrescriptions />
    </ErrorBoundary>
  );
}