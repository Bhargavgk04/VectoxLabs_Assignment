import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useRole } from '../store/RoleContext';
import { PatientTabNavigator } from './PatientTabNavigator';
import { StaffTabNavigator } from './StaffTabNavigator';
import { DoctorTabNavigator } from './DoctorTabNavigator';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { PatientsScreen } from '../features/dashboard/screens/PatientsScreen';
import { AppointmentsScreen } from '../features/dashboard/screens/AppointmentsScreen';
import { DepartmentsScreen } from '../features/dashboard/screens/DepartmentsScreen';
import { DoctorProfileScreen } from '../features/doctors/screens/DoctorProfileScreen';
import { DoctorDirectoryScreen } from '../features/doctors/screens/DoctorDirectoryScreen';
import { BookingScreen } from '../features/doctors/screens/BookingScreen';
import { BookingConfirmationScreen } from '../features/doctors/screens/BookingConfirmationScreen';
import { FollowUpQueueScreen } from '../features/workflow/screens/FollowUpQueueScreen';
import { RenewalReviewScreen } from '../features/workflow/screens/RenewalReviewScreen';
import { RenewalCompletionScreen } from '../features/workflow/screens/RenewalCompletionScreen';
import { ViewAllScreen } from '../features/home/screens/ViewAllScreen';
import { DetailViewScreen } from '../features/home/screens/DetailViewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { currentRole, isAuthenticated } = useRole();

  return (
    <Stack.Navigator
      key={`${currentRole}-${isAuthenticated ? 'auth' : 'guest'}`}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : currentRole === 'patient' ? (
        <>
          <Stack.Screen name="PatientTabs" component={PatientTabNavigator} />
          <Stack.Screen name="StaffTabs" component={StaffTabNavigator} />
          <Stack.Screen name="DoctorTabs" component={DoctorTabNavigator} />
        </>
      ) : currentRole === 'staff' ? (
        <>
          <Stack.Screen name="StaffTabs" component={StaffTabNavigator} />
          <Stack.Screen name="DoctorTabs" component={DoctorTabNavigator} />
          <Stack.Screen name="PatientTabs" component={PatientTabNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="DoctorTabs" component={DoctorTabNavigator} />
          <Stack.Screen name="StaffTabs" component={StaffTabNavigator} />
          <Stack.Screen name="PatientTabs" component={PatientTabNavigator} />
        </>
      )}

      {/* Q1 Destination Screens for Quick Actions */}
      <Stack.Screen name="PatientsList" component={PatientsScreen} />
      <Stack.Screen name="AppointmentsList" component={AppointmentsScreen} />
      <Stack.Screen name="DepartmentsList" component={DepartmentsScreen} />

      {/* Q2 Doctor Profile & Booking Flow */}
      <Stack.Screen name="DoctorDirectory" component={DoctorDirectoryScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="BookingSlot" component={BookingScreen} />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
        options={{ gestureEnabled: false }}
      />

      {/* Q3 Clinical Workflow Screens */}
      <Stack.Screen name="FollowUpQueue" component={FollowUpQueueScreen} />
      <Stack.Screen name="RenewalReview" component={RenewalReviewScreen} />
      <Stack.Screen
        name="RenewalCompletion"
        component={RenewalCompletionScreen}
        options={{ gestureEnabled: false }}
      />

      {/* Q4 View All & Entity Details */}
      <Stack.Screen name="ViewAll" component={ViewAllScreen} />
      <Stack.Screen name="DetailView" component={DetailViewScreen} />
    </Stack.Navigator>
  );
};
