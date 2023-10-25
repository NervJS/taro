import Taro from '../../index'

declare module '../../index' {
  namespace writeBLECharacteristicValue {
    interface Promised extends TaroGeneral.BluetoothError {
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    interface Option {
      /** 蓝牙特征值的 uuid */
      characteristicId: string
      /** 蓝牙设备 id */
      deviceId: string
      /** 蓝牙特征值对应服务的 uuid */
      serviceId: string
      /** 蓝牙设备特征值对应的二进制值 */
      value: ArrayBuffer
      /** 蓝牙特征值的写模式设置，有两种模式，iOS 优先 write，安卓优先 writeNoResponse 。（基础库 2.22.0 开始支持） */
      writeType?: keyof WriteType
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.BluetoothError) => void
    }
    interface WriteType {
      /** 强制回复写，不支持时报错 */
      write
      /** 强制无回复写，不支持时报错 */
      writeNoResponse
    }
  }

  namespace setBLEMTU {
    type Promised = FailCallbackResult | SuccessCallbackResult
    interface Option {
      /** 蓝牙设备 id */
      deviceId: string
      /** 最大传输单元。设置范围为 (22,512) 区间内，单位 bytes */
      mtu: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: Promised) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: FailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface FailCallbackResult extends TaroGeneral.BluetoothError {
      /** 最终协商的 MTU 值。如果协商失败则无此参数。安卓客户端 8.0.9 开始支持。 */
      mtu: string
    }
    interface SuccessCallbackResult extends TaroGeneral.BluetoothError {
      /** 最终协商的 MTU 值，与传入参数一致。安卓客户端 8.0.9 开始支持。 */
      mtu: string
    }
  }

  namespace readBLECharacteristicValue {
    interface Option {
      /** 蓝牙特征值的 uuid */
      characteristicId: string
      /** 蓝牙设备 id */
      deviceId: string
      /** 蓝牙特征值对应服务的 uuid */
      serviceId: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.BluetoothError) => void
    }
  }

  namespace onBLEMTUChange {
    interface CallbackResult {
      /** 蓝牙设备ID */
      deviceId: string
      /** 最大传输单元 */
      mtu: string
    }
    /** 蓝牙低功耗的最大传输单元变化事件的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void
  }

  namespace onBLEConnectionStateChange {
    interface CallbackResult {
      /** 是否处于已连接状态 */
      connected: boolean
      /** 蓝牙设备ID */
      deviceId: string
    }
    /** 低功耗蓝牙连接状态的改变事件的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void
  }

  namespace onBLECharacteristicValueChange {
    /** 低功耗蓝牙设备的特征值变化事件的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      /** 蓝牙特征值的 uuid */
      characteristicId: string
      /** 蓝牙设备 id */
      deviceId: string
      /** 蓝牙特征值对应服务的 uuid */
      serviceId: string
      /** 特征值最新的值 */
      value: ArrayBuffer
    }
  }

  namespace notifyBLECharacteristicValueChange {
    interface Promised extends TaroGeneral.BluetoothError {
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    interface Option {
      /** 蓝牙特征值的 uuid */
      characteristicId: string
      /** 蓝牙设备 id */
      deviceId: string
      /** 蓝牙特征值对应服务的 uuid */
      serviceId: string
      /** 是否启用 notify */
      state: boolean
      /** 设置特征订阅类型，有效值有 notification 和 indication
       * @default "indication"
       */
      type?: keyof Type
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.BluetoothError) => void
    }
    interface Type {
      notification
      indication
    }
  }

  namespace getBLEMTU {
    interface Option {
      /** 蓝牙设备 id */
      deviceId: string
      /** 写模式 （iOS 特有参数）
       * @default "write"
       */
      writeType?: keyof WriteType
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (
        result: SuccessCallbackResult,
      ) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.BluetoothError {
      /** 最大传输单元 */
      mtu: number
    }
    /** 写模式合法值 */
    interface WriteType {
      /** 有回复写 */
      write
      /** 无回复写 */
      writeNoResponse
    }
  }

  namespace getBLEDeviceServices {
    interface Option {
      /** 蓝牙设备 id */
      deviceId: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (
        result: SuccessCallbackResult,
      ) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.BluetoothError {
      /** 设备服务列表 */
      services: BLEService[]
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    /** 设备服务列表 */
    interface BLEService {
      /** 该服务是否为主服务 */
      isPrimary: boolean
      /** 蓝牙设备服务的 uuid */
      uuid: string
    }
  }

  namespace getBLEDeviceRSSI {
    interface Option {
      /** 蓝牙设备 id */
      deviceId: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (
        result: SuccessCallbackResult,
      ) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.BluetoothError {
      /** 信号强度，单位 dBm */
      RSSI: number
    }
  }

  namespace getBLEDeviceCharacteristics {
    interface Option {
      /** 蓝牙设备 id */
      deviceId: string
      /** 蓝牙服务 uuid，需要使用 `getBLEDeviceServices` 获取 */
      serviceId: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.BluetoothError {
      /** 设备特征值列表 */
      characteristics: BLECharacteristic[]
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    /** 设备特征值列表 */
    interface BLECharacteristic {
      /** 该特征值支持的操作类型 */
      properties: Properties
      /** 蓝牙设备特征值的 uuid */
      uuid: string
    }
    /** 该特征值支持的操作类型 */
    interface Properties {
      /** 该特征值是否支持 indicate 操作 */
      indicate: boolean
      /** 该特征值是否支持 notify 操作 */
      notify: boolean
      /** 该特征值是否支持 read 操作 */
      read: boolean
      /** 该特征值是否支持 write 操作 */
      write: boolean
      /** 该特征是否支持无回复写操作 */
      writeNoResponse: boolean
      /** 该特征是否支持有回复写操作 */
      writeDefault: boolean
    }
  }

  namespace createBLEConnection {
    interface Promised extends TaroGeneral.BluetoothError {
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    interface Option {
      /** 用于区分设备的 id */
      deviceId: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.BluetoothError) => void
      /** 超时时间，单位ms，不填表示不会超时 */
      timeout?: number
    }
  }

  namespace closeBLEConnection {
    interface Promised extends TaroGeneral.BluetoothError {
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    interface Option {
      /** 用于区分设备的 id */
      deviceId: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.BluetoothError) => void
    }
  }

  interface TaroStatic {
    /** 向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用。
     *
     * **注意**
     * - 并行调用多次会存在写失败的可能性。
     * - 小程序不会对写入数据包大小做限制，但系统与蓝牙设备会限制蓝牙4.0单次传输的数据大小，超过最大字节数后会发生写入错误，建议每次写入不超过20字节。
     * - 若单次写入数据过长，iOS 上存在系统不会有任何回调的情况（包括错误回调）。
     * - 安卓平台上，在调用 `notifyBLECharacteristicValueChange` 成功后立即调用 `writeBLECharacteristicValue` 接口，在部分机型上会发生 10008 系统错误
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * // 向蓝牙设备发送一个0x00的16进制数据
     * let buffer = new ArrayBuffer(1)
     * let dataView = new DataView(buffer)
     * dataView.setUint8(0, 0)
     * Taro.writeBLECharacteristicValue({
     *   // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
     *   deviceId,
     *   // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
     *   serviceId,
     *   // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
     *   characteristicId,
     *   // 这里的value是ArrayBuffer类型
     *   value: buffer,
     *   success: function (res) {
     *     console.log('writeBLECharacteristicValue success', res.errMsg)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.writeBLECharacteristicValue.html
     */
    writeBLECharacteristicValue(
      option: writeBLECharacteristicValue.Option,
    ): Promise<writeBLECharacteristicValue.Promised>

    /** 协商设置蓝牙低功耗的最大传输单元 (Maximum Transmission Unit, MTU)
     *
     * - 需在 Taro.createBLEConnection 调用成功后调用
     * - 仅安卓系统 5.1 以上版本有效，iOS 因系统限制不支持。
     * @supported weapp, alipay, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.setBLEMTU.html
     */
    setBLEMTU(
      option: setBLEMTU.Option,
    ): Promise<setBLEMTU.Promised>

    /** 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用。
     *
     * **注意**
     * - 并行调用多次会存在读失败的可能性。
     * - 接口读取到的信息需要在 `onBLECharacteristicValueChange` 方法注册的回调中获取。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * // 必须在这里的回调才能获取
     * Taro.onBLECharacteristicValueChange(function(characteristic) {
     *   console.log('characteristic value comed:', characteristic)
     * })
     * Taro.readBLECharacteristicValue({
     *   // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     *   deviceId,
     *   // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
     *   serviceId,
     *   // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
     *   characteristicId,
     *   success: function (res) {
     *     console.log('readBLECharacteristicValue:', res.errCode)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.readBLECharacteristicValue.html
     */
    readBLECharacteristicValue(
      option: readBLECharacteristicValue.Option,
    ): Promise<TaroGeneral.BluetoothError>

    /** 监听蓝牙低功耗的最大传输单元变化事件（仅安卓触发）
     * @supported weapp
     * @example
     * ```tsx
     * Taro.onBLEMTUChange(function (res) {
     *   console.log('bluetooth mtu is', res.mtu)
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.onBLEMTUChange.html
     */
    onBLEMTUChange(
      /** 蓝牙低功耗的最大传输单元变化事件的回调函数 */
      callback: onBLEMTUChange.Callback,
    ): void

    /** 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.onBLEConnectionStateChange(function (res) {
     *   // 该方法回调中可以用于处理连接意外断开等异常情况
     *   console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.onBLEConnectionStateChange.html
     */
    onBLEConnectionStateChange(
      /** 低功耗蓝牙连接状态的改变事件的回调函数 */
      callback: onBLEConnectionStateChange.Callback,
    ): void

    /** 监听低功耗蓝牙设备的特征值变化事件。必须先启用 `notifyBLECharacteristicValueChange` 接口才能接收到设备推送的 notification。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * // ArrayBuffer转16进制字符串示例
     * function ab2hex(buffer) {
     *   let hexArr = Array.prototype.map.call(
     *     new Uint8Array(buffer),
     *     function(bit) {
     *       return ('00' + bit.toString(16)).slice(-2)
     *     }
     *   )
     *   return hexArr.join('');
     * }
     * Taro.onBLECharacteristicValueChange(function (res) {
     *   console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
     *   console.log(ab2hex(res.value))
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.onBLECharacteristicValueChange.html
     */
    onBLECharacteristicValueChange(
      /** 低功耗蓝牙设备的特征值变化事件的回调函数 */
      callback: onBLECharacteristicValueChange.Callback,
    ): void

    /** 取消监听蓝牙低功耗的最大传输单元变化事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.offBLEMTUChange.html
     */
    offBLEMTUChange(
      /** 蓝牙低功耗的最大传输单元变化事件的回调函数 */
      callback?: onBLEMTUChange.Callback,
    ): void

    /** 取消监听蓝牙低功耗连接状态的改变事件
     * @supported weapp, alipay
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.offBLEConnectionStateChange.html
     */
    offBLEConnectionStateChange(
      /** 蓝牙低功耗连接状态的改变事件的回调函数 */
      callback?: onBLEConnectionStateChange.Callback,
    ): void

    /** 取消监听蓝牙低功耗设备的特征值变化事件
     * @supported weapp, alipay
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.offBLECharacteristicValueChange.html
     */
    offBLECharacteristicValueChange(
      /** 低功耗蓝牙设备的特征值变化事件的回调函数 */
      callback: onBLECharacteristicValueChange.Callback,
    ): void

    /** 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。
     *
     * 另外，必须先启用 `notifyBLECharacteristicValueChange` 才能监听到设备 `characteristicValueChange` 事件
     *
     * **注意**
     * - 订阅操作成功后需要设备主动更新特征值的 value，才会触发 Taro.onBLECharacteristicValueChange 回调。
     * - 安卓平台上，在调用 `notifyBLECharacteristicValueChange` 成功后立即调用 `writeBLECharacteristicValue` 接口，在部分机型上会发生 10008 系统错误
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.notifyBLECharacteristicValueChange({
     *   state: true, // 启用 notify 功能
     *   // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     *   deviceId,
     *   // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
     *   serviceId,
     *   // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
     *   characteristicId,
     *   success: function (res) {
     *     console.log('notifyBLECharacteristicValueChange success', res.errMsg)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.notifyBLECharacteristicValueChange.html
     */
    notifyBLECharacteristicValueChange(
      option: notifyBLECharacteristicValueChange.Option,
    ): Promise<notifyBLECharacteristicValueChange.Promised>

    /** 获取蓝牙低功耗的最大传输单元。需在 [Taro.createBLEConnection](/docs/apis/device/bluetooth-ble/createBLEConnection) 调用成功后调用。
     *
     * 注意:
     *  - 小程序中 MTU 为 ATT_MTU，包含 Op-Code 和 Attribute Handle 的长度，实际可以传输的数据长度为 ATT_MTU - 3
     *  - iOS 系统中 MTU 为固定值；安卓系统中，MTU 会在系统协商成功之后发生改变，建议使用 [Taro.onBLEMTUChange](/docs/apis/device/bluetooth-ble/onBLEMTUChange) 监听。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.getBLEMTU({
     *   deviceId: '',
     *   writeType: 'write',
     *   success (res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEMTU.html
     */
     getBLEMTU(
      option: getBLEMTU.Option,
    ): Promise<getBLEMTU.SuccessCallbackResult>

    /** 获取蓝牙设备所有服务(service)。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.getBLEDeviceServices({
     *   // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     *   deviceId,
     *   success: function (res) {
     *     console.log('device services:', res.services)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEDeviceServices.html
     */
    getBLEDeviceServices(
      option: getBLEDeviceServices.Option,
    ): Promise<getBLEDeviceServices.SuccessCallbackResult>

    /** 获取蓝牙低功耗设备的信号强度 (Received Signal Strength Indication, RSSI)。
     * @supported weapp, alipay, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEDeviceRSSI.html
     */
    getBLEDeviceRSSI(
      option: getBLEDeviceRSSI.Option,
    ): Promise<getBLEDeviceRSSI.SuccessCallbackResult>

    /** 获取蓝牙设备某个服务中所有特征值(characteristic)。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.getBLEDeviceCharacteristics({
     *   // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     *   deviceId,
     *   // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
     *   serviceId,
     *   success: function (res) {
     *     console.log('device getBLEDeviceCharacteristics:', res.characteristics)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEDeviceCharacteristics.html
     */
    getBLEDeviceCharacteristics(
      option: getBLEDeviceCharacteristics.Option,
    ): Promise<getBLEDeviceCharacteristics.SuccessCallbackResult>

    /** 连接低功耗蓝牙设备。
     *
     * 若小程序在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备，无需进行搜索操作。
     *
     * **注意**
     * - 请保证尽量成对的调用 `createBLEConnection` 和 `closeBLEConnection` 接口。安卓如果多次调用 `createBLEConnection` 创建连接，有可能导致系统持有同一设备多个连接的实例，导致调用 `closeBLEConnection` 的时候并不能真正的断开与设备的连接。
     * - 蓝牙连接随时可能断开，建议监听 Taro.onBLEConnectionStateChange 回调事件，当蓝牙设备断开时按需执行重连操作
     * - 若对未连接的设备或已断开连接的设备调用数据读写操作的接口，会返回 10006 错误，建议进行重连操作。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.createBLEConnection({
     *   // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     *   deviceId,
     *   success: function (res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.createBLEConnection.html
     */
    createBLEConnection(option: createBLEConnection.Option): Promise<createBLEConnection.Promised>

    /** 断开与低功耗蓝牙设备的连接。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.closeBLEConnection({
     *   deviceId,
     *   success: function (res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.closeBLEConnection.html
     */
    closeBLEConnection(option: closeBLEConnection.Option): Promise<closeBLEConnection.Promised>
  }
}
