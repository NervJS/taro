---
title: Taro.setWifiList(option)
sidebar_label: setWifiList
id: version-2.1.1-setWifiList
original_id: setWifiList
---

设置 `wifiList` 中 AP 的相关信息。在 `onGetWifiList` 回调后调用，**iOS特有接口**。

**注意**
- 该接口只能在 `onGetWifiList` 回调之后才能调用。
- 此时客户端会挂起，等待小程序设置 Wi-Fi 信息，请务必尽快调用该接口，若无数据请传入一个空数组。
- 有可能随着周边 Wi-Fi 列表的刷新，单个流程内收到多次带有存在重复的 Wi-Fi 列表的回调。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.setWifiList.html)

## 类型

```tsx
(option: Option) => Promise<WifiError>
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
      <td>wifiList</td>
      <td><code>WifiData[]</code></td>
      <td style="text-align:center">是</td>
      <td>提供预设的 Wi-Fi 信息列表</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: WifiError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: WifiError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: WifiError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### WifiData

提供预设的 Wi-Fi 信息列表

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
      <td>BSSID</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>Wi-Fi 的 BSSID</td>
    </tr>
    <tr>
      <td>SSID</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>Wi-Fi 的 SSID</td>
    </tr>
    <tr>
      <td>password</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>Wi-Fi 设备密码</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.onGetWifiList(function (res) {
  if (res.wifiList.length) {
    Taro.setWifiList({
      wifiList: [{
        SSID: res.wifiList[0].SSID,
        BSSID: res.wifiList[0].BSSID,
        password: '123456'
      }]
    })
  } else {
    Taro.setWifiList({
      wifiList: []
    })
  }
})
Taro.getWifiList()
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setWifiList | ✔️ |  |  |
