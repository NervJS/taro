import { FormItemProps } from '@tarojs/components'
import { RadioGroupProps as _RadioGroupProps } from '@tarojs/components/types/RadioGroup'
import { StyleProp, ViewStyle } from 'react-native'

export type EventOnChange = {
  value: any;
  checked: boolean;
}

export type EventGroupOnChange = {
  detail: {
    value: any;
  };
}

export interface RadioGroupState {
  checkedValue?: string;
}

export interface RadioGroupProps extends FormItemProps, _RadioGroupProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle> | any;
  onChange?: (evt: EventGroupOnChange) => void;
  _onGroupDataInitial?: (value: any) => void;
}
