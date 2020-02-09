---
title: Taro.offAppShow(callback)
sidebar_label: offAppShow
id: version-1.3.37-offAppShow
original_id: offAppShow
---

取消监听小程序切前台事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offAppShow.html)

## 类型

```tsx
(callback: (res: CallbackResult) => void) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: CallbackResult) => void` | 小程序切前台事件的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offAppShow | ✔️ |  |  |
