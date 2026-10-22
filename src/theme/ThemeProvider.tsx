import React, { createContext, useContext, ReactNode } from 'react';
import { theme, Theme } from './tokens';

export interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  colors: Theme['colors'];
  typography: Theme['typography'];
  spacing: Theme['spacing'];
  radius: Theme['radius'];
  elevation: Theme['elevation'];
  motion: Theme['motion'];
}

const defaultContextValue: ThemeContextValue = {
  theme,
  isDark: false,
  colors: theme.colors,
  typography: theme.typography,
  spacing: theme.spacing,
  radius: theme.radius,
  elevation: theme.elevation,
  motion: theme.motion,
};

const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);

export interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const value: ThemeContextValue = {
    theme,
    isDark: false,
    colors: theme.colors,
    typography: theme.typography,
    spacing: theme.spacing,
    radius: theme.radius,
    elevation: theme.elevation,
    motion: theme.motion,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultContextValue;
  }
  return context;
}
