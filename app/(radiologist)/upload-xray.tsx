import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getAllPatients } from '@/services/patientService';
import { getAllDoctors } from '@/services/doctorService';
import { uploadXRayImage } from '@/services/storageService';
import { detectAnomalies, analyzeMedicalImage } from '@/services/aiService';
import { createReport } from '@/services/reportService';
import { Patient, Doctor } from '@/types';
import { ArrowLeft, Camera, Image as ImageIcon, Upload, X } from 'lucide-react-native';

export default function UploadXRayScreen() {
  const router = useRouter();
  const { patientId } = useLocalSearchParams();
  const { user } = useAuth();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patientId as string || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [radiologistNotes, setRadiologistNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [patientsData, doctorsData] = await Promise.all([
        getAllPatients(),
        getAllDoctors(),
      ]);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      let result;

      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          alert('Camera permission is required');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          alert('Gallery permission is required');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to select image');
    }
  };

  const handleAnalyzeAndUpload = async () => {
    if (!imageUri || !selectedPatientId || !selectedDoctorId || !user) {
      alert('Please select an image, patient, and doctor');
      return;
    }

    try {
      setAnalyzing(true);

      const anomalies = await detectAnomalies(imageUri);

      const geminiAnalysis = await analyzeMedicalImage(anomalies);

      setUploading(true);
      const imageUrl = await uploadXRayImage(
        imageUri,
        selectedPatientId,
        (progress) => setUploadProgress(progress)
      );

      await createReport(
        selectedPatientId,
        selectedDoctorId,
        imageUrl,
        'xray',
        anomalies,
        geminiAnalysis,
        undefined,
        radiologistNotes
      );

      alert('X-ray analyzed and report sent successfully!');
      router.back();
    } catch (error) {
      console.error('Error processing X-ray:', error);
      alert('Failed to process X-ray. Please try again.');
    } finally {
      setAnalyzing(false);
      setUploading(false);
    }
  };

  const selectedPatient = patients.find(p => p.patientId === selectedPatientId);
  const selectedDoctor = doctors.find(d => d.doctorId === selectedDoctorId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload X-Ray</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {!imageUri ? (
          <Card style={styles.imagePickerCard}>
            <Text style={styles.sectionTitle}>Select X-Ray Image</Text>

            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => pickImage('camera')}
            >
              <Camera size={32} color={colors.primary.main} />
              <Text style={styles.imagePickerText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => pickImage('library')}
            >
              <ImageIcon size={32} color={colors.primary.main} />
              <Text style={styles.imagePickerText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <Card style={styles.imagePreviewCard}>
            <View style={styles.imageHeader}>
              <Text style={styles.sectionTitle}>X-Ray Preview</Text>
              <TouchableOpacity onPress={() => setImageUri(null)}>
                <X size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          </Card>
        )}

        <Card style={styles.selectionCard}>
          <Text style={styles.sectionTitle}>Select Patient</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowPatientModal(true)}
          >
            <Text style={selectedPatient ? styles.selectorTextSelected : styles.selectorTextPlaceholder}>
              {selectedPatient ? selectedPatient.fullName : 'Choose patient'}
            </Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.selectionCard}>
          <Text style={styles.sectionTitle}>Assign to Doctor</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowDoctorModal(true)}
          >
            <Text style={selectedDoctor ? styles.selectorTextSelected : styles.selectorTextPlaceholder}>
              {selectedDoctor ? `Dr. ${selectedDoctor.specialization}` : 'Choose doctor'}
            </Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.notesCard}>
          <Text style={styles.sectionTitle}>Radiologist Notes (Optional)</Text>
          <Input
            value={radiologistNotes}
            onChangeText={setRadiologistNotes}
            multiline
            numberOfLines={4}
            placeholder="Add any additional observations..."
            containerStyle={{ marginBottom: 0 }}
          />
        </Card>

        <Button
          title={analyzing ? 'Analyzing...' : uploading ? `Uploading ${uploadProgress.toFixed(0)}%` : 'Analyze & Send Report'}
          onPress={handleAnalyzeAndUpload}
          loading={analyzing || uploading}
          disabled={!imageUri || !selectedPatientId || !selectedDoctorId}
          style={styles.submitButton}
        />
      </ScrollView>

      <Modal visible={showPatientModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Patient</Text>
            <ScrollView style={styles.modalList}>
              {patients.map((patient) => (
                <TouchableOpacity
                  key={patient.patientId}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedPatientId(patient.patientId);
                    setShowPatientModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{patient.fullName}</Text>
                  <Text style={styles.modalItemSubtext}>{patient.age} years • {patient.gender}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Cancel" onPress={() => setShowPatientModal(false)} variant="outline" />
          </View>
        </View>
      </Modal>

      <Modal visible={showDoctorModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Doctor</Text>
            <ScrollView style={styles.modalList}>
              {doctors.map((doctor) => (
                <TouchableOpacity
                  key={doctor.doctorId}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedDoctorId(doctor.doctorId);
                    setShowDoctorModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>Dr. {doctor.specialization}</Text>
                  <Text style={styles.modalItemSubtext}>{doctor.hospitalName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Cancel" onPress={() => setShowDoctorModal(false)} variant="outline" />
          </View>
        </View>
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
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  imagePickerCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.sm,
  },
  imagePickerText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
  imagePreviewCard: {
    marginBottom: spacing.md,
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
  },
  selectionCard: {
    marginBottom: spacing.md,
  },
  selector: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  selectorTextSelected: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  selectorTextPlaceholder: {
    fontSize: fontSize.md,
    color: colors.text.light,
  },
  notesCard: {
    marginBottom: spacing.md,
  },
  submitButton: {
    marginBottom: spacing.xl,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  modalList: {
    marginBottom: spacing.md,
  },
  modalItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalItemText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    fontWeight: fontWeight.medium,
  },
  modalItemSubtext: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
