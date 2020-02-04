---
title: Taro.getBluetoothDevices(option)
sidebar_label: getBluetoothDevices
---

获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。

**注意事项**
- 该接口获取到的设备列表为**蓝牙模块生效期间所有搜索到的蓝牙设备**，若在蓝牙模块使用流程结束后未及时调用 Taro.closeBluetoothAdapter 释放资源，会存在调用该接口会返回之前的蓝牙使用流程中搜索到的蓝牙设备，可能设备已经不在用户身边，无法连接。
- 蓝牙设备在被搜索到时，系统返回的 name 字段一般为广播包中的 LocalName 字段中的设备名称，而如果与蓝牙设备建立连接，系统返回的 name 字段会改为从蓝牙设备上获取到的 `GattName`。若需要动态改变设备名称并展示，建议使用 `localName` 字段。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBluetoothDevices.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: BluetoothError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: BluetoothError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| devices | `SuccessCallbackResultBlueToothDevice[]` | uuid 对应的的已连接设备列表 |
| errMsg | `string` | 成功：ok，错误：详细信息 |

### SuccessCallbackResultBlueToothDevice

uuid 对应的的已连接设备列表

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| RSSI | `number` | 当前蓝牙设备的信号强度 |
| advertisData | `ArrayBuffer` | 当前蓝牙设备的广播数据段中的 ManufacturerData 数据段。 |
| advertisServiceUUIDs | `string[]` | 当前蓝牙设备的广播数据段中的 ServiceUUIDs 数据段 |
| deviceId | `string` | 用于区分设备的 id |
| localName | `string` | 当前蓝牙设备的广播数据段中的 LocalName 数据段 |
| name | `string` | 蓝牙设备名称，某些设备可能没有 |
| serviceData | `Record<string, any>` | 当前蓝牙设备的广播数据段中的 ServiceData 数据段 |

## 示例代码

```tsx
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

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBluetoothDevices | ✔️ |  |  |
