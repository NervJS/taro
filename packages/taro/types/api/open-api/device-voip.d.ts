import Taro from '../../index'

declare module '../../index' {
  namespace requestDeviceVoIP {
    interface Option {
      /** 设备唯一序列号。由厂商分配，长度不能超过128字节。字符只接受数字，大小写字母，下划线（_）和连字符（-） */
      sn: string
      /** 设备票据，5分钟内有效 */
      snTicket: string
      /** 设备型号 id。通过微信公众平台注册设备获得。 */
      modelId: string
      /** 设备名称，将显示在授权弹窗内（长度不超过13）。授权框中「设备名字」= 「deviceName」 + 「modelId 对应设备型号」 */
      deviceName: string
      /** 是否为授权设备组，默认 false */
      isGroup?: boolean
      /** 设备组的唯一标识 id 。isGroup 为 true 时只需要传该参数，isGroup 为 false 时不需要传该参数，但需要传 sn、snTicket、modelId、deviceName 。 */
      groupId: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getDeviceVoIPList {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      list: DeviceVoIP[]
    }
    interface DeviceVoIP {
      /** 设备唯一序列号。（仅单台设备时） */
      sn: string
      /** 设备型号 id。通过微信公众平台注册设备获得。（仅单台设备时）	 */
      model_id: string
      /** 设备组的唯一标识 id（仅设备组时）  */
      group_id: string
      /** 设备（组）授权状态。0：未授权；1：已授权  */
      status: number
    }
  }

  interface TaroStatic {
    /** 请求用户授权与设备（组）间进行音视频通话
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/device-voip/wx.requestDeviceVoIP.html
     */
    requestDeviceVoIP(option: requestDeviceVoIP.Option): Promise<TaroGeneral.CallbackResult>
    /** 查询当前用户授权的音视频通话设备（组）信息
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/device-voip/wx.getDeviceVoIPList.html
     */
    getDeviceVoIPList(option: getDeviceVoIPList.Option): Promise<getDeviceVoIPList.SuccessCallbackResult>
  }
}
