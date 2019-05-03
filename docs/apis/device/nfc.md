---
title: NFC
sidebar_label: NFC
---

## Taro.getHCEState(OBJECT)

使用方式同 [`wx.getHCEState`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getHCEState.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getHCEState(params).then(...)
```

## Taro.startHCE(OBJECT)

使用方式同 [`wx.startHCE`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startHCE.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startHCE(params).then(...)
```

## Taro.stopHCE(OBJECT)

使用方式同 [`wx.stopHCE`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopHCE.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopHCE(params).then(...)
```

## Taro.onHCEMessage(CALLBACK)

使用方式同 [`wx.onHCEMessage`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onHCEMessage.html)。

## Taro.sendHCEMessage(OBJECT)

使用方式同 [`wx.sendHCEMessage`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.sendHCEMessage.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.sendHCEMessage(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getHCEState | ✔️ |  |  |
| Taro.startHCE | ✔️ |  |  |
| Taro.stopHCE | ✔️ |  |  |
| Taro.onHCEMessage | ✔️ |  |  |
| Taro.sendHCEMessage | ✔️ |  |  |
