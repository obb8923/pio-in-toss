import { useState } from 'react';
import { Alert } from 'react-native';
import { 
  launchImageLibrary, 
  launchCamera, 
  ImagePickerResponse, 
  MediaType, 
  PhotoQuality 
} from 'react-native-image-picker';

interface UseImagePickerOptions {
  quality?: PhotoQuality;
  includeBase64?: boolean;
}

interface UseImagePickerReturn {
  isProcessing: boolean;
  selectFromGallery: () => void;
  takePhoto: () => void;
}

export const useImagePicker = (
  onImageSelected: (base64: string) => void,
  options: UseImagePickerOptions = {}
): UseImagePickerReturn => {
  const [isProcessing, setIsProcessing] = useState(false);

  const defaultOptions = {
    quality: 0.8 as PhotoQuality,
    includeBase64: true,
    ...options,
  };

  const handleImagePickerResponse = async (response: ImagePickerResponse) => {
    setIsProcessing(false);
    
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
      onImageSelected(asset.base64);
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      Alert.alert('오류', '이미지 처리 중 오류가 발생했습니다.');
    }
  };

  const selectFromGallery = () => {
    setIsProcessing(true);
    const pickerOptions = {
      mediaType: 'photo' as MediaType,
      ...defaultOptions,
    };
    launchImageLibrary(pickerOptions, handleImagePickerResponse);
  };

  const takePhoto = () => {
    setIsProcessing(true);
    const pickerOptions = {
      mediaType: 'photo' as MediaType,
      ...defaultOptions,
    };
    launchCamera(pickerOptions, handleImagePickerResponse);
  };

  return {
    isProcessing,
    selectFromGallery,
    takePhoto,
  };
};
