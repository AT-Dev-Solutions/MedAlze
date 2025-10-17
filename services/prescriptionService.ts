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
import { Prescription, Medication } from '@/types';
import { markReportAsCompleted, sendReportToPatient } from './reportService';

export const createPrescription = async (
  reportId: string,
  doctorId: string,
  patientId: string,
  diagnosis: string,
  prescriptionText: string,
  precautions: string,
  medications: Medication[]
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'prescriptions'), {
      reportId,
      doctorId,
      patientId,
      diagnosis,
      prescriptionText,
      precautions,
      medications,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await updateDoc(docRef, {
      prescriptionId: docRef.id,
    });

    await markReportAsCompleted(reportId);
    await sendReportToPatient(reportId, patientId);

    return docRef.id;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};

export const getPrescriptionByReportId = async (reportId: string): Promise<Prescription | null> => {
  try {
    const q = query(collection(db, 'prescriptions'), where('reportId', '==', reportId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();
      return {
        ...docData,
        createdAt: docData.createdAt?.toDate(),
        updatedAt: docData.updatedAt?.toDate(),
      } as Prescription;
    }
    return null;
  } catch (error) {
    console.error('Error fetching prescription:', error);
    throw error;
  }
};

export const getPrescriptionsByPatient = async (patientId: string): Promise<Prescription[]> => {
  try {
    const q = query(
      collection(db, 'prescriptions'),
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Prescription[];
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw error;
  }
};

export const getPrescriptionsByDoctor = async (doctorId: string): Promise<Prescription[]> => {
  try {
    const q = query(
      collection(db, 'prescriptions'),
      where('doctorId', '==', doctorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Prescription[];
  } catch (error) {
    console.error('Error fetching doctor prescriptions:', error);
    throw error;
  }
};
