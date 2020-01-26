---
title: VideoContext
sidebar_label: VideoContext
---

## 方法

### exitFullScreen

退出全屏

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.exitFullScreen.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoContext.exitFullScreen | ✔️ |  |  |  |  |  |  |  |

### hideStatusBar

隐藏状态栏，仅在iOS全屏下有效

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.hideStatusBar.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoContext.hideStatusBar | ✔️ |  |  |  |  |  |  |  |

### pause

暂停视频

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.pause.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoContext.pause | ✔️ |  |  |  |  |  |  |  |

### play

播放视频

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.play.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoContext.play | ✔️ |  |  |  |  |  |  |  |

### playbackRate

设置倍速播放

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.playbackRate.html)

```tsx
(rate: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| rate | `number` | 倍率，支持 0.5/0.8/1.0/1.25/1.5，2.6.3 起支持 2.0 倍速 |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoContext.playbackRate | ✔️ |  |  |  |  |  |  |  |

### requestFullScreen

进入全屏

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.requestFullScreen.html)

```tsx
(option: RequestFullScreenOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `RequestFullScreenOption` |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoContext.requestFullScreen | ✔️ |  |  |  |  |  |  |  |

### seek

跳转到指定位置

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.seek.html)

```tsx
(position: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| position | `number` | 跳转到的位置，单位 s |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoContext.seek | ✔️ |  |  |  |  |  |  |  |

### sendDanmu

发送弹幕

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.sendDanmu.html)

```tsx
(data: Danmu) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| data | `Danmu` | 弹幕内容 |

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoContext.sendDanmu | ✔️ |  |  |  |  |  |  |  |

### showStatusBar

显示状态栏，仅在iOS全屏下有效

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.showStatusBar.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoContext.showStatusBar | ✔️ |  |  |  |  |  |  |  |

### stop

停止视频

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.stop.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoContext.stop | ✔️ |  |  |  |  |  |  |  |

## 参数

### RequestFullScreenOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| direction | `0 | 90 | -90` | 否 | 设置全屏时视频的方向，不指定则根据宽高比自动判断。<br /><br />可选值：<br />- 0: 正常竖向;<br />- 90: 屏幕逆时针90度;<br />- -90: 屏幕顺时针90度; |

### Danmu

弹幕内容

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| text | `string` | 是 | 弹幕文字 |
| color | `string` | 否 | 弹幕颜色 |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoContext.exitFullScreen | ✔️ |  |  |  |  |  |  |  |
| VideoContext.hideStatusBar | ✔️ |  |  |  |  |  |  |  |
| VideoContext.pause | ✔️ |  |  |  |  |  |  |  |
| VideoContext.play | ✔️ |  |  |  |  |  |  |  |
| VideoContext.playbackRate | ✔️ |  |  |  |  |  |  |  |
| VideoContext.requestFullScreen | ✔️ |  |  |  |  |  |  |  |
| VideoContext.seek | ✔️ |  |  |  |  |  |  |  |
| VideoContext.sendDanmu | ✔️ |  |  |  |  |  |  |  |
| VideoContext.showStatusBar | ✔️ |  |  |  |  |  |  |  |
| VideoContext.stop | ✔️ |  |  |  |  |  |  |  |
