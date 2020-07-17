---
title: Taro.getLocation(option)
sidebar_label: getLocation
id: version-2.1.1-getLocation
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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>altitude</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>highAccuracyExpireTime</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>高精度定位超时时间(ms)，指定时间内返回最高精度，该值3000ms以上高精度定位才有效果</td>
    </tr>
    <tr>
      <td>isHighAccuracy</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>开启高精度定位</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>wgs84 返回 gps 坐标，gcj02 返回可用于 Taro.openLocation 的坐标</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>accuracy</td>
      <td><code>number</code></td>
      <td>位置的精确度</td>
    </tr>
    <tr>
      <td>altitude</td>
      <td><code>number</code></td>
      <td>高度，单位 m</td>
    </tr>
    <tr>
      <td>horizontalAccuracy</td>
      <td><code>number</code></td>
      <td>水平精度，单位 m</td>
    </tr>
    <tr>
      <td>latitude</td>
      <td><code>number</code></td>
      <td>纬度，范围为 -90~90，负数表示南纬</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td>经度，范围为 -180~180，负数表示西经</td>
    </tr>
    <tr>
      <td>speed</td>
      <td><code>number</code></td>
      <td>速度，单位 m/s</td>
    </tr>
    <tr>
      <td>verticalAccuracy</td>
      <td><code>number</code></td>
      <td>垂直精度，单位 m（Android 无法获取，返回 0）</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

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
