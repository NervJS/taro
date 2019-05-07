---
title: Taro.vibrateShort(param)
sidebar_label: vibrateShort
---

使手机发生较短时间的振动（15 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效

使用方式同 [`wx.vibrateShort`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.vibrateShort.html)，支持 `Promise` 化使用。

## 参数

### object param

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| [success] | <code>function</code> |  | 接口调用成功的回调函数 |
| [fail] | <code>function</code> |  | 接口调用失败的回调函数 |
| [complete] | <code>function</code> |  | 接口调用结束的回调函数（调用成功、失败都会执行） |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.vibrateShort(params).then(...)

```
## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.vibrateShort | ✔️ | ✔️ | ✔️ |

