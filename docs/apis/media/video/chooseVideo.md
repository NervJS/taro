---
title: Taro.chooseVideo(option)
sidebar_label: chooseVideo
---

拍摄视频或从手机相册中选视频。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseVideo.html)

## 类型

```tsx
(option: Option) => Promise<void>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| camera | "back" or "front" | 否 | 默认拉起的是前置或者后置摄像头。部分 Android 手机下由于系统 ROM 不支持无法生效 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| compressed | `boolean` | 否 | 是否压缩所选择的视频文件 |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| maxDuration | `number` | 否 | 拍摄视频最长拍摄时间，单位秒 |
| sourceType | ("album" or "camera")[] | 否 | 视频选择的来源 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| duration | `number` | 选定视频的时间长度 |
| height | `number` | 返回选定视频的高度 |
| size | `number` | 选定视频的数据量大小 |
| tempFilePath | `string` | 选定视频的临时文件路径 |
| width | `number` | 返回选定视频的宽度 |
| errMsg | `string` | 调用结果 |

### camera

| 参数 | 说明 |
| --- | --- |
| back | 默认拉起后置摄像头 |
| front | 默认拉起前置摄像头 |

### sourceType

| 参数 | 说明 |
| --- | --- |
| album | 从相册选择视频 |
| camera | 使用相机拍摄视频 |

## 示例代码

```tsx
Taro.chooseVideo({
  sourceType: ['album','camera'],
  maxDuration: 60,
  camera: 'back',
  success: function (res) {
    console.log(res.tempFilePath)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseVideo | ✔️ |  | ✔️ |
