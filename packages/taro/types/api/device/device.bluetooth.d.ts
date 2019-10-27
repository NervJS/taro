declare namespace Taro {
  namespace stopBluetoothDevicesDiscovery {
    type Promised = {
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.stopBluetoothDevicesDiscovery({
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.stopBluetoothDevicesDiscovery.html
   */
  function stopBluetoothDevicesDiscovery(OBJECT?: stopBluetoothDevicesDiscovery.Param): Promise<stopBluetoothDevicesDiscovery.Promised>

  namespace startBluetoothDevicesDiscovery {
    type Promised = {
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {
      /**
       * 蓝牙设备主 service 的 uuid 列表
       */
      services?: any[]
      /**
       * 是否允许重复上报同一设备， 如果允许重复上报，则onDeviceFound 方法会多次上报同一设备，但是 RSSI 值会有不同
       */
      allowDuplicatesKey?: boolean
      /**
       * 上报设备的间隔，默认为0，意思是找到新设备立即上报，否则根据传入的间隔上报
       */
      interval?: number
    }
  }
  /**
   * @since 1.1.0
   *
   * 开始搜寻附近的蓝牙外围设备。注意，该操作比较耗费系统资源，请在搜索并连接到设备后调用 stop 方法停止搜索。
   *
   * **示例代码：**
   *
   ```javascript
   // 以微信硬件平台的蓝牙智能灯为例，主服务的 UUID 是 FEE7。传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
   Taro.startBluetoothDevicesDiscovery({
     services: ['FEE7'],
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.startBluetoothDevicesDiscovery.html
   */
  function startBluetoothDevicesDiscovery(OBJECT?: startBluetoothDevicesDiscovery.Param): Promise<startBluetoothDevicesDiscovery.Promised>

  namespace openBluetoothAdapter {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 初始化小程序蓝牙模块，生效周期为调用`Taro.openBluetoothAdapter`至调用`Taro.closeBluetoothAdapter`或小程序被销毁为止。 在小程序蓝牙适配器模块生效期间，开发者可以正常调用下面的小程序API，并会收到蓝牙模块相关的on回调。
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 基础库版本 1.1.0 开始支持，低版本需做[兼容处理](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   * 2.  `tip`: 在没有调用`Taro.openBluetoothAdapter`的情况下调用小程序其它蓝牙模块相关API，API会返回错误，错误码为`10000`
   * 3.  `bug`: 在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用`Taro.openBluetoothAdapter`会返回错误，错误码为`10001`，表示手机蓝牙功能不可用；此时小程序蓝牙模块已经初始化完成，可通过`Taro.onBluetoothAdapterStateChange`监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.openBluetoothAdapter({
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.openBluetoothAdapter.html
   */
  function openBluetoothAdapter(OBJECT?: openBluetoothAdapter.Param): Promise<any>

  namespace onBluetoothDeviceFound {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 新搜索到的设备列表
       */
      devices: ParamParamPropDevices
    }
    /**
     * 新搜索到的设备列表
     */
    type ParamParamPropDevices = ParamParamPropDevicesItem[]
    type ParamParamPropDevicesItem = {
      /**
       * 蓝牙设备名称，某些设备可能没有
       */
      name: string
      /**
       * 用于区分设备的 id
       */
      deviceId: string
      /**
       * 当前蓝牙设备的信号强度
       */
      RSSI: number
      /**
       * 当前蓝牙设备的广播数据段中的ManufacturerData数据段 **（注意：vConsole 无法打印出 ArrayBuffer 类型数据）**
       */
      advertisData: ArrayBuffer
      /**
       * 当前蓝牙设备的广播数据段中的ServiceUUIDs数据段
       */
      advertisServiceUUIDs: any[]
      /**
       * 当前蓝牙设备的广播数据段中的LocalName数据段
       */
      localName: string
      /**
       * 当前蓝牙设备的广播数据段中的ServiceData数据段
       */
      serviceData: ArrayBuffer
    }
  }
  /**
   * @since 1.1.0
   *
   * 监听寻找到新设备的事件
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: Mac系统可能无法获取`advertisData`及`RSSI`，请使用真机调试
   * 2.  `tip`: 开发者工具和 Android 上获取到的`deviceId`为设备 MAC 地址，iOS 上则为设备 uuid。因此`deviceId`不能硬编码到代码中
   * 3.  `tip`: 若在onBluetoothDeviceFound回调了某个设备，则此设备会添加到 Taro.getBluetoothDevices 接口获取到的数组中
   *
   * **示例代码：**
   *
   ```javascript
   // ArrayBuffer转16进度字符串示例
   function ab2hex(buffer) {
     var hexArr = Array.prototype.map.call(
       new Uint8Array(buffer),
       function(bit) {
         return ('00' + bit.toString(16)).slice(-2)
       }
     )
     return hexArr.join('');
   }
   Taro.onBluetoothDeviceFound(function(devices) {
     console.log('new device list has founded')
     console.dir(devices)
     console.log(ab2hex(devices[0].advertisData))
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothDeviceFound.html
   */
  function onBluetoothDeviceFound(CALLBACK: onBluetoothDeviceFound.Param): void

  namespace onBluetoothAdapterStateChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 蓝牙适配器是否可用
       */
      available: boolean
      /**
       * 蓝牙适配器是否处于搜索状态
       */
      discovering: boolean
    }
  }
  /**
   * @since 1.1.0
   *
   * 监听蓝牙适配器状态变化事件
   *
   * **示例代码：**
   *
   ```javascript
   Taro.onBluetoothAdapterStateChange(function(res) {
     console.log(`adapterState changed, now is`, res)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothAdapterStateChange.html
   */
  function onBluetoothAdapterStateChange(CALLBACK: onBluetoothAdapterStateChange.Param): void

  namespace getConnectedBluetoothDevices {
    type Promised = {
      /**
       * 搜索到的设备列表
       */
      devices: PromisedPropDevices
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    /**
     * 搜索到的设备列表
     */
    type PromisedPropDevices = PromisedPropDevicesItem[]
    type PromisedPropDevicesItem = {
      /**
       * 蓝牙设备名称，某些设备可能没有
       */
      name: string
      /**
       * 用于区分设备的 id
       */
      deviceId: string
    }
    type Param = {
      /**
       * 蓝牙设备主 service 的 uuid 列表
       */
      services: any[]
    }
  }
  /**
   * @since 1.1.0
   *
   * 根据 uuid 获取处于已连接状态的设备
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 开发者工具和 Android 上获取到的`deviceId`为设备 MAC 地址，iOS 上则为设备 uuid。因此`deviceId`不能硬编码到代码中
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getConnectedBluetoothDevices({
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getConnectedBluetoothDevices.html
   */
  function getConnectedBluetoothDevices(OBJECT: getConnectedBluetoothDevices.Param): Promise<getConnectedBluetoothDevices.Promised>

  namespace getBluetoothDevices {
    type Promised = {
      /**
       * uuid 对应的的已连接设备列表
       */
      devices: PromisedPropDevices
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    /**
     * uuid 对应的的已连接设备列表
     */
    type PromisedPropDevices = PromisedPropDevicesItem[]
    type PromisedPropDevicesItem = {
      /**
       * 蓝牙设备名称，某些设备可能没有
       */
      name: string
      /**
       * 用于区分设备的 id
       */
      deviceId: string
      /**
       * 当前蓝牙设备的信号强度
       */
      RSSI: number
      /**
       * 当前蓝牙设备的广播数据段中的ManufacturerData数据段 **（注意：vConsole 无法打印出 ArrayBuffer 类型数据）**
       */
      advertisData: ArrayBuffer
      /**
       * 当前蓝牙设备的广播数据段中的ServiceUUIDs数据段
       */
      advertisServiceUUIDs: any[]
      /**
       * 当前蓝牙设备的广播数据段中的LocalName数据段
       */
      localName: string
      /**
       * 当前蓝牙设备的广播数据段中的ServiceData数据段
       */
      serviceData: ArrayBuffer
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 获取在小程序蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备。
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: Mac系统可能无法获取`advertisData`及`RSSI`，请使用真机调试
   * 2.  `tip`: 开发者工具和 Android 上获取到的`deviceId`为设备 MAC 地址，iOS 上则为设备 uuid。因此`deviceId`不能硬编码到代码中
   * 3.  `tip`: 注意该接口获取到的设备列表为**小程序蓝牙模块生效期间所有搜索到的蓝牙设备**，若在蓝牙模块使用流程结束后未及时调用 Taro.closeBluetoothAdapter 释放资源，会存在调用该接口会返回之前的蓝牙使用流程中搜索到的蓝牙设备，可能设备已经不在用户身边，无法连接。
   * 4.  `tips`: 蓝牙设备在被搜索到时，系统返回的 name 字段一般为广播包中的LocalName字段中的设备名称，而如果与蓝牙设备建立连接，系统返回的 name 字段会改为从蓝牙设备上获取到的GattName。若需要动态改变设备名称并展示，建议使用localName字段。
   *
   * **示例代码：**
   *
   ```javascript
   // ArrayBuffer转16进度字符串示例
   function ab2hex(buffer) {
     var hexArr = Array.prototype.map.call(
       new Uint8Array(buffer),
       function(bit) {
         return ('00' + bit.toString(16)).slice(-2)
       }
     )
     return hexArr.join('');
   }
   Taro.getBluetoothDevices({
     success: function (res) {
       console.log(res)
       if (res.devices[0]) {
         console.log(ab2hex(res.devices[0].advertisData))
       }
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBluetoothDevices.html
   */
  function getBluetoothDevices(OBJECT?: getBluetoothDevices.Param): Promise<getBluetoothDevices.Promised>

  namespace getBluetoothAdapterState {
    type Promised = {
      /**
       * 是否正在搜索设备
       */
      discovering: boolean
      /**
       * 蓝牙适配器是否可用
       */
      available: boolean
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 获取本机蓝牙适配器状态
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getBluetoothAdapterState({
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBluetoothAdapterState.html
   */
  function getBluetoothAdapterState(OBJECT?: getBluetoothAdapterState.Param): Promise<getBluetoothAdapterState.Promised>

  namespace closeBluetoothAdapter {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 关闭蓝牙模块，使其进入未初始化状态。调用该方法将断开所有已建立的链接并释放系统资源。建议在使用小程序蓝牙流程后调用，与`Taro.openBluetoothAdapter`成对调用。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.closeBluetoothAdapter({
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.closeBluetoothAdapter.html
   */
  function closeBluetoothAdapter(OBJECT?: closeBluetoothAdapter.Param): Promise<any>
}
