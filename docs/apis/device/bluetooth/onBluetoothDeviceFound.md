---
title: Taro.onBluetoothDeviceFound(callback)
sidebar_label: onBluetoothDeviceFound
---

监听寻找到新设备的事件

**注意**
- 若在 Taro.onBluetoothDeviceFound 回调了某个设备，则此设备会添加到 Taro.getBluetoothDevices 接口获取到的数组中。
- 安卓下部分机型需要有位置权限才能搜索到设备，需留意是否开启了位置权限

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothDeviceFound.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

寻找到新设备的事件的回调函数

```tsx
(result: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### CallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>devices</td>
      <td><code>CallbackResultBlueToothDevice[]</code></td>
      <td>新搜索到的设备列表</td>
    </tr>
  </tbody>
</table>

### CallbackResultBlueToothDevice

新搜索到的设备

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>RSSI</td>
      <td><code>number</code></td>
      <td>当前蓝牙设备的信号强度</td>
    </tr>
    <tr>
      <td>advertisData</td>
      <td><code>ArrayBuffer</code></td>
      <td>当前蓝牙设备的广播数据段中的 ManufacturerData 数据段。</td>
    </tr>
    <tr>
      <td>advertisServiceUUIDs</td>
      <td><code>string[]</code></td>
      <td>当前蓝牙设备的广播数据段中的 ServiceUUIDs 数据段</td>
    </tr>
    <tr>
      <td>deviceId</td>
      <td><code>string</code></td>
      <td>用于区分设备的 id</td>
    </tr>
    <tr>
      <td>localName</td>
      <td><code>string</code></td>
      <td>当前蓝牙设备的广播数据段中的 LocalName 数据段</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td>蓝牙设备名称，某些设备可能没有</td>
    </tr>
    <tr>
      <td>serviceData</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>当前蓝牙设备的广播数据段中的 ServiceData 数据段</td>
    </tr>
  </tbody>
</table>

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
Taro.onBluetoothDeviceFound(function (res) {
  var devices = res.devices;
  console.log('new device list has founded')
  console.dir(devices)
  console.log(ab2hex(devices[0].advertisData))
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBluetoothDeviceFound | ✔️ |  |  |
