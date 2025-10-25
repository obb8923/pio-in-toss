import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../components/common/Button';
import { useImagePicker } from '../hooks/useImagePicker';
import { styles } from '../styles/common';

export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();

  const goToAboutPage = () => {
    navigation.navigate('/about');
  };

  const handleImageSelected = (base64: string) => {
    (navigation as any).navigate('/analyze', { imageBase64: base64 });
  };

  const { selectFromGallery, takePhoto } = useImagePicker(handleImageSelected);

  return (
    <View style={[styles.container, styles.mainContainer]}>
      <Text style={[styles.welcomeTitle, styles.textPrimary, styles.textCenter]}>
        🎉 Welcome! 🎉
      </Text>
      <Text style={[styles.welcomeSubtitle, styles.textMuted, styles.textCenter]}>
        식물 인식 AI로 식물을 분석해보세요
      </Text>
      
      <Button
        title="📷 갤러리에서 선택"
        variant="success"
        style={styles.buttonSpacing}
        onPress={selectFromGallery}
      />

      <Button
        title="📸 카메라로 찍기"
        variant="info"
        style={styles.lastButtonSpacing}
        onPress={takePhoto}
      />

      <Button
        title="About 페이지로 이동"
        variant="primary"
        onPress={goToAboutPage}
      />
    </View>
  );
}

