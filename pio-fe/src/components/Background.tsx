import { View, ViewStyle } from "react-native"
import { TAB_BAR_HEIGHT } from "../constants/TabNavOptions"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors } from '@toss/tds-react-native';
type BackgroundProps = {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle | ViewStyle[];
  type?: 'green' | 'white' ;
  isStatusBarGap?: boolean;
  isTabBarGap?: boolean;
}
export const Background = ({children,isStatusBarGap=false,type='green',isTabBarGap=true,...props}: BackgroundProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ backgroundColor: colors.grey100, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    {type === 'white' && <View style={{ flex: 1, marginHorizontal: 2, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white', opacity: 0.9 }}/>}
    <View 
    style={{ flex: 1,
      paddingTop: isStatusBarGap ? insets.top : 0,
      paddingBottom: isTabBarGap?TAB_BAR_HEIGHT:0,
      ...props.style }}>
      {children}
    </View>
    </View>    
  )
}
