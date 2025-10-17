import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { createUserProfile, signInWithGoogle, signInWithApple, useGoogleAuth } from '@/services/authService';
import { UserRole } from '@/types';
import { Stethoscope, Activity, User } from 'lucide-react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

export default function OnboardingScreen() {
  const router = useRouter();
  const { firebaseUser, refreshUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAppleSignInAvailable, setIsAppleSignInAvailable] = useState(false);

  const [request, response, promptAsync] = useGoogleAuth();

  const [doctorData, setDoctorData] = useState({
    specialization: '',
    licenseNumber: '',
    hospitalName: '',
    experience: '',
  });

  const [radiologistData, setRadiologistData] = useState({
    licenseNumber: '',
    certification: '',
    hospital: '',
  });

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setIsAppleSignInAvailable);
    }
  }, []);

  useEffect(() => {
    if (response?.type === 'success' && !firebaseUser) {
      handleGoogleSignIn();
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const userProfile = await signInWithGoogle(response);

      if (userProfile && firebaseUser) {
        await refreshUser();
        navigateToRole(userProfile.role);
      } else if (firebaseUser && !userProfile && selectedRole) {
        await completeProfile();
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      Alert.alert('Sign In Error', error.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      const userProfile = await signInWithApple();

      if (userProfile) {
        await refreshUser();
        navigateToRole(userProfile.role);
      } else if (firebaseUser && selectedRole) {
        await completeProfile();
      }
    } catch (error: any) {
      console.error('Error signing in with Apple:', error);
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Sign In Error', error.message || 'Failed to sign in with Apple. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToRole = (role: UserRole) => {
    if (role === 'radiologist') {
      router.replace('/(radiologist)');
    } else if (role === 'doctor') {
      router.replace('/(doctor)');
    } else {
      router.replace('/(patient)');
    }
  };

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setShowProfileForm(false);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      Alert.alert('Role Required', 'Please select a role to continue');
      return;
    }
    setShowProfileForm(true);
  };

  const completeProfile = async () => {
    if (!firebaseUser || !selectedRole) {
      Alert.alert('Authentication Required', 'Please sign in first');
      return;
    }

    try {
      setLoading(true);

      let additionalData = {};

      if (selectedRole === 'doctor') {
        if (!doctorData.specialization || !doctorData.licenseNumber || !doctorData.hospitalName) {
          Alert.alert('Required Fields', 'Please fill in all required fields');
          return;
        }
        additionalData = {
          ...doctorData,
          experience: parseInt(doctorData.experience) || 0,
        };
      } else if (selectedRole === 'radiologist') {
        if (!radiologistData.licenseNumber || !radiologistData.certification || !radiologistData.hospital) {
          Alert.alert('Required Fields', 'Please fill in all required fields');
          return;
        }
        additionalData = radiologistData;
      }

      await createUserProfile(firebaseUser, selectedRole, additionalData);
      await refreshUser();
      navigateToRole(selectedRole);
    } catch (error: any) {
      console.error('Error completing profile:', error);
      Alert.alert('Setup Error', error.message || 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {showProfileForm ? 'Complete Your Profile' : 'Welcome to MediScan'}
          </Text>
          <Text style={styles.subtitle}>
            {showProfileForm
              ? 'Please authenticate and provide your details'
              : 'Select your role to get started'}
          </Text>
        </View>

        {!showProfileForm && (
          <View style={styles.rolesContainer}>
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === 'radiologist' && styles.roleCardSelected,
              ]}
              onPress={() => handleRoleSelection('radiologist')}
            >
              <View style={styles.roleIconContainer}>
                <Activity
                  size={48}
                  color={selectedRole === 'radiologist' ? colors.primary.main : colors.text.secondary}
                  strokeWidth={2}
                />
              </View>
              <Text style={[
                styles.roleTitle,
                selectedRole === 'radiologist' && styles.roleTextSelected,
              ]}>
                Radiologist
              </Text>
              <Text style={styles.roleDescription}>
                Upload and analyze X-ray images with AI assistance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === 'doctor' && styles.roleCardSelected,
              ]}
              onPress={() => handleRoleSelection('doctor')}
            >
              <View style={styles.roleIconContainer}>
                <Stethoscope
                  size={48}
                  color={selectedRole === 'doctor' ? colors.primary.main : colors.text.secondary}
                  strokeWidth={2}
                />
              </View>
              <Text style={[
                styles.roleTitle,
                selectedRole === 'doctor' && styles.roleTextSelected,
              ]}>
                Doctor
              </Text>
              <Text style={styles.roleDescription}>
                Review AI-analyzed reports and prescribe treatment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === 'patient' && styles.roleCardSelected,
              ]}
              onPress={() => handleRoleSelection('patient')}
            >
              <View style={styles.roleIconContainer}>
                <User
                  size={48}
                  color={selectedRole === 'patient' ? colors.primary.main : colors.text.secondary}
                  strokeWidth={2}
                />
              </View>
              <Text style={[
                styles.roleTitle,
                selectedRole === 'patient' && styles.roleTextSelected,
              ]}>
                Patient
              </Text>
              <Text style={styles.roleDescription}>
                View your reports and prescriptions
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!showProfileForm && selectedRole && (
          <Button
            title="Continue"
            onPress={handleContinue}
            style={styles.continueButton}
          />
        )}

        {showProfileForm && selectedRole !== 'patient' && (
          <Card style={styles.formCard}>
            <Text style={styles.formTitle}>
              {selectedRole === 'doctor' ? 'Doctor Information' : 'Radiologist Information'}
            </Text>

            {selectedRole === 'doctor' && (
              <>
                <Input
                  label="Specialization *"
                  value={doctorData.specialization}
                  onChangeText={(text) => setDoctorData({ ...doctorData, specialization: text })}
                  placeholder="e.g., Cardiology, Pulmonology"
                />
                <Input
                  label="License Number *"
                  value={doctorData.licenseNumber}
                  onChangeText={(text) => setDoctorData({ ...doctorData, licenseNumber: text })}
                  placeholder="Enter your medical license number"
                />
                <Input
                  label="Hospital/Clinic Name *"
                  value={doctorData.hospitalName}
                  onChangeText={(text) => setDoctorData({ ...doctorData, hospitalName: text })}
                  placeholder="Enter your workplace"
                />
                <Input
                  label="Years of Experience"
                  value={doctorData.experience}
                  onChangeText={(text) => setDoctorData({ ...doctorData, experience: text })}
                  placeholder="e.g., 5"
                  keyboardType="numeric"
                />
              </>
            )}

            {selectedRole === 'radiologist' && (
              <>
                <Input
                  label="License Number *"
                  value={radiologistData.licenseNumber}
                  onChangeText={(text) => setRadiologistData({ ...radiologistData, licenseNumber: text })}
                  placeholder="Enter your medical license number"
                />
                <Input
                  label="Certification *"
                  value={radiologistData.certification}
                  onChangeText={(text) => setRadiologistData({ ...radiologistData, certification: text })}
                  placeholder="e.g., Board Certified Radiologist"
                />
                <Input
                  label="Hospital/Institution *"
                  value={radiologistData.hospital}
                  onChangeText={(text) => setRadiologistData({ ...radiologistData, hospital: text })}
                  placeholder="Enter your workplace"
                />
              </>
            )}
          </Card>
        )}

        {showProfileForm && (
          <View style={styles.authButtonsContainer}>
            <Button
              title="Continue with Google"
              onPress={() => promptAsync()}
              loading={loading && !firebaseUser}
              disabled={firebaseUser !== null}
              style={styles.authButton}
              variant={firebaseUser ? 'outline' : 'primary'}
            />

            {isAppleSignInAvailable && Platform.OS === 'ios' && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={12}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
              />
            )}

            {firebaseUser && (
              <>
                <Text style={styles.signedInText}>Signed in as {firebaseUser.email}</Text>
                <Button
                  title="Complete Setup"
                  onPress={completeProfile}
                  loading={loading}
                  style={styles.submitButton}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxl * 2,
  },
  header: {
    marginBottom: spacing.xl * 1.5,
  },
  title: {
    fontSize: fontSize.xxl * 1.2,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.5,
  },
  rolesContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  roleCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roleCardSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + '08',
    shadowColor: colors.primary.main,
    shadowOpacity: 0.15,
    elevation: 4,
  },
  roleIconContainer: {
    marginBottom: spacing.md,
  },
  roleTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  roleTextSelected: {
    color: colors.primary.main,
  },
  roleDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: fontSize.sm * 1.5,
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  formTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  continueButton: {
    marginTop: spacing.md,
  },
  authButtonsContainer: {
    gap: spacing.md,
  },
  authButton: {
    marginTop: spacing.xs,
  },
  appleButton: {
    height: 48,
    marginTop: spacing.xs,
  },
  signedInText: {
    fontSize: fontSize.sm,
    color: colors.status.success,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontWeight: fontWeight.medium,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
