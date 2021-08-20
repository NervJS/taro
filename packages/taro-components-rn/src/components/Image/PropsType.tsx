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

import { StyleProp, ImageStyle } from 'react-native'

export interface ImageState {
  ratio: number;
  layoutWidth: number;
}

export enum Mode {
  ScaleToFill = 'scaleToFill',
  AspectFit = 'aspectFit',
  AspectFill = 'aspectFill',
  WidthFix = 'widthFix',
  Top = 'top',
  Bottom = 'bottom',
  Center = 'center',
  Left = 'left',
  Right = 'right',
  TopLeft = 'top left',
  TopRight = 'top right',
  BottomLeft = 'bottom left',
  BottomRight = 'bottom right'
}

export type ResizeModeMap = {
  // [key in Mode]: string
  [Mode.ScaleToFill]: string;
  [Mode.AspectFit]: string;
  [Mode.AspectFill]: string;
  [Mode.Center]: string;
  [key: string]: string;
}

export type ResizeMode = 'cover' | 'contain' | 'stretch' | 'repeat' | 'center' | undefined

export type EventError = {
  detail: {
    errMsg: string;
  };
}

export type EventLoad = {
  detail: {
    width: number;
    height: number;
  };
}

export interface ImageProps {
  style?: StyleProp<ImageStyle>;
  src: string;
  mode?: Mode;
  onError?: (event: EventError) => void;
  onLoad?: (event: EventLoad) => void;
}
