import { BlurView } from '@granite-js/react-native';
import { View,ViewStyle ,Platform} from 'react-native';
import { colors } from '@toss/tds-react-native';
export const Blur = ({children,style}: {children?: React.ReactNode,style?:ViewStyle}) => {
  const isIOS = Platform.OS === 'ios';
  if(isIOS){
    return (
      <View style={{width:"100%",height:"100%",overflow: 'hidden',...style}}>
        <BlurView blurType="light" blurAmount={1} style={{flex:1}}>
          {children}
        </BlurView>
      </View>
    );
  }
  return (
    <View style={{
      width:"100%",
      height:"100%",
      overflow: 'hidden',
      backgroundColor: colors.background,
      ...style}}>
      {children}
    </View>
  );
};