---
title: Taro.chooseLocation(option)
sidebar_label: chooseLocation
id: version-1.3.37-chooseLocation
original_id: chooseLocation
---

打开地图选择位置。

`chooseLocation` api功能是依赖于腾讯位置服务，所以需要使用 api 密钥。如果您没有，可以前往腾讯位置服务[开发者控制台](https://lbs.qq.com/console/mykey.html?console=mykey)进行申请。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| latitude | `number` | 否 | 目标地纬度 |
| longitude | `number` | 否 | 目标地经度 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| address | `string` | 详细地址 |
| latitude | `string` | 纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系 |
| longitude | `string` | 经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系 |
| name | `string` | 位置名称 |
| errMsg | `string` | 调用结果 |

## 示例代码

```tsx
// config/index.js

// 获得 api 密钥后，您需要将它填入项目的常量配置`defineConstants.LOCATION_APIKEY`中：
const config = {
  defineConstants: {
    LOCATION_APIKEY: JSON.stringify('XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX')
  },
  // ...
}
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseLocation | ✔️ | ✔️ |  |
