---
title: Taro.chooseImage(option)
sidebar_label: chooseImage
---

从本地相册选择图片或使用相机拍照。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="百度小程序" src={require('@site/static/img/platform/swan.png').default} className="icon_platform" width="25px"/> <img title="支付宝小程序" src={require('@site/static/img/platform/alipay.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html)

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
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| count | `number` | 否 | 最多可以选择的图片张数 |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| sizeType | `(keyof sizeType)[]` | 否 | 所选的图片的尺寸 |
| sourceType | `(keyof sourceType)[]` | 否 | 选择图片的来源 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| imageId | `string` | 否 | 用来上传的input元素ID（仅h5端）@supported h5 |

### sizeType

图片的尺寸

| 参数 | 说明 |
| --- | --- |
| original | 原图 |
| compressed | compressed |

### sourceType

图片的来源

| 参数 | 说明 |
| --- | --- |
| album | 从相册选图 |
| camera | 使用相机 |
| user | 使用前置摄像头(仅H5纯浏览器使用) |
| environment | 使用后置摄像头(仅H5纯浏览器) |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempFilePaths | `string[]` | 图片的本地临时文件路径列表 |
| tempFiles | `ImageFile[]` | 图片的本地临时文件列表 |
| errMsg | `string` | 调用结果 |

### ImageFile

图片的本地临时文件列表

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| path | `string` | 是 | 本地临时文件路径 |
| size | `number` | 是 | 本地临时文件大小，单位 B |
| type | `string` | 否 | 文件的 MIME 类型<br />API 支持度: h5 |
| originalFileObj | `File` | 否 | 原始的浏览器 File 对象<br />API 支持度: h5 |

## 示例代码

```tsx
Taro.chooseImage({
  count: 1, // 默认9
  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
  success: function (res) {
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    var tempFilePaths = res.tempFilePaths
  }
})
```
