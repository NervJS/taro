---
title: 蓝牙
sidebar_label: 蓝牙
---

## Taro.openBluetoothAdapter(OBJECT)

使用方式同 [`wx.openBluetoothAdapter`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openBluetoothAdapter.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.openBluetoothAdapter(params).then(...)
```

## Taro.closeBluetoothAdapter(OBJECT)

使用方式同 [`wx.closeBluetoothAdapter`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.closeBluetoothAdapter.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.closeBluetoothAdapter(params).then(...)
```

## Taro.getBluetoothAdapterState(OBJECT)

使用方式同 [`wx.getBluetoothAdapterState`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBluetoothAdapterState.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getBluetoothAdapterState(params).then(...)
```

## Taro.onBluetoothAdapterStateChange(CALLBACK)

使用方式同 [`wx.onBluetoothAdapterStateChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBluetoothAdapterStateChange.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onBluetoothAdapterStateChange(res => {
  console.log(`adapterState changed, now is`, res)
})
```

## Taro.startBluetoothDevicesDiscovery(OBJECT)

使用方式同 [`wx.startBluetoothDevicesDiscovery`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startBluetoothDevicesDiscovery.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startBluetoothDevicesDiscovery(params).then(...)
```

## Taro.stopBluetoothDevicesDiscovery(OBJECT)

使用方式同 [`wx.stopBluetoothDevicesDiscovery`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopBluetoothDevicesDiscovery.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopBluetoothDevicesDiscovery(params).then(...)
```

## Taro.getBluetoothDevices(OBJECT)

使用方式同 [`wx.getBluetoothDevices`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBluetoothDevices.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getBluetoothDevices(params).then(...)
```

## Taro.getConnectedBluetoothDevices(OBJECT)

使用方式同 [`wx.getConnectedBluetoothDevices`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getConnectedBluetoothDevices.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getConnectedBluetoothDevices(params).then(...)
```

## Taro.onBluetoothDeviceFound(CALLBACK)

使用方式同 [`wx.onBluetoothDeviceFound `](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBluetoothDeviceFound.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onBluetoothDeviceFound(devices => {
  console.log(devices)
  console.log(devices[0].advertisData)
})
```

## Taro.createBLEConnection(OBJECT)

使用方式同 [`wx.createBLEConnection`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.createBLEConnection.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.createBLEConnection(params).then(...)
```

## Taro.closeBLEConnection(OBJECT)

使用方式同 [`wx.closeBLEConnection`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.closeBLEConnection.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.closeBLEConnection(params).then(...)
```

## Taro.getBLEDeviceServices(OBJECT)

使用方式同 [`wx.getBLEDeviceServices`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBLEDeviceServices.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getBLEDeviceServices(params).then(...)
```

## Taro.getBLEDeviceCharacteristics(OBJECT)

使用方式同 [`wx.getBLEDeviceCharacteristics`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBLEDeviceCharacteristics.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getBLEDeviceCharacteristics(params).then(...)
```

## Taro.readBLECharacteristicValue(OBJECT)

使用方式同 [`wx.readBLECharacteristicValue`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.readBLECharacteristicValue.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.readBLECharacteristicValue(params).then(...)
```

## Taro.writeBLECharacteristicValue(OBJECT)

使用方式同 [`wx.writeBLECharacteristicValue`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.writeBLECharacteristicValue.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.writeBLECharacteristicValue(params).then(...)
```

## Taro.notifyBLECharacteristicValueChange(OBJECT)

使用方式同 [`wx.notifyBLECharacteristicValueChange`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.notifyBLECharacteristicValueChange.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.notifyBLECharacteristicValueChange(params).then(...)
```

## Taro.onBLEConnectionStateChange(CALLBACK)

使用方式同 [`wx.onBLEConnectionStateChange`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBLEConnectionStateChange.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onBLEConnectionStateChange(res => {
  // 该方法回调中可以用于处理连接意外断开等异常情况
  console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
})
```

## Taro.onBLECharacteristicValueChange(CALLBACK)

使用方式同 [`wx.onBLECharacteristicValueChange`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBLECharacteristicValueChange.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onBLECharacteristicValueChange(res => {
  console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
  console.log(res.value)
})
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.openBluetoothAdapter | ✔️ |  |  |
| Taro.closeBluetoothAdapter | ✔️ |  |  |
| Taro.getBluetoothAdapterState | ✔️ |  |  |
| Taro.onBluetoothAdapterStateChange | ✔️ |  |  |
| Taro.startBluetoothDevicesDiscovery | ✔️ |  |  |
| Taro.stopBluetoothDevicesDiscovery | ✔️ |  |  |
| Taro.getBluetoothDevices | ✔️ |  |  |
| Taro.getConnectedBluetoothDevices | ✔️ |  |  |
| Taro.onBluetoothDeviceFound | ✔️ |  |  |
| Taro.createBLEConnection | ✔️ |  |  |
| Taro.closeBLEConnection | ✔️ |  |  |
| Taro.getBLEDeviceServices | ✔️ |  |  |
| Taro.getBLEDeviceCharacteristics | ✔️ |  |  |
| Taro.readBLECharacteristicValue | ✔️ |  |  |
| Taro.writeBLECharacteristicValue | ✔️ |  |  |
| Taro.notifyBLECharacteristicValueChange | ✔️ |  |  |
| Taro.onBLEConnectionStateChange | ✔️ |  |  |
| Taro.onBLECharacteristicValueChange | ✔️ |  |  |
