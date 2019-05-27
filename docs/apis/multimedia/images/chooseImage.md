---
title: Taro.chooseImage(OBJECT)
sidebar_label: chooseImage
---


使用方式同 [`wx.chooseImage `](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseImage.html)，支持 `Promise` 化使用。

注：RN 端该 API 不支持 `count` 属性；不支持相机与相册同时选择，只会取 `sourceType` 数组里的第一个值。默认从相册选取图片。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.chooseImage(params).then(...)
```



## API支持度


| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.chooseImage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

