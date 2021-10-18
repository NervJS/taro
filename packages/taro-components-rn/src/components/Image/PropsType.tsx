import { StyleProp, ImageStyle, ImageResizeMode } from 'react-native'
import { ImageProps as _ImageProps } from '@tarojs/components/types/Image'
export interface ImageState {
  ratio: number;
  layoutWidth: number;
}

export type ResizeModeMap = Partial<Record<keyof _ImageProps.mode, ImageResizeMode>>;
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
  mode?:keyof _ImageProps.mode;
  onError?: (event: EventError) => void;
  onLoad?: (event: EventLoad) => void;
}
