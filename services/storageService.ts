import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Define the EncodingType enum if it's not exported by expo-file-system
const EncodingType = {
  UTF8: 'utf8' as const,
  Base64: 'base64' as const,
} as const;

type FileSystemEncoding = 'base64' | 'utf8';

export const uploadXRayImage = async (
  uri: string,
  patientId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const filename = `xray_${patientId}_${timestamp}.jpg`;
    const storageRef = ref(storage, `xrays/${patientId}/${filename}`);

    let blob: Blob;

    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      blob = await response.blob();
    } else {
      const fileInfo = await FileSystem.readAsStringAsync(uri, {
        encoding: EncodingType.Base64 as FileSystemEncoding,
      });

      const byteCharacters = atob(fileInfo);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: 'image/jpeg' });
    }

    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Error uploading X-ray:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading X-ray image:', error);
    throw error;
  }
};

export const uploadProfileImage = async (
  uri: string,
  userId: string
): Promise<string> => {
  try {
    const filename = `profile_${userId}.jpg`;
    const storageRef = ref(storage, `profiles/${filename}`);

    let blob: Blob;

    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      blob = await response.blob();
    } else {
      const fileInfo = await FileSystem.readAsStringAsync(uri, {
        encoding: EncodingType.Base64 as FileSystemEncoding,
      });

      const byteCharacters = atob(fileInfo);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: 'image/jpeg' });
    }

    await uploadBytesResumable(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

export const getImageUrl = (storedUrl: string): string => {
  return storedUrl;
};
