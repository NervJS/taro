---
title: Taro.getBackgroundAudioPlayerState(option)
sidebar_label: getBackgroundAudioPlayerState
id: version-1.3.38-getBackgroundAudioPlayerState
original_id: getBackgroundAudioPlayerState
---

获取后台音乐播放状态。
**注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.getBackgroundAudioManager](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioManager.html) 接口**

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioPlayerState.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| currentPosition | `number` | 选定音频的播放位置（单位：s），只有在音乐播放中时返回 |
| dataUrl | `string` | 歌曲数据链接，只有在音乐播放中时返回 |
| downloadPercent | `number` | 音频的下载进度百分比，只有在音乐播放中时返回 |
| duration | `number` | 选定音频的长度（单位：s），只有在音乐播放中时返回 |
| status | 0 or 1 or 2 | 播放状态 |
| errMsg | `string` | 调用结果 |

### status

| 参数 | 说明 |
| --- | --- |
| 0 | 暂停中 |
| 1 | 播放中 |
| 2 | 没有音乐播放 |

## 示例代码

```tsx
Taro.getBackgroundAudioPlayerState({
  success: function (res) {
    var status = res.status
    var dataUrl = res.dataUrl
    var currentPosition = res.currentPosition
    var duration = res.duration
    var downloadPercent = res.downloadPercent
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBackgroundAudioPlayerState | ✔️ |  |  |
