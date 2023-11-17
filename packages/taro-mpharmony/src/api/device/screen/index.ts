import { temporarilyNotSupport } from '../../../utils'

/**
 * 设置截屏/录屏时屏幕表现
 * 
 * @canNotUse setVisualEffectOnCapture
 */
export const setVisualEffectOnCapture = /* @__PURE__ */ temporarilyNotSupport('setVisualEffectOnCapture')

/**
 * 监听用户录屏事件
 * 
 * @canNotUse onScreenRecordingStateChanged
 */
export const onScreenRecordingStateChanged = /* @__PURE__ */ temporarilyNotSupport('onScreenRecordingStateChanged')

/**
 * 取消用户录屏事件的监听函数
 * 
 * @canNotUse offScreenRecordingStateChanged
 */
export const offScreenRecordingStateChanged = /* @__PURE__ */ temporarilyNotSupport('offScreenRecordingStateChanged')

/**
 * 查询用户是否在录屏
 * 
 * @canNotUse getScreenRecordingState
 */
export const getScreenRecordingState = /* @__PURE__ */ temporarilyNotSupport('getScreenRecordingState')

export * from './getScreenBrightness'
export * from './offUserCaptureScreen'
export * from './onUserCaptureScreen'
export * from './setKeepScreenOn'
export * from './setScreenBrightness'
