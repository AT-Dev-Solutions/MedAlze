import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/constants/theme';
import type { Report, Patient, Prescription } from '@/types';
import { Card } from './Card';
import { Button } from './Button';
import {
  FileText,
  User,
  AlertCircle,
  CheckCircle,
  Edit3,
  Send,
  PlusCircle,
} from 'lucide-react-native';

interface ReportDetailProps {
  report: Report;
  patient?: Patient;
  prescription?: Prescription;
  onCreatePrescription: () => void;
  onSendToPatient: () => void;
  onClose: () => void;
}

export const ReportDetail: React.FC<ReportDetailProps> = ({
  report,
  patient,
  prescription,
  onCreatePrescription,
  onSendToPatient,
  onClose,
}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.title}>X-Ray Report</Text>
        <View style={[styles.statusBadge, {
          backgroundColor: report.status === 'completed' 
            ? colors.primary.main + '20'
            : colors.secondary.main + '20'
        }]}>
          {report.status === 'completed' ? (
            <CheckCircle size={16} color={colors.primary.main} />
          ) : (
            <AlertCircle size={16} color={colors.secondary.main} />
          )}
          <Text style={[styles.statusText, {
            color: report.status === 'completed' ? colors.primary.main : colors.secondary.main
          }]}>
            {report.status}
          </Text>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: report.imageUrl }}
          style={styles.xrayImage}
          resizeMode="contain"
        />
      </View>

      {patient && (
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color={colors.text.primary} />
            <Text style={styles.sectionTitle}>Patient Information</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{patient.fullName}</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{patient.age} years</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{patient.gender}</Text>
          </View>
          {patient.medicalHistory && (
            <View style={styles.patientInfo}>
              <Text style={styles.label}>Medical History:</Text>
              <Text style={styles.value}>{patient.medicalHistory}</Text>
            </View>
          )}
        </Card>
      )}

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <AlertCircle size={20} color={colors.text.primary} />
          <Text style={styles.sectionTitle}>AI Analysis</Text>
        </View>
        <Text style={styles.analysisText}>{report.geminiAnalysis}</Text>
        
        {report.detectedAnomalies && report.detectedAnomalies.length > 0 && (
          <View style={styles.anomalies}>
            <Text style={styles.subsectionTitle}>Detected Anomalies:</Text>
            {report.detectedAnomalies.map((anomaly, index) => (
              <View key={index} style={styles.anomalyItem}>
                <Text style={styles.anomalyType}>{anomaly.type}</Text>
                <Text style={styles.anomalyLocation}>Location: {anomaly.location}</Text>
                <Text style={styles.anomalyConfidence}>
                  Confidence: {(anomaly.confidence * 100).toFixed(1)}%
                </Text>
                <Text style={styles.anomalyDescription}>{anomaly.description}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {(report.findings || report.recommendations) && (
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color={colors.text.primary} />
            <Text style={styles.sectionTitle}>Radiologist Notes</Text>
          </View>
          {report.findings && (
            <>
              <Text style={styles.label}>Findings:</Text>
              <Text style={styles.notesText}>{report.findings}</Text>
            </>
          )}
          {report.recommendations && (
            <>
              <Text style={styles.label}>Recommendations:</Text>
              <Text style={styles.notesText}>{report.recommendations}</Text>
            </>
          )}
        </Card>
      )}

      {prescription ? (
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Edit3 size={20} color={colors.text.primary} />
            <Text style={styles.sectionTitle}>Prescription</Text>
          </View>
          <View style={styles.prescriptionContent}>
            <Text style={styles.label}>Diagnosis:</Text>
            <Text style={styles.value}>{prescription.diagnosis}</Text>

            <Text style={styles.label}>Medications:</Text>
            {prescription.medications.map((med, index) => (
              <View key={index} style={styles.medicationItem}>
                <Text style={styles.medicationName}>{med.name}</Text>
                <Text style={styles.medicationDetails}>
                  {med.dosage} - {med.frequency} for {med.duration}
                </Text>
              </View>
            ))}

            <Text style={styles.label}>Precautions:</Text>
            <Text style={styles.value}>{prescription.precautions}</Text>
          </View>
        </Card>
      ) : (
        <View style={styles.actionButtons}>
          <Button
            title="Create Prescription"
            onPress={onCreatePrescription}
            icon={<PlusCircle size={20} color={colors.text.white} />}
          />
        </View>
      )}

      {report.status === 'completed' && !report.sentToPatient && (
        <View style={styles.actionButtons}>
          <Button
            title="Send to Patient"
            onPress={onSendToPatient}
            icon={<Send size={20} color={colors.text.white} />}
            variant="secondary"
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.primary,
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeText: {
    color: colors.primary.main,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: colors.background.card,
    marginBottom: spacing.md,
  },
  xrayImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  patientInfo: {
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  value: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  analysisText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    lineHeight: 24,
  },
  anomalies: {
    marginTop: spacing.md,
  },
  subsectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  anomalyItem: {
    backgroundColor: colors.background.secondary,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  anomalyType: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  anomalyLocation: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  anomalyConfidence: {
    fontSize: fontSize.sm,
    color: colors.primary.main,
    marginBottom: 2,
  },
  anomalyDescription: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    marginTop: 4,
  },
  notesText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    lineHeight: 24,
  },
  prescriptionContent: {
    gap: spacing.md,
  },
  medicationItem: {
    backgroundColor: colors.background.secondary,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  medicationName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  medicationDetails: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  actionButtons: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});