import React from 'react';

export type PopupPickerProps = {
  picker?: any;
  value?: any;
  triggerType?: string;
  WrapComponent?: any;
  dismissText?: string | React.ReactElement<any>; // React.ReactElement only for web
  okText?: string | React.ReactElement<any>; // React.ReactElement only for web
  title?: string | React.ReactElement<any>; // React.ReactElement only for web
  visible?: boolean;
  disabled?: boolean;
  onOk?: (value?: any) => void;
  style?: any;
  onVisibleChange?: (visible: boolean) => void;
  content?: React.ReactElement<any> | string;
  onDismiss?: () => void;
  styles?: any;
  actionTextUnderlayColor?: string;
  actionTextActiveOpacity?: number;
  wrapStyle?: React.CSSProperties;
  pickerValueProp?: string;
  pickerValueChangeProp?: string;
  transitionName?: string;
  popupTransitionName?: string;
  maskTransitionName?: string;
};
