---
title: Taro.getLocation(option)
sidebar_label: getLocation
id: version-1.3.37-getLocation
original_id: getLocation
---

获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用。开启高精度定位，接口耗时会增加，可指定 highAccuracyExpireTime 作为超时时间。

**注意**
- 工具中定位模拟使用IP定位，可能会有一定误差。且工具目前仅支持 gcj02 坐标。
- 使用第三方服务进行逆地址解析时，请确认第三方服务默认的坐标系，正确进行坐标转换。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| altitude | `string` | 否 | 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| highAccuracyExpireTime | `number` | 否 | 高精度定位超时时间(ms)，指定时间内返回最高精度，该值3000ms以上高精度定位才有效果 |
| isHighAccuracy | `boolean` | 否 | 开启高精度定位 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| type | `string` | 否 | wgs84 返回 gps 坐标，gcj02 返回可用于 Taro.openLocation 的坐标 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| accuracy | `number` | 位置的精确度 |
| altitude | `number` | 高度，单位 m |
| horizontalAccuracy | `number` | 水平精度，单位 m |
| latitude | `number` | 纬度，范围为 -90~90，负数表示南纬 |
| longitude | `number` | 经度，范围为 -180~180，负数表示西经 |
| speed | `number` | 速度，单位 m/s |
| verticalAccuracy | `number` | 垂直精度，单位 m（Android 无法获取，返回 0） |
| errMsg | `string` | 调用结果 |

## 示例代码

 ```tsx
Taro.getLocation({
 type: 'wgs84',
 success: function (res) {
   const latitude = res.latitude
   const longitude = res.longitude
   const speed = res.speed
   const accuracy = res.accuracy
 }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getLocation | ✔️ |  |  |
