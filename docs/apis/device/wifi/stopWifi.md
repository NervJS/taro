---
title: Taro.stopWifi(option)
sidebar_label: stopWifi
---

关闭 Wi-Fi 模块。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.stopWifi.html)

## 类型

```tsx
(option?: Option) => Promise<WifiError>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: WifiError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: WifiError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: WifiError) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.stopWifi({
  success: function (res) {
    console.log(res.errMsg)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.stopWifi | ✔️ |  |  |
