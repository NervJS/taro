---
title: 罗盘
sidebar_label: 罗盘
---

## Taro.onCompassChange(CALLBACK)

使用方式同 [`wx.onCompassChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onCompassChange.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onCompassChange(res => {
  console.log(res.direction)
})
```

## Taro.startCompass(OBJECT)

使用方式同 [`wx.startCompass`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startCompass.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startCompass()
```

## Taro.stopCompass(OBJECT)

使用方式同 [`wx.stopCompass`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopCompass.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopCompass()
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.onCompassChange | ✔️ | ✔️ |  |
| Taro.startCompass | ✔️ | ✔️ |  |
| Taro.stopCompass | ✔️ | ✔️ |  |
