---
title: Wi-Fi
sidebar_label: Wi-Fi
---

## Taro.startWifi(OBJECT)

使用方式同 [`wx.startWifi`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startWifi.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startWifi(params).then(...)
```

## Taro.stopWifi(OBJECT)

使用方式同 [`wx.stopWifi`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopWifi.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopWifi(params).then(...)
```

## Taro.connectWifi(OBJECT)

使用方式同 [`wx.connectWifi`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.connectWifi.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.connectWifi(params).then(...)
```

## Taro.getWifiList(OBJECT)

使用方式同 [`wx.getWifiList`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getWifiList.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getWifiList(params).then(...)
```

## Taro.onGetWifiList(CALLBACK)

使用方式同 [`wx.onGetWifiList`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onGetWifiList.html)。

## Taro.setWifiList(OBJECT)

使用方式同 [`wx.setWifiList`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setWifiList.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setWifiList(params).then(...)
```

## Taro.onWifiConnected(CALLBACK)

使用方式同 [`wx.onWifiConnected`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onWifiConnected.html)。

## Taro.getConnectedWifi(OBJECT)

使用方式同 [`wx.getConnectedWifi`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getConnectedWifi.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getConnectedWifi(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.startWifi | ✔️ |  |  |
| Taro.stopWifi | ✔️ |  |  |
| Taro.connectWifi | ✔️ |  |  |
| Taro.getWifiList | ✔️ |  |  |
| Taro.onGetWifiList | ✔️ |  |  |
| Taro.setWifiList | ✔️ |  |  |
| Taro.onWifiConnected | ✔️ |  |  |
| Taro.getConnectedWifi | ✔️ |  |  |
