export type UserRole = 'radiologist' | 'doctor' | 'patient';

export interface User {
  userId: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  googleId: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface Patient {
  patientId: string;
  registeredBy: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  email: string;
  medicalHistory?: string;
  bloodGroup?: string;
  allergies?: string;
  createdAt: Date;
}

export interface Doctor {
  doctorId: string;
  userId: string;
  displayName: string;
  specialization: string;
  licenseNumber: string;
  hospitalName: string;
  experience: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Radiologist {
  radiologistId: string;
  userId: string;
  licenseNumber: string;
  certification: string;
  hospital: string;
  isActive: boolean;
  createdAt: Date;
}

export interface DetectedAnomaly {
  type: string;
  location: string;
  confidence: number;
  description: string;
}

export interface Report {
  id: string;
  patientId: string;
  radiologistId?: string;
  doctorId: string;
  imageUrl: string;
  type: 'xray' | 'ct' | 'mri' | 'ultrasound';
  detectedAnomalies?: DetectedAnomaly[];
  geminiAnalysis?: string;
  diagnosis?: string;
  findings?: string;
  recommendations?: string;
  status: 'pending' | 'completed';
  sentToDoctor?: boolean;
  sentToPatient?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  reportId?: string;
  diagnosis: string;
  prescriptionText?: string;
  precautions?: string;
  medications: Medication[];
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'report' | 'prescription' | 'appointment' | 'system' | 'new_report' | 'report_ready' | 'new_patient_registered' | 'prescription_ready';
  title: string;
  body: string;
  message?: string;
  reportId?: string;
  isRead: boolean;
  createdAt: Date;
}
