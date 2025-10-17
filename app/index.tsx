import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/Button';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { signInWithGoogle } from '@/services/authService';
import { Activity } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [signingIn, setSigningIn] = React.useState(false);

  React.useEffect(() => {
    if (!loading && user) {
      if (user.role === 'radiologist') {
        router.replace('/(radiologist)');
      } else if (user.role === 'doctor') {
        router.replace('/(doctor)');
      } else if (user.role === 'patient') {
        router.replace('/(patient)');
      }
    }
  }, [user, loading]);

  const handleGetStarted = () => {
    router.push('/onboarding');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <LinearGradient
      colors={[colors.primary.main, colors.primary.dark]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Activity size={80} color={colors.text.white} />
        </View>

        <Text style={styles.title}>MedAlze AI</Text>
        <Text style={styles.subtitle}>Advanced Medical Imaging Analysis Platform</Text>

        <View style={styles.featuresContainer}>
          <Text style={styles.featureText}>AI-Powered X-Ray Analysis</Text>
          <Text style={styles.featureText}>Real-Time Collaboration</Text>
          <Text style={styles.featureText}>Secure Patient Management</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            style={styles.signInButton}
          />
        </View>

        <Text style={styles.footerText}>
          Trusted by healthcare professionals worldwide
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text.white,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.white,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    opacity: 0.9,
  },
  featuresContainer: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  featureText: {
    fontSize: fontSize.sm,
    color: colors.text.white,
    marginBottom: spacing.sm,
    opacity: 0.85,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  signInButton: {
    backgroundColor: colors.text.white,
  },
  footerText: {
    fontSize: fontSize.xs,
    color: colors.text.white,
    opacity: 0.7,
    textAlign: 'center',
  },
});
