---
title: Taro.offLocationChange(callback)
sidebar_label: offLocationChange
id: version-2.0.3-offLocationChange
original_id: offLocationChange
---

取消监听实时地理位置变化事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.offLocationChange.html)

## 类型

```tsx
(callback: (res: CallbackResult) => void) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: CallbackResult) => void` | 实时地理位置变化事件的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offLocationChange | ✔️ |  |  |
