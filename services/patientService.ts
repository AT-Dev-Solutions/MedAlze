import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Patient } from '@/types';

export const registerPatient = async (patientData: Omit<Patient, 'patientId' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'patients'), {
      ...patientData,
      createdAt: serverTimestamp(),
    });

    await updateDoc(docRef, {
      patientId: docRef.id,
    });

    return docRef.id;
  } catch (error) {
    console.error('Error registering patient:', error);
    throw error;
  }
};

export const getPatientsByRadiologist = async (radiologistId: string): Promise<Patient[]> => {
  try {
    console.log('Fetching patients for radiologist:', radiologistId);

    const q = query(
      collection(db, 'patients'),
      where('registeredBy', '==', radiologistId)
    );
    const querySnapshot = await getDocs(q);
    console.log('Query returned documents:', querySnapshot.size);

    const patients = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Patient document:', doc.id, data);
      return {
        ...data,
        createdAt: data.createdAt?.toDate(),
      };
    }) as Patient[];

    patients.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return patients;
  } catch (error) {
    console.error('Error fetching patients:', error);

    console.log('Trying to fetch all patients as fallback...');
    const allQ = query(collection(db, 'patients'));
    const allSnapshot = await getDocs(allQ);
    const allPatients = allSnapshot.docs
      .map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Patient[];

    const filtered = allPatients.filter(p => p.registeredBy === radiologistId);
    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    console.log('Fallback returned:', filtered.length, 'patients');
    return filtered;
  }
};

export const getPatientById = async (patientId: string): Promise<Patient | null> => {
  try {
    const docRef = doc(db, 'patients', patientId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
      } as Patient;
    }
    return null;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
};

export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    const q = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Patient[];
  } catch (error) {
    console.error('Error fetching all patients:', error);
    throw error;
  }
};
