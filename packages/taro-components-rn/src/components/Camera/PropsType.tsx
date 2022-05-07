import type { FlashMode } from 'expo-camera'
import { CameraProps as _CameraProps } from '@tarojs/components/types/Camera'
import { StyleProp, ViewProps } from 'react-native'

export interface CameraState {
  hasPermission: boolean | null;
}

export interface CameraProps extends _CameraProps {
  ratio?: string;
  style?: StyleProp<ViewProps> | any;
  flash?: FlashMode
}
