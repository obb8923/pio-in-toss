import { createRoute } from '@granite-js/react-native';
import React, { useState } from 'react';
import { View, Image, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Button, colors, Text } from '@toss/tds-react-native';
import { useImagePicker } from '../hooks/useImagePicker';
import { useImageAnalysis } from '../hooks/useImageAnalysis';
import { Background } from '../components/Background';
// import { Line } from '../components/Line';
// import { PLANT_TYPE_NAMES } from '../types/analysis';
import { Blur } from '../components/Blur';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const goToAboutPage = () => {
    navigation.navigate('/about');
  };

  const handleImageSelected = (base64: string) => {
    setSelectedImageBase64(base64);
  };

  const { selectFromGallery, takePhoto } = useImagePicker(handleImageSelected);

  const { isAnalyzing, analysisResult } = useImageAnalysis({
    imageBase64: selectedImageBase64 ?? '',
    onError: (error) => {
      Alert.alert('오류', error, [
        { text: '확인', onPress: () => setSelectedImageBase64(null) }
      ]);
    }
  });
  
  React.useEffect(() => {
    if (!selectedImageBase64) return;
    if (analysisResult && analysisResult.code !== 'success' && analysisResult.code !== 'error') {
      Alert.alert('분석 결과', analysisResult.error ?? '식물로 인식되지 않았어요.', [
        { text: '확인', onPress: () => setSelectedImageBase64(null) }
      ]);
    }
  }, [analysisResult, selectedImageBase64]);
  
  return (
    <Background isInsetTop={true} isInsetBottom={false}>
      {/* 앱정보 버튼 */}
      <View style={{position:'absolute',top: 16,right: 0,left:0 ,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal: 16}}>
      <View style={{width:45}}/>
        <Text typography='t5' color={colors.grey900} style={{textAlign:'center',flex:1}}>
          식물 이름 찾기는 피오!
        </Text>
      <Button display="block" size="tiny" style="weak" onPress={goToAboutPage}>       
            앱 정보
      </Button>
      </View>
      {/* 전체 컨테이너 */}
      <View style={{ flex: 1,justifyContent:'space-between',alignItems:'center'}}>
      <View style={{ padding: 16,width: '90%',maxHeight: '80%',justifyContent:'center',alignItems:'center',backgroundColor: colors.background,borderTopLeftRadius:96,borderTopRightRadius:96,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
              {/* 사진 영역 */}
      <View style={{width:'100%',aspectRatio:6/4,maxHeight: 240,backgroundColor: colors.grey200,overflow: 'hidden',borderTopLeftRadius:96,borderTopRightRadius:96,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
        {selectedImageBase64 ? (
        <Image source={{ uri: `data:image/jpeg;base64,${selectedImageBase64}` }} style={{ width: '100%', height: '100%' }} />
        ) : (
        <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
          <Text typography='t5' color={colors.grey600} style={{textAlign:'center'}}>
            식물 사진을 선택해주세요
          </Text>
        </View>
        )}
      </View>
      <Blur innerStyle={{paddingHorizontal:16}} style={{minWidth:123,maxWidth:333,height:53,borderWidth:6,borderColor: colors.background,borderRadius:10000,position:'absolute',top: 196,left: 0}}>
        {selectedImageBase64 ? (
          isAnalyzing ? (
            <Text typography='t5' color={colors.grey900} style={{textAlign:'center'}} numberOfLines={1}>
              분석 중...
            </Text>
          ) : analysisResult && analysisResult.code === 'success' ? (
            <Text typography='t5' color={colors.grey900} style={{textAlign:'center'}} numberOfLines={1}>
              {analysisResult.name}
            </Text>
          ) : (
            <Text typography='t5' color={colors.grey900} style={{textAlign:'center'}} numberOfLines={1}>
              분석 실패
            </Text>
          )
        ) : (
          <Text typography='t5' color={colors.grey900} style={{textAlign:'center'}} numberOfLines={1}>
            식물 이름
          </Text>
        )}
      </Blur>
      <ScrollView
        style={{ width: '100%',marginTop: 24,borderRadius:20}}
        contentContainerStyle={{ 
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 100 : 400,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        showsVerticalScrollIndicator={false}
      > 
      {/* 식물 설명 영역 */}
      {selectedImageBase64 ? (
        isAnalyzing ? (
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}>
            <ActivityIndicator size="large" color={colors.green600} />
            <Text typography='t5' color={colors.grey600} style={{ marginTop: 16, textAlign: 'center' }}>
              식물을 분석하고 있습니다..!
            </Text>
          </View>
        ) : analysisResult && analysisResult.code === 'success' ? (
          <View style={{ width: '100%' }}>
            <Text typography='t5' color={colors.grey900} style={{textAlign:'left',width:'100%'}}>
              {analysisResult.description}
            </Text>
          </View>
        ) : (
          <></>
        )
      ) : (
        <Text typography='t5' color={colors.grey900} style={{textAlign:'left',width:'100%'}}>
          {`아래 버튼을 눌러서 식물을 사진을 선택해주세요\n궁금했던 식물의 이름과 설명을 확인할 수 있어요!`}
        </Text>
      )}
     
      </ScrollView>
      </View>


        {/* 버튼 영역 */}
        <View style={{ 
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 32, 
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          backgroundColor: colors.background
        }}>
           <Button display="block" size="large" onPress={takePhoto}> 
            카메라로 찍기
          </Button>
          <Button display="block" size="large" onPress={selectFromGallery}>        
            갤러리에서 선택
          </Button>
        </View>
        </View>
    </Background>
  );
}

