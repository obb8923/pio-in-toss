import { createRoute } from '@granite-js/react-native';
import React, { useState } from 'react';
import { View, Image, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Button, colors, Text } from '@toss/tds-react-native';
import { useImagePicker } from '../hooks/useImagePicker';
import { useImageAnalysis } from '../hooks/useImageAnalysis';
import { Background } from '../components/Background';
import { Line } from '../components/Line';
import { PLANT_TYPE_NAMES } from '../types/analysis';
import { Blur } from '../components/Blur';
import { DEVICE_WIDTH } from '../constants/normal';
export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [chartWidth, setChartWidth] = useState(200);

  const goToAboutPage = () => {
    navigation.navigate('/about');
  };

  const handleImageSelected = (base64: string) => {
    setSelectedImageBase64(base64);
  };

  const { selectFromGallery, takePhoto } = useImagePicker(handleImageSelected);

  // const { isAnalyzing, analysisResult } = useImageAnalysis({
  //   imageBase64: selectedImageBase64 ?? '',
  //   onError: (error) => {
  //     Alert.alert('오류', error, [
  //       { text: '확인', onPress: () => setSelectedImageBase64(null) }
  //     ]);
  //   }
  // });
  const padding = 8;
  
  return (
    <Background isInsetTop={true} isInsetBottom={true}>
      <View style={{ flex: 1,justifyContent:'space-between',alignItems:'center'}}>
      <View style={{ width: '90%',justifyContent:'center',alignItems:'center',borderRadius: padding * 2,backgroundColor: colors.background}}>
              {/* 사진 영역 */}
      <View style={{ position:'absolute',top: padding,bottom: padding,left: padding,right: padding,flex: 1,maxHeight: 240,backgroundColor: colors.red400,borderRadius: padding,overflow: 'hidden'}}>
        {selectedImageBase64 && (
        <Image source={{ uri: `data:image/jpeg;base64,${selectedImageBase64}` }} style={{ width: '100%', height: '100%' }} />
        )}
      </View>

      <ScrollView
        style={{ width: '100%'}}
        contentContainerStyle={{ 
          paddingTop: 140,
          paddingBottom: Platform.OS === "ios" ? 100 : 400,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        showsVerticalScrollIndicator={false}
      > 
      {/* 귀퉁이 */}
      <View style={{ width: '100%', height: 100, flexDirection: 'row',justifyContent:'space-between',alignItems:'flex-end'}}>
        {/* 왼쪽 귀퉁이 */}
       <Blur style={{minWidth:'30%',maxWidth:'65%',height:"100%",borderTopLeftRadius: padding * 3,borderTopRightRadius: padding * 9}}>
        <View style={{width:'100%',height:'100%',padding: padding, justifyContent:'center',alignItems:'center'}}>
        <Text typography='t5' color={colors.grey600}>
          귀퉁이
        </Text>
        </View>
       </Blur>
        {/* 중앙 */}
        <Blur style={{flex:1,height:"30%"}}></Blur>
        {/* 오른쪽 귀퉁이 */}
        <Blur style={{width:100,height:"100%",borderTopLeftRadius: padding * 2,borderTopRightRadius: padding * 3}}>

        </Blur>
       
      </View>
      {/* 하단 영역 */}
         <Blur style={{width:'100%', height:100 }}>

         </Blur>
      </ScrollView>
      </View>


        {/* 버튼 영역 */}
        <View style={{ 
          flexDirection: 'row',
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          gap: 12, 
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: colors.background
        }}>
          <Button
            display="block"
            onPress={selectFromGallery}
          >        
            갤러리에서 선택
          </Button>

          <Button
            display="block"
            onPress={takePhoto}
          > 

            카메라로 찍기
          </Button>

          <Button
            display="block"
            onPress={goToAboutPage}
          >       

            정보
          </Button>
      
        </View>
        </View>
    </Background>
  );
}

