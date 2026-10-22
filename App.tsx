import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { RoleProvider } from './src/store/RoleContext';
import { WorkflowProvider } from './src/store/WorkflowContext';
import { ErrorBoundary } from './src/components/feedback/ErrorBoundary';
import { ToastProvider } from './src/context/ToastContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.canvas,
    card: colors.surface1,
    text: colors.text.primary,
    border: colors.borderSubtle,
    primary: colors.accent.primary,
  },
};

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <RoleProvider>
            <WorkflowProvider>
              <ToastProvider>
                <NavigationContainer theme={navigationTheme}>
                  <StatusBar style="dark" />
                  <RootNavigator />
                </NavigationContainer>
              </ToastProvider>
            </WorkflowProvider>
          </RoleProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
