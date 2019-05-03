---
title: 设置导航条
sidebar_label: 设置导航条
---

## Taro.setNavigationBarTitle(OBJECT)

使用方式同 [`wx.setNavigationBarTitle`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setNavigationBarTitle.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setNavigationBarTitle(params).then(...)
```

## Taro.showNavigationBarLoading()

在当前页面显示导航条加载动画。

## Taro.hideNavigationBarLoading()

隐藏导航条加载动画。

## Taro.setNavigationBarColor(OBJECT)

使用方式同 [`wx.setNavigationBarColor`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setNavigationBarColor.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setNavigationBarColor(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setNavigationBarTitle | ✔️ | ✔️ |✔️  |
| Taro.showNavigationBarLoading | ✔️ |  | ✔️ |
| Taro.hideNavigationBarLoading | ✔️ |  | ✔️ |
| Taro.setNavigationBarColor | ✔️ |  | ✔️(不支持 animation 参数) |
