---
title: 系统信息
sidebar_label: 系统信息
---

## Taro.getSystemInfo(OBJECT)

获取系统信息，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| success | Function | 否 | 接口调用成功的回调函数，详见返回参数说明 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数 | 说明 |
| :-- | :-- |
| brand | 手机品牌 |
| model | 手机型号 |
| system | 操作系统版本 |
| pixelRatio | 设备像素比 |
| screenWidth | 屏幕宽度 |
| screenHeight | 屏幕高度 |
| windowWidth | 可使用窗口宽度 |
| windowHeight | 可使用窗口高度 |
| version | 微信版本号 |
| statusBarHeight | 状态栏的高度 |
| platform | 客户端平台 |
| language | 微信设置的语言 |
| fontSizeSetting | 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px |
| SDKVersion | 客户端基础库版本 |

注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getSystemInfo({
  success: res => console.log(res)
})
  .then(res => console.log(res))
```

## Taro.getSystemInfoSync()

获取系统信息同步接口。

**同步返回参数说明：**

| 参数 | 说明 |
| :-- | :-- |
| brand | 手机品牌 |
| model | 手机型号 |
| system | 操作系统版本 |
| pixelRatio | 设备像素比 |
| screenWidth | 屏幕宽度 |
| screenHeight | 屏幕高度 |
| windowWidth | 可使用窗口宽度 |
| windowHeight | 可使用窗口高度 |
| version | 微信版本号 |
| statusBarHeight | 状态栏的高度 |
| platform | 客户端平台 |
| language | 微信设置的语言 |
| fontSizeSetting | 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px |
| SDKVersion | 客户端基础库版本 |

注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const res = Taro.getSystemInfoSync()
console.log(res.model)
console.log(res.pixelRatio)
console.log(res.windowWidth)
console.log(res.windowHeight)
console.log(res.language)
console.log(res.version)
console.log(res.platform)
```

## Taro.canIUse(String)

使用方式同 [`wx.canIUse`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.canIUse.html)。

**示例代码：**

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

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getSystemInfo | ✔️ | ✔️ | ✔️ |
| Taro.getSystemInfoSync | ✔️ | ✔️ | ✔️ |
| Taro.canIUse | ✔️ |  |  |
