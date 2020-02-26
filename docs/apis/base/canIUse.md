---
title: Taro.canIUse(schema)
sidebar_label: canIUse
---

判断小程序的 API，回调，参数，组件等是否在当前版本可用。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.canIUse.html)

## 类型

```tsx
(schema: string) => boolean
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| schema | `string` | 使用 `${API}.${method}.${param}.${option}` 或者 `${component}.${attribute}.${option}` 方式来调用<br /><br />**参数说明**<br /><br />- `${API}` 代表 API 名字<br />- `${method}` 代表调用方式，有效值为return, success, object, callback<br />- `${param}` 代表参数或者返回值<br />- `${option}` 代表参数的可选值或者返回值的属性<br />- `${component}` 代表组件名字<br />- `${attribute}` 代表组件属性<br />- `${option}` 代表组件属性的可选值 |

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

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.canIUse | ✔️ |  |  |
