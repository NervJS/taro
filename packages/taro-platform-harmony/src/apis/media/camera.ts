import { temporarilyNotSupport } from '../utils'

import type Taro from '@tarojs/taro/types'

// 相机
class CameraContext implements Taro.CameraContext {
  onCameraFrame = temporarilyNotSupport('CameraContext.onCameraFrame') as unknown as Taro.CameraContext['onCameraFrame']
  setZoom = temporarilyNotSupport('CameraContext.setZoom')
  startRecord = temporarilyNotSupport('CameraContext.startRecord')
  stopRecord = temporarilyNotSupport('CameraContext.stopRecord')
  takePhoto = temporarilyNotSupport('CameraContext.takePhoto')
}

export const createCameraContext: typeof Taro.createCameraContext = (_?: string) => {
  return new CameraContext()
}
