---
title: AudioContext
sidebar_label: AudioContext
---

`AudioContext` 实例，可通过 `Taro.createAudioContext` 获取。
`AudioContext` 通过 `id` 跟一个 `audio` 组件绑定，操作对应的 audio 组件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioContext.html)

## 方法

### pause

暂停音频。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioContext.pause.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| AudioContext.pause | ✔️ |  |  |  |  |  |  |  |

### play

播放音频。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioContext.play.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| AudioContext.play | ✔️ |  |  |  |  |  |  |  |

### seek

跳转到指定位置。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioContext.seek.html)

```tsx
(position: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| position | `number` | 跳转位置，单位 s |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| AudioContext.seek | ✔️ |  |  |  |  |  |  |  |

### setSrc

设置音频地址

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioContext.setSrc.html)

```tsx
(src: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| src | `string` | 音频地址 |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| AudioContext.setSrc | ✔️ |  |  |  |  |  |  |  |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| AudioContext.pause | ✔️ |  |  |  |  |  |  |  |
| AudioContext.play | ✔️ |  |  |  |  |  |  |  |
| AudioContext.seek | ✔️ |  |  |  |  |  |  |  |
| AudioContext.setSrc | ✔️ |  |  |  |  |  |  |  |
