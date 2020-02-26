---
title: LivePlayerContext
sidebar_label: LivePlayerContext
---

`LivePlayerContext` 实例，可通过 `Taro.createLivePlayerContext` 获取。
`LivePlayerContext` 通过 `id` 跟一个 `live-player` 组件绑定，操作对应的 `live-player` 组件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.html)

## 方法

### exitFullScreen

退出全屏

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.exitFullScreen.html)

```tsx
(option?: ExitFullScreenOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `ExitFullScreenOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayerContext.exitFullScreen | ✔️ |  |  |

### mute

静音

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.mute.html)

```tsx
(option?: MuteOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `MuteOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayerContext.mute | ✔️ |  |  |

### pause

暂停

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.pause.html)

```tsx
(option?: PauseOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `PauseOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayerContext.pause | ✔️ |  |  |

### play

播放

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.play.html)

```tsx
(option?: PlayOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `PlayOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayerContext.play | ✔️ |  |  |

### requestFullScreen

进入全屏

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.requestFullScreen.html)

```tsx
(option: RequestFullScreenOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `RequestFullScreenOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayerContext.requestFullScreen | ✔️ |  |  |

### resume

恢复

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.resume.html)

```tsx
(option?: ResumeOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `ResumeOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayerContext.resume | ✔️ |  |  |

### snapshot

截图

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.snapshot.html)

```tsx
(option?: SnapshotOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `SnapshotOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayerContext.snapshot | ✔️ |  |  |

### stop

停止

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.stop.html)

```tsx
(option?: StopOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `StopOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayerContext.stop | ✔️ |  |  |

## 参数

### ExitFullScreenOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### MuteOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### PauseOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### PlayOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### RequestFullScreenOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| direction | 0 or 90 or -90 | 否 | 设置全屏时的方向<br /><br />可选值：<br />- 0: 正常竖向;<br />- 90: 屏幕逆时针90度;<br />- -90: 屏幕顺时针90度; |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### ResumeOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SnapshotOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SnapshotSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SnapshotSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| height | `string` | 图片的高度 |
| tempImagePath | `string` | 图片文件的临时路径 |
| width | `string` | 图片的宽度 |
| errMsg | `string` | 调用结果 |

### StopOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayerContext.exitFullScreen | ✔️ |  |  |
| LivePlayerContext.mute | ✔️ |  |  |
| LivePlayerContext.pause | ✔️ |  |  |
| LivePlayerContext.play | ✔️ |  |  |
| LivePlayerContext.requestFullScreen | ✔️ |  |  |
| LivePlayerContext.resume | ✔️ |  |  |
| LivePlayerContext.snapshot | ✔️ |  |  |
| LivePlayerContext.stop | ✔️ |  |  |
