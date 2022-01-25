---
title: Taro.openVideoEditor(option)
sidebar_label: openVideoEditor
---

打开视频编辑器

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.openVideoEditor.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 视频源的路径，只支持本地路径 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| duration | `number` | 剪辑后生成的视频文件的时长，单位毫秒（ms） |
| size | `number` | 剪辑后生成的视频文件大小，单位字节数（byte） |
| tempFilePath | `string` | 编辑后生成的视频文件的临时路径 |
| tempThumbPath | `string` | 编辑后生成的缩略图文件的临时路径 |

## 示例代码

```tsx
Taro.openVideoEditor({
 filePath: ''
})
```
