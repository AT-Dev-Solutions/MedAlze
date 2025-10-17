import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { registerPatient } from '@/services/patientService';
import { ArrowLeft } from 'lucide-react-native';

export default function RegisterPatient() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    contactNumber: '',
    email: '',
    medicalHistory: '',
    bloodGroup: '',
    allergies: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.age || parseInt(formData.age) <= 0) {
      newErrors.age = 'Valid age is required';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !user) return;

    try {
      setLoading(true);

      const patientData = {
        registeredBy: user.userId,
        fullName: formData.fullName,
        age: parseInt(formData.age),
        gender: formData.gender,
        contactNumber: formData.contactNumber,
        email: formData.email,
        medicalHistory: formData.medicalHistory,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies,
      };

      console.log('Registering patient with data:', patientData);
      const patientId = await registerPatient(patientData);
      console.log('Patient registered successfully with ID:', patientId);

      alert('Patient registered successfully!');
      router.back();
    } catch (error) {
      console.error('Error registering patient:', error);
      alert('Failed to register patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register Patient</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <Input
            label="Full Name *"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            placeholder="Enter patient's full name"
            error={errors.fullName}
          />

          <Input
            label="Age *"
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            placeholder="Enter age"
            keyboardType="numeric"
            error={errors.age}
          />

          <Text style={styles.inputLabel}>Gender *</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.gender === 'male' && styles.genderButtonSelected,
              ]}
              onPress={() => setFormData({ ...formData, gender: 'male' })}
            >
              <Text
                style={[
                  styles.genderText,
                  formData.gender === 'male' && styles.genderTextSelected,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.gender === 'female' && styles.genderButtonSelected,
              ]}
              onPress={() => setFormData({ ...formData, gender: 'female' })}
            >
              <Text
                style={[
                  styles.genderText,
                  formData.gender === 'female' && styles.genderTextSelected,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.gender === 'other' && styles.genderButtonSelected,
              ]}
              onPress={() => setFormData({ ...formData, gender: 'other' })}
            >
              <Text
                style={[
                  styles.genderText,
                  formData.gender === 'other' && styles.genderTextSelected,
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <Input
            label="Contact Number *"
            value={formData.contactNumber}
            onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            error={errors.contactNumber}
          />

          <Input
            label="Email Address *"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Medical Information</Text>

          <Input
            label="Blood Group"
            value={formData.bloodGroup}
            onChangeText={(text) => setFormData({ ...formData, bloodGroup: text })}
            placeholder="e.g., A+, O-, AB+"
          />

          <Input
            label="Allergies"
            value={formData.allergies}
            onChangeText={(text) => setFormData({ ...formData, allergies: text })}
            placeholder="List any known allergies"
            multiline
            numberOfLines={2}
          />

          <Input
            label="Medical History"
            value={formData.medicalHistory}
            onChangeText={(text) => setFormData({ ...formData, medicalHistory: text })}
            placeholder="Brief medical history"
            multiline
            numberOfLines={4}
          />
        </Card>

        <Button
          title="Register Patient"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
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
  formCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  genderButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  genderButtonSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + '10',
  },
  genderText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  genderTextSelected: {
    color: colors.primary.main,
    fontWeight: fontWeight.semibold,
  },
  submitButton: {
    marginBottom: spacing.xl,
  },
});
