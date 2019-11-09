---
title: Taro.canIUse(param)
sidebar_label: canIUse
---

判断小程序的 API，回调，参数，组件等是否在当前版本可用。

**String** 参数说明：

使用`${API}.${method}.${param}.${options}`或者`${component}.${attribute}.${option}`方式来调用，例如：
  `${API}` 代表 API 名字
  `${method}` 代表调用方式，有效值为`return`, `success`, `object`, `callback`
  `${param}` 代表参数或者返回值
  `${options}` 代表参数的可选值
  `${component}` 代表组件名字
  `${attribute}` 代表组件属性
  `${option}` 代表组件属性的可选值

## 类型

```tsx
(param: string) => boolean
```

## 示例代码

```tsx
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

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.canIUse | ✔️ |  |  |  |  |  |  |  |

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.canIUse.html)
