---
title: Taro.onLocationChange(callback)
sidebar_label: onLocationChange
---

Listens for real-time geolocation change events, to be used in conjunction with `Taro.startLocationUpdateBackground`、`Taro.startLocationUpdate`.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.onLocationChange.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

Callback function for real-time geolocation change events.

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
      <td>accuracy</td>
      <td><code>number</code></td>
      <td>Location accuracy</td>
    </tr>
    <tr>
      <td>altitude</td>
      <td><code>number</code></td>
      <td>Altitude (in m)</td>
    </tr>
    <tr>
      <td>horizontalAccuracy</td>
      <td><code>number</code></td>
      <td>Horizontal accuracy (in m)</td>
    </tr>
    <tr>
      <td>latitude</td>
      <td><code>number</code></td>
      <td>Latitude. The value ranges from -90 to +90, and the negative number means south latitude.</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td>Longitude. The value ranges from -180 to +180, and the negative number means west longitude.</td>
    </tr>
    <tr>
      <td>speed</td>
      <td><code>number</code></td>
      <td>Speed (in m/s)</td>
    </tr>
    <tr>
      <td>verticalAccuracy</td>
      <td><code>number</code></td>
      <td>Vertical accuracy (in m) (Not available for Android, and 0 will be returned)</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
const _locationChangeFn = function (res) {
 console.log('location change', res)
}
Taro.onLocationChange(_locationChangeFn)
Taro.offLocationChange(_locationChangeFn)
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onLocationChange | ✔️ |  |  |
