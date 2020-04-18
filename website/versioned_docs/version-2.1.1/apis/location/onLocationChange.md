---
title: Taro.onLocationChange(callback)
sidebar_label: onLocationChange
id: version-2.1.1-onLocationChange
original_id: onLocationChange
---

监听实时地理位置变化事件，需结合 Taro.startLocationUpdateBackground、Taro.startLocationUpdate 使用。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.onLocationChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

实时地理位置变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### CallbackResult

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
  </tbody>
</table>

## 示例代码

```tsx
const _locationChangeFn = function (res) {
 console.log('location change', res)
}
Taro.onLocationChange(_locationChangeFn)
Taro.offLocationChange(_locationChangeFn)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onLocationChange | ✔️ |  |  |
