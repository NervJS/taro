---
title: Taro.onDeviceMotionChange(callback)
sidebar_label: onDeviceMotionChange
---

Listens on the device orientation change event. The frequency is based on the `Taro.startDeviceMotionListening()` interval parameter. You can use `Taro.stopDeviceMotionListening()` stop listening.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/motion/wx.onDeviceMotionChange.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the device orientation change event.

```tsx
(result: CallbackResult) => void
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
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### CallbackResult

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
      <td>alpha</td>
      <td><code>number</code></td>
      <td>When the phone coordinate X/Y and the earth coordinate X/Y coincide, the angle of rotation around the Z axis is alpha. The range is [0, 2*PI). It is positive when the phone rotates counterclockwise.</td>
    </tr>
    <tr>
      <td>beta</td>
      <td><code>number</code></td>
      <td>When the phone coordinate Y/Z and the earth coordinate Y/Z coincide, the angle of rotation around the X axis is beta. The range is [-1*PI, PI). It is positive when the phone rotates with its top toward the earth surface or the user.</td>
    </tr>
    <tr>
      <td>gamma</td>
      <td><code>number</code></td>
      <td>When the phone coordinate X/Z and the earth coordinate X/Z coincide, the angle of rotation around the Y axis is gamma. The range is [-1*PI/2, PI/2). It is positive when the phone rotates with its right side toward the earth surface.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onDeviceMotionChange | ✔️ | ✔️ | ✔️ |
