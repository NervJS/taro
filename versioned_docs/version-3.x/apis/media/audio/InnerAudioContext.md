---
title: InnerAudioContext
sidebar_label: InnerAudioContext
---

InnerAudioContext 实例，可通过 Taro.createInnerAudioContext 接口获取实例。

**支持格式**

| 格式 | iOS  | Android |
| ---- | ---- | ------- |
| flac | x    | √       |
| m4a  | √    | √       |
| ogg  | x    | √       |
| ape  | x    | √       |
| amr  | x    | √       |
| wma  | x    | √       |
| wav  | √    | √       |
| mp3  | √    | √       |
| mp4  | x    | √       |
| aac  | √    | √       |
| aiff | √    | x       |
| caf  | √    | x       |

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/InnerAudioContext.html)

## 方法

| 参数 | 类型 | 默认值 | 只读 | 必填 | 说明 |
| --- | --- | :---: | :---: | :---: | --- |
| src | `string` |  | 否 | 是 | 音频资源的地址，用于直接播放。 |
| startTime | `number` | `0` | 否 | 是 | 开始播放的位置（单位：s） |
| autoplay | `boolean` | `false` | 否 | 是 | 是否自动开始播放 |
| loop | `boolean` | `false` | 否 | 是 | 是否循环播放 |
| obeyMuteSwitch | `boolean` | `true` | 否 | 是 | 是否遵循系统静音开关。当此参数为 `false` 时，即使用户打开了静音开关，也能继续发出声音。从 2.3.0 版本开始此参数不生效，使用 [Taro.setInnerAudioOption](/docs/apis/media/audio/setInnerAudioOption) 接口统一设置。 |
| volume | `number` | `1` | 否 | 是 | 音量。范围 0~1。 |
| playbackRate | `number` | `1` | 否 | 是 | 播放速度。范围 0.5-2.0。 |
| duration | `number` |  | 是 | 是 | 当前音频的长度（单位 s）。只有在当前有合法的 src 时返回 |
| currentTime | `number` |  | 是 | 是 | 当前音频的播放位置（单位 s）。只有在当前有合法的 src 时返回，时间保留小数点后 6 位 |
| paused | `boolean` |  | 是 | 是 | 当前是是否暂停或停止状态 |
| buffered | `number` |  | 是 | 是 | 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲 |
| referrerPolicy | `string` |  | 否 | 否 | origin: 发送完整的 referrer; no-referrer: 不发送 |

### play

播放

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
() => void
```

### pause

暂停

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
() => void
```

### stop

停止

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
() => void
```

### seek

跳转到指定位置，单位 s

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(position: number) => void
```

| 参数 | 类型 |
| --- | --- |
| position | `number` |

### destroy

销毁当前实例

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

```tsx
() => void
```

### onCanplay

音频进入可以播放状态，但不保证后面可以流畅播放

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### onPlay

音频播放事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### onPause

音频暂停事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### onStop

音频停止事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### onEnded

音频自然播放结束事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### onTimeUpdate

音频播放进度更新事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### onError

音频播放错误事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: (res: onErrorDetail) => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `(res: onErrorDetail) => void` |

### onWaiting

音频加载中事件，当音频因为数据不足，需要停下来加载时会触发

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### onSeeking

音频进行 seek 操作事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### onSeeked

音频完成 seek 操作事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### offCanplay

取消监听 onCanplay 事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### offPlay

取消监听 onPlay 事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### offPause

取消监听 onPause 事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### offStop

取消监听 onStop 事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### offEnded

取消监听 onEnded 事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### offTimeUpdate

取消监听 onTimeUpdate 事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### offError

取消监听 onError 事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### offWaiting

取消监听 onWaiting 事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### offSeeking

取消监听 onSeeking 事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

### offSeeked

取消监听 onSeeked 事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

```tsx
(callback?: () => void) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `() => void` |

## 参数

### onErrorDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errCode | `number` | 错误码 |
| errMsg | `string` | 错误信息 |

### onErrorDetailErrCode

| 参数 | 说明 |
| --- | --- |
| 10001 | 系统错误 |
| 10002 | 网络错误 |
| 10003 | 文件错误 |
| 10004 | 格式错误 |
| -1 | 未知错误 |

## 示例代码

```tsx
const innerAudioContext = Taro.createInnerAudioContext()
innerAudioContext.autoplay = true
innerAudioContext.src = 'https://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
innerAudioContext.onPlay(() => {
  console.log('开始播放')
})
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InnerAudioContext.play | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.pause | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.stop | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.seek | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.destroy | ✔️ | ✔️ |  |
| InnerAudioContext.onCanplay | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.onPlay | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.onPause | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.onStop | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.onEnded | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.onTimeUpdate | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.onError | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.onWaiting | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.onSeeking | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.onSeeked | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.offCanplay | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.offPlay | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.offPause | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.offStop | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.offEnded | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.offTimeUpdate | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.offError | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.offWaiting | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.offSeeking | ✔️ | ✔️ | ✔️ |
| InnerAudioContext.offSeeked | ✔️ | ✔️ | ✔️ |
