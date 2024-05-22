import * as React from 'react'
import { ViewStyle, StyleProp } from 'react-native'

import type { FormItemProps } from '@tarojs/components'

export type EventOnChange = {
  value: any;
  checked: boolean;
};

export type EventGroupOnChange = {
  detail: {
    value: any[];
  };
};

export interface CheckboxGroupProps extends FormItemProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onChange?: (evt: EventGroupOnChange) => void;
  _onGroupDataInitial?: (values: any[]) => void;
}

export interface ValueProps {
  value: any;
  checked: boolean;
}
