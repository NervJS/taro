declare namespace Taro {
  namespace stopHCE {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.NFCError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.NFCError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.NFCError) => void
    }
  }
  /**
   * 关闭 NFC 模块。仅在安卓系统下有效。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.stopHCE({
   *   success: function (res) {
   *     console.log(res.errMsg)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.stopHCE.html
   */
  function stopHCE(option?: stopHCE.Option): Promise<General.NFCError>

  namespace startHCE {
    interface Option {
      /** 需要注册到系统的 AID 列表 */
      aid_list: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.NFCError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.NFCError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.NFCError) => void
  }
  }
  /**
   * 初始化 NFC 模块。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.startHCE({
   *   aid_list: ['F222222222']
   *   success: function (res) {
   *     console.log(res.errMsg)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.startHCE.html
   */
  function startHCE(option: startHCE.Option): Promise<General.NFCError>

  namespace sendHCEMessage {
    interface Option {
      /** 二进制数据 */
      data: ArrayBuffer
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.NFCError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.NFCError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.NFCError) => void
    }
  }
  /**
   * 发送 NFC 消息。仅在安卓系统下有效。
   * @supported weapp
   * @example
   * ```tsx
   * const buffer = new ArrayBuffer(1)
   * const dataView = new DataView(buffer)
   * dataView.setUint8(0, 0)
   *       Taro.startHCE({
   *   success: function (res) {
   *     Taro.onHCEMessage(function (res) {
   *       if (res.messageType === 1) {
   *         Taro.sendHCEMessage({data: buffer})
   *       }
   *     })
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.sendHCEMessage.html
   */
  function sendHCEMessage(option: sendHCEMessage.Option): Promise<General.NFCError>

  namespace onHCEMessage {
    /** 接收 NFC 设备消息事件的回调函数 */
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      /** `messageType=1` 时 ,客户端接收到 NFC 设备的指令 */
      data: ArrayBuffer
      /** 消息类型 */
      messageType: keyof messageType
      /** `messageType=2` 时，原因 */
      reason: number
    }

    /** 消息类型 */
    interface messageType {
      /** HCE APDU Command类型，小程序需对此指令进行处理，并调用 sendHCEMessage 接口返回处理指令 */
      1
      /** 设备离场事件类型 */
      2
    }
  }
  /**
   * 监听接收 NFC 设备消息事件，仅能注册一个监听
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.onHCEMessage.html
   */
  function onHCEMessage(
    /** 接收 NFC 设备消息事件的回调函数 */
    callback: onHCEMessage.Callback,
  ): void

  namespace getHCEState {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.NFCError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.NFCError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.NFCError) => void
  }
  }
  /**
   * 判断当前设备是否支持 HCE 能力。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.getHCEState({
   *   success: function (res) {
   *     console.log(res.errCode)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.getHCEState.html
   */
  function getHCEState(option?: getHCEState.Option): Promise<General.NFCError>

  /** 接收 NFC 设备消息事件，取消事件监听。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.offHCEMessage.html
   */
  function offHCEMessage(
    /** 接收 NFC 设备消息事件的回调函数 */
    callback: (...args: any[]) => any,
  ): void
}
