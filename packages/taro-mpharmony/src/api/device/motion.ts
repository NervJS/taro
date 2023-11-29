/**
 * 停止监听设备方向的变化。
 * 
 * @canUse stopDeviceMotionListening
 */
export { stopDeviceMotionListening } from '@tarojs/taro-h5'

/**
 * 开始监听设备方向的变化。
 * 
 * @canUse startDeviceMotionListening
 * @__object [interval[game, ui, normal]]
 */
export { startDeviceMotionListening } from '@tarojs/taro-h5'

/**
 * 监听设备方向变化事件。
 * 
 * @canUse onDeviceMotionChange
 * @__callback [alpha, beta, gamma]
 */
export { onDeviceMotionChange } from '@tarojs/taro-h5'

/**
 * 取消监听设备方向变化事件，参数为空，则取消所有的事件监听。
 * 
 * @canUse offDeviceMotionChange
 */
export { offDeviceMotionChange } from '@tarojs/taro-h5'
