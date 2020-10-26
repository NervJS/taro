import * as React from 'react'
import { ViewStyle, StyleProp } from 'react-native'

export type EventOnChange = {
  value: any;
  checked: boolean;
}

export type EventGroupOnChange = {
  detail: {
    value: any[];
  }
}

export interface CheckboxState {
  checked: boolean;
}

export interface CheckboxProps {
  style?: StyleProp<ViewStyle>;
  value: any;
  disabled?: boolean;
  checked?: boolean;
  color: string;
  onChange?: (evt: EventOnChange) => void;
}

export interface CheckboxGroupProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onChange?: (evt: EventGroupOnChange) => void;
  _onGroupDataInitial?: (values: any[]) => void;
}
