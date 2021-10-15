import { StyleProp, ViewStyle } from 'react-native'
import { RadioProps as _RadioProps } from '@tarojs/components/types/Radio'

export type EventOnChange = {
  value: any;
  checked: boolean;
}

export interface RadioState {
  checked: boolean;
}

export interface RadioProps extends _RadioProps {
  style?: StyleProp<ViewStyle>|any;
  /* rn独有的，在taro里面看不到，得翻源码才能看到 **/
  onChange?: (evt: EventOnChange) => void;
}
