declare namespace Taro {
  namespace stopBluetoothDevicesDiscovery {
    interface Promised extends General.CallbackResult {
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.BluetoothError) => void
    }
  }
  /** 停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
   * @supported weapp
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
  function stopBluetoothDevicesDiscovery(
    option?: stopBluetoothDevicesDiscovery.Option,
  ): Promise<stopBluetoothDevicesDiscovery.Promised>

  namespace startBluetoothDevicesDiscovery {
    interface Promised extends General.CallbackResult {
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    interface Option {
      /** 是否允许重复上报同一设备。如果允许重复上报，则 Taro.onBlueToothDeviceFound 方法会多次上报同一设备，但是 RSSI 值会有不同。 */
      allowDuplicatesKey?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.BluetoothError) => void
      /** 上报设备的间隔。0 表示找到新设备立即上报，其他数值根据传入的间隔上报。 */
      interval?: number
      /** 要搜索的蓝牙设备主 service 的 uuid 列表。某些蓝牙设备会广播自己的主 service 的 uuid。如果设置此参数，则只搜索广播包有对应 uuid 的主服务的蓝牙设备。建议主要通过该参数过滤掉周边不需要处理的其他蓝牙设备。 */
      services?: string[]
      /** 接口调用成功的回调函数 */
      success?: (res: General.BluetoothError) => void
    }
  }
  /** 开始搜寻附近的蓝牙外围设备。**此操作比较耗费系统资源，请在搜索并连接到设备后调用 Taro.stopBluetoothDevicesDiscovery 方法停止搜索。**
   * @supported weapp
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
  function startBluetoothDevicesDiscovery(
    option: startBluetoothDevicesDiscovery.Option,
  ): Promise<startBluetoothDevicesDiscovery.Promised>

  namespace openBluetoothAdapter {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.BluetoothError) => void
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
  /** 初始化蓝牙模块
   *
   * **注意**
   * - 其他蓝牙相关 API 必须在 Taro.openBluetoothAdapter 调用之后使用。否则 API 会返回错误（errCode=10000）。
   * - 在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用 Taro.openBluetoothAdapter 监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。
   * @supported weapp
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
  function openBluetoothAdapter(option?: openBluetoothAdapter.Option): Promise<General.CallbackResult>

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
      serviceData: General.IAnyObject
    }
  }
  /** 监听寻找到新设备的事件
   *
   * **注意**
   * - 若在 Taro.onBluetoothDeviceFound 回调了某个设备，则此设备会添加到 Taro.getBluetoothDevices 接口获取到的数组中。
   * - 安卓下部分机型需要有位置权限才能搜索到设备，需留意是否开启了位置权限
   * @supported weapp
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
  function onBluetoothDeviceFound(
    /** 寻找到新设备的事件的回调函数 */
    callback: onBluetoothDeviceFound.Callback,
  ): void

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
  /** 监听蓝牙适配器状态变化事件
   * @supported weapp
   * @example
   * ```tsx
   * Taro.onBluetoothAdapterStateChange(function (res) {
   *   console.log('adapterState changed, now is', res)
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothAdapterStateChange.html
   */
  function onBluetoothAdapterStateChange(
    /** 蓝牙适配器状态变化事件的回调函数 */
    callback: onBluetoothAdapterStateChange.Callback,
  ): void

  namespace getConnectedBluetoothDevices {
    interface Option {
      /** 蓝牙设备主 service 的 uuid 列表 */
      services: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
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
  /** 根据 uuid 获取处于已连接状态的设备。
   * @supported weapp
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
  function getConnectedBluetoothDevices(
    option: getConnectedBluetoothDevices.Option,
  ): void

  namespace getBluetoothDevices {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** uuid 对应的的已连接设备列表 */
      devices: SuccessCallbackResultBlueToothDevice[]
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
    /** uuid 对应的的已连接设备列表 */
    interface SuccessCallbackResultBlueToothDevice extends General.CallbackResult {
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
        serviceData: General.IAnyObject
    }
  }
  /** 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
   * 
   * **注意事项**
   * - 该接口获取到的设备列表为**蓝牙模块生效期间所有搜索到的蓝牙设备**，若在蓝牙模块使用流程结束后未及时调用 Taro.closeBluetoothAdapter 释放资源，会存在调用该接口会返回之前的蓝牙使用流程中搜索到的蓝牙设备，可能设备已经不在用户身边，无法连接。
   * - 蓝牙设备在被搜索到时，系统返回的 name 字段一般为广播包中的 LocalName 字段中的设备名称，而如果与蓝牙设备建立连接，系统返回的 name 字段会改为从蓝牙设备上获取到的 `GattName`。若需要动态改变设备名称并展示，建议使用 `localName` 字段。
   * @supported weapp
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
  function getBluetoothDevices(option?: getBluetoothDevices.Option): Promise<getBluetoothDevices.SuccessCallbackResult>

  namespace getBluetoothAdapterState {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends General.CallbackResult {
      /** 蓝牙适配器是否可用 */
      available: boolean
      /** 是否正在搜索设备 */
      discovering: boolean
      /** 成功：ok，错误：详细信息 */
      errMsg: string
    }
  }
  /** 获取本机蓝牙适配器状态。
   * @supported weapp
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
  function getBluetoothAdapterState(
    option?: getBluetoothAdapterState.Option,
  ): Promise<getBluetoothAdapterState.SuccessCallbackResult>

  namespace closeBluetoothAdapter {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.BluetoothError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.BluetoothError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.BluetoothError) => void
    }
  }
  /** 关闭蓝牙模块。调用该方法将断开所有已建立的连接并释放系统资源。建议在使用蓝牙流程后，与 Taro.openBluetoothAdapter 成对调用。
   * @supported weapp
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
  function closeBluetoothAdapter(option?: closeBluetoothAdapter.Option): Promise<General.CallbackResult>
}
