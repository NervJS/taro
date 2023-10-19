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
      connected: boolean
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
    interface SuccessCallbackResult extends TaroGeneral.BluetoothError {
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
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.addService.html
     */
    addService(option: BLEPeripheralServer.addService.Option): Promise<TaroGeneral.BluetoothError>
    /** 关闭当前服务端
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.close.html
     */
    close(option: BLEPeripheralServer.close.Option): Promise<TaroGeneral.BluetoothError>
    /** 取消监听已连接的设备请求读当前外围设备的特征值事件
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicReadRequest.html
     */
    offCharacteristicReadRequest(
      /** 已连接的设备请求读当前外围设备的特征值事件的回调函数 */
      callback?: BLEPeripheralServer.onCharacteristicReadRequest.Callback,
    ): void
    /** 取消监听特征订阅事件
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicSubscribed.html
     */
    offCharacteristicSubscribed(
      /** 特征订阅事件的回调函数 */
      callback?: BLEPeripheralServer.onCharacteristicSubscribed.Callback,
    ): void
    /** 取消监听取消特征订阅事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicUnsubscribed.html
     */
    offCharacteristicUnsubscribed(
      /** 取消特征订阅事件的回调函数 */
      callback?: BLEPeripheralServer.onCharacteristicUnsubscribed.Callback,
    ): void
    /** 取消监听已连接的设备请求写当前外围设备的特征值事件
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicWriteRequest.html
     */
    offCharacteristicWriteRequest(
      /** 已连接的设备请求写当前外围设备的特征值事件的回调函数 */
      callback?: BLEPeripheralServer.onCharacteristicWriteRequest.Callback,
    ): void
    /** 监听已连接的设备请求读当前外围设备的特征值事件
     *
     * 收到该消息后需要立刻调用 [writeCharacteristicValue](/docs/apis/device/bluetooth-peripheral/BLEPeripheralServer#writecharacteristicvalue) 写回数据，否则主机不会收到响应。
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicReadRequest.html
     */
    onCharacteristicReadRequest(
      /** 已连接的设备请求读当前外围设备的特征值事件的回调函数 */
      callback: BLEPeripheralServer.onCharacteristicReadRequest.Callback,
    ): void
    /** 监听特征订阅事件，仅 iOS 支持
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicSubscribed.html
     */
    onCharacteristicSubscribed(
      /** 特征订阅事件的回调函数 */
      callback: BLEPeripheralServer.onCharacteristicSubscribed.Callback,
    ): void
    /** 监听取消特征订阅事件，仅 iOS 支持
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicUnsubscribed.html
     */
    onCharacteristicUnsubscribed(
      /** 取消特征订阅事件的回调函数 */
      callback: BLEPeripheralServer.onCharacteristicUnsubscribed.Callback,
    ): void
    /** 监听已连接的设备请求写当前外围设备的特征值事件
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicWriteRequest.html
     */
    onCharacteristicWriteRequest(
      /** 已连接的设备请求写当前外围设备的特征值事件的回调函数 */
      callback: BLEPeripheralServer.onCharacteristicWriteRequest.Callback,
    ): void
    /** 移除服务
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.removeService.html
     */
    removeService(option: BLEPeripheralServer.removeService.Option): Promise<TaroGeneral.BluetoothError>
    /** 开始广播本地创建的外围设备
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.startAdvertising.html
     */
    startAdvertising(option: BLEPeripheralServer.startAdvertising.Option): Promise<TaroGeneral.BluetoothError>
    /** 停止广播
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.stopAdvertising.html
     */
    stopAdvertising(option: BLEPeripheralServer.stopAdvertising.Option): Promise<TaroGeneral.BluetoothError>
    /** 往指定特征写入二进制数据值，并通知已连接的主机，从机的特征值已发生变化，该接口会处理是走回包还是走订阅
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.writeCharacteristicValue.html
     */
    writeCharacteristicValue(option: BLEPeripheralServer.writeCharacteristicValue.Option): Promise<TaroGeneral.BluetoothError>
  }

  namespace BLEPeripheralServer {
    namespace addService {
      interface Option {
        /** 描述 service 的 Object */
        service: service
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.BluetoothError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.BluetoothError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.BluetoothError) => void
      }
      interface service {
        /** 蓝牙服务的 UUID */
        uuid: string
        /** characteristics 列表 */
        characteristics: characteristic[]
      }
      interface characteristic {
        /** characteristic 的 UUID */
        uuid: string
        /** 特征支持的操作 */
        properties?: properties
        /** 特征权限 */
        permission?: characteristicPermission
        /** 特征对应的二进制值 */
        value?: ArrayBuffer
        /** 描述符数据 */
        descriptors?: descriptor[]
      }
      /** 特征支持的操作 */
      interface properties {
        /** 写
         * @default false
         */
        write?: boolean
        /** 无回复写
         * @default false
         */
        writeNoResponse?: boolean
        /** 读
         * @default false
         */
        read?: boolean
        /** 订阅
         * @default false
         */
        notify?: boolean
        /** 回包
         * @default false
         */
        indicate?: boolean
      }
      /** 特征权限 */
      interface characteristicPermission {
        /** 可读
         * @default false
         */
        readable?: boolean
        /** 可写
         * @default false
         */
        writeable?: boolean
        /** 加密读请求
         * @default false
         */
        readEncryptionRequired?: boolean
        /** 加密写请求
         * @default false
         */
        writeEncryptionRequired?: boolean
      }
      /** 描述符数据 */
      interface descriptor {
        /** Descriptor 的 UUID */
        uuid: string
        /** 描述符的权限 */
        permission?: descriptorPermission
        /** 描述符数据 */
        value: ArrayBuffer
      }
      /** 描述符的权限 */
      interface descriptorPermission {
        /** 写
         * @default false
         */
        write?: boolean
        /** 读
         * @default false
         */
        read?: boolean
      }
    }
    namespace close {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.BluetoothError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.BluetoothError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.BluetoothError) => void
      }
    }
    namespace onCharacteristicReadRequest {
      /** 已连接的设备请求读当前外围设备的特征值事件的回调函数 */
      type Callback = (
        result: CallbackResult,
      ) => void

      interface CallbackResult {
        /** 蓝牙特征对应服务的 UUID */
        serviceId: string
        /** 蓝牙特征的 UUID */
        characteristicId: string
        /** 唯一标识码，调用 [writeCharacteristicValue](/docs/apis/device/bluetooth-peripheral/BLEPeripheralServer#writecharacteristicvalue) 时使用 */
        callbackId: number
      }
    }
    namespace onCharacteristicSubscribed {
      /** 特征订阅事件的回调函数 */
      type Callback = (
        result: CallbackResult,
      ) => void

      interface CallbackResult {
        /** 蓝牙特征对应服务的 UUID */
        serviceId: string
        /** 蓝牙特征的 UUID */
        characteristicId: string
      }
    }
    namespace onCharacteristicUnsubscribed {
      /** 取消特征订阅事件的回调函数 */
      type Callback = (
        result: CallbackResult,
      ) => void

      interface CallbackResult {
        /** 蓝牙特征对应服务的 UUID */
        serviceId: string
        /** 蓝牙特征的 UUID */
        characteristicId: string
      }
    }
    namespace onCharacteristicWriteRequest {
      /** 已连接的设备请求写当前外围设备的特征值事件的回调函数 */
      type Callback = (
        result: CallbackResult,
      ) => void

      interface CallbackResult {
        /** 蓝牙特征对应服务的 UUID */
        serviceId: string
        /** 蓝牙特征的 UUID */
        characteristicId: string
        /** 唯一标识码，调用 [writeCharacteristicValue](/docs/apis/device/bluetooth-peripheral/BLEPeripheralServer#writecharacteristicvalue) 时使用 */
        callbackId: number
        /** 请求写入特征的二进制数据值 */
        value: ArrayBuffer
      }
    }
    namespace removeService {
      interface Option {
        /** service 的 UUID */
        serviceId: string
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.BluetoothError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.BluetoothError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.BluetoothError) => void
      }
    }
    namespace startAdvertising {
      interface Option {
        /** 广播自定义参数 */
        advertiseRequest: advertiseRequest
        /** 广播功率
         * @default "medium"
         */
        powerLevel?: keyof PowerLevel
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.BluetoothError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.BluetoothError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.BluetoothError) => void
      }
      /** 广播自定义参数 */
      interface advertiseRequest {
        /** 当前设备是否可连接
         * @default true
         */
        connectable?: boolean
        /** 广播中 deviceName 字段，默认为空
         * @default ""
         */
        deviceName?: string
        /** 要广播的服务 UUID 列表。使用 16/32 位 UUID 时请参考注意事项。 */
        serviceUuids?: string[]
        /** 广播的制造商信息。仅安卓支持，iOS 因系统限制无法定制。 */
        manufacturerData?: manufacturerData[]
        /** 以 beacon 设备形式广播的参数。 */
        beacon?: beacon
      }
      /** 广播的制造商信息。仅安卓支持，iOS 因系统限制无法定制。 */
      interface manufacturerData {
        /** 制造商ID，0x 开头的十六进制 */
        manufacturerId: string
        /** 制造商信息 */
        manufacturerSpecificData?: ArrayBuffer
      }
      /** 以 beacon 设备形式广播的参数。 */
      interface beacon {
        /** Beacon 设备广播的 UUID */
        uuid: string
        /** Beacon 设备的主 ID */
        major: number
        /** Beacon 设备的次 ID */
        minor: number
        /** 用于判断距离设备 1 米时 RSSI 大小的参考值 */
        measuredPower?: number
      }
      /** 广播功率合法值 */
      interface PowerLevel {
        /** 功率低 */
        low
        /** 功率适中 */
        medium
        /** 功率高 */
        high
      }
    }
    namespace stopAdvertising {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.BluetoothError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.BluetoothError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.BluetoothError) => void
      }
    }
    namespace writeCharacteristicValue {
      interface Option {
        /** 蓝牙特征对应服务的 UUID */
        serviceId: string
        /** 蓝牙特征的 UUID */
        characteristicId: string
        /** characteristic 对应的二进制值 */
        value: ArrayBuffer
        /** 是否需要通知主机 value 已更新 */
        needNotify: boolean
        /** 可选，处理回包时使用 */
        callbackId?: number
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.BluetoothError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.BluetoothError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.BluetoothError) => void
      }
    }
  }

  interface TaroStatic {
    /** 监听当前外围设备被连接或断开连接事件
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/wx.onBLEPeripheralConnectionStateChanged.html
     */
    onBLEPeripheralConnectionStateChanged(
      /** 监听当前外围设备被连接或断开连接事件 */
      callback: onBLEPeripheralConnectionStateChanged.Callback,
    ): void

    /** 取消监听当前外围设备被连接或断开连接事件
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/wx.offBLEPeripheralConnectionStateChanged.html
     */
     offBLEPeripheralConnectionStateChanged(
      /** 当前外围设备被连接或断开连接事件的回调函数 */
      callback?: onBLEPeripheralConnectionStateChanged.Callback,
    ): void

    /** 建立本地作为蓝牙低功耗外围设备的服务端，可创建多个
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/wx.createBLEPeripheralServer.html
     */
     createBLEPeripheralServer(
      option: createBLEPeripheralServer.Option,
    ): Promise<createBLEPeripheralServer.SuccessCallbackResult>
  }
}
