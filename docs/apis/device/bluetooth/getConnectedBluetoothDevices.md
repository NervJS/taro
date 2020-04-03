---
title: Taro.getConnectedBluetoothDevices(option)
sidebar_label: getConnectedBluetoothDevices
---

根据 uuid 获取处于已连接状态的设备。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getConnectedBluetoothDevices.html)

## 类型

```tsx
(option: Option) => void
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
      <td>services</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">是</td>
      <td>蓝牙设备主 service 的 uuid 列表</td>
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
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
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
      <td><code>BluetoothDeviceInfo[]</code></td>
      <td>搜索到的设备列表</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>成功：ok，错误：详细信息</td>
    </tr>
  </tbody>
</table>

### BluetoothDeviceInfo

搜索到的设备

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
      <td>deviceId</td>
      <td><code>string</code></td>
      <td>用于区分设备的 id</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td>蓝牙设备名称，某些设备可能没有</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.getConnectedBluetoothDevices({
  success: function (res) {
    console.log(res)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getConnectedBluetoothDevices | ✔️ |  |  |
