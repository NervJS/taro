---
title: Taro.getVideoInfo(option)
sidebar_label: getVideoInfo
---

获取视频详细信息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.getVideoInfo.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| src | `string` | 是 | 视频文件路径，可以是临时文件路径也可以是永久文件路径 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| orientation | `keyof orientation` | 画面方向 |
| type | `string` | 视频格式 |
| duration | `number` | 视频长度 |
| size | `number` | 视频大小，单位 kB |
| height | `number` | 视频的长，单位 px |
| width | `number` | 视频的宽，单位 px |
| fps | `number` | 视频帧率 |
| bitrate | `number` | 视频码率，单位 kbps |

### orientation

| 参数 | 说明 |
| --- | --- |
| up | 默认 |
| down | 180 度旋转 |
| left | 逆时针旋转 90 度 |
| right | 顺时针旋转 90 度 |
| up-mirrored | 同 up，但水平翻转 |
| down-mirrored | 同 down，但水平翻转 |
| left-mirrored | 同 left，但垂直翻转 |
| right-mirrored | 同 right，但垂直翻转 |

## 示例代码

```tsx
Taro.downloadFile({
  url: 'https://mock.taro.org/mock_video.mp4',
  success(res) {
    Taro.getVideoInfo({
      src: res.tempFilePath,
      success (res) {
        console.log('获取文件地址成功')
        console.log(res)
      },
      fail (res) {
        console.log('获取文件地址失败')
        console.log(res)
      },
      complete (res) {
        console.log('获取文件地址')
      }
    })
  }
})
```
