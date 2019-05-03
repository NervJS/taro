---
title: 设置
sidebar_label: 设置
---

## Taro.getSetting(OBJECT)

使用方式同 [`wx.getSetting`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSetting.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getSetting(params).then(...)
```

## Taro.openSetting(OBJECT)

使用方式同 [`wx.openSetting`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openSetting.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.openSetting(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getSetting | ✔️ |  |  |
| Taro.openSetting | ✔️ |  |  |
