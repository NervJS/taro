---
title: Taro.saveImageToPhotosAlbum(option)
sidebar_label: saveImageToPhotosAlbum
id: version-1.3.37-saveImageToPhotosAlbum
original_id: saveImageToPhotosAlbum
---

保存图片到系统相册。需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.writePhotosAlbum

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.saveImageToPhotosAlbum({
  success: function (res) { }
})
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.saveImageToPhotosAlbum | ✔️ | ✔️ | ✔️ |  | ✔️ |
