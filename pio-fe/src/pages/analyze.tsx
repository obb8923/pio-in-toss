import { createRoute } from '@granite-js/react-native';
import React, { useState } from 'react';
import { View, Image, Alert, ActivityIndicator } from 'react-native';
import { useImageAnalysis } from '../hooks/useImageAnalysis';
import { Background } from 'components/Background';
import { ScrollView, Platform } from 'react-native';
import { Button, colors } from '@toss/tds-react-native';
import { AnalyzeImageResponse, PLANT_TYPE_NAMES } from 'types/analysis';
import { Line } from 'components/Line';
import { Text } from '@toss/tds-react-native';


export const Route = createRoute('/analyze', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const routeParams = Route.useParams() as { imageBase64: string };
  const [chartWidth, setChartWidth] = useState(200);

  const { isAnalyzing, analysisResult } = useImageAnalysis({
    imageBase64: routeParams.imageBase64,
    onError: (error) => {
      Alert.alert('오류', error, [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    }
  });
  const imageHeight = 240;
  const borderRadius = 16;
  return (
    <Background isInsetTop={true} isInsetBottom={true}>
      {/* 사진 영역 */}
      <View style={{ position: 'absolute', top: 16, left: 0, right: 0, marginBottom: 6, width: '100%', height: imageHeight,paddingHorizontal: 8 }}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${routeParams.imageBase64}` }}
          style={{ width: '100%', height: '100%', borderRadius: borderRadius }}
          resizeMode="cover"
        />
      </View>
      <ScrollView
        style={{ flex: 1, paddingTop: imageHeight + 32, paddingHorizontal: 8, paddingBottom: 8, borderRadius: borderRadius }}
        contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 100 : 400 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 식물 정보 영역 */}
        {isAnalyzing ? (
          <View style={{ width: '100%',height: imageHeight, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.green600} />
            <Text typography='t5' color={colors.grey600} style={{ marginTop: 16 }}>
              AI가 식물을 분석하고 있습니다...
            </Text>
          </View>
        ) : analysisResult && analysisResult.code !== "success" ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: colors.grey600, marginTop: 16 }}>
              {analysisResult.error}
            </Text>
          </View>
        ) : (
          <View style={{ width: '100%', backgroundColor: 'white', borderRadius: 16, padding: 16 }}>
            {/* 식물 이름 영역 */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text
                typography='t3'
                style={{  padding: 12, textAlign: 'center' }}
              >{analysisResult?.name ?? ''}</Text>
              <Text
                typography='st11'
                style={{ padding: 12, textAlign: 'center' }}
              >{PLANT_TYPE_NAMES[analysisResult?.type_code as keyof typeof PLANT_TYPE_NAMES]}</Text>

            </View>
            {/* 활동 곡선 영역 */}
              {/* 활동 곡선 영역 */}
              <View 
                style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}
                onLayout={(event) => {
                  const { width } = event.nativeEvent.layout;
                  setChartWidth(width);
                }}
              >
                <Line data={analysisResult?.activity_curve ?? []} width={chartWidth * 0.8} height={80}  />
              </View>
            {/* 설명 영역 */}
              <Text
              typography='st11'
              color={colors.grey600}
                style={{minHeight: 90, maxHeight: 140, backgroundColor: colors.grey100, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.grey200 }}               
              >{analysisResult?.description ?? '식물에 대한 설명을 입력해주세요'}</Text>
            {/* <View style={{ height: 0.5, backgroundColor: colors.grey200, marginTop: 16, marginBottom: 16 }}/> */}
            {/* 버튼 영역 */}
  
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 8 }}>
          <Button onPress={() => navigation.goBack()}>취소</Button>
          {!isAnalyzing && analysisResult?.code === "success" && (
            <>
              <View style={{ width: 20 }}/>
              <Button 
                onPress={() => {}} 
              >저장</Button>
            </>
          )}
        </View>
          </View>
        )}
        
      </ScrollView>

      
    </Background>
  );
}
