import { StyleProp, ViewStyle } from 'react-native'

import type { FormItemProps } from '@tarojs/components'

export type EventOnChange = {
  detail: {
    value: boolean;
  };
}

export interface SwitchState {
  checked?: boolean;
  pChecked?: boolean;
}

export interface SwitchProps extends FormItemProps {
  style?: StyleProp<ViewStyle>;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  type: 'switch' | 'checkbox';
  color: string;
  onChange?: (evt: EventOnChange) => void;
}
