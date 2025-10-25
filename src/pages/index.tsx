import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';

export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();

  const goToAboutPage = () => {
    navigation.navigate('/about');
  };

  const handleImagePickerResponse = async (response: ImagePickerResponse) => {
    if (response.didCancel || response.errorMessage) {
      console.log('이미지 선택 취소 또는 오류:', response.errorMessage);
      return;
    }

    const asset = response.assets?.[0];
    if (!asset?.base64) {
      Alert.alert('오류', '이미지 데이터를 가져올 수 없습니다.');
      return;
    }

    try {
      // 분석 화면으로 이동하면서 base64 데이터 전달
      (navigation as any).navigate('/analyze', { imageBase64: asset.base64 });
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      Alert.alert('오류', '이미지 처리 중 오류가 발생했습니다.');
    }
  };

  const selectFromGallery = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as PhotoQuality,
      includeBase64: true,
    };

    launchImageLibrary(options, handleImagePickerResponse);
  };

  const takePhoto = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as PhotoQuality,
      includeBase64: true,
    };

    launchCamera(options, handleImagePickerResponse);
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#ef4444',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    }}>
      <Text style={{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 16,
      }}>
        🎉 Welcome! 🎉
      </Text>
      <Text style={{
        fontSize: 18,
        color: '#4b5563',
        textAlign: 'center',
        marginBottom: 24,
      }}>
        식물 인식 AI로 식물을 분석해보세요
      </Text>
      
      <TouchableOpacity 
        style={{
          backgroundColor: '#10b981',
          paddingVertical: 12,
          paddingHorizontal: 32,
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          marginBottom: 16,
        }}
        onPress={selectFromGallery}
      >
        <Text style={{
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          📷 갤러리에서 선택
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{
          backgroundColor: '#059669',
          paddingVertical: 12,
          paddingHorizontal: 32,
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          marginBottom: 24,
        }}
        onPress={takePhoto}
      >
        <Text style={{
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          📸 카메라로 찍기
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{
          backgroundColor: '#2563eb',
          paddingVertical: 12,
          paddingHorizontal: 32,
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={goToAboutPage}
      >
        <Text style={{
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          About 페이지로 이동
        </Text>
      </TouchableOpacity>
    </View>
  );
}

