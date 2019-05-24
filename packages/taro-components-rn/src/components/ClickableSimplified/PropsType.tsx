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
  style?: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<ViewStyle>;
  hoverStartTime?: number;
  hoverStayTime?: number;
  onClick?: (event: ClickableEventRet) => void;
  onLongPress?: (event: ClickableEventRet) => void;
  onTouchstart?: (event: ClickableEventRet) => void;
  onTouchmove?: (event: ClickableEventRet) => void;
  onTouchcancel?: (event: ClickableEventRet) => void;
  onTouchend?: (event: ClickableEventRet) => void;
}
