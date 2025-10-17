import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getPatientsByRadiologist } from '@/services/patientService';
import { getReportsByRadiologist } from '@/services/reportService';
import { Users, FileText, Upload, LogOut } from 'lucide-react-native';

export default function RadiologistDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalReports: 0,
    pendingReports: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    if (!user) return;

    try {
      const patients = await getPatientsByRadiologist(user.userId);
      const reports = await getReportsByRadiologist(user.userId);
      const pending = reports.filter((r: { status: string }) => r.status === 'pending').length;

      setStats({
        totalPatients: patients.length,
        totalReports: reports.length,
        pendingReports: pending,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.displayName}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut}>
          <LogOut size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Users size={32} color={colors.primary.main} />
          </View>
          <Text style={styles.statValue}>{stats.totalPatients}</Text>
          <Text style={styles.statLabel}>Total Patients</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <FileText size={32} color={colors.secondary.main} />
          </View>
          <Text style={styles.statValue}>{stats.totalReports}</Text>
          <Text style={styles.statLabel}>Reports Generated</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Upload size={32} color={colors.accent.main} />
          </View>
          <Text style={styles.statValue}>{stats.pendingReports}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>
      </View>

      <Card style={styles.actionCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <Button
          title="Register New Patient"
          onPress={() => router.push('/(radiologist)/register-patient')}
          style={styles.actionButton}
        />

        <Button
          title="Upload X-Ray for Analysis"
          onPress={() => router.push('/(radiologist)/upload-xray')}
          variant="secondary"
          style={styles.actionButton}
        />

        <Button
          title="View All Patients"
          onPress={() => router.push('/(radiologist)/patients')}
          variant="outline"
        />
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          1. Register patients in the system{'\n'}
          2. Upload X-ray images for AI analysis{'\n'}
          3. Review AI-generated insights{'\n'}
          4. Assign reports to doctors for prescription
        </Text>
      </Card>
    </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  actionCard: {
    margin: spacing.lg,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  infoCard: {
    margin: spacing.lg,
    marginTop: 0,
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 24,
  },
});
