---
title: OffscreenCanvas
sidebar_label: OffscreenCanvas
---

离屏 canvas 实例，可通过 Taro.createOffscreenCanvas 创建。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/OffscreenCanvas.html)

## 方法

### getContext

该方法返回 OffscreenCanvas 的绘图上下文

****

当前仅支持获取 WebGL 绘图上下文

```tsx
(contextType: string) => RenderingContext
```

| 参数 | 类型 |
| --- | --- |
| contextType | `string` |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| OffscreenCanvas.getContext | ✔️ |  |  |  |  |  |  |  |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| OffscreenCanvas.getContext | ✔️ |  |  |  |  |  |  |  |
