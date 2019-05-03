---
title: iBeacon
sidebar_label: iBeacon
---

## Taro.startBeaconDiscovery(OBJECT)

使用方式同 [`wx.startBeaconDiscovery`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startBeaconDiscovery.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startBeaconDiscovery(params).then(...)
```

## Taro.stopBeaconDiscovery(OBJECT)

使用方式同 [`wx.stopBeaconDiscovery`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopBeaconDiscovery.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopBeaconDiscovery(params).then(...)
```

## Taro.getBeacons(OBJECT)

使用方式同 [`wx.getBeacons`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBeacons.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getBeacons(params).then(...)
```

## Taro.onBeaconUpdate(CALLBACK)

使用方式同 [`wx.onBeaconUpdate`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBeaconUpdate.html)。

## Taro.onBeaconServiceChange(CALLBACK)

使用方式同 [`wx.onBeaconServiceChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBeaconServiceChange.html)。

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.startBeaconDiscovery | ✔️ |  |  |
| Taro.stopBeaconDiscovery | ✔️ |  |  |
| Taro.getBeacons | ✔️ |  |  |
| Taro.onBeaconUpdate | ✔️ |  |  |
| Taro.onBeaconServiceChange | ✔️ |  |  |
