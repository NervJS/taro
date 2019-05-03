---
title: 下拉刷新
sidebar_label: 下拉刷新
---

## Taro.startPullDownRefresh(OBJECT)

使用方式同 [`wx.startPullDownRefresh`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startPullDownRefresh.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startPullDownRefresh(params).then(...)
```

## Taro.stopPullDownRefresh()

停止当前页面下拉刷新。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopPullDownRefresh()
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.startPullDownRefresh | ✔️ | ✔️ |  ✔️（无动画效果）  |
| Taro.stopPullDownRefresh | ✔️ | ✔️ |  ✔️  |
