---
title: Taro.saveVideoToPhotosAlbum(option)
sidebar_label: saveVideoToPhotosAlbum
id: version-1.3.37-saveVideoToPhotosAlbum
original_id: saveVideoToPhotosAlbum
---

保存视频到系统相册。支持mp4视频格式。需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.writePhotosAlbum

**Bug & Tip：**

1.  `tip`: camera 参数在部分 Android 手机下由于系统 ROM 不支持无法生效

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 视频文件路径，可以是临时文件路径也可以是永久文件路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.saveVideoToPhotosAlbum({
  filePath: 'wxfile://xxx'
  success: function (res) {
    console.log(res.errMsg)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.saveVideoToPhotosAlbum | ✔️ |  | ✔️ |
