---
title: Taro.onBeaconUpdate(callback)
sidebar_label: onBeaconUpdate
---

监听 iBeacon 设备更新事件，仅能注册一个监听

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.onBeaconUpdate.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

iBeacon 设备更新事件的回调函数

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
      <td>beacons</td>
      <td><code>IBeaconInfo[]</code></td>
      <td>当前搜寻到的所有 iBeacon 设备列表</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBeaconUpdate | ✔️ |  |  |
