---
title: LivePusher
sidebar_label: LivePusher
---

实时音视频录制。需要用户授权 scope.camera、scope.record

需要先通过类目审核，再在小程序管理后台，「开发」-「接口设置」中自助开通该组件权限。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html)

## 类型

```tsx
ComponentType<LivePusherProps>
```

## 示例代码

```tsx
class App extends Components {
  render () {
    return (
      <LivePusher url='url' mode='RTC' autopush  />
    )
  }
}
```

## LivePusherProps

实时音视频录制。
需要用户授权 scope.camera、scope.record
暂只针对国内主体如下类目的小程序开放，需要先通过类目审核，再在小程序管理后台，“设置”-“接口设置”中自助开通该组件权限。

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| url | `string` |  | 否 | 推流地址。目前仅支持 rtmp 格式 |
| mode | "SD" or "HD" or "FHD" or "RTC" | `"RTC"` | 否 | SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话） |
| autopush | `boolean` | `false` | 否 | 自动推流 |
| muted | `boolean` | `false` | 否 | 是否静音。即将废弃，可用 enable-mic 替代<br />**不推荐使用** |
| enableCamera | `boolean` | `true` | 否 | 开启摄像头 |
| autoFocus | `boolean` | `true` | 否 | 自动聚集 |
| orientation | "vertical" or "horizontal" | `"vertical"` | 否 | 画面方向 |
| beauty | `number` | `0` | 否 | 美颜，取值范围 0-9 ，0 表示关闭 |
| whiteness | `number` | `0` | 否 | 美白，取值范围 0-9 ，0 表示关闭 |
| aspect | "9:16" or "3:4" | `"9:16"` | 否 | 宽高比，可选值有 3:4, 9:16 |
| minBitrate | `number` | `200` | 否 | 最小码率 |
| maxBitrate | `number` | `1000` | 否 | 最大码率 |
| audioQuality | `string` | `"high"` | 否 | 高音质(48KHz)或低音质(16KHz)，值为high, low |
| waitingImage | `string` |  | 否 | 进入后台时推流的等待画面 |
| waitingImageHash | `string` |  | 否 | 等待画面资源的MD5值 |
| zoom | `boolean` | `false` | 否 | 调整焦距 |
| devicePosition | `string` | `"front"` | 否 | 前置或后置，值为front, back |
| backgroundMute | `boolean` | `false` | 否 | 进入后台时是否静音 |
| mirror | `boolean` | `false` | 否 | 设置推流画面是否镜像，产生的效果在 LivePlayer 反应到<br />**不推荐使用** |
| remoteMirror | `boolean` | `false` | 否 | 设置推流画面是否镜像，产生的效果在 LivePlayer 反应到<br /><br />**Note:** 同 mirror 属性，后续 mirror 将废弃 |
| localMirror | "auto" or "enable" or "disable" | `"auto"` | 否 | 控制本地预览画面是否镜像 |
| audioReverbType | 0 or 1 or 2 or 3 or 4 or 5 or 6 or 7 | `0` | 否 | 音频混响类型 |
| enableMic | `boolean` | `true` | 否 | 开启或关闭麦克风 |
| enableAgc | `boolean` | `false` | 否 | 是否开启音频自动增益 |
| enableAns | `boolean` | `false` | 否 | 是否开启音频噪声抑制 |
| audioVolumeType | "media" or "voicecall" | `"voicecall"` | 否 | 音量类型 |
| videoWidth | `number` | `360` | 否 | 上推的视频流的分辨率宽度 |
| videoHeight | `number` | `640` | 否 | 上推的视频流的分辨率高度 |
| onStateChange | `BaseEventOrigFunction<onStateChangeEventDetail>` |  | 否 | 状态变化事件，detail = {code} |
| onNetstatus | `BaseEventOrigFunction<onNetstatusEventDetail>` |  | 否 | 网络状态通知，detail = {info} |
| onError | `BaseEventOrigFunction<onErrorEventDetail>` |  | 否 | 渲染错误事件，detail = {errMsg, errCode} |
| onBgmStart | `BaseEventOrigFunction<any>` |  | 否 | 背景音开始播放时触发 |
| onBgmProgress | `BaseEventOrigFunction<onBgmProgressEventDetail>` |  | 否 | 背景音进度变化时触发，detail = {progress, duration} |
| onBgmComplete | `BaseEventOrigFunction<any>` |  | 否 | 背景音播放完成时触发 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherProps.url | ✔️ |  |  |
| LivePusherProps.mode | ✔️ |  |  |
| LivePusherProps.autopush | ✔️ |  |  |
| LivePusherProps.muted | ✔️ |  |  |
| LivePusherProps.enableCamera | ✔️ |  |  |
| LivePusherProps.autoFocus | ✔️ |  |  |
| LivePusherProps.orientation | ✔️ |  |  |
| LivePusherProps.beauty | ✔️ |  |  |
| LivePusherProps.whiteness | ✔️ |  |  |
| LivePusherProps.aspect | ✔️ |  |  |
| LivePusherProps.minBitrate | ✔️ |  |  |
| LivePusherProps.maxBitrate | ✔️ |  |  |
| LivePusherProps.audioQuality | ✔️ |  |  |
| LivePusherProps.waitingImage | ✔️ |  |  |
| LivePusherProps.waitingImageHash | ✔️ |  |  |
| LivePusherProps.zoom | ✔️ |  |  |
| LivePusherProps.devicePosition | ✔️ |  |  |
| LivePusherProps.backgroundMute | ✔️ |  |  |
| LivePusherProps.mirror | ✔️ |  |  |
| LivePusherProps.remoteMirror | ✔️ |  |  |
| LivePusherProps.localMirror | ✔️ |  |  |
| LivePusherProps.audioReverbType | ✔️ |  |  |
| LivePusherProps.enableMic | ✔️ |  |  |
| LivePusherProps.enableAgc | ✔️ |  |  |
| LivePusherProps.enableAns | ✔️ |  |  |
| LivePusherProps.audioVolumeType | ✔️ |  |  |
| LivePusherProps.videoWidth | ✔️ |  |  |
| LivePusherProps.videoHeight | ✔️ |  |  |
| LivePusherProps.onStateChange | ✔️ |  |  |
| LivePusherProps.onNetstatus | ✔️ |  |  |
| LivePusherProps.onError | ✔️ |  |  |
| LivePusherProps.onBgmStart | ✔️ |  |  |
| LivePusherProps.onBgmProgress | ✔️ |  |  |
| LivePusherProps.onBgmComplete | ✔️ |  |  |

### orientation

orientation 的合法值

| 参数 | 说明 |
| --- | --- |
| vertical | 竖直 |
| horizontal | 水平 |

### localMirror

localMirror 的合法值

| 参数 | 说明 |
| --- | --- |
| auto | 前置摄像头镜像，后置摄像头不镜像 |
| enable | 前后置摄像头均镜像 |
| disable | 前后置摄像头均不镜像 |

### audioReverbType

audioReverbType 的合法值

| 参数 | 说明 |
| --- | --- |
| 0 | 关闭 |
| 1 | KTV |
| 2 | 小房间 |
| 3 | 大会堂 |
| 4 | 低沉 |
| 5 | 洪亮 |
| 6 | 金属声 |
| 7 | 磁性 |

### audioVolumeType

audioVolumeType 的合法值

| 参数 | 说明 |
| --- | --- |
| media | 媒体音量 |
| voicecall | 通话音量 |

### onStateChangeEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| code | `number` | 状态码 |

### onNetstatusEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| info | `netStatus` | 网络状态 |

### onErrorEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息 |
| errCode | string or number | 错误码 |

### onBgmProgressEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| progress | `any` | 进展 |
| duration | `number` | 持续时间 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusher | ✔️ |  |  |
