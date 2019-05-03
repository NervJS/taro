---
title: 屏幕亮度
sidebar_label: 屏幕亮度
---

## Taro.setScreenBrightness(OBJECT)

使用方式同 [`wx.setScreenBrightness`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setScreenBrightness.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setScreenBrightness(params).then(...)
```

## Taro.getScreenBrightness(OBJECT)

使用方式同 [`wx.getScreenBrightness`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getScreenBrightness.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getScreenBrightness(params).then(...)
```

## Taro.setKeepScreenOn(OBJECT)

使用方式同 [`wx.setKeepScreenOn`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setKeepScreenOn.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setKeepScreenOn(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setScreenBrightness | ✔️ |  |  |
| Taro.getScreenBrightness | ✔️ |  |  |
| Taro.setKeepScreenOn | ✔️ |  |  |
