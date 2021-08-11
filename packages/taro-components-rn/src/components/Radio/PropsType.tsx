import { StyleProp, ViewStyle } from 'react-native'

export type EventOnChange = {
  value: any;
  checked: boolean;
}

export interface RadioState {
  checked: boolean;
}

export interface RadioProps {
  style?: StyleProp<ViewStyle>;
  value: any;
  disabled?: boolean;
  checked?: boolean;
  color: string;
  onChange?: (evt: EventOnChange) => void;
}
