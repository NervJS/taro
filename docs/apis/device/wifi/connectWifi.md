---
title: Taro.connectWifi(option)
sidebar_label: connectWifi
---

连接 Wi-Fi。若已知 Wi-Fi 信息，可以直接利用该接口连接。仅 Android 与 iOS 11 以上版本支持。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.connectWifi.html)

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
      <td>SSID</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>Wi-Fi 设备 SSID</td>
    </tr>
    <tr>
      <td>password</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>Wi-Fi 设备密码</td>
    </tr>
    <tr>
      <td>BSSID</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>Wi-Fi 设备 BSSID</td>
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

## 示例代码

```tsx
Taro.connectWifi({
  SSID: '',
  BSSID: '',
  success: function (res) {
    console.log(res.errMsg)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.connectWifi | ✔️ |  |  |
