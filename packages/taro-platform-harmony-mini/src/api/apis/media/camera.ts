import Taro from '@tarojs/taro'

/**
 * 创建 camera 上下文 CameraContext 对象
 * 
 * @canUse createCameraContext
 */
export const createCameraContext: typeof Taro.createCameraContext = () => {
  // @ts-ignore
  return native.createCameraContext()
}

/**
 * CameraContext 实例
 * 
 * @canUse CameraContext
 * @__class [startRecord, stopRecord, takePhoto]
 */

/**
 * CameraContext.onCameraFrame() 返回的监听器
 * 
 * @canNotUse CameraFrameListener
 */