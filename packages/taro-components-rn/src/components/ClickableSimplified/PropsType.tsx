import { StyleProp, ViewStyle } from 'react-native'

export type NativeEvent = {
  timestamp: number;
  target: any;
  pageX: number;
  pageY: number;
  touches: any[];
  changedTouches: any[];
}

export type ClickableEventRet = {
  type: string;
  timeStamp: number;
  target: any;
  currentTarget: any;
  detail: any;
  touches: any[];
  changedTouches: any[];
}

export interface ClickableProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<ViewStyle>;
  hoverStartTime?: number;
  hoverStayTime?: number;
  onClick?: (event: ClickableEventRet) => void;
  onLongPress?: (event: ClickableEventRet) => void;
  onTouchStart?: (event: ClickableEventRet) => void;
  onTouchMove?: (event: ClickableEventRet) => void;
  onTouchCancel?: (event: ClickableEventRet) => void;
  onTouchEnd?: (event: ClickableEventRet) => void;
}
