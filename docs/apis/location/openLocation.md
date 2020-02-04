---
title: Taro.openLocation(option)
sidebar_label: openLocation
---

使用微信内置地图查看位置

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| latitude | `number` | 是 | 纬度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系 |
| longitude | `number` | 是 | 经度，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系 |
| address | `string` | 否 | 地址的详细说明 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| name | `string` | 否 | 位置名 |
| scale | `number` | 否 | 缩放比例，范围5~18 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.getLocation({
 type: 'gcj02', //返回可以用于 Taro.openLocation的经纬度
 success: function (res) {
   const latitude = res.latitude
   const longitude = res.longitude
   Taro.openLocation({
     latitude,
     longitude,
     scale: 18
   })
 }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.openLocation | ✔️ | ✔️ |  |
