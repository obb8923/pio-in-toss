import { createRoute } from '@granite-js/react-native';
import { View } from 'react-native';
import { Button } from '@toss/tds-react-native';
import { useImagePicker } from '../hooks/useImagePicker';
import { Background } from '../components/Background';

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
    <Background isStatusBarGap={false} isTabBarGap={false}>
    <View style={{flex:1, justifyContent:'center', alignItems:'center', gap: 12, paddingHorizontal: 20}}>
      <Button
        display="block"
        onPress={selectFromGallery}
      >
        📷 갤러리에서 선택
      </Button>

      <Button
        display="block"
        onPress={takePhoto}
      >
        📸 카메라로 찍기
      </Button>

      <Button
        display="block"
        onPress={goToAboutPage}
      >
        About 페이지로 이동
      </Button>
    </View>
    </Background>
  );
}

