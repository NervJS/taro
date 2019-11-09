---
title: Taro.startAccelerometer(res)
sidebar_label: startAccelerometer
---

开始监听加速度数据。

## 类型

```tsx
(res?: Param) => Promise<any>
```

## 参数

### Param res

| Name | Type | Default | Description |
| --- | --- | :---: | --- |
| interval | `"game" | "ui" | "normal"` | `"normal"` | 监听加速度数据回调函数的执行频率 |
| success | `Function` |  | 接口调用成功的回调函数 |
| fail | `Function` |  | 接口调用失败的回调函数 |
| complete | `Function` |  | 接口调用结束的回调函数（调用成功、失败都会执行） |

### interval

| Name | Type | Description |
| --- | --- | --- |
| game | `"game"` | 适用于更新游戏的回调频率，在 20ms/次 左右 |
| ui | `"ui"` | 适用于更新 UI 的回调频率，在 60ms/次 左右 |
| normal | `"normal"` | 普通的回调频率，在 200ms/次 左右 |

## 示例代码

```tsx
Taro.startAccelerometer({ interval: 'game' })
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.startAccelerometer | ✔️ |  |  |  |  | ✔️ | ✔️ |  |

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.startAccelerometer.html)
