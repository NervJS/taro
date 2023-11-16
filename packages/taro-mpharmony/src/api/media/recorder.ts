import Taro from '@tarojs/taro'

import { temporarilyNotSupport } from '../../utils'

/**
 * 停止录音
 * 
 * @canNotUse stopRecord
 */
export const stopRecord = /* @__PURE__ */ temporarilyNotSupport('stopRecord')

/**
 * 开始录音
 * 
 * @canNotUse startRecord
 */
export const startRecord = /* @__PURE__ */ temporarilyNotSupport('startRecord')

/**
 * 获取全局唯一的录音管理器
 * 
 * @canUse getRecorderManager
 */
export const getRecorderManager: typeof Taro.getRecorderManager = () => {
  // @ts-ignore
  return native.getRecorderManager()
}

/**
 * 全局唯一的录音管理器
 * 
 * @canUse RecorderManager
 * @__class 
 * [onError, onFrameRecorded, onInterruptionBegin, onInterruptionEnd, onPause, onResume, onStart, onStop, pause, resume,\
 * start, stop]
 */