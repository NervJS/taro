---
title: 导航
sidebar_label: 导航
---

## Taro.navigateTo(OBJECT)

使用方式同 [`wx.navigateTo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateTo.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.navigateTo(params).then(...)
```

## Taro.redirectTo(OBJECT)

使用方式同 [`wx.redirectTo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.redirectTo.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.redirectTo(params).then(...)
```

## Taro.switchTab(OBJECT)

使用方式同 [`wx.switchTab`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.switchTab.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.switchTab(params).then(...)
```

## Taro.navigateBack(OBJECT)

使用方式同 [`wx.navigateBack`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateBack.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.navigateBack({ delta: 2 })
```

## Taro.reLaunch(OBJECT)

使用方式同 [`wx.reLaunch`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.reLaunch.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.reLaunch(params).then(...)
```

## Taro.getCurrentPages(OBJECT)

使用方式同 [`getCurrentPages`](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html#getcurrentpages)， 获取当前的页面栈，决定需要返回几层。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getCurrentPages().length
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.navigateTo | ✔️ | ✔️ | ✔️ |
| Taro.redirectTo | ✔️ | ✔️ | ✔️ |
| Taro.switchTab | ✔️ | ✔️ | ✔️ |
| Taro.navigateBack | ✔️ | ✔️ | ✔️ |
| Taro.reLaunch | ✔️ | ✔️ | ✔️ |
| Taro.getCurrentPages | ✔️ |   | ✔️|
