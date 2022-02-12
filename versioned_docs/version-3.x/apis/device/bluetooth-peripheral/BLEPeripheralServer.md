---
title: BLEPeripheralServer
sidebar_label: BLEPeripheralServer
---

外围设备的服务端

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.html)

## 方法

### addService

添加服务

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.addService.html)

```tsx
(option: Option) => Promise<TaroGeneral.BluetoothError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### close

关闭当前服务端

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.close.html)

```tsx
(option: Option) => Promise<TaroGeneral.BluetoothError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### offCharacteristicReadRequest

取消监听已连接的设备请求读当前外围设备的特征值事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicReadRequest.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 已连接的设备请求读当前外围设备的特征值事件的回调函数 |

### offCharacteristicSubscribed

取消监听特征订阅事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicSubscribed.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 特征订阅事件的回调函数 |

### offCharacteristicUnsubscribed

取消监听取消特征订阅事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicUnsubscribed.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 取消特征订阅事件的回调函数 |

### offCharacteristicWriteRequest

取消监听已连接的设备请求写当前外围设备的特征值事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicWriteRequest.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 已连接的设备请求写当前外围设备的特征值事件的回调函数 |

### onCharacteristicReadRequest

监听已连接的设备请求读当前外围设备的特征值事件

收到该消息后需要立刻调用 [writeCharacteristicValue](/docs/apis/device/bluetooth-peripheral/BLEPeripheralServer#writecharacteristicvalue) 写回数据，否则主机不会收到响应。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicReadRequest.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 已连接的设备请求读当前外围设备的特征值事件的回调函数 |

### onCharacteristicSubscribed

监听特征订阅事件，仅 iOS 支持

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicSubscribed.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 特征订阅事件的回调函数 |

### onCharacteristicUnsubscribed

监听取消特征订阅事件，仅 iOS 支持

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicUnsubscribed.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 取消特征订阅事件的回调函数 |

### onCharacteristicWriteRequest

监听已连接的设备请求写当前外围设备的特征值事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicWriteRequest.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 已连接的设备请求写当前外围设备的特征值事件的回调函数 |

### removeService

移除服务

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.removeService.html)

```tsx
(option: Option) => Promise<TaroGeneral.BluetoothError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### startAdvertising

开始广播本地创建的外围设备

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.startAdvertising.html)

```tsx
(option: Option) => Promise<TaroGeneral.BluetoothError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### stopAdvertising

停止广播

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.stopAdvertising.html)

```tsx
(option: Option) => Promise<TaroGeneral.BluetoothError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### writeCharacteristicValue

往指定特征写入二进制数据值，并通知已连接的主机，从机的特征值已发生变化，该接口会处理是走回包还是走订阅

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.writeCharacteristicValue.html)

```tsx
(option: Option) => Promise<TaroGeneral.BluetoothError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

## 参数

### addService

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| service | `service` | 是 | 描述 service 的 Object |
| complete | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用成功的回调函数 |

#### service

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| uuid | `string` | 蓝牙服务的 UUID |
| characteristics | `characteristic[]` | characteristics 列表 |

#### characteristic

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| uuid | `string` | characteristic 的 UUID |
| properties | `properties` | 特征支持的操作 |
| permission | `characteristicPermission` | 特征权限 |
| value | `ArrayBuffer` | 特征对应的二进制值 |
| descriptors | `descriptor[]` | 描述符数据 |

#### properties

特征支持的操作

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| write | `boolean` | `false` | 否 | 写 |
| writeNoResponse | `boolean` | `false` | 否 | 无回复写 |
| read | `boolean` | `false` | 否 | 读 |
| notify | `boolean` | `false` | 否 | 订阅 |
| indicate | `boolean` | `false` | 否 | 回包 |

#### characteristicPermission

特征权限

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| readable | `boolean` | `false` | 否 | 可读 |
| writeable | `boolean` | `false` | 否 | 可写 |
| readEncryptionRequired | `boolean` | `false` | 否 | 加密读请求 |
| writeEncryptionRequired | `boolean` | `false` | 否 | 加密写请求 |

#### descriptor

描述符数据

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| uuid | `string` | Descriptor 的 UUID |
| permission | `descriptorPermission` | 描述符的权限 |
| value | `ArrayBuffer` | 描述符数据 |

#### descriptorPermission

描述符的权限

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| write | `boolean` | `false` | 否 | 写 |
| read | `boolean` | `false` | 否 | 读 |

### close

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用成功的回调函数 |

### onCharacteristicReadRequest

#### Callback

已连接的设备请求读当前外围设备的特征值事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

#### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| serviceId | `string` | 蓝牙特征对应服务的 UUID |
| characteristicId | `string` | 蓝牙特征的 UUID |
| callbackId | `number` | 唯一标识码，调用 [writeCharacteristicValue](/docs/apis/device/bluetooth-peripheral/BLEPeripheralServer#writecharacteristicvalue) 时使用 |

### onCharacteristicSubscribed

#### Callback

特征订阅事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

#### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| serviceId | `string` | 蓝牙特征对应服务的 UUID |
| characteristicId | `string` | 蓝牙特征的 UUID |

### onCharacteristicUnsubscribed

#### Callback

取消特征订阅事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

#### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| serviceId | `string` | 蓝牙特征对应服务的 UUID |
| characteristicId | `string` | 蓝牙特征的 UUID |

### onCharacteristicWriteRequest

#### Callback

已连接的设备请求写当前外围设备的特征值事件的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

#### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| serviceId | `string` | 蓝牙特征对应服务的 UUID |
| characteristicId | `string` | 蓝牙特征的 UUID |
| callbackId | `number` | 唯一标识码，调用 [writeCharacteristicValue](/docs/apis/device/bluetooth-peripheral/BLEPeripheralServer#writecharacteristicvalue) 时使用 |
| value | `ArrayBuffer` | 请求写入特征的二进制数据值 |

### removeService

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| serviceId | `string` | 是 | service 的 UUID |
| complete | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用成功的回调函数 |

### startAdvertising

#### Option

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| advertiseRequest | `advertiseRequest` |  | 是 | 广播自定义参数 |
| powerLevel | `keyof PowerLevel` | `"medium"` | 否 | 广播功率 |
| complete | `(res: TaroGeneral.BluetoothError) => void` |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.BluetoothError) => void` |  | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.BluetoothError) => void` |  | 否 | 接口调用成功的回调函数 |

#### advertiseRequest

广播自定义参数

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| connectable | `boolean` | `true` | 否 | 当前设备是否可连接 |
| deviceName | `string` | `""` | 否 | 广播中 deviceName 字段，默认为空 |
| serviceUuids | `string[]` |  | 否 | 要广播的服务 UUID 列表。使用 16/32 位 UUID 时请参考注意事项。 |
| manufacturerData | `manufacturerData[]` |  | 否 | 广播的制造商信息。仅安卓支持，iOS 因系统限制无法定制。 |
| beacon | `beacon` |  | 否 | 以 beacon 设备形式广播的参数。 |

#### manufacturerData

广播的制造商信息。仅安卓支持，iOS 因系统限制无法定制。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| manufacturerId | `string` | 是 | 制造商ID，0x 开头的十六进制 |
| manufacturerSpecificData | `ArrayBuffer` | 否 | 制造商信息 |

#### beacon

以 beacon 设备形式广播的参数。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| uuid | `string` | 是 | Beacon 设备广播的 UUID |
| major | `number` | 是 | Beacon 设备的主 ID |
| minor | `number` | 是 | Beacon 设备的次 ID |
| measuredPower | `number` | 否 | 用于判断距离设备 1 米时 RSSI 大小的参考值 |

#### PowerLevel

广播功率合法值

| 参数 | 说明 |
| --- | --- |
| low | 功率低 |
| medium | 功率适中 |
| high | 功率高 |

### stopAdvertising

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用成功的回调函数 |

### writeCharacteristicValue

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| serviceId | `string` | 是 | 蓝牙特征对应服务的 UUID |
| characteristicId | `string` | 是 | 蓝牙特征的 UUID |
| value | `ArrayBuffer` | 是 | characteristic 对应的二进制值 |
| needNotify | `boolean` | 是 | 是否需要通知主机 value 已更新 |
| callbackId | `number` | 否 | 可选，处理回包时使用 |
| complete | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.BluetoothError) => void` | 否 | 接口调用成功的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| BLEPeripheralServer | ✔️ |  |  |
| BLEPeripheralServer.addService | ✔️ |  |  |
| BLEPeripheralServer.close | ✔️ |  |  |
| BLEPeripheralServer.offCharacteristicReadRequest | ✔️ |  |  |
| BLEPeripheralServer.offCharacteristicSubscribed | ✔️ |  |  |
| BLEPeripheralServer.offCharacteristicUnsubscribed | ✔️ |  |  |
| BLEPeripheralServer.offCharacteristicWriteRequest | ✔️ |  |  |
| BLEPeripheralServer.onCharacteristicReadRequest | ✔️ |  |  |
| BLEPeripheralServer.onCharacteristicSubscribed | ✔️ |  |  |
| BLEPeripheralServer.onCharacteristicUnsubscribed | ✔️ |  |  |
| BLEPeripheralServer.onCharacteristicWriteRequest | ✔️ |  |  |
| BLEPeripheralServer.removeService | ✔️ |  |  |
| BLEPeripheralServer.startAdvertising | ✔️ |  |  |
| BLEPeripheralServer.stopAdvertising | ✔️ |  |  |
| BLEPeripheralServer.writeCharacteristicValue | ✔️ |  |  |
