---
title: Taro.setScreenBrightness(option)
sidebar_label: setScreenBrightness
---

设置屏幕亮度。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setScreenBrightness.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| value | `number` | 是 | 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.setScreenBrightness(params).then(...)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setScreenBrightness | ✔️ |  | ✔️ |
