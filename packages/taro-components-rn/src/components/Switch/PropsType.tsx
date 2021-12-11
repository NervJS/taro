import { FormItemProps } from '@tarojs/components'
import { StyleProp, ViewStyle } from 'react-native'

export type EventOnChange = {
  detail: {
    value: boolean;
  };
}

export interface SwitchState {
  checked: boolean;
}

export interface SwitchProps extends FormItemProps {
  style?: StyleProp<ViewStyle>;
  checked?: boolean;
  disabled?: boolean;
  type: 'switch' | 'checkbox';
  color: string;
  onChange?: (evt: EventOnChange) => void;
}
