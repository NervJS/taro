---
title: Taro.scanCode(OBJECT)
sidebar_label: scanCode
---


使用方式同 [`wx.scanCode`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.scanCode.html)，h5端仅支持[微信公众号](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)（API以小程序为准），支持 `Promise` 化使用。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.scanCode(params).then(...)
```

## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.scanCode | ✔️ | ✔️ |  |

