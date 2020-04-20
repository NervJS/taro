declare namespace Taro {
  namespace setScreenBrightness {
    type Param = {
      /**
       * 屏幕亮度值，范围 0~1，0 最暗，1 最亮
       */
      value: number
    }
  }
  /**
   * @since 1.2.0
   *
   * 设置屏幕亮度。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setScreenBrightness.html
   */
  function setScreenBrightness(OBJECT: setScreenBrightness.Param): Promise<any>

  namespace setKeepScreenOn {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 是否保持屏幕常亮
       */
      keepScreenOn: boolean
    }
  }
  /**
   * @since 1.4.0
   *
   * 设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效。
   *
   * **示例代码：**
   *
   ```javascript
   // 保持屏幕常亮
   Taro.setKeepScreenOn({
       keepScreenOn: true
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setKeepScreenOn.html
   */
  function setKeepScreenOn(OBJECT: setKeepScreenOn.Param): Promise<setKeepScreenOn.Promised>

  /**
   * @since 1.4.0
   *
   * 监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件
   *
   * **示例代码：**
   *
   ```javascript
   Taro.onUserCaptureScreen(function(res) {
       console.log('用户截屏了')
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.onUserCaptureScreen.html
   */
  function onUserCaptureScreen(CALLBACK: any): void

  namespace getScreenBrightness {
    type Promised = {
      /**
       * 屏幕亮度值，范围 0~1，0 最暗，1 最亮
       */
      value: number
    }
    type Param = {}
  }
  /**
   * @since 1.2.0
   *
   * 获取屏幕亮度。
   *
   * **Bug & Tip：**
   *
   * 1. `tip`: `getScreenBrightness` 接口若安卓系统设置中开启了自动调节亮度功能，则屏幕亮度会根据光线自动调整，该接口仅能获取自动调节亮度之前的值，而非实时的亮度值。
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.getScreenBrightness.html
   */
  function getScreenBrightness(OBJECT?: getScreenBrightness.Param): Promise<getScreenBrightness.Promised>

  // TODO: wx.offUserCaptureScreen
}
