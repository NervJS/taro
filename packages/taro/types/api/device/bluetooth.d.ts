import Taro from '../../index'

declare module '../../index' {
  namespace stopBluetoothDevicesDiscovery {
    interface Promised extends TaroGeneral.CallbackResult {
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.BluetoothError) => void
    }
  }

  namespace startBluetoothDevicesDiscovery {
    interface Promised extends TaroGeneral.CallbackResult {
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    interface Option {
      /** 是否允许重复上报同一设备。如果允许重复上报，则 Taro.onBlueToothDeviceFound 方法会多次上报同一设备，但是 RSSI 值会有不同。 */
      allowDuplicatesKey?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 上报设备的间隔。0 表示找到新设备立即上报，其他数值根据传入的间隔上报。 */
      interval?: number
      /** 要搜索的蓝牙设备主 service 的 uuid 列表。某些蓝牙设备会广播自己的主 service 的 uuid。如果设置此参数，则只搜索广播包有对应 uuid 的主服务的蓝牙设备。建议主要通过该参数过滤掉周边不需要处理的其他蓝牙设备。 */
      services?: string[]
      /** 扫描模式，越高扫描越快，也越耗电。仅安卓微信客户端 7.0.12 及以上支持。  */
      powerLevel?: keyof PowerLevel
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.BluetoothError) => void
    }

    interface PowerLevel {
      /** 低 */
      low,
      /** 中 */
      medium,
      /** 高 */
      high
    }
  }

  namespace openBluetoothAdapter {
    interface Option {
      /** 蓝牙模式，可作为主/从设备，仅 iOS 需要。 */
      mode?: keyof Mode;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.BluetoothError) => void
    }

    interface Mode {
      /** 主机模式 */
      central
      /** 从机（外围设备）模式 */
      peripheral
    }

    /** object.fail 回调函数返回的 state 参数（仅 iOS） */
    interface state {
      /** 未知 */
      0
      /** 重置中 */
      1
      /** 不支持 */
      2
      /** 未授权 */
      3
      /** 未开启 */
      4
    }
  }

  namespace onBluetoothDeviceFound {
    /** 寻找到新设备的事件的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      /** 新搜索到的设备列表 */
      devices: CallbackResultBlueToothDevice[]
    }
    /** 新搜索到的设备 */
    interface CallbackResultBlueToothDevice {
      /** 当前蓝牙设备的信号强度，单位 dBm */
      RSSI: number
      /** 当前蓝牙设备的广播数据段中的 ManufacturerData 数据段。 */
      advertisData: ArrayBuffer
      /** 当前蓝牙设备的广播数据段中的 ServiceUUIDs 数据段 */
      advertisServiceUUIDs: string[]
      /** 用于区分设备的 id */
      deviceId: string
      /** 当前蓝牙设备的广播数据段中的 LocalName 数据段 */
      localName: string
      /** 蓝牙设备名称，某些设备可能没有 */
      name: string
      /** 当前蓝牙设备的广播数据段中的 ServiceData 数据段 */
      serviceData: TaroGeneral.IAnyObject
      /** 当前蓝牙设备是否可连接（ Android 8.0 以下不支持返回该值 ） */
      connectable?: boolean
    }
  }

  namespace onBluetoothAdapterStateChange {
    /** 蓝牙适配器状态变化事件的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      /** 蓝牙适配器是否可用 */
      available: boolean
      /** 蓝牙适配器是否处于搜索状态 */
      discovering: boolean
    }
  }

  namespace makeBluetoothPair {
    interface Option {
      /** 蓝牙设备 id */
      deviceId: string
      /** pin 码，Base64 格式 */
      pin: string
      /** 超时时间，单位 ms
       * @default 20000
       */
      timeout?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace isBluetoothDevicePaired {
    interface Option {
      /** 蓝牙设备 id */
      deviceId: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void

    }
  }

  namespace getConnectedBluetoothDevices {
    interface Option {
      /** 蓝牙设备主 service 的 uuid 列表 */
      services: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 搜索到的设备列表 */
      devices: BluetoothDeviceInfo[]
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    /** 搜索到的设备 */
    interface BluetoothDeviceInfo {
      /** 用于区分设备的 id */
      deviceId: string
      /** 蓝牙设备名称，某些设备可能没有 */
      name: string
    }
  }

  namespace getBluetoothDevices {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** uuid 对应的的已连接设备列表 */
      devices: SuccessCallbackResultBlueToothDevice[]
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    /** uuid 对应的的已连接设备列表 */
    interface SuccessCallbackResultBlueToothDevice extends TaroGeneral.CallbackResult {
        /** 当前蓝牙设备的信号强度 */
        RSSI: number
        /** 当前蓝牙设备的广播数据段中的 ManufacturerData 数据段。 */
        advertisData: ArrayBuffer
        /** 当前蓝牙设备的广播数据段中的 ServiceUUIDs 数据段 */
        advertisServiceUUIDs: string[]
        /** 用于区分设备的 id */
        deviceId: string
        /** 当前蓝牙设备的广播数据段中的 LocalName 数据段 */
        localName: string
        /** 蓝牙设备名称，某些设备可能没有 */
        name: string
        /** 当前蓝牙设备的广播数据段中的 ServiceData 数据段 */
        serviceData: TaroGeneral.IAnyObject
        /** 当前蓝牙设备是否可连接（ Android 8.0 以下不支持返回该值 ） */
        connectable?: boolean
    }
  }

  namespace getBluetoothAdapterState {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 蓝牙适配器是否可用 */
      available: boolean
      /** 是否正在搜索设备 */
      discovering: boolean
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
  }

  namespace closeBluetoothAdapter {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.BluetoothError) => void
    }
  }

  interface TaroStatic {
    /** 停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.stopBluetoothDevicesDiscovery({
     *   success: function (res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.stopBluetoothDevicesDiscovery.html
     */
    stopBluetoothDevicesDiscovery(
      option?: stopBluetoothDevicesDiscovery.Option,
    ): Promise<stopBluetoothDevicesDiscovery.Promised>

    /** 开始搜寻附近的蓝牙外围设备。**此操作比较耗费系统资源，请在搜索并连接到设备后调用 Taro.stopBluetoothDevicesDiscovery 方法停止搜索。**
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * // 以微信硬件平台的蓝牙智能灯为例，主服务的 UUID 是 FEE7。传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
     * Taro.startBluetoothDevicesDiscovery({
     *   services: ['FEE7'],
     *   success: function (res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.startBluetoothDevicesDiscovery.html
     */
    startBluetoothDevicesDiscovery(
      option: startBluetoothDevicesDiscovery.Option,
    ): Promise<startBluetoothDevicesDiscovery.Promised>

    /** 初始化蓝牙模块
     *
     * **注意**
     * - 其他蓝牙相关 API 必须在 Taro.openBluetoothAdapter 调用之后使用。否则 API 会返回错误（errCode=10000）。
     * - 在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用 Taro.openBluetoothAdapter 监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.openBluetoothAdapter({
     *   success: function (res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.openBluetoothAdapter.html
     */
    openBluetoothAdapter(option?: openBluetoothAdapter.Option): Promise<TaroGeneral.CallbackResult>

    /** 监听寻找到新设备的事件
     *
     * **注意**
     * - 若在 Taro.onBluetoothDeviceFound 回调了某个设备，则此设备会添加到 Taro.getBluetoothDevices 接口获取到的数组中。
     * - 安卓下部分机型需要有位置权限才能搜索到设备，需留意是否开启了位置权限
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * // ArrayBuffer转16进度字符串示例
     * function ab2hex(buffer) {
     *   var hexArr = Array.prototype.map.call(
     *     new Uint8Array(buffer),
     *     function(bit) {
     *       return ('00' + bit.toString(16)).slice(-2)
     *     }
     *   )
     *   return hexArr.join('');
     * }
     * Taro.onBluetoothDeviceFound(function (res) {
     *   var devices = res.devices;
     *   console.log('new device list has founded')
     *   console.dir(devices)
     *   console.log(ab2hex(devices[0].advertisData))
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothDeviceFound.html
     */
    onBluetoothDeviceFound(
      /** 寻找到新设备的事件的回调函数 */
      callback: onBluetoothDeviceFound.Callback,
    ): void

    /** 监听蓝牙适配器状态变化事件
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.onBluetoothAdapterStateChange(function (res) {
     *   console.log('adapterState changed, now is', res)
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothAdapterStateChange.html
     */
    onBluetoothAdapterStateChange(
      /** 蓝牙适配器状态变化事件的回调函数 */
      callback: onBluetoothAdapterStateChange.Callback,
    ): void

    /** 取消监听寻找到新设备的事件
     * @supported weapp, alipay
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.offBluetoothDeviceFound.html
     */
    offBluetoothDeviceFound(
      /** 寻找到新设备的事件的回调函数 */
      callback: onBluetoothDeviceFound.Callback,
    ): void
  
    /** 取消监听蓝牙适配器状态变化事件
     * @supported weapp, alipay
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.offBluetoothAdapterStateChange.html
     */
    offBluetoothAdapterStateChange(
      /** 蓝牙适配器状态变化事件的回调函数 */
      callback: onBluetoothAdapterStateChange.Callback,
    ): void
  
    /** 蓝牙配对接口，仅安卓支持
     * 
     * 通常情况下（需要指定 pin 码或者密码时）系统会接管配对流程，直接调用 [Taro.createBLEConnection](/docs/apis/device/bluetooth-ble/createBLEConnection) 即可。该接口只应当在开发者不想让用户手动输入 pin 码且真机验证确认可以正常生效情况下用。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.makeBluetoothPair.html
     */
    makeBluetoothPair(option: makeBluetoothPair.Option): Promise<TaroGeneral.CallbackResult>
  
    /** 查询蓝牙设备是否配对，仅安卓支持
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.isBluetoothDevicePaired.html
     */
    isBluetoothDevicePaired(option: isBluetoothDevicePaired.Option): Promise<TaroGeneral.CallbackResult>

    /** 根据 uuid 获取处于已连接状态的设备。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.getConnectedBluetoothDevices({
     *   success: function (res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getConnectedBluetoothDevices.html
     */
    getConnectedBluetoothDevices(
      option: getConnectedBluetoothDevices.Option,
    ): Promise<getConnectedBluetoothDevices.SuccessCallbackResult>

    /** 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
     *
     * **注意事项**
     * - 该接口获取到的设备列表为**蓝牙模块生效期间所有搜索到的蓝牙设备**，若在蓝牙模块使用流程结束后未及时调用 Taro.closeBluetoothAdapter 释放资源，会存在调用该接口会返回之前的蓝牙使用流程中搜索到的蓝牙设备，可能设备已经不在用户身边，无法连接。
     * - 蓝牙设备在被搜索到时，系统返回的 name 字段一般为广播包中的 LocalName 字段中的设备名称，而如果与蓝牙设备建立连接，系统返回的 name 字段会改为从蓝牙设备上获取到的 `GattName`。若需要动态改变设备名称并展示，建议使用 `localName` 字段。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * // ArrayBuffer转16进度字符串示例
     * function ab2hex(buffer) {
     *   var hexArr = Array.prototype.map.call(
     *     new Uint8Array(buffer),
     *     function(bit) {
     *       return ('00' + bit.toString(16)).slice(-2)
     *     }
     *   )
     *   return hexArr.join('');
     * }
     * Taro.getBluetoothDevices({
     *   success: function (res) {
     *     console.log(res)
     *     if (res.devices[0]) {
     *       console.log(ab2hex(res.devices[0].advertisData))
     *     }
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBluetoothDevices.html
     */
    getBluetoothDevices(option?: getBluetoothDevices.Option): Promise<getBluetoothDevices.SuccessCallbackResult>

    /** 获取本机蓝牙适配器状态。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.getBluetoothAdapterState({
     *   success: function (res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBluetoothAdapterState.html
     */
    getBluetoothAdapterState(
      option?: getBluetoothAdapterState.Option,
    ): Promise<getBluetoothAdapterState.SuccessCallbackResult>

    /** 关闭蓝牙模块。调用该方法将断开所有已建立的连接并释放系统资源。建议在使用蓝牙流程后，与 Taro.openBluetoothAdapter 成对调用。
     * @supported weapp, alipay, jd
     * @example
     * ```tsx
     * Taro.closeBluetoothAdapter({
     *   success: function (res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.closeBluetoothAdapter.html
     */
    closeBluetoothAdapter(option?: closeBluetoothAdapter.Option): Promise<TaroGeneral.CallbackResult>
  }
}
