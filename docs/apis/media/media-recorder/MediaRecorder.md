---
title: MediaRecorder
sidebar_label: MediaRecorder
---

## 方法

### destroy

销毁录制器

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.destroy.html)

```tsx
() => Promise<void>
```

### off

取消监听录制事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.off.html)

```tsx
(eventName: keyof EventName, callback: Callback) => Promise<void>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| eventName | `keyof EventName` | 事件名 |
| callback | `Callback` | 事件触发时执行的回调函数 |

### on

注册监听录制事件的回调函数

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.on.html)

```tsx
(eventName: keyof EventName, callback: Callback) => Promise<void>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| eventName | `keyof EventName` | 事件名 |
| callback | `Callback` | 事件触发时执行的回调函数 |

### pause

暂停录制

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.pause.html)

```tsx
() => Promise<void>
```

### requestFrame

请求下一帧录制，在 callback 里完成一帧渲染后开始录制当前帧

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.requestFrame.html)

```tsx
(callback: Callback) => Promise<void>
```

| 参数 | 类型 |
| --- | --- |
| callback | `Callback` |

### resume

恢复录制

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.resume.html)

```tsx
() => Promise<void>
```

### start

开始录制

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.start.html)

```tsx
() => Promise<void>
```

### stop

结束录制

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.stop.html)

```tsx
() => Promise<void>
```

## 参数

### on

#### EventName

eventName 的合法值

| 参数 | 说明 |
| --- | --- |
| start | 录制开始事件。 |
| stop | 录制结束事件。返回 {tempFilePath, duration, fileSize} |
| pause | 录制暂停事件。 |
| resume | 录制继续事件。 |
| timeupdate | 录制时间更新事件。 |

#### Callback

事件触发时执行的回调函数

```tsx
(res: { tempFilePath: string; duration: number; fileSize: number; }) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `{ tempFilePath: string; duration: number; fileSize: number; }` |

### requestFrame

#### Callback

事件触发时执行的回调函数

```tsx
() => void
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaRecorder.destroy | ✔️ |  |  |
| MediaRecorder.off | ✔️ |  |  |
| MediaRecorder.on | ✔️ |  |  |
| MediaRecorder.pause | ✔️ |  |  |
| MediaRecorder.requestFrame | ✔️ |  |  |
| MediaRecorder.resume | ✔️ |  |  |
| MediaRecorder.start | ✔️ |  |  |
| MediaRecorder.stop | ✔️ |  |  |
