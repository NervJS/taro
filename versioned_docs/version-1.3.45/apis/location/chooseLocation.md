---
title: Taro.chooseLocation(param)
sidebar_label: chooseLocation
---

打开地图选择位置。

使用方式同 [`wx.chooseLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseLocation.html)，支持 `Promise` 化使用。

## 使用前注意

`chooseLocation` api功能是依赖于腾讯位置服务，所以需要使用 api 密钥。如果您没有，可以前往腾讯位置服务[开发者控制台](https://lbs.qq.com/console/mykey.html?console=mykey)进行申请。

获得 api 密钥后，您需要将它填入项目的常量配置`defineConstants.LOCATION_APIKEY`中：

```javascript
// config/index.js

const config = {
  defineConstants: {
    LOCATION_APIKEY: JSON.stringify('XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX')
  },
  // ...
}
```

## 参数

### object param

| Property | Type | Description |
| --- | --- | --- |
| [success] | [<code>function</code>](#successobj) | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

#### 参数

##### success(obj)

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | 位置名称 |
| address | <code>string</code> | 详细地址 |
| latitude | <code>string</code> | 纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系 |
| longitude | <code>string</code> | 经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系 |


## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.chooseLocation(params).then(...)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.chooseLocation | ✔️ | ✔️ |  |
