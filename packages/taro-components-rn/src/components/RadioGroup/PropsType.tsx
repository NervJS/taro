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

export interface RadioGroupProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onChange?: (evt: EventGroupOnChange) => void;
  _onGroupDataInitial?: (value: any) => void;
}
