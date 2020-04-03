---
title: LivePusherContext
sidebar_label: LivePusherContext
id: version-1.3.37-LivePusherContext
original_id: LivePusherContext
---

`LivePusherContext` 实例，可通过 `Taro.createLivePusherContext` 获取。
`LivePusherContext` 与页面内唯一的 `live-pusher` 组件绑定，操作对应的 `live-pusher` 组件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.html)

## 方法

### pause

暂停推流

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.pause.html)

```tsx
(option?: PauseOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `PauseOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.pause | ✔️ |  |  |

### pauseBGM

暂停背景音

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.pauseBGM.html)

```tsx
(option?: PauseBGMOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `PauseBGMOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.pauseBGM | ✔️ |  |  |

### playBGM

播放背景音

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.playBGM.html)

```tsx
(option: PlayBGMOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `PlayBGMOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.playBGM | ✔️ |  |  |

### resume

恢复推流

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.resume.html)

```tsx
(option?: ResumeOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `ResumeOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.resume | ✔️ |  |  |

### resumeBGM

恢复背景音

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.resumeBGM.html)

```tsx
(option?: ResumeBGMOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `ResumeBGMOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.resumeBGM | ✔️ |  |  |

### setBGMVolume

设置背景音音量

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.setBGMVolume.html)

```tsx
(option: SetBGMVolumeOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `SetBGMVolumeOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.setBGMVolume | ✔️ |  |  |

### snapshot

快照

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.snapshot.html)

```tsx
(option?: SnapshotOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `SnapshotOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.snapshot | ✔️ |  |  |

### start

开始推流，同时开启摄像头预览

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.start.html)

```tsx
(option?: StartOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `StartOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.start | ✔️ |  |  |

### startPreview

开启摄像头预览

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.startPreview.html)

```tsx
(option?: StartPreviewOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `StartPreviewOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.startPreview | ✔️ |  |  |

### stop

停止推流，同时停止摄像头预览

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.stop.html)

```tsx
(option?: StopOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `StopOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.stop | ✔️ |  |  |

### stopBGM

停止背景音

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.stopBGM.html)

```tsx
(option?: StopBGMOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `StopBGMOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.stopBGM | ✔️ |  |  |

### stopPreview

关闭摄像头预览

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.stopPreview.html)

```tsx
(option?: StopPreviewOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `StopPreviewOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.stopPreview | ✔️ |  |  |

### switchCamera

切换前后摄像头

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.switchCamera.html)

```tsx
(option?: SwitchCameraOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `SwitchCameraOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.switchCamera | ✔️ |  |  |

### toggleTorch

切换手电筒

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.toggleTorch.html)

```tsx
(option?: ToggleTorchOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `ToggleTorchOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.toggleTorch | ✔️ |  |  |

## 参数

### PauseOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### PauseBGMOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### PlayBGMOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| url | `string` | 是 | 加入背景混音的资源地址 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### ResumeOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### ResumeBGMOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SetBGMVolumeOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| volume | `string` | 是 | 音量大小，范围是 0-1 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SnapshotOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### StartOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### StartPreviewOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### StopOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### StopBGMOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### StopPreviewOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SwitchCameraOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### ToggleTorchOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherContext.pause | ✔️ |  |  |
| LivePusherContext.pauseBGM | ✔️ |  |  |
| LivePusherContext.playBGM | ✔️ |  |  |
| LivePusherContext.resume | ✔️ |  |  |
| LivePusherContext.resumeBGM | ✔️ |  |  |
| LivePusherContext.setBGMVolume | ✔️ |  |  |
| LivePusherContext.snapshot | ✔️ |  |  |
| LivePusherContext.start | ✔️ |  |  |
| LivePusherContext.startPreview | ✔️ |  |  |
| LivePusherContext.stop | ✔️ |  |  |
| LivePusherContext.stopBGM | ✔️ |  |  |
| LivePusherContext.stopPreview | ✔️ |  |  |
| LivePusherContext.switchCamera | ✔️ |  |  |
| LivePusherContext.toggleTorch | ✔️ |  |  |
