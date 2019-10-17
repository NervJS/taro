declare namespace Taro {
  namespace readBLECharacteristicValue {
    type Promised = {
      /**
       * 错误码
       */
      errCode: number
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 device 对象
       */
      deviceId: string
      /**
       * 蓝牙特征值对应服务的 uuid
       */
      serviceId: string
      /**
       * 蓝牙特征值的 uuid
       */
      characteristicId: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持`read`才可以成功调用，具体参照 characteristic 的 properties 属性
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 并行调用多次读写接口存在读写失败的可能性。
   * 2.  `tip`: `read`接口读取到的信息需要在`onBLECharacteristicValueChange`方法注册的回调中获取。
   *
   * **示例代码：**
   *
   ```javascript
   // 必须在这里的回调才能获取
   Taro.onBLECharacteristicValueChange(function(characteristic) {
     console.log('characteristic value comed:', characteristic)
   })
         Taro.readBLECharacteristicValue({
     // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接  [  new  ]
     deviceId: deviceId,
     // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
     serviceId: serviceId,
     // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
     characteristicId: characteristicId,
     success: function (res) {
       console.log('readBLECharacteristicValue:', res.errCode)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.readBLECharacteristicValue.html
   */
  function readBLECharacteristicValue(OBJECT: readBLECharacteristicValue.Param): Promise<readBLECharacteristicValue.Promised>

  namespace onBLEConnectionStateChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 蓝牙设备 id，参考 device 对象
       */
      deviceId: string
      /**
       * 连接目前的状态
       */
      connected: boolean
    }
  }
  /**
   * @since 1.1.1
   *
   * 监听低功耗蓝牙连接状态的改变事件，包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
   *
   * **示例代码：**
   *
   ```javascript
   Taro.onBLEConnectionStateChange(function(res) {
     // 该方法回调中可以用于处理连接意外断开等异常情况
     console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.onBLEConnectionStateChange.html
   */
  function onBLEConnectionStateChange(CALLBACK: onBLEConnectionStateChange.Param): void

  namespace onBLECharacteristicValueChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 蓝牙设备 id，参考 device 对象
       */
      deviceId: string
      /**
       * 特征值所属服务 uuid
       */
      serviceId: string
      /**
       * 特征值 uuid
       */
      characteristicId: string
      /**
       * 特征值最新的值 **（注意：vConsole 无法打印出 ArrayBuffer 类型数据）**
       */
      value: ArrayBuffer
    }
  }
  /**
   * @since 1.1.0
   *
   * 监听低功耗蓝牙设备的特征值变化。必须先启用`notify`接口才能接收到设备推送的notification。
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
   Taro.onBLECharacteristicValueChange(function(res) {
     console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
     console.log(ab2hext(res.value))
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.onBLECharacteristicValueChange.html
   */
  function onBLECharacteristicValueChange(CALLBACK: onBLECharacteristicValueChange.Param): void

  namespace notifyBLECharacteristicValueChange {
    type Promised = {
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 device 对象
       */
      deviceId: string
      /**
       * 蓝牙特征值对应服务的 uuid
       */
      serviceId: string
      /**
       * 蓝牙特征值的 uuid
       */
      characteristicId: string
      /**
       * true: 启用 notify; false: 停用 notify
       */
      state: boolean
    }
  }
  /**
   * @since 1.1.1
   *
   * 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持`notify`或者`indicate`才可以成功调用，具体参照 characteristic 的 properties 属性
   *
   * 另外，必须先启用`notify`才能监听到设备 characteristicValueChange 事件
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 订阅操作成功后需要设备主动更新特征值的value，才会触发 Taro.onBLECharacteristicValueChange 回调。
   * 2.  `tip`: 安卓平台上，在调用notify成功后立即调用write接口，在部分机型上会发生 10008 系统错误
   *
   * **示例代码：**
   *
   ```javascript
   Taro.notifyBLECharacteristicValueChange({
     state: true, // 启用 notify 功能
     // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     deviceId: deviceId,
     // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
     serviceId: serviceId,
     // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
     characteristicId: characteristicId,
     success: function (res) {
       console.log('notifyBLECharacteristicValueChange success', res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.notifyBLECharacteristicValueChange.html
   */
  function notifyBLECharacteristicValueChange(OBJECT: notifyBLECharacteristicValueChange.Param): Promise<notifyBLECharacteristicValueChange.Promised>

  namespace getBLEDeviceServices {
    type Promised = {
      /**
       * 设备服务列表
       */
      services: PromisedPropServices
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    /**
     * 设备服务列表
     */
    type PromisedPropServices = PromisedPropServicesItem[]
    type PromisedPropServicesItem = {
      /**
       * 蓝牙设备服务的 uuid
       */
      uuid: string
      /**
       * 该服务是否为主服务
       */
      isPrimary: boolean
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 getDevices 接口
       */
      deviceId: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 获取蓝牙设备所有 service（服务）
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`:iOS平台上后续对特征值的read、write、notify，由于系统需要获取特征值实例，传入的 serviceId 与 characteristicId 必须由 getBLEDeviceServices 与 getBLEDeviceCharacteristics 中获取到后才能使用。建议双平台统一在建立链接后先执行 getBLEDeviceServices 与 getBLEDeviceCharacteristics 后再进行与蓝牙设备的数据交互
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getBLEDeviceServices({
     // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     deviceId: deviceId,
     success: function (res) {
       console.log('device services:', res.services)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEDeviceServices.html
   */
  function getBLEDeviceServices(OBJECT: getBLEDeviceServices.Param): Promise<getBLEDeviceServices.Promised>

  namespace getBLEDeviceCharacteristics {
    type Promised = {
      /**
       * 设备特征值列表
       */
      characteristics: PromisedPropCharacteristics
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    /**
     * 设备特征值列表
     */
    type PromisedPropCharacteristics = PromisedPropCharacteristicsItem[]
    type PromisedPropCharacteristicsItem = {
      /**
       * 蓝牙设备特征值的 uuid
       */
      uuid: string
      /**
       * 该特征值支持的操作类型
       */
      properties: PromisedPropCharacteristicsItemPropProperties
    }
    /**
     * 该特征值支持的操作类型
     */
    type PromisedPropCharacteristicsItemPropProperties = {
      /**
       * 该特征值是否支持 read 操作
       */
      read: boolean
      /**
       * 该特征值是否支持 write 操作
       */
      write: boolean
      /**
       * 该特征值是否支持 notify 操作
       */
      notify: boolean
      /**
       * 该特征值是否支持 indicate 操作
       */
      indicate: boolean
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 device 对象
       */
      deviceId: string
      /**
       * 蓝牙服务 uuid
       */
      serviceId: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 获取蓝牙设备某个服务中的所有 characteristic（特征值）
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`:传入的serviceId需要在getBLEDeviceServices获取到
   * 2.  `tip`:iOS平台上后续对特征值的read、write、notify，由于系统需要获取特征值实例，传入的 serviceId 与 characteristicId 必须由 getBLEDeviceServices 与 getBLEDeviceCharacteristics 中获取到后才能使用。建议双平台统一在建立链接后先执行 getBLEDeviceServices 与 getBLEDeviceCharacteristics 后再进行与蓝牙设备的数据交互
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getBLEDeviceCharacteristics({
     // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     deviceId: deviceId,
     // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
     serviceId: serviceId,
     success: function (res) {
       console.log('device getBLEDeviceCharacteristics:', res.characteristics)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEDeviceCharacteristics.html
   */
  function getBLEDeviceCharacteristics(OBJECT: getBLEDeviceCharacteristics.Param): Promise<getBLEDeviceCharacteristics.Promised>

  namespace createBLEConnection {
    type Promised = {
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 getDevices 接口
       */
      deviceId: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 连接低功耗蓝牙设备。
   *
   * > 若小程序在之前已有搜索过某个蓝牙设备，并成功建立链接，可直接传入之前搜索获取的deviceId直接尝试连接该设备，无需进行搜索操作。
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 安卓手机上如果多次调用create创建连接，有可能导致系统持有同一设备多个连接的实例，导致调用close的时候并不能真正的断开与设备的连接。因此请保证尽量成对的调用create和close接口
   * 2.  `tip`: 蓝牙链接随时可能断开，建议监听 Taro.onBLEConnectionStateChange 回调事件，当蓝牙设备断开时按需执行重连操作
   * 3.  `tip`: 若对未连接的设备或已断开连接的设备调用数据读写操作的接口，会返回10006错误，详见错误码，建议进行重连操作
   *
   * **示例代码：**
   *
   ```javascript
   Taro.createBLEConnection({
     // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     deviceId: deviceId,
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.createBLEConnection.html
   */
  function createBLEConnection(OBJECT: createBLEConnection.Param): Promise<createBLEConnection.Promised>

  namespace closeBLEConnection {
    type Promised = {
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 getDevices 接口
       */
      deviceId: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 断开与低功耗蓝牙设备的连接
   *
   * **示例代码：**
   *
   ```javascript
   Taro.closeBLEConnection({
     deviceId:deviceId
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.closeBLEConnection.html
   */
  function closeBLEConnection(OBJECT: closeBLEConnection.Param): Promise<closeBLEConnection.Promised>

  namespace writeBLECharacteristicValue {
    type Promised = {
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 device 对象
       */
      deviceId: string
      /**
       * 蓝牙特征值对应服务的 uuid
       */
      serviceId: string
      /**
       * 蓝牙特征值的 uuid
       */
      characteristicId: string
      /**
       * 蓝牙设备特征值对应的二进制值
       */
      value: ArrayBuffer
    }
  }
  /**
   * @since 1.1.0
   *
   * 向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持`write`才可以成功调用，具体参照 characteristic 的 properties 属性
   *
   * _tips: 并行调用多次读写接口存在读写失败的可能性_
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 并行调用多次读写接口存在读写失败的可能性。
   * 2.  `tip`: 小程序不会对写入数据包大小做限制，但系统与蓝牙设备会确定蓝牙4.0单次传输的数据大小，超过最大字节数后会发生写入错误，建议每次写入不超过20字节。
   * 3.  `tip`: 安卓平台上，在调用notify成功后立即调用write接口，在部分机型上会发生 10008 系统错误
   * 4.  `bug`: 若单次写入数据过长，iOS平台上存在系统不会有任何回调的情况(包括错误回调)。
   *
   * **示例代码：**
   *
   ```javascript
   // 向蓝牙设备发送一个0x00的16进制数据
   let buffer = new ArrayBuffer(1)
   let dataView = new DataView(buffer)
   dataView.setUint8(0, 0)
         Taro.writeBLECharacteristicValue({
     // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
     deviceId: deviceId,
     // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
     serviceId: serviceId,
     // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
     characteristicId: characteristicId,
     // 这里的value是ArrayBuffer类型
     value: buffer,
     success: function (res) {
       console.log('writeBLECharacteristicValue success', res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.writeBLECharacteristicValue.html
   */
  function writeBLECharacteristicValue(OBJECT: writeBLECharacteristicValue.Param): Promise<writeBLECharacteristicValue.Promised>
}
