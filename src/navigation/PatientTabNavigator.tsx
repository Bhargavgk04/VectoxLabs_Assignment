import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Hospital, Stethoscope, Calendar, User } from 'lucide-react-native';
import { PatientTabParamList } from './types';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { DoctorDirectoryScreen } from '../features/doctors/screens/DoctorDirectoryScreen';
import { AppointmentsScreen } from '../features/dashboard/screens/AppointmentsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<PatientTabParamList>();

export const PatientTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface1,
          borderTopColor: colors.borderSubtle,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Campus',
          tabBarIcon: ({ color, size }) => <Hospital size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="DoctorsTab"
        component={DoctorDirectoryScreen}
        options={{
          tabBarLabel: 'Doctors',
          tabBarIcon: ({ color, size }) => (
            <Stethoscope size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentsScreen}
        options={{
          tabBarLabel: 'My Visits',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
