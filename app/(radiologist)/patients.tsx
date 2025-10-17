import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getPatientsByRadiologist } from '@/services/patientService';
import { Patient } from '@/types';
import { User, Search, Upload } from 'lucide-react-native';

export default function PatientsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadPatients();
    }, [user])
  );

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    if (!user) return;

    try {
      console.log('Loading patients for radiologist:', user.userId);
      const data = await getPatientsByRadiologist(user.userId);
      console.log('Loaded patients:', data.length);
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterPatients = () => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter((patient) =>
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPatients();
  };

  const renderPatientCard = ({ item }: { item: Patient }) => (
    <Card style={styles.patientCard}>
      <View style={styles.patientHeader}>
        <View style={styles.patientAvatar}>
          <User size={24} color={colors.primary.main} />
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.fullName}</Text>
          <Text style={styles.patientDetails}>
            {item.age} years • {item.gender}
          </Text>
          <Text style={styles.patientContact}>{item.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => router.push({
            pathname: '/(radiologist)/upload-xray',
            params: { patientId: item.patientId }
          })}
        >
          <Upload size={20} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      {item.bloodGroup && (
        <View style={styles.patientMeta}>
          <Text style={styles.metaLabel}>Blood Group: </Text>
          <Text style={styles.metaValue}>{item.bloodGroup}</Text>
        </View>
      )}

      {item.allergies && (
        <View style={styles.patientMeta}>
          <Text style={styles.metaLabel}>Allergies: </Text>
          <Text style={styles.metaValue}>{item.allergies}</Text>
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patients</Text>
        <Text style={styles.headerSubtitle}>{patients.length} registered</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={colors.text.secondary} style={styles.searchIcon} />
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search patients by name or email"
          containerStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientCard}
        keyExtractor={(item) => item.patientId}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary.main]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <User size={64} color={colors.text.light} />
            <Text style={styles.emptyText}>No patients found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search' : 'Start by registering a patient'}
            </Text>
          </View>
        }
      />
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
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  searchIcon: {
    position: 'absolute',
    left: spacing.xl,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  list: {
    padding: spacing.lg,
  },
  patientCard: {
    marginBottom: spacing.md,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.light + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  patientDetails: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  patientContact: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },
  uploadButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary.light + '20',
  },
  patientMeta: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  metaLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  metaValue: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: fontWeight.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.text.light,
    marginTop: spacing.xs,
  },
});
