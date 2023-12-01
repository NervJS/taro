/**
 * 设置截屏/录屏时屏幕表现
 * 
 * @canNotUse setVisualEffectOnCapture
 */
export { setVisualEffectOnCapture } from '@tarojs/taro-h5'

/**
 * 监听用户录屏事件
 * 
 * @canNotUse onScreenRecordingStateChanged
 */
export { onScreenRecordingStateChanged } from '@tarojs/taro-h5'

/**
 * 取消用户录屏事件的监听函数
 * 
 * @canNotUse offScreenRecordingStateChanged
 */
export { offScreenRecordingStateChanged } from '@tarojs/taro-h5'

/**
 * 
 * 查询用户是否在录屏
 * 
 * @canNotUse getScreenRecordingState
 */
export * from './getScreenBrightness'
export * from './offUserCaptureScreen'
export * from './onUserCaptureScreen'
export * from './setKeepScreenOn'
export * from './setScreenBrightness'
export { getScreenRecordingState } from '@tarojs/taro-h5'
