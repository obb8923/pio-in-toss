import { View, ViewStyle, Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors } from '@toss/tds-react-native';
type BackgroundProps = {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle | ViewStyle[];
  type?: 'green' | 'white' ;
  isInsetTop?: boolean;
  isInsetBottom?: boolean;
}
export const Background = ({children,isInsetTop=false,type='white',isInsetBottom=true,...props}: BackgroundProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      {type === 'white' && 
      <View
        style={{ backgroundColor: colors.greyBackground, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      }
      {type === 'green' && 
     <Image source={{uri:'https://hiqdelhkugdugbcvvxxb.supabase.co/storage/v1/object/public/public_bucket/background.png'}} 
     style={{position:'absolute',top: 0,left: 0,right: 0,bottom: 0,width:'100%',height:'100%'}} resizeMode='cover' />
      }
    <View 
    style={{ flex: 1,
      paddingTop: isInsetTop ? insets.top : 0,
      paddingBottom: isInsetBottom ? insets.bottom : 0,
      ...props.style }}>
      {children}
    </View>
    </View>    
  )
}
