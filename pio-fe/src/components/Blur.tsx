import { BlurView } from '@granite-js/react-native';
import { View,ViewStyle ,Platform} from 'react-native';
import { colors } from '@toss/tds-react-native';
export const Blur = ({children,style,innerStyle}: {children?: React.ReactNode,style?:ViewStyle,innerStyle?:ViewStyle}) => {
  const isIOS = Platform.OS === 'ios';
  if(isIOS){
    return (
      <View style={{overflow: 'hidden',...style}}>
        <BlurView blurType="light" blurAmount={20} style={{height:'100%',justifyContent:'center',alignItems:'center',...innerStyle}}>
          {children}
        </BlurView>
      </View>
    );
  }
  return (
    <View style={{
      overflow: 'hidden',
      backgroundColor: colors.background,
      ...style}}>
      <View style={{height:'100%',backgroundColor: colors.background,justifyContent:'center',alignItems:'center',...innerStyle}}>
        {children}
      </View>
    </View>
  );
};