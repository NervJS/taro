declare namespace Taro {
  namespace stopAccelerometer {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 停止监听加速度数据。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.stopAccelerometer()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.stopAccelerometer.html
   */
  function stopAccelerometer(OBJECT?: stopAccelerometer.Param): Promise<any>

  namespace startAccelerometer {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 开始监听加速度数据。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startAccelerometer()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.startAccelerometer.html
   */
  function startAccelerometer(OBJECT?: startAccelerometer.Param): Promise<any>

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
   *
   * **示例代码：**
   *
   ```javascript
   Taro.onAccelerometerChange(function(res) {
     console.log(res.x)
     console.log(res.y)
     console.log(res.z)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.onAccelerometerChange.html
   */
  function onAccelerometerChange(CALLBACK: onAccelerometerChange.Param): void

  // TODO: wx.offAccelerometerChange
}
