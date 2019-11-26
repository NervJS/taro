---
title: Taro.createInnerAudioContext()
sidebar_label: createInnerAudioContext
---

创建内部 audio 上下文 InnerAudioContext 对象。

使用方式同 [`wx.createInnerAudioContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createInnerAudioContext.html)。

## 返回值

### object InnerAudioContext

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| src | <code>string</code> |  | 音频资源的地址，用于直接播放。 |
| [startTime] | <code>number</code> | <code>0</code> | 开始播放的位置（单位：s），默认为 0 |
| [autoplay] | <code>boolean</code> | <code>false</code> | 是否自动开始播放，默认为 false |
| [loop] | <code>boolean</code> | <code>false</code> | 是否循环播放，默认为 false |
| [obeyMuteSwitch] | <code>boolean</code> | <code>true</code> | 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。 |
| [volume] | <code>number</code> | <code>1</code> | 音量。范围 0~1。默认为 1 |
| duration | <code>number</code> |  | 当前音频的长度（单位 s）。只有在当前有合法的 src 时返回（只读） |
| currentTime | <code>number</code> |  | 当前音频的播放位置（单位 s）。只有在当前有合法的 src 时返回，时间保留小数点后 6 位（只读） |
| paused | <code>boolean</code> |  | 当前是是否暂停或停止状态（只读） |
| buffered | <code>number</code> |  | 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲（只读） |
| play | <code>function</code> |  | 播放 |
| pause | <code>function</code> |  | 暂停。暂停后的音频再播放会从暂停处开始播放 |
| stop | <code>function</code> |  | 停止。停止后的音频再播放会从头开始播放。 |
| seek | <code>function</code> |  | 跳转到指定位置 |
| destroy | <code>function</code> |  | 销毁当前实例 |
| offCanplay | <code>function</code> |  | 取消监听音频进入可以播放状态的事件 |
| offEnded | <code>function</code> |  | 取消监听音频自然播放至结束的事件 |
| offError | <code>function</code> |  | 取消监听音频播放错误事件 |
| offPause | <code>function</code> |  | 取消监听音频暂停事件 |
| offPlay | <code>function</code> |  | 取消监听音频播放事件 |
| offSeeked | <code>function</code> |  | 取消监听音频完成跳转操作的事件 |
| offSeeking | <code>function</code> |  | 取消监听音频进行跳转操作的事件 |
| offStop | <code>function</code> |  | 取消监听音频停止事件 |
| offTimeUpdate | <code>function</code> |  | 取消监听音频播放进度更新事件 |
| offWaiting | <code>function</code> |  | 取消监听音频加载中事件 |
| onCanplay | <code>function</code> |  | 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放 |
| onEnded | <code>function</code> |  | 监听音频自然播放至结束的事件 |
| onError | <code>function</code> |  | 监听音频播放错误事件 |
| onPause | <code>function</code> |  | 监听音频暂停事件 |
| onPlay | <code>function</code> |  | 监听音频播放事件 |
| onSeeked | <code>function</code> |  | 监听音频完成跳转操作的事件 |
| onSeeking | <code>function</code> |  | 监听音频进行跳转操作的事件 |
| onStop | <code>function</code> |  | 监听音频停止事件 |
| onTimeUpdate | <code>function</code> |  | 监听音频播放进度更新事件 |
| onWaiting | <code>function</code> |  | 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发 |


## 示例代码

```jsx
import Taro from '@tarojs/taro'

const innerAudioContext = Taro.createInnerAudioContext()
```



## API支持度


| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.createInnerAudioContext | ✔️ | ✔️ |  | | |

