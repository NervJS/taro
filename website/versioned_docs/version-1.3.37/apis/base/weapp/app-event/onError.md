---
title: Taro.onError(callback)
sidebar_label: onError
id: version-1.3.37-onError
original_id: onError
---

监听小程序错误事件。如脚本错误或 API 调用报错等。该事件与 [`App.onError`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onerrorstring-error) 的回调时机与参数一致。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onError.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

小程序错误事件的回调函数

```tsx
(error: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| error | `string` | 错误信息，包含堆栈 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onError | ✔️ |  |  |
