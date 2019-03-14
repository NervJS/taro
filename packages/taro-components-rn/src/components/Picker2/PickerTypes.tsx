import { StyleProp, ViewStyle } from "react-native";

export type PickerProps = {
  disabled?: boolean;
  selectedValue?: any;
  onValueChange?: (value: any) => void;
  itemStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  indicatorClassName?: string;
  defaultSelectedValue?: any;
  style?: StyleProp<ViewStyle>;
  onScrollChange?: (value: any) => void;
  noAnimate?: boolean;
};
