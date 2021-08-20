/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
  maxlength?: number;
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
