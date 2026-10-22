/**
 * Vectox Hospital Domain Types
 * Strict typing across all questions (Q1–Q4) and global services.
 */

export type UserRole = 'patient' | 'staff' | 'doctor';

// Doctor Entity (Q2 & Q4)
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  departmentId: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  availability: 'Available Today' | 'Next Available: Tomorrow' | 'On Leave';
  imageUrl: string;
  hospitalAffiliation: string;
  bio: string;
  consultationFee: number;
  education: string;
  availableDates: {
    date: string; // YYYY-MM-DD
    slots: string[];
  }[];
}

// Appointment Entity (Q1, Q2, Q4)
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'M' | 'F' | 'Other';
  doctorId: string;
  doctorName: string;
  specialty: string;
  dateTime: string;
  status: 'Scheduled' | 'Completed' | 'Pending' | 'Cancelled' | 'In-Progress';
  roomNumber: string;
  type: 'In-Person' | 'Follow-Up' | 'Emergency' | 'Telehealth';
  reason?: string;
}

// Hospital Staff Metric (Q1)
export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  changeText: string;
  isPositive: boolean;
  category: 'patients' | 'appointments' | 'doctors' | 'tasks';
}

// Department Entity (Q1, Q4)
export interface Department {
  id: string;
  name: string;
  code: string;
  headDoctor: string;
  floor: string;
  activeDoctorsCount: number;
  description: string;
  imageUrl: string;
  iconName: string;
}

// Diagnostic Service (Q4)
export interface DiagnosticService {
  id: string;
  name: string;
  category: 'Radiology' | 'Pathology' | 'Cardiology' | 'Genomics';
  turnaroundTime: string;
  price: number;
  description: string;
  preparationNotes: string;
  imageUrl: string;
}

// Hospital Facility (Q4)
export interface HospitalFacility {
  id: string;
  name: string;
  availability: string;
  location: string;
  description: string;
  capacity: string;
  imageUrl: string;
}

// Health Checkup Promo Package (Q4)
export interface HealthPackage {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  originalPrice: number;
  discountedPrice: number;
  includesTestsCount: number;
  imageUrl: string;
  features: string[];
  description: string;
}

// Patient Record
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  assignedDoctorId: string;
  roomBed?: string;
  status: 'Admitted' | 'Outpatient' | 'Discharged';
  allergies: string[];
  chronicConditions: string[];
}

// Q3 Clinical Workflow: Follow-Up Prescription Renewal
export interface VitalsReading {
  bp: string;
  pulse: number;
  spo2: number;
  recordedAt: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  instructions: string;
  refillsRemaining: number;
  prescribedBy: string;
  prescribedAt: string;
}

export interface FollowUpQueueItem {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'M' | 'F' | 'Other';
  urgency: 'Routine' | 'Urgent' | 'Stable';
  lastVisitDate: string;
  diagnoses: string[];
  allergies: string[];
  vitalsTrend: VitalsReading[];
  lastPrescription: Prescription;
  draftRenewal?: {
    dosage: string;
    durationDays: number;
    notes?: string;
  };
  status: 'pending' | 'renewed' | 'rescheduled' | 'skipped';
}
