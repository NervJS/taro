---
title: VideoDecoder
sidebar_label: VideoDecoder
---

## 方法

### getFrameData

获取下一帧的解码数据

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.getFrameData.html)

```tsx
() => Promise<Result>
```

### off

取消监听录制事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.off.html)

```tsx
(eventName: keyof EventName, callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| eventName | `keyof EventName` | 事件名 |
| callback | `Callback` | 事件触发时执行的回调函数 |

### on

注册监听录制事件的回调函数

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.on.html)

```tsx
(eventName: keyof EventName, callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| eventName | `keyof EventName` | 事件名 |
| callback | `Callback` | 事件触发时执行的回调函数 |

### remove

移除解码器

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.remove.html)

```tsx
() => Promise<void>
```

### seek

跳到某个时间点解码

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.seek.html)

```tsx
(position: number) => Promise<void>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| position | `number` | 跳转的解码位置，单位 ms |

### start

开始解码

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.start.html)

```tsx
(option: Option) => Promise<void>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### stop

停止解码

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.stop.html)

```tsx
() => Promise<void>
```

## 参数

### getFrameData

#### Result

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| width | `number` | 帧数据宽度 |
| height | `number` | 帧数据高度 |
| data | `ArrayBuffer` | 帧数据 |
| pkPts | `number` | 帧原始 pts |
| pkDts | `number` | 帧原始 dts |

### on

#### EventName

eventName 的合法值

| 参数 | 说明 |
| --- | --- |
| start | 开始事件。返回 {width, height} |
| stop | 结束事件。 |
| seek | seek 完成事件。 |
| bufferchange | 缓冲区变化事件。 |
| ended | 解码结束事件。 |

#### Callback

事件触发时执行的回调函数

```tsx
(res: { width: number; height: number; }) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `{ width: number; height: number; }` |

### start

#### Option

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| source | `string` |  | 是 | 需要解码的视频源文件。 |
| mode | `number` | `1` | 否 | 解码模式。0：按 pts 解码；1：以最快速度解码 |
| abortAudio | `boolean` | `false` | 否 | 是否不需要音频轨道 |
| abortVideo | `boolean` | `false` | 否 | 是否不需要视频轨道 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoDecoder.getFrameData | ✔️ |  |  |
| VideoDecoder.off | ✔️ |  |  |
| VideoDecoder.on | ✔️ |  |  |
| VideoDecoder.remove | ✔️ |  |  |
| VideoDecoder.seek | ✔️ |  |  |
| VideoDecoder.start | ✔️ |  |  |
| VideoDecoder.stop | ✔️ |  |  |
