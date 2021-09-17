---
title: Taro.onCompassChange(callback)
sidebar_label: onCompassChange
---

Listens on the compass data change event at a frequency of 5 times per second. Listening automatically starts after the API is called. You can use `Taro.stopCompass` to stop listening.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/compass/wx.onCompassChange.html)

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
      <td>The accuracy</td>
    </tr>
    <tr>
      <td>direction</td>
      <td><code>number</code></td>
      <td>The degree of the direction faced</td>
    </tr>
  </tbody>
</table>

### accuracy

**Accuracy Difference Between iOS and Android**
The accuracy values are different on iOS and Android.

- iOS: The accuracy is a number-type value indicating the deviation from the magnetic north pole. 0 indicates the device points to magnetic north, 90 east, 180 south, and so on.
- Android: The accuracy is a string-type enumerated value.

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
      <td>Unreliable. Unknown error.</td>
    </tr>
    <tr>
      <td>unknow {`{value}`}</td>
      <td>An unknown accuracy enumerated value. That is, the value returned by the Android system is not a standard enumerated value of accuracy.</td>
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

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onCompassChange | ✔️ | ✔️ |  |
