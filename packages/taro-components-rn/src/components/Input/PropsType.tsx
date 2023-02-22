/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import { FormItemProps } from '@tarojs/components'
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

export interface InputProps extends FormItemProps{
  style?: StyleProp<ViewStyle>;
  value?: string;
  type?: 'text' | 'number' | 'idcard' | 'digit';
  password?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxlength?: number;
  autoFocus?: boolean;
  focus?: boolean;
  confirmType: 'done' | 'send' | 'search' | 'next' | 'go';
  confirmHold?: boolean;
  cursor?: number;
  selectionStart?: number;
  selectionEnd?: number;
  placeholderStyle?: string;
  placeholderTextColor?: string;
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
