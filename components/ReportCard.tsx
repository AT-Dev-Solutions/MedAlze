import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/constants/theme';
import type { Report, Patient } from '@/types';
import { FileText, User, Clock, CheckCircle, AlertCircle } from 'lucide-react-native';

interface ReportWithPatient extends Report {
  patientName: string;
}

interface ReportCardProps {
  report: ReportWithPatient;
  onPress: (report: ReportWithPatient) => void;
  style?: any;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onPress,
  style,
}) => {
  const getStatusColor = () => {
    switch (report.status) {
      case 'completed':
        return colors.primary.main;
      case 'pending':
        return colors.secondary.main;
      default:
        return colors.text.secondary;
    }
  };

  const StatusIcon = report.status === 'completed' ? CheckCircle : AlertCircle;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress(report)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: report.imageUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.patientName} numberOfLines={1}>
            {report.patientName}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
            <StatusIcon size={16} color={getStatusColor()} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {report.status}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Clock size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>
              {report.createdAt?.toLocaleDateString()}
            </Text>
          </View>
          {report.detectedAnomalies && report.detectedAnomalies.length > 0 && (
            <View style={styles.detail}>
              <FileText size={16} color={colors.text.secondary} />
              <Text style={styles.detailText}>
                {report.detectedAnomalies.length} findings
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
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
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  patientName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
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
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginLeft: 4,
  },
});