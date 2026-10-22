import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../types';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  department?: string;
  // Patient-specific
  uhid?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  allergies?: string[];
  emergencyContact?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceStatus?: string;
  primaryDoctor?: string;
  // Doctor-specific
  licenseNumber?: string;
  specialty?: string;
  opdRoom?: string;
  consultingHours?: string;
  prescribingStatus?: string;
  // Staff-specific
  staffId?: string;
  nursingStation?: string;
  shiftTiming?: string;
  operationalPrivileges?: string[];
}

export interface RoleContextValue {
  isAuthenticated: boolean;
  currentRole: UserRole;
  role: UserRole;
  userProfile: UserProfile;
  setRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  login: (role: UserRole, profile?: Partial<UserProfile>) => void;
  logout: () => void;
}

const defaultProfiles: Record<UserRole, UserProfile> = {
  patient: {
    id: 'pat-101',
    name: 'Rajesh Patel',
    role: 'patient',
    title: 'Registered Outpatient (UHID: VX-90412)',
    email: 'rajesh.patel@gmail.com',
    phone: '+91 98201 44320',
    location: 'Mumbai Suburbs • South Wing OPD',
    uhid: 'VX-90412',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    emergencyContact: 'Kavita Patel (Spouse) • +91 98201 44321',
    insuranceProvider: 'Star Health Comprehensive Premier',
    insurancePolicyNumber: 'POL-VX-88912-2026',
    insuranceStatus: 'Pre-Approved • Cashless Active',
    primaryDoctor: 'Dr. Sarah Jenkins (Cardiology)',
  },
  doctor: {
    id: 'doc-1',
    name: 'Dr. Rajesh Sharma, MD',
    role: 'doctor',
    title: 'Chief Interventional Cardiologist',
    email: 'dr.sharma@vectoxhospital.com',
    phone: '+91 98201 11001',
    department: 'Interventional Cardiology & Cath Lab',
    location: 'Block B • Executive Clinic Suite 204',
    licenseNumber: 'MCI-99412-A / State Medical Council',
    specialty: 'Interventional Cardiology & Coronary Angioplasty',
    opdRoom: 'OPD Suite 204 (2nd Floor)',
    consultingHours: 'Mon - Fri: 09:00 AM - 04:00 PM',
    prescribingStatus: 'Full E-Prescribing & STAT Lab Ordering (RSA-4096 Signed)',
  },
  staff: {
    id: 'stf-204',
    name: 'Priya Nair, RN',
    role: 'staff',
    title: 'Senior Clinical Operations & Bed Manager',
    email: 'priya.nair@vectoxhospital.com',
    phone: '+91 98201 22002',
    department: 'Nursing Operations & Bed Allocation',
    location: 'Central Triage & Nursing Station 3 (Ward 4B)',
    staffId: 'STF-204 (Credential ID #EMP-8831)',
    nursingStation: 'Station 3 • Inpatient Acute Care Wing',
    shiftTiming: 'Day Shift: 07:00 AM - 03:30 PM (Supervisor: Dr. Mehta)',
    operationalPrivileges: [
      'Inpatient Bed Allocation',
      'Emergency Triage Admission',
      'Telemetry Sync & Vital Override',
      'Internal Clinic Transfer',
    ],
  },
};

const RoleContext = createContext<RoleContextValue>({
  isAuthenticated: false,
  currentRole: 'patient',
  role: 'patient',
  userProfile: defaultProfiles.patient,
  setRole: () => {},
  switchRole: () => {},
  login: () => {},
  logout: () => {},
});

export function RoleProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setRoleState] = useState<UserRole>('patient');
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfiles.patient);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setUserProfile(defaultProfiles[newRole]);
  };

  const login = (roleToLogin: UserRole, profile?: Partial<UserProfile>) => {
    setRoleState(roleToLogin);
    setUserProfile({
      ...defaultProfiles[roleToLogin],
      ...profile,
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value: RoleContextValue = {
    isAuthenticated,
    currentRole,
    role: currentRole,
    userProfile,
    setRole,
    switchRole: setRole,
    login,
    logout,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
