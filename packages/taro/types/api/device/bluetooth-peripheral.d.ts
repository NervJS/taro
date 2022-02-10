import Taro from '../../index'

declare module '../../index' {
  namespace onBLEPeripheralConnectionStateChanged {
    /** 当前外围设备被连接或断开连接事件的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      /** 蓝牙设备 id */
      deviceId: string
      /** server 的 UUID */
      serverId: string
      /** 连接目前状态 */
      connected: string
    }
  }

  namespace createBLEPeripheralServer {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 外围设备的服务端 */
      server: BLEPeripheralServer
    }
  }

  /** 外围设备的服务端
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.html
   */
  interface BLEPeripheralServer {
    /** 添加服务
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.addService.html
     */
    addService
    /** 关闭当前服务端
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.close.html
     */
    close(option: BLEPeripheralServer.CloseOption): void
    /** 取消监听已连接的设备请求读当前外围设备的特征值事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicReadRequest.html
     */
    offCharacteristicReadRequest
    /** 取消监听特征订阅事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicSubscribed.html
     */
    offCharacteristicSubscribed
    /** 取消监听取消特征订阅事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicUnsubscribed.html
     */
    offCharacteristicUnsubscribed
    /** 取消监听已连接的设备请求写当前外围设备的特征值事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicWriteRequest.html
     */
    offCharacteristicWriteRequest
    /** 监听已连接的设备请求读当前外围设备的特征值事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicReadRequest.html
     */
    onCharacteristicReadRequest
    /** 监听特征订阅事件，仅 iOS 支持
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicSubscribed.html
     */
    onCharacteristicSubscribed
    /** 监听取消特征订阅事件，仅 iOS 支持
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicUnsubscribed.html
     */
    onCharacteristicUnsubscribed
    /** 监听已连接的设备请求写当前外围设备的特征值事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicWriteRequest.html
     */
    onCharacteristicWriteRequest
    /** 移除服务
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.removeService.html
     */
    removeService
    /** 开始广播本地创建的外围设备
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.startAdvertising.html
     */
    startAdvertising
    /** 停止广播
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.stopAdvertising.html
     */
    stopAdvertising
    /** 往指定特征写入二进制数据值，并通知已连接的主机，从机的特征值已发生变化，该接口会处理是走回包还是走订阅
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.writeCharacteristicValue.html
     */
    writeCharacteristicValue
  }

  namespace BLEPeripheralServer {
    interface CloseOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 监听当前外围设备被连接或断开连接事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/wx.onBLEPeripheralConnectionStateChanged.html
     */
    onBLEPeripheralConnectionStateChanged(
      /** 监听当前外围设备被连接或断开连接事件 */
      callback: onBLEPeripheralConnectionStateChanged.Callback,
    ): void

    /** 取消监听当前外围设备被连接或断开连接事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/wx.offBLEPeripheralConnectionStateChanged.html
     */
     offBLEPeripheralConnectionStateChanged(
      /** 当前外围设备被连接或断开连接事件的回调函数 */
      callback: onBLEPeripheralConnectionStateChanged.Callback,
    ): void

    /** 建立本地作为蓝牙低功耗外围设备的服务端，可创建多个
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/wx.createBLEPeripheralServer.html
     */
     createBLEPeripheralServer(
      option: createBLEPeripheralServer.Option,
    ): Promise<createBLEPeripheralServer.SuccessCallbackResult>
  }
}
