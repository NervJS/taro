import { ViewStyle, StyleProp } from 'react-native'

export type EventOnChange = {
  value: any;
  checked: boolean;
}

export interface CheckboxState {
  checked: boolean;
}

export interface CheckboxProps {
  style?: StyleProp<ViewStyle>;
  value: any;
  disabled?: boolean;
  checked?: boolean;
  color?: string;
  onChange?: (evt: EventOnChange) => void;
}
