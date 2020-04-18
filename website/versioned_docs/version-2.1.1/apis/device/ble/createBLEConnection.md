---
title: Taro.createBLEConnection(option)
sidebar_label: createBLEConnection
id: version-2.1.1-createBLEConnection
original_id: createBLEConnection
---

连接低功耗蓝牙设备。

若小程序在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备，无需进行搜索操作。

**注意**
- 请保证尽量成对的调用 `createBLEConnection` 和 `closeBLEConnection` 接口。安卓如果多次调用 `createBLEConnection` 创建连接，有可能导致系统持有同一设备多个连接的实例，导致调用 `closeBLEConnection` 的时候并不能真正的断开与设备的连接。
- 蓝牙连接随时可能断开，建议监听 Taro.onBLEConnectionStateChange 回调事件，当蓝牙设备断开时按需执行重连操作
- 若对未连接的设备或已断开连接的设备调用数据读写操作的接口，会返回 10006 错误，建议进行重连操作。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.createBLEConnection.html)

## 类型

```tsx
(option: Option) => Promise<Promised>
```

## 参数

### Promised

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>成功：ok，错误：详细信息</td>
    </tr>
  </tbody>
</table>

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
      <td>deviceId</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>用于区分设备的 id</td>
    </tr>
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
      <td><code>(res: BluetoothError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>timeout</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>超时时间，单位ms，不填表示不会超时</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.createBLEConnection({
  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
  deviceId,
  success: function (res) {
    console.log(res)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createBLEConnection | ✔️ |  |  |
