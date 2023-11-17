import Taro from '@tarojs/taro'

/**
 * 监听陀螺仪数据变化事件。频率根据 Taro.startGyroscope() 的 interval 参数。可以使用 Taro.stopGyroscope() 停止监听。
 * 
 * @canUse onGyroscopeChange
 * @__callback [x, y, z]
 */
export const onGyroscopeChange: typeof Taro.onGyroscopeChange = (callback) => {
  // @ts-ignore
  return native.onGyroscopeChange(callback)
}
