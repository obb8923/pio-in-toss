import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { View, Image, Alert } from 'react-native';
import { Header } from '../components/common/Header';
import { AnalysisLoading } from '../components/analysis/AnalysisLoading';
import { AnalysisSuccessResult } from '../components/analysis/AnalysisSuccessResult';
import { AnalysisErrorResult } from '../components/analysis/AnalysisErrorResult';
import { useImageAnalysis } from '../hooks/useImageAnalysis';
import { styles } from '../styles/common';

export const Route = createRoute('/analyze', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const routeParams = Route.useParams() as { imageBase64: string };
  
  const { isAnalyzing, analysisResult } = useImageAnalysis({
    imageBase64: routeParams.imageBase64,
    onError: (error) => {
      Alert.alert('오류', error, [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    }
  });

  const goBack = () => {
    navigation.goBack();
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;
    
    if (analysisResult.code === "success") {
      return <AnalysisSuccessResult result={analysisResult} />;
    } else {
      return <AnalysisErrorResult result={analysisResult} />;
    }
  };

  return (
    <View style={[styles.container, styles.analysisContainer]}>
      <Header 
        title="식물 분석 결과" 
        showBackButton 
        onBackPress={goBack} 
      />

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${routeParams.imageBase64}` }}
          style={styles.analysisImage}
        />
      </View>

      {isAnalyzing ? <AnalysisLoading /> : renderAnalysisResult()}
    </View>
  );
}
