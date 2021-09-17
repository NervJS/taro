---
title: Taro.onAccelerometerChange(callback)
sidebar_label: onAccelerometerChange
---

Listens on the acceleration data event. The frequency is based on the `Taro.startAccelerometer()` interval parameter. You can use `Taro.stopAccelerometer()` to stop listening.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/accelerometer/wx.onAccelerometerChange.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

```tsx
(res: Result) => void
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
      <td>res</td>
      <td><code>Result</code></td>
    </tr>
  </tbody>
</table>

### Result

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
      <td>x</td>
      <td><code>number</code></td>
      <td>X-axis</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>Y-axis</td>
    </tr>
    <tr>
      <td>z</td>
      <td><code>number</code></td>
      <td>Z-axis</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.onAccelerometerChange(res => {
  console.log(res.x)
  console.log(res.y)
  console.log(res.z)
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onAccelerometerChange | ✔️ | ✔️ | ✔️ |
