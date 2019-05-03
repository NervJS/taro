---
title: 地图组件控制
sidebar_label: 地图组件控制
---

## Taro.createMapContext(mapId, this.$scope)

使用方式同 [`wx.createMapContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createMapContext.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const mapCtx = Taro.createMapContext('myMap')
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.createMapContext | ✔️ |  |  |
