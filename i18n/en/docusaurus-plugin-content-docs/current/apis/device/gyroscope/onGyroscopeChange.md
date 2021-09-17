---
title: Taro.onGyroscopeChange(callback)
sidebar_label: onGyroscopeChange
---

Listens on the gyroscope data change event. The frequency is based on the `Taro.startGyroscope()` interval parameter. You can use `Taro.stopGyroscope()` to stop listening.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/gyroscope/wx.onGyroscopeChange.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the gyroscope data change event.

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
      <td>x</td>
      <td><code>number</code></td>
      <td>X-axis angular velocity</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>Y-axis angular velocity</td>
    </tr>
    <tr>
      <td>z</td>
      <td><code>number</code></td>
      <td>Z-axis angular velocity</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onGyroscopeChange | ✔️ |  | ✔️ |
