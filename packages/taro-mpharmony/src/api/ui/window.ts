/**
 * 设置窗口大小，该接口仅适用于 PC 平台，使用细则请参见指南
 * 
 * @canNotUse setWindowSize
 */
export { setWindowSize } from '@tarojs/taro-h5'

/**
 * 监听窗口尺寸变化事件
 * 
 * @canUse onWindowResize
 */
export { onWindowResize } from '@tarojs/taro-h5'

/**
 * 取消监听窗口尺寸变化事件
 * 
 * @canUse offWindowResize
 */
export { offWindowResize } from '@tarojs/taro-h5'

/**
 * 返回当前是否存在小窗播放
 * 
 * @canNotUse checkIsPictureInPictureActive
 */
export { checkIsPictureInPictureActive } from '@tarojs/taro-h5'
