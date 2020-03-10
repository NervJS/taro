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

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| SSID | `string` | 是 | Wi-Fi 设备 SSID |
| password | `string` | 是 | Wi-Fi 设备密码 |
| BSSID | `string` | 否 | Wi-Fi 设备 BSSID |
| complete | `(res: WifiError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: WifiError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: WifiError) => void` | 否 | 接口调用成功的回调函数 |

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
