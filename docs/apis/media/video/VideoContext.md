---
title: VideoContext
sidebar_label: VideoContext
---

## 方法

### exitFullScreen

退出全屏

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.exitFullScreen.html)

```tsx
() => void
```

### hideStatusBar

隐藏状态栏，仅在iOS全屏下有效

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.hideStatusBar.html)

```tsx
() => void
```

### pause

暂停视频

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.pause.html)

```tsx
() => void
```

### play

播放视频

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.play.html)

```tsx
() => void
```

### playbackRate

设置倍速播放

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.playbackRate.html)

```tsx
(rate: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| rate | `number` | 倍率，支持 0.5/0.8/1.0/1.25/1.5，2.6.3 起支持 2.0 倍速 |

### requestFullScreen

进入全屏

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.requestFullScreen.html)

```tsx
(option: RequestFullScreenOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `RequestFullScreenOption` |

### seek

跳转到指定位置

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.seek.html)

```tsx
(position: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| position | `number` | 跳转到的位置，单位 s |

### sendDanmu

发送弹幕

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.sendDanmu.html)

```tsx
(data: Danmu) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| data | `Danmu` | 弹幕内容 |

### showStatusBar

显示状态栏，仅在iOS全屏下有效

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.showStatusBar.html)

```tsx
() => void
```

### stop

停止视频

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.stop.html)

```tsx
() => void
```

## 参数

### RequestFullScreenOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| direction | 0 or 90 or -90 | 否 | 设置全屏时视频的方向，不指定则根据宽高比自动判断。<br /><br />可选值：<br />- 0: 正常竖向;<br />- 90: 屏幕逆时针90度;<br />- -90: 屏幕顺时针90度; |

### Danmu

弹幕内容

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| text | `string` | 是 | 弹幕文字 |
| color | `string` | 否 | 弹幕颜色 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.exitFullScreen | ✔️ | ✔️ | ✔️ |
| VideoContext.hideStatusBar | ✔️ |  |  |
| VideoContext.pause | ✔️ | ✔️ | ✔️ |
| VideoContext.play | ✔️ | ✔️ | ✔️ |
| VideoContext.playbackRate | ✔️ |  | ✔️ |
| VideoContext.requestFullScreen | ✔️ | ✔️ | ✔️ |
| VideoContext.seek | ✔️ | ✔️ | ✔️ |
| VideoContext.sendDanmu | ✔️ |  |  |
| VideoContext.showStatusBar | ✔️ |  |  |
| VideoContext.stop | ✔️ | ✔️ | ✔️ |
