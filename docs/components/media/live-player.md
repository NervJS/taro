---
title: LivePlayer
sidebar_label: LivePlayer
---

实时音视频播放。相关api：Taro.createLivePlayerContext

需要先通过类目审核，再在小程序管理后台，“设置”-“接口设置”中自助开通该组件权限。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html)

## 类型

```tsx
ComponentType<LivePlayerProps>
```

## 示例代码

```tsx
class App extends Components {
  render () {
    return (
      <LivePlayer src='url' mode='live' autoplay  />
    )
  }
}
```

## LivePlayerProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| src | `string` |  | 否 | 音视频地址。目前仅支持 flv, rtmp 格式 |
| mode | "live" or "RTC" | `"live"` | 否 | 模式 |
| autoplay | `boolean` | `false` | 否 | 自动播放 |
| muted | `boolean` | `false` | 否 | 是否静音 |
| orientation | "vertical" or "horizontal" | `"vertical"` | 否 | 画面方向 |
| objectFit | "contain" or "fillCrop" | `"contain"` | 否 | 填充模式 |
| backgroundMute | `boolean` | `false` | 否 | 进入后台时是否静音（已废弃，默认退台静音）<br />**不推荐使用** |
| minCache | `number` | `1` | 否 | 进最小缓冲区，单位s |
| maxCache | `number` | `3` | 否 | 进最小缓冲区，单位s |
| soundMode | "speaker" or "ear" | `"speaker"` | 否 | 声音输出方式 |
| autoPauseIfNavigate | `boolean` | `true` | 否 | 当跳转到本小程序的其他页面时，是否自动暂停本页面的实时音视频播放 |
| autoPauseIfOpenNavigate | `boolean` | `true` | 否 | 当跳转到其它微信原生页面时，是否自动暂停本页面的实时音视频播放 |
| onStateChange | `BaseEventOrigFunction<onStateChangeEventDetail>` |  | 否 | 播放状态变化事件，detail = {code} |
| onFullScreenChange | `BaseEventOrigFunction<onFullScreenChangeEventDetail>` |  | 否 | 全屏变化事件，detail = {direction, fullScreen} |
| onNetstatus | `BaseEventOrigFunction<onNetStatusEventDetail>` |  | 否 | 网络状态通知，detail = {info} |
| onAudioVolumenotify | `BaseEventOrigFunction<{}>` |  | 否 | 播放音量大小通知，detail = {} |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayerProps.src | ✔️ |  |  |
| LivePlayerProps.mode | ✔️ |  |  |
| LivePlayerProps.autoplay | ✔️ |  |  |
| LivePlayerProps.muted | ✔️ |  |  |
| LivePlayerProps.orientation | ✔️ |  |  |
| LivePlayerProps.objectFit | ✔️ |  |  |
| LivePlayerProps.backgroundMute | ✔️ |  |  |
| LivePlayerProps.minCache | ✔️ |  |  |
| LivePlayerProps.maxCache | ✔️ |  |  |
| LivePlayerProps.soundMode | ✔️ |  |  |
| LivePlayerProps.autoPauseIfNavigate | ✔️ |  |  |
| LivePlayerProps.autoPauseIfOpenNavigate | ✔️ |  |  |
| LivePlayerProps.onStateChange | ✔️ |  |  |
| LivePlayerProps.onFullScreenChange | ✔️ |  |  |
| LivePlayerProps.onNetstatus | ✔️ |  |  |
| LivePlayerProps.onAudioVolumenotify | ✔️ |  |  |

### mode

mode 的合法值

| 参数 | 说明 |
| --- | --- |
| live | 直播 |
| RTC | 实时通话，该模式时延更低 |

### orientation

orientation 的合法值

| 参数 | 说明 |
| --- | --- |
| vertical | 竖直 |
| horizontal | 水平 |

### objectFit

objectFit 的合法值

| 参数 | 说明 |
| --- | --- |
| contain | 图像长边填满屏幕，短边区域会被填充⿊⾊ |
| fillCrop | 图像铺满屏幕，超出显示区域的部分将被截掉 |

### soundMode

soundMode 的合法值

| 参数 | 说明 |
| --- | --- |
| speaker | 扬声器 |
| ear | 听筒 |

### onStateChangeEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| code | `number` | 状态码 |

### onFullScreenChangeEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| direction | `number` | 方向 |
| fullScreen | number or boolean | 全屏 |

### onNetStatusEventDetail

| 参数 | 类型 |
| --- | --- |
| info | `netStatus` |

### status

状态码

| 参数 | 说明 |
| --- | --- |
| 2001 | 已经连接服务器 |
| 2002 | 已经连接 RTMP 服务器,开始拉流 |
| 2003 | 网络接收到首个视频数据包(IDR) |
| 2004 | 视频播放开始 |
| 2005 | 视频播放进度 |
| 2006 | 视频播放结束 |
| 2007 | 视频播放Loading |
| 2008 | 解码器启动 |
| 2009 | 视频分辨率改变 |
| -2301 | 网络断连，且经多次重连抢救无效，更多重试请自行重启播放 |
| -2302 | 获取加速拉流地址失败 |
| 2101 | 当前视频帧解码失败 |
| 2102 | 当前音频帧解码失败 |
| 2103 | 网络断连, 已启动自动重连 |
| 2104 | 网络来包不稳：可能是下行带宽不足，或由于主播端出流不均匀 |
| 2105 | 当前视频播放出现卡顿 |
| 2106 | 硬解启动失败，采用软解 |
| 2107 | 当前视频帧不连续，可能丢帧 |
| 2108 | 当前流硬解第一个I帧失败，SDK自动切软解 |
| 3001 | RTMP -DNS解析失败 |
| 3002 | RTMP服务器连接失败 |
| 3003 | RTMP服务器握手失败 |
| 3005 | RTMP 读/写失败 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayer | ✔️ |  |  |
