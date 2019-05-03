---
title: 录音
sidebar_label: 录音
---

## Taro.startRecord(OBJECT)

使用方式同 [`wx.startRecord`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startRecord.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startRecord(params).then(...)
```

## Taro.stopRecord()

​主动调用停止录音。

​**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopRecord()
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.startRecord | ✔️ |  |  |  |  |
| Taro.stopRecord | ✔️ |  |  |  |  |

# 录音管理

## Taro.getRecorderManager()

使用方式同 [`wx.getRecorderManager`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getRecorderManager.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const recorderManager = Taro.getRecorderManager()
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.getRecorderManager | ✔️ |  |  |  |  |
