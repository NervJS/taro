---
title: Taro.canIUse(String)
sidebar_label: canIUse
---


使用方式同 [`wx.canIUse`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.canIUse.html)。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.canIUse('openBluetoothAdapter')
Taro.canIUse('getSystemInfoSync.return.screenWidth')
Taro.canIUse('getSystemInfo.success.screenWidth')
Taro.canIUse('showToast.object.image')
Taro.canIUse('onCompassChange.callback.direction')
Taro.canIUse('request.object.method.GET')
Taro.canIUse('live-player')
Taro.canIUse('text.selectable')
Taro.canIUse('button.open-type.contact')

```

## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.canIUse | ✔️ |  |  |

