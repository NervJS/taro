import { StyleProp, ViewStyle } from 'react-native';
import { Omit } from 'utility-types';
import { CascaderValue } from './cascader/CascaderTypes';
import { PopupPickerProps } from './PopupPickerTypes';
export interface PickerData {
  value: string | number;
  label: string;
  children?: PickerData[];
}
export interface PickerPropsType extends Omit<PopupPickerProps, 'styles'> {
  data: PickerData[] | PickerData[][];
  cascade?: boolean;
  value?: Array<string | number>;
  format?: (values: string[]) => string;
  cols?: number;
  extra?: string;
  onChange?: (date?: CascaderValue) => void;
  onPickerChange?: (value: CascaderValue) => void;
  itemStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
}
