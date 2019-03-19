import React from 'react';
import { TextStyle } from 'react-native';
export interface ModalPropsType<T> {
  title?: React.ReactNode;
  visible: boolean;
  maskClosable?: boolean;
  closable?: boolean;
  footer?: Action<T>[];
  onClose?: () => void;
  transparent?: boolean;
  popup?: boolean;
  animated?: boolean;
  locale?: object;
  animationType?: any;
  onAnimationEnd?: (visible: boolean) => void;
  animateAppear?: boolean;
  operation?: boolean;
}

export interface Action<T = TextStyle> {
  text: string;
  onPress?: () => void | Promise<any>;
  style?: T | string;
}

export type Callback = (valueOrLogin: string, password?: string) => void;
export type CallbackOrActions<T> = Callback | Action<T>[];
