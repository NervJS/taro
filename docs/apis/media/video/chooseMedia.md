---
title: Taro.chooseMedia(option)
sidebar_label: chooseMedia
---

拍摄或从手机相册中选择图片或视频。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseMedia.html)

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
| count | `number` | 否 | 最多可以选择的文件个数 |
| mediaType | `(keyof mediaType)[]` | 否 | 文件类型 |
| sourceType | `(keyof sourceType)[]` | 否 | 图片和视频选择的来源 |
| maxDuration | `number` | 否 | 拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 30s 之间 |
| sizeType | ("original" or "compressed")[] | 否 | 仅对 mediaType 为 image 时有效，是否压缩所选文件 |
| camera | `string` | 否 | 仅在 sourceType 为 camera 时生效，使用前置或后置摄像头 |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempFiles | `ChooseMedia[]` | 本地临时文件列表 |
| type | `string` | 文件类型，有效值有 image 、video |

### ChooseMedia

本地临时文件列表

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempFilePath | `string` | 本地临时文件路径 (本地路径) |
| size | `number` | 本地临时文件大小，单位 B |
| duration | `number` | 视频的时间长度 |
| height | `number` | 视频的高度 |
| width | `number` | 视频的宽度 |
| thumbTempFilePath | `string` | 视频缩略图临时文件路径 |

### mediaType

| 参数 | 说明 |
| --- | --- |
| video | 只能拍摄视频或从相册选择视频 |
| image | 只能拍摄图片或从相册选择图片 |

### sourceType

| 参数 | 说明 |
| --- | --- |
| album | 从相册选择 |
| camera | 使用相机拍摄 |

### camera

| 参数 | 说明 |
| --- | --- |
| back | 使用后置摄像头 |
| front | 使用前置摄像头 |

## 示例代码

```tsx
Taro.chooseMedia({
  count: 9,
  mediaType: ['image','video'],
  sourceType: ['album', 'camera'],
  maxDuration: 30,
  camera: 'back',
  success: (res) => {
    console.log(res.tempFiles)
    console.log(res.type)
  }
})
```
