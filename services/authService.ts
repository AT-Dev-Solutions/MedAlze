import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User, UserRole } from '@/types';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const googleClientId = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

export const useGoogleAuth = () => {
  return Google.useAuthRequest({
    clientId: googleClientId,
    scopes: ['profile', 'email'],
  });
};

export const signInWithGoogle = async (response: any): Promise<User | null> => {
  try {
    if (response?.type !== 'success') {
      return null;
    }

    const { id_token } = response.params;
    const credential = GoogleAuthProvider.credential(id_token);
    const result = await signInWithCredential(auth, credential);
    const firebaseUser = result.user;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (userDoc.exists()) {
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        lastLoginAt: serverTimestamp()
      }, { merge: true });

      return userDoc.data() as User;
    }

    return null;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signInWithApple = async (): Promise<User | null> => {
  try {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign In is only available on iOS');
    }

    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const { identityToken } = appleCredential;
    if (!identityToken) {
      throw new Error('No identity token returned from Apple');
    }

    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({
      idToken: identityToken,
    });

    const result = await signInWithCredential(auth, credential);
    const firebaseUser = result.user;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (userDoc.exists()) {
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        lastLoginAt: serverTimestamp()
      }, { merge: true });

      return userDoc.data() as User;
    }

    return null;
  } catch (error: any) {
    if (error.code === 'ERR_REQUEST_CANCELED') {
      console.log('User cancelled Apple Sign In');
      return null;
    }
    console.error('Error signing in with Apple:', error);
    throw error;
  }
};

export const createUserProfile = async (
  firebaseUser: FirebaseUser,
  role: UserRole,
  additionalData: any
): Promise<User> => {
  try {
    const userData: User = {
      userId: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || '',
      role,
      photoURL: firebaseUser.photoURL || undefined,
      googleId: firebaseUser.uid,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    if (role === 'doctor') {
      await setDoc(doc(db, 'doctors', firebaseUser.uid), {
        doctorId: firebaseUser.uid,
        userId: firebaseUser.uid,
        ...additionalData,
        isActive: true,
        createdAt: serverTimestamp(),
      });
    } else if (role === 'radiologist') {
      await setDoc(doc(db, 'radiologists', firebaseUser.uid), {
        radiologistId: firebaseUser.uid,
        userId: firebaseUser.uid,
        ...additionalData,
        isActive: true,
        createdAt: serverTimestamp(),
      });
    }

    return userData;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};
