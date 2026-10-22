import { NavigatorScreenParams } from '@react-navigation/native';

export type PatientTabParamList = {
  HomeTab: undefined;
  DoctorsTab: undefined;
  AppointmentsTab: undefined;
  ProfileTab: undefined;
};

export type StaffTabParamList = {
  DashboardTab: undefined;
  PatientsTab: undefined;
  AppointmentsTab: undefined;
  DepartmentsTab: undefined;
  ProfileTab: undefined;
};

export type DoctorTabParamList = {
  TodayTab: undefined;
  FollowUpsTab: undefined;
  PatientsTab: undefined;
  ProfileTab: undefined;
};

export type WorkflowStackParamList = {
  FollowUpQueue: undefined;
  RenewalReview: { itemId: string };
  RenewalCompletion: {
    itemId: string;
    prescribedDosage: string;
    prescribedDuration: number;
    prescribedRefills: number;
  };
};

export type RootStackParamList = {
  // Authentication & Portal Access
  Login: undefined;

  // Persona Tab Stacks
  PatientTabs: NavigatorScreenParams<PatientTabParamList>;
  StaffTabs: NavigatorScreenParams<StaffTabParamList>;
  DoctorTabs: NavigatorScreenParams<DoctorTabParamList>;

  // Q1 Destination Screens for Quick Actions
  PatientsList: undefined;
  AppointmentsList: undefined;
  DepartmentsList: undefined;

  // Q2 Doctor Profile & Booking Flow
  DoctorDirectory: undefined;
  DoctorProfile: { doctorId: string };
  BookingSlot: { doctorId: string; doctorName: string; specialty: string };
  BookingConfirmation: { appointmentId: string };

  // Q3 Clinical Workflow Flow
  FollowUpQueue: undefined;
  RenewalReview: { itemId: string };
  RenewalCompletion: {
    itemId: string;
    prescribedDosage: string;
    prescribedDuration: number;
    prescribedRefills: number;
  };

  // Q4 View All & Entity Details
  ViewAll: { title: string; category: 'departments' | 'doctors' | 'diagnostics' | 'facilities' };
  DetailView: {
    id: string;
    category: string;
    title: string;
    subtitle?: string;
    imageUrl?: string;
    description?: string;
    metadata?: Record<string, string | number>;
  };
};
