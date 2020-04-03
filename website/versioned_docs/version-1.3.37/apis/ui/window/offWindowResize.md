---
title: Taro.offWindowResize(callback)
sidebar_label: offWindowResize
id: version-1.3.37-offWindowResize
original_id: offWindowResize
---

取消监听窗口尺寸变化事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.offWindowResize.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

窗口尺寸变化事件的回调函数

```tsx
(res: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offWindowResize | ✔️ | ✔️ |  |
