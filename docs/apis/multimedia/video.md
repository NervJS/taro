---
title: 视频
sidebar_label: 视频
---

## Taro.chooseVideo(OBJECT)

使用方式同 [`wx.chooseVideo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseVideo.html)，支持 `Promise` 化使用。

注：RN端该API不支持 `compressed` 、`maxDuration`、`camera` 属性；不支持相册与相机同时选择，只会取 `sourceType` 数组里的第一个值。默认从相册选取视频。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.chooseVideo(params).then(...)
```

## Taro.saveVideoToPhotosAlbum(OBJECT)

使用方式同 [`wx.saveVideoToPhotosAlbum`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.saveVideoToPhotosAlbum.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.saveVideoToPhotosAlbum(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.chooseVideo | ✔️ |  | ✔️ |
| Taro.saveVideoToPhotosAlbum | ✔️ |  | ✔️ |

# 视频组件控制

## Taro.createVideoContext(videoId, this.$scope)

使用方式同 [`wx.createVideoContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createVideoContext.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const videoContext = Taro.createVideoContext('myVideo')
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.createVideoContext | ✔️ | ✔️ |  |
