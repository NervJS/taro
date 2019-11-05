declare namespace Taro {
  namespace startAccelerometer {
    type Param = {
      /**
       * 监听加速度数据回调函数的执行频率 game 适用于更新游戏的回调频率，在 20ms/次 左右 ui 适用于更新 UI 的回调频率，在 60ms/次 左右 normal 普通的回调频率，在 200ms/次 左右
       * @default normal
       */
      interval?: 'game' | 'ui' | 'normal'
      // 接口调用成功的回调函数
      success?: Function
      // 接口调用失败的回调函数
      fail?: Function
      // 接口调用结束的回调函数（调用成功、失败都会执行）
      complete?: Function
    }
  }
  /**
   * 开始监听加速度数据。
   * @name Taro.startAccelerometer(res)
   * @since 1.1.0
   * @example
   * ```javascript
   * import Taro from '@tarojs/taro'
   * 
   * Taro.startAccelerometer({ interval: 'game' })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.startAccelerometer.html
   */
  function startAccelerometer(OBJECT?: startAccelerometer.Param): Promise<any>

  namespace stopAccelerometer {
    type Param = {}
  }
  /**
   * 停止监听加速度数据。
   * @since 1.1.0
   * @example
   * ```javascript
   * import Taro from '@tarojs/taro'
   * 
   * Taro.stopAccelerometer()
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.stopAccelerometer.html
   */
  function stopAccelerometer(OBJECT?: stopAccelerometer.Param): Promise<any>

  namespace onAccelerometerChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * X 轴
       */
      x: number
      /**
       * Y 轴
       */
      y: number
      /**
       * Z 轴
       */
      z: number
    }
  }
  /**
   * 监听加速度数据，频率：5次/秒，接口调用后会自动开始监听，可使用 `Taro.stopAccelerometer` 停止监听。
   * @example
   * ```javascript
   * import Taro from '@tarojs/taro'
   *
   * Taro.onAccelerometerChange(res => {
   *   console.log(res.x)
   *   console.log(res.y)
   *   console.log(res.z)
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.onAccelerometerChange.html
   */
  function onAccelerometerChange(CALLBACK: onAccelerometerChange.Param): void

  // TODO: wx.offAccelerometerChange
}
