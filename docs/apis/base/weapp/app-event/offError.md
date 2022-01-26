---
title: Taro.offError(callback)
sidebar_label: offError
---

取消监听音频播放错误事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/InnerAudioContext.offError.html)

## 类型

```tsx
(callback: (res: Callback) => void) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(res: Callback) => void` | 音频播放错误事件的回调函数 |
