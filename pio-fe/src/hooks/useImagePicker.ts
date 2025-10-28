import { useState, useCallback } from 'react';
import { 
  openCamera, 
  fetchAlbumPhotos, 
  ImageResponse 
} from '@apps-in-toss/framework';
import { useDialog } from '@toss/tds-react-native';
import { usePermissionGate } from './usePermissionGate';

interface UseImagePickerOptions {
  base64?: boolean;
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
  const dialog = useDialog();

  const defaultOptions = {
    base64: true,
    ...options,
  };

  const cameraPermissionGate = usePermissionGate({
    getPermission: () => openCamera.getPermission(),
    openPermissionDialog: () => openCamera.openPermissionDialog(),
    onPermissionRequested: (status) => console.log(`카메라 권한 요청 결과: ${status}`),
  });

  const albumPermissionGate = usePermissionGate({
    getPermission: () => fetchAlbumPhotos.getPermission(),
    openPermissionDialog: () => fetchAlbumPhotos.openPermissionDialog(),
    onPermissionRequested: (status) => console.log(`앨범 권한 요청 결과: ${status}`),
  });

  const handleImageResponse = async (response: ImageResponse | ImageResponse[] | undefined) => {
    setIsProcessing(false);
    
    if (!response) {
      console.log('이미지 선택 취소');
      return;
    }

    // fetchAlbumPhotos는 배열을 반환하므로 첫 번째 이미지만 사용
    const imageData = Array.isArray(response) ? response[0] : response;
    
    if (!imageData?.dataUri) {
      dialog.openAlert({ title: '오류', description: '이미지 데이터를 가져올 수 없습니다.' });
      return;
    }

    try {
      const base64Data = defaultOptions.base64 
        ? imageData.dataUri 
        : `data:image/jpeg;base64,${imageData.dataUri}`;
      onImageSelected(base64Data);
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      dialog.openAlert({ title: '오류', description: '이미지 처리 중 오류가 발생했습니다.' });
    }
  };

  const selectFromGallery = useCallback(async () => {
    setIsProcessing(true);
    try {
      const response = await albumPermissionGate.ensureAndRun(() =>
        fetchAlbumPhotos({ maxCount: 1, maxWidth: 1280, base64: defaultOptions.base64 })
      );
      await handleImageResponse(response);
    } catch (error) {
      setIsProcessing(false);
      console.error('갤러리 선택 중 오류:', error);
      dialog.openAlert({ title: '오류', description: '갤러리에서 이미지를 선택할 수 없습니다.' });
    }
  }, [albumPermissionGate, defaultOptions.base64]);

  const takePhoto = useCallback(async () => {
    setIsProcessing(true);
    try {
      const response = await cameraPermissionGate.ensureAndRun(() =>
        openCamera({ maxWidth: 1280, base64: defaultOptions.base64 })
      );
      await handleImageResponse(response);
    } catch (error) {
      setIsProcessing(false);
      console.error('카메라 촬영 중 오류:', error);
      dialog.openAlert({ title: '오류', description: '카메라로 사진을 촬영할 수 없습니다.' });
    }
  }, [cameraPermissionGate, defaultOptions.base64]);

  return {
    isProcessing,
    selectFromGallery,
    takePhoto,
  };
};