import { CameraProps as _CameraProps } from '@tarojs/components/types/Camera'
import { StyleProp, ViewProps } from 'react-native'

import type { FlashMode } from 'expo-camera'

export interface CameraState {
  hasPermission: boolean | null
}

export interface CameraProps extends _CameraProps {
  ratio?: string
  style?: StyleProp<ViewProps> | any
  flash?: FlashMode
}
