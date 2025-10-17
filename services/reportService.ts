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
import { Report, DetectedAnomaly, Doctor } from '@/types';
import { createNotification } from './notificationService';

export const getReportsByRadiologist = async (radiologistId: string): Promise<Report[]> => {
  try {
    const q = query(
      collection(db, 'reports'),
      where('radiologistId', '==', radiologistId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Report[];
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const createReport = async (
  patientId: string,
  doctorId: string,
  imageUrl: string,
  type: 'xray' | 'ct' | 'mri' | 'ultrasound',
  detectedAnomalies?: DetectedAnomaly[],
  geminiAnalysis?: string,
  diagnosis?: string,
  findings?: string,
  recommendations?: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'reports'), {
      id: '',
      patientId,
      doctorId,
      type,
      imageUrl,
      detectedAnomalies,
      geminiAnalysis,
      diagnosis,
      findings,
      recommendations,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await updateDoc(docRef, {
      id: docRef.id,
    });

    await createNotification(
      doctorId,
      'new_report',
      'A new report has been created',
      docRef.id
    );

    return docRef.id;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

export const getReportsByDoctor = async (doctorId: string): Promise<Report[]> => {
  try {
    const q = query(
      collection(db, 'reports'),
      where('doctorId', '==', doctorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Report[];
  } catch (error) {
    console.error('Error fetching reports by doctor:', error);
    throw error;
  }
};

export const getReportsByPatient = async (patientId: string): Promise<Report[]> => {
  try {
    const q = query(
      collection(db, 'reports'),
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Report[];
  } catch (error) {
    console.error('Error fetching reports by patient:', error);
    throw error;
  }
};

export const getReportById = async (reportId: string): Promise<Report | null> => {
  try {
    const docRef = doc(db, 'reports', reportId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        id: docSnap.id,
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
      } as Report;
    }
    return null;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

export const markReportAsCompleted = async (reportId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'reports', reportId);
    await updateDoc(docRef, {
      status: 'completed',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
};

export const getDoctor = async (doctorId: string): Promise<Doctor | null> => {
  try {
    const docRef = doc(db, 'doctors', doctorId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        doctorId: docSnap.id,
        createdAt: docSnap.data().createdAt?.toDate(),
      } as Doctor;
    }
    return null;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    throw error;
  }
};
