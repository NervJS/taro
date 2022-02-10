---
title: Taro.createAudioContext(id, component)
sidebar_label: createAudioContext
---

创建 audio 上下文 AudioContext 对象。
**注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html) 接口**

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createAudioContext.html)

## 类型

```tsx
(id: string, component?: TaroGeneral.IAnyObject) => AudioContext
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | `string` | [audio](https://developers.weixin.qq.com/miniprogram/dev/component/audio.html) 组件的 id |
| component | `TaroGeneral.IAnyObject` | 在自定义组件下，当前组件实例的this，以操作组件内 [audio](https://developers.weixin.qq.com/miniprogram/dev/component/audio.html) 组件 |

## 示例代码

```tsx
const audioCtx = Taro.createAudioContext('myAudio')
```
