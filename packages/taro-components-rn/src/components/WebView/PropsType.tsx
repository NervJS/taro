import { StyleProp, ViewStyle } from 'react-native';

export type OnMessageCallbackEvent = {
  detail: {
    data: any[]
  }
}

export type CommonCallbackEvent = {
  detail: {
    src?: string
  }
}

export interface WebViewProps {
  style?: StyleProp<ViewStyle>;
  src?: string;
  onMessage?: (event: OnMessageCallbackEvent) => void;
  onLoad?: (event: CommonCallbackEvent) => void;
  onError?: (event: CommonCallbackEvent) => void;
}
