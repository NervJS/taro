---
title: Taro.startBeaconDiscovery(option)
sidebar_label: startBeaconDiscovery
id: version-2.1.1-startBeaconDiscovery
original_id: startBeaconDiscovery
---

开始搜索附近的 iBeacon 设备

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.startBeaconDiscovery.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>uuids</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">是</td>
      <td>iBeacon 设备广播的 uuid 列表</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: IBeaconError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: IBeaconError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>ignoreBluetoothAvailable</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否校验蓝牙开关，仅在 iOS 下有效</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: IBeaconError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.startBeaconDiscovery({
  success: function (res) { }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startBeaconDiscovery | ✔️ |  |  |
