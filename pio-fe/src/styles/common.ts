import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 공통 스타일
  container: {
    flex: 1,
  },
  
  // 메인 페이지 스타일
  mainContainer: {
    flex: 1,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  welcomeSubtitle: {
    fontSize: 18,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  
  buttonSpacing: {
    marginBottom: 16,
  },
  
  lastButtonSpacing: {
    marginBottom: 24,
  },
  
  // 분석 페이지 스타일
  analysisContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  
  imageContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  
  analysisImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  
  // 텍스트 스타일
  textCenter: {
    textAlign: 'center',
  },
  
  textBold: {
    fontWeight: 'bold',
  },
  
  textLarge: {
    fontSize: 18,
  },
  
  textMedium: {
    fontSize: 16,
  },
  
  textSmall: {
    fontSize: 14,
  },
  
  // 색상 스타일
  textPrimary: {
    color: '#1f2937',
  },
  
  textSecondary: {
    color: '#6b7280',
  },
  
  textMuted: {
    color: '#4b5563',
  },
  
  // 레이아웃 스타일
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  row: {
    flexDirection: 'row',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  // 패딩/마진 스타일
  padding16: {
    padding: 16,
  },
  
  paddingHorizontal16: {
    paddingHorizontal: 16,
  },
  
  paddingVertical16: {
    paddingVertical: 16,
  },
  
  marginBottom16: {
    marginBottom: 16,
  },
  
  marginBottom24: {
    marginBottom: 24,
  },
  
  marginTop16: {
    marginTop: 16,
  },
});
