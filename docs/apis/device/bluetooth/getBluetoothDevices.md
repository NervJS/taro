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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: BluetoothError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: BluetoothError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

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
      <td><code>SuccessCallbackResultBlueToothDevice[]</code></td>
      <td>uuid 对应的的已连接设备列表</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>成功：ok，错误：详细信息</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResultBlueToothDevice

uuid 对应的的已连接设备列表

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
