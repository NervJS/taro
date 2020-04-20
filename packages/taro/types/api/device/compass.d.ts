declare namespace Taro {
  namespace stopCompass {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 停止监听罗盘数据。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.stopCompass()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.stopCompass.html
   */
  function stopCompass(OBJECT?: stopCompass.Param): Promise<any>

  namespace startCompass {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 开始监听罗盘数据。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startCompass()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.startCompass.html
   */
  function startCompass(OBJECT?: startCompass.Param): Promise<any>

  namespace onCompassChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 面对的方向度数
       */
      direction: number
    }
  }
  /**
   * 监听罗盘数据，频率：5次/秒，接口调用后会自动开始监听，可使用`Taro.stopCompass`停止监听。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.onCompassChange(function (res) {
     console.log(res.direction)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.onCompassChange.html
   */
  function onCompassChange(CALLBACK: onCompassChange.Param): void

  // TODO: wx.offCompassChange
}
