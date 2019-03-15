import { StyleProp, ViewStyle } from "react-native";

export interface PickerCol {
  key?: string;
  props?: any;
}

interface MultiPickerProps {
  selectedValue?: any[];
  rootNativeProps?: any;
  onValueChange?: (v?: any, i?: number) => void;
  children?: any;
  style?: StyleProp<ViewStyle>;
  onScrollChange?: (v?: any, i?: number) => void;
}

export default MultiPickerProps;
