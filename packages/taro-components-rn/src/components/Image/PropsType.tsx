/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import { StyleProp, ImageStyle, ImageResizeMode } from 'react-native'
import { ImageProps as _ImageProps } from '@tarojs/components/types/Image'
export interface ImageState {
  ratio: number;
  layoutWidth: number;
}

export type ResizeModeMap = Partial<Record<keyof _ImageProps.Mode, ImageResizeMode>>;
// 其实上面的写法是和下面的是等价了，下面可阅读性高点，上面优雅一点
// export type ResizeModeMap = {
//   [key in keyof _ImageProps.mode]?: ImageResizeMode;
// }

export type ResizeMode = ImageResizeMode | undefined

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
  mode?:keyof _ImageProps.Mode;
  onError?: (event: EventError) => void;
  onLoad?: (event: EventLoad) => void;
  svg?: boolean;
}
