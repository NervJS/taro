---
title: Taro.onCompassChange(callback)
sidebar_label: onCompassChange
---

监听罗盘数据变化事件。频率：5 次/秒，接口调用后会自动开始监听，可使用 Taro.stopCompass 停止监听。

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.onCompassChange.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the compass data change event.

```tsx
(result: OnCompassChangeCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>OnCompassChangeCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnCompassChangeCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>accuracy</td>
      <td><code>string | number</code></td>
      <td><strong x-id="1">Accuracy Difference Between iOS and Android</strong>
The accuracy values are different on iOS and Android.iOS: The accuracy is a number-type value indicating the deviation from the magnetic north pole.0 indicates the device points to magnetic north, 90 east, 180 south, and so on.<br />- Android：accuracy 是一个 string 类型的枚举值。</td>
    </tr>
    <tr>
      <td>direction</td>
      <td><code>number</code></td>
      <td>The degree of the direction faced</td>
    </tr>
  </tbody>
</table>

### accuracy

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>high</td>
      <td>High accuracy</td>
    </tr>
    <tr>
      <td>medium</td>
      <td>Moderate accuracy</td>
    </tr>
    <tr>
      <td>low</td>
      <td>Low accuracy</td>
    </tr>
    <tr>
      <td>no-contact</td>
      <td>Unreliable. Connection with sensor lost.</td>
    </tr>
    <tr>
      <td>unreliable</td>
      <td>不可信，原因未知</td>
    </tr>
    <tr>
      <td>unknow {`{value}`}</td>
      <td>Android: The accuracy is a string-type enumerated value.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.onCompassChange(function (res) {
  console.log(res.direction)
})
```

## API Support

|         API          | WeChat Mini-Program | H5 | React Native |
|:--------------------:|:-------------------:|:--:|:------------:|
| Taro.onCompassChange |         ✔️          | ✔️ |              |
