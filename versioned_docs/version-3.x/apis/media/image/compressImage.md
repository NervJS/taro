---
title: Taro.compressImage(option)
sidebar_label: compressImage
---

压缩图片接口，可选压缩质量

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.compressImage.html)

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
| src | `string` | 是 | 图片路径，图片的路径，可以是相对路径、临时文件路径、存储文件路径 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| quality | `number` | 否 | 压缩质量，范围0～100，数值越小，质量越低，压缩率越高（仅对jpg有效）。 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempFilePath | `string` | 压缩后图片的临时文件路径 |
| errMsg | `string` | 调用结果 |

## 示例代码

```tsx
Taro.compressImage({
  src: '', // 图片路径
  quality: 80 // 压缩质量
})
```
