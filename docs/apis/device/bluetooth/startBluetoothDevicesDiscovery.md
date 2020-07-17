---
title: Taro.startBluetoothDevicesDiscovery(option)
sidebar_label: startBluetoothDevicesDiscovery
---

开始搜寻附近的蓝牙外围设备。**此操作比较耗费系统资源，请在搜索并连接到设备后调用 Taro.stopBluetoothDevicesDiscovery 方法停止搜索。**

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.startBluetoothDevicesDiscovery.html)

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
      <td>allowDuplicatesKey</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否允许重复上报同一设备。如果允许重复上报，则 Taro.onBlueToothDeviceFound 方法会多次上报同一设备，但是 RSSI 值会有不同。</td>
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
      <td>interval</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>上报设备的间隔。0 表示找到新设备立即上报，其他数值根据传入的间隔上报。</td>
    </tr>
    <tr>
      <td>services</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">否</td>
      <td>要搜索的蓝牙设备主 service 的 uuid 列表。某些蓝牙设备会广播自己的主 service 的 uuid。如果设置此参数，则只搜索广播包有对应 uuid 的主服务的蓝牙设备。建议主要通过该参数过滤掉周边不需要处理的其他蓝牙设备。</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: BluetoothError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
// 以微信硬件平台的蓝牙智能灯为例，主服务的 UUID 是 FEE7。传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
Taro.startBluetoothDevicesDiscovery({
  services: ['FEE7'],
  success: function (res) {
    console.log(res)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startBluetoothDevicesDiscovery | ✔️ |  |  |
