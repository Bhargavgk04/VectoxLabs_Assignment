import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Activity, Calendar, Users, User } from 'lucide-react-native';
import { DoctorTabParamList } from './types';
import { FollowUpQueueScreen } from '../features/workflow/screens/FollowUpQueueScreen';
import { AppointmentsScreen } from '../features/dashboard/screens/AppointmentsScreen';
import { PatientsScreen } from '../features/dashboard/screens/PatientsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<DoctorTabParamList>();

export const DoctorTabNavigator: React.FC = () => {
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
        name="TodayTab"
        component={FollowUpQueueScreen}
        options={{
          tabBarLabel: 'Rx Queue',
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="FollowUpsTab"
        component={AppointmentsScreen}
        options={{
          tabBarLabel: 'OPD Schedule',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PatientsTab"
        component={PatientsScreen}
        options={{
          tabBarLabel: 'Inpatients',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
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
