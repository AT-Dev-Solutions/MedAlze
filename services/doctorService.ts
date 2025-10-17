import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Doctor } from '@/types';

export const getAllDoctors = async (): Promise<Doctor[]> => {
  try {
    const q = query(
      collection(db, 'doctors'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Doctor[];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const getDoctorById = async (doctorId: string): Promise<Doctor | null> => {
  try {
    const docRef = doc(db, 'doctors', doctorId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
      } as Doctor;
    }
    return null;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    throw error;
  }
};

export const getDoctorByUserId = async (userId: string): Promise<Doctor | null> => {
  try {
    const q = query(collection(db, 'doctors'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();
      return {
        ...docData,
        createdAt: docData.createdAt?.toDate(),
      } as Doctor;
    }
    return null;
  } catch (error) {
    console.error('Error fetching doctor by user ID:', error);
    throw error;
  }
};
