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

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

```tsx
(contextType: string) => RenderingContext
```

| 参数 | 类型 |
| --- | --- |
| contextType | `string` |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OffscreenCanvas.getContext | ✔️ |  |  |
