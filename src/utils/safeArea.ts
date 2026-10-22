import { Platform, StatusBar } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

/**
 * Calculates a safe top padding that guarantees content is never obscured by
 * the Android notification/status bar or iOS Dynamic Island / notch.
 */
export function getSafeTopPadding(insets: EdgeInsets, extra = 8): number {
  const androidBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;
  const topInset = Math.max(insets.top, androidBarHeight);
  // Ensure at least 24dp top margin on any device
  return Math.max(topInset, 24) + extra;
}

/**
 * Calculates safe bottom padding for home indicator / bottom navigation bar.
 */
export function getSafeBottomPadding(insets: EdgeInsets, extra = 12): number {
  return Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 0) + extra;
}
