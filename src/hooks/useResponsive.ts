import { useWindowDimensions, Platform, DimensionValue } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const isSmallDevice = width < 375;
  const isLargePhone = width >= 414 && width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isWide = width >= 1280;

  // Max content container widths
  const containerMaxWidth: DimensionValue = isWide ? 1280 : isDesktop ? 1080 : isTablet ? 760 : '100%';
  const maxContentWidth = Math.min(width, isDesktop ? 1280 : 760);

  // Column calculations
  const doctorColumns = isWide ? 3 : isDesktop ? 2 : isTablet ? 2 : 1;
  const metricColumns = isDesktop ? 4 : isTablet ? 2 : 2;
  const patientColumns = isDesktop ? 2 : 1;
  const appointmentColumns = isDesktop ? 2 : 1;

  // Spacing
  const horizontalPadding = isDesktop ? 32 : isTablet ? 24 : 16;
  const cardGap = isDesktop ? 20 : isTablet ? 16 : 12;

  return {
    width,
    height,
    isWeb,
    isSmallDevice,
    isLargePhone,
    isTablet,
    isDesktop,
    isWide,
    containerMaxWidth,
    maxContentWidth,
    doctorColumns,
    metricColumns,
    patientColumns,
    appointmentColumns,
    horizontalPadding,
    cardGap,
  };
}
