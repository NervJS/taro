import { StyleProp, ViewStyle, Animated } from 'react-native';

export interface ButtonState {
  valve: Animated.Value;
  isHover: boolean;
}

export interface ButtonProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  size: 'default' | 'mini';
  type: 'primary' | 'default' | 'warn';
  plain?: boolean;
  disabled?: boolean;
  loading?: boolean;
  formType?: 'submit' | 'reset';
  hoverStyle?: StyleProp<ViewStyle>;
  // hoverStopPropagation: boolean;
  hoverStartTime?: number;
  hoverStayTime?: number;
  onClick?: () => void;
}
