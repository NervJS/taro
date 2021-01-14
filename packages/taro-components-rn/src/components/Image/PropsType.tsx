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
