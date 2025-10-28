import { createRoute, useNavigation } from '@granite-js/react-native';
import React from 'react';
import {  View, ScrollView, Image } from 'react-native';
import { generateHapticFeedback } from '@apps-in-toss/framework';
import { Text, colors ,Button} from '@toss/tds-react-native';
import { Background } from '../components/Background';
export const Route = createRoute('/about', {
  component: Page,
});

function Page() {
  const navigation = useNavigation();
  return (
    <Background isInsetTop={false} isInsetBottom={false}>
      <View style={{flex:1}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:16}}>
          <Button display="block" size="tiny" style="weak" onPress={() => { generateHapticFeedback({ type: 'tap' }); navigation.goBack(); }}>
            {'<'}
          </Button>
        <Text typography='t4' color={colors.grey900} style={{textAlign:'center'}}>
          앱 정보
        </Text>
        <View style={{width:54}}/>

        </View>
        {/* 메뉴 리스트 */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
          {/* 앱 설명 헤더 */}
          <View style={{borderWidth: 1, borderColor: colors.grey200,marginBottom:16,width:'100%',minHeight:100,backgroundColor:colors.background,borderRadius:16,overflow:'hidden',alignItems:'center',padding:16}}>
            {/* 앱로고와 이름,설명 */}
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:16}}>
            <Image 
            style={{width:80,height:80,justifyContent:'center',alignItems:'center',borderRadius:16,overflow:'hidden',marginRight:16}}
            source={{uri:'https://hiqdelhkugdugbcvvxxb.supabase.co/storage/v1/object/public/public_bucket/app_logo.png'}}  
            resizeMode='cover'
            />
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-start',flexShrink:1}}>
            <Text typography='t5' color={colors.grey900} fontWeight='semibold' style={{textAlign:'left',marginBottom:4}}>피오</Text>
            <Text typography='t6' color={colors.grey900} style={{textAlign:'left'}} numberOfLines={0}>내 주변 식물의 이름을 알아보고 위치를 기록할 수 있어요</Text>
            </View>
            </View>
            {/* 앱 스크린샷 */}
            <ScrollView horizontal style={{}}>
              <Image source={{uri:'https://hiqdelhkugdugbcvvxxb.supabase.co/storage/v1/object/public/public_bucket/1.png'}} style={{width:140,aspectRatio:215/466,borderRadius:8,overflow:'hidden',marginRight:16}} resizeMode='cover'/>
              <Image source={{uri:'https://hiqdelhkugdugbcvvxxb.supabase.co/storage/v1/object/public/public_bucket/2.png'}} style={{width:140,aspectRatio:215/466,borderRadius:8,overflow:'hidden',marginRight:16}} resizeMode='cover'/>
              <Image source={{uri:'https://hiqdelhkugdugbcvvxxb.supabase.co/storage/v1/object/public/public_bucket/3.png'}} style={{width:140,aspectRatio:215/466,borderRadius:8,overflow:'hidden',marginRight:16}} resizeMode='cover'/>
              <Image source={{uri:'https://hiqdelhkugdugbcvvxxb.supabase.co/storage/v1/object/public/public_bucket/4.png'}} style={{width:140,aspectRatio:215/466,borderRadius:8,overflow:'hidden',marginRight:16}} resizeMode='cover'/>
              <Image source={{uri:'https://hiqdelhkugdugbcvvxxb.supabase.co/storage/v1/object/public/public_bucket/5.png'}} style={{width:140,aspectRatio:215/466,borderRadius:8,overflow:'hidden',marginRight:16}} resizeMode='cover'/>
            </ScrollView>
          </View>

          
          {/* <View 
          style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.grey200 }}
          >
            <TouchableOpacity
              onPress={() => Platform.OS === 'ios' ? Linking.openURL(APPSTORE_URL) : Linking.openURL(GOOGLEPLAY_URL)}
              style={{ padding: 16 }} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text typography='t5' style={{ marginBottom: 4 }}>{Platform.OS === 'ios' ? '앱스토어로 이동' : '플레이스토어로 이동'}</Text>
                  <Text typography='t7' color={colors.grey600}>어플을 다운받아 더 많은 기능을 사용해보세요</Text>
                </View>
                <Text typography='t5' color={colors.grey400}>{'›'}</Text>
              </View>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: colors.grey200 }} />

            <TouchableOpacity
              onPress={async () => {
                try {
                  const storeUrl = Platform.OS === 'ios' ? APPSTORE_URL : GOOGLEPLAY_URL;
                  await share({
                    message: `피오와 함께 식물을 발견하고 탐험해요! 🌿✨\n${storeUrl}`,
                  });
                  // 공유 성공 시 햅틱 피드백
                  generateHapticFeedback({ type: 'success' });
                } catch (error) {
                  // console.log('공유 취소됨');
                }
              }}
              style={{ padding: 16 }} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text typography='t5' style={{ marginBottom: 4 }}>공유하기</Text>
                  <Text typography='t7' color={colors.grey600}>피오를 공유하고 친구들과 함께 사용해보세요</Text>
                </View>
                <Text typography='t5' color={colors.grey400}>{'›'}</Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
      </View>
    </Background>
  );
}