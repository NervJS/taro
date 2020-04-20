declare namespace Taro {
  namespace stopHCE {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 错误码
       */
      errCode: number
    }
    type Param = {}
  }
  /**
   * @since 1.7.0
   *
   * 关闭 NFC 模块。仅在安卓系统下有效。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.stopHCE({
     success: function(res) {
       console.log(res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.stopHCE.html
   */
  function stopHCE(OBJECT?: stopHCE.Param): Promise<stopHCE.Promised>

  namespace startHCE {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 错误码
       */
      errCode: number
    }
    type Param = {
      /**
       * 需要注册到系统的 AID 列表，每个 AID 为 String 类型
       */
      aid_list: any[]
    }
  }
  /**
   * @since 1.7.0
   *
   * 初始化 NFC 模块。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startHCE({
     aid_list: ['F222222222']
     success: function(res) {
       console.log(res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.startHCE.html
   */
  function startHCE(OBJECT: startHCE.Param): Promise<startHCE.Promised>

  namespace sendHCEMessage {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 错误码
       *
       * **errCode列表：**
       *
       * 每个接口调用的时候，都会返回 `errCode` 字段。
       *
       *   错误码  |  说明
       * ----------|---------------------------
       *   0       |  Ok
       *   13000   |  当前设备不支持 NFC
       *   13001   |当前设备支持 NFC，但系统NFC开关未开启
       *   13002   |当前设备支持 NFC，但不支持HCE
       *   13003   |  AID 列表参数格式错误
       *   13004   |未设置微信为默认NFC支付应用
       *   13005   |  返回的指令不合法
       *   13006   |  注册 AID 失败
       */
      errCode: number
    }
    type Param = {
      /**
       * 二进制数据
       */
      data: ArrayBuffer
    }
  }
  /**
   * @since 1.7.0
   *
   * 发送 NFC 消息。仅在安卓系统下有效。
   *
   * **success返回参数说明：**
   *
   ```javascript
   const buffer = new ArrayBuffer(1)
   const dataView = new DataView(buffer)
   dataView.setUint8(0, 0)
         Taro.startHCE({
     success: function(res) {
       Taro.onHCEMessage(function(res) {
         if (res.messageType === 1) {
           Taro.sendHCEMessage({data: buffer})
         }
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.sendHCEMessage.html
   */
  function sendHCEMessage(OBJECT: sendHCEMessage.Param): Promise<sendHCEMessage.Promised>

  namespace onHCEMessage {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 消息类型
       */
      messageType: number
      /**
       * 客户端接收到 NFC 设备的指令，此参数当且仅当 `messageType=1` 时有效
       */
      data: ArrayBuffer
      /**
       * 此参数当且仅当 `messageType=2` 时有效
       */
      reason: number
    }
  }
  /**
   * @since 1.7.0
   *
   * 监听 NFC 设备的消息回调，并在回调中处理。返回参数中 `messageType` 表示消息类型，目前有如下值：
   *
   * *   1：消息为HCE Apdu Command类型，小程序需对此指令进行处理，并调用 `sendHCEMessage` 接口返回处理指令；
   * *   2：消息为设备离场事件
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.onHCEMessage.html
   */
  function onHCEMessage(CALLBACK: onHCEMessage.Param): void

  namespace getHCEState {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 错误码
       */
      errCode: number
    }
    type Param = {}
  }
  /**
   * @since 1.7.0
   *
   * 判断当前设备是否支持 HCE 能力。
   *
   * **success返回参数说明：**
   *
   ```javascript
   Taro.getHCEState({
     success: function(res) {
       console.log(res.errCode)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.getHCEState.html
   */
  function getHCEState(OBJECT?: getHCEState.Param): Promise<getHCEState.Promised>

  // TODO: wx.offHCEMessage
}
