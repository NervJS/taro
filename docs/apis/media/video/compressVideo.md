---
title: Taro.compressVideo(option)
sidebar_label: compressVideo
---

压缩视频接口。
开发者可指定压缩质量 `quality` 进行压缩。当需要更精细的控制时，可指定 `bitrate`、`fps`、和 `resolution`，当 `quality` 传入时，这三个参数将被忽略。原视频的相关信息可通过 [getVideoInfo](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.getVideoInfo.html) 获取。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.compressVideo.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| src | `string` | 是 | 视频文件路径，可以是临时文件路径也可以是永久文件路径 |
| quality | `keyof quality` | 是 | 压缩质量 |
| bitrate | `number` | 是 | 码率，单位 kbps |
| fps | `number` | 是 | 帧率 |
| resolution | `number` | 是 | 相对于原视频的分辨率比例，取值范围(0, 1] |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempFilePath | `string` | 压缩后的临时文件地址 |
| size | `number` | 压缩后的大小，单位 kB |

### quality

| 参数 | 说明 |
| --- | --- |
| low | 低 |
| medium | 中 |
| high | 高 |

## 示例代码

```tsx
Taro.chooseVideo({
  sourceType: ['album', 'camera'],
  maxDuration: 60,
  camera: 'back',
  compressed: false,
  success (res) {
    Taro.compressVideo({
      src: res.tempFilePath,
      quality: quality,
      bitrate: 1032,
      fps: 24,
      resolution:0.5,
      success (res) {
        console.log("压缩成功")
      },
      fail (err) {
        console.log("压缩失败")
      }
    })
  }
})
```
