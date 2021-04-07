import * as React from 'react'
import { ViewStyle, StyleProp } from 'react-native'

export type FormValues = {
  [key: string]: any;
}

export type EventOnSubmit = {
  detail: {
    value: any;
  };
}

export interface FormProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onSubmit?: (evt: EventOnSubmit) => void;
  onReset?: () => void;
}
