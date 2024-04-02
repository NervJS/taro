import Taro from '@tarojs/taro'

/**
 * 停止录音
 * 
 * @canNotUse stopRecord
 */
export { stopRecord } from '@tarojs/taro-h5'

/**
 * 开始录音
 * 
 * @canNotUse startRecord
 */
export { startRecord } from '@tarojs/taro-h5'

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