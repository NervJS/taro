---
title: Taro.canIUse(schema)
sidebar_label: canIUse
---

Determines whether the APIs, callbacks, parameters, and components of the Mini Program are available in the current version.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/wx.canIUse.html)

## Type

```tsx
(schema: string) => boolean
```

## Parameters

The API is called using the `${API}.${method}.${param}.${options}` or `${component}.${attribute}.${option}` method.

**Parameters Description**  
  
\- `${API}`: API name
\- `${method}`: Call method. Available values: return, success, object, and callback.
\- `${param}`: Parameter or return value
\- `${option}`: Available values for the parameter
\- `${component}`: Component name
\- `${attribute}`: Component attribute
\- `${option}`: Available values for the component attribute

## Sample Code

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

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.canIUse | ✔️ |  |  |
