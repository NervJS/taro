import { ViewStyle, StyleProp } from 'react-native'

export type Event = {
  target: { value?: string };
  detail: { value?: string };
}

export type EventOnLineChange = {
  detail: {
    height: number;
    lineCount: number;
  };
}

export interface InputState {
  returnValue?: string;
  height: number;
  value?: string;
}

export interface InputProps {
  style?: StyleProp<ViewStyle>;
  value?: string;
  type: 'text' | 'number' | 'idcard' | 'digit';
  password?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxLength: number;
  autoFocus?: boolean;
  confirmType: 'done' | 'send' | 'search' | 'next' | 'go';
  confirmHold?: boolean;
  cursor?: number;
  selectionStart: number;
  selectionEnd: number;
  onInput?: (evt: Event) => void;
  onChange?: (evt: Event) => void;
  onFocus?: (evt: Event) => void;
  onBlur?: (evt: Event) => void;
  onKeyDown?: (evt: Partial<Event> & { which?: number }) => void;
  onConfirm?: (evt: Event) => void;
  // Private
  _multiline?: boolean;
  _autoHeight?: boolean;
  _onLineChange?: (evt: EventOnLineChange) => void;
}
