---
title: Taro.onBeaconServiceChange(callback)
sidebar_label: onBeaconServiceChange
id: version-2.1.1-onBeaconServiceChange
original_id: onBeaconServiceChange
---

监听 iBeacon 服务状态变化事件，仅能注册一个监听

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.onBeaconServiceChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

iBeacon 服务状态变化事件的回调函数

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
      <td>available</td>
      <td><code>boolean</code></td>
      <td>服务目前是否可用</td>
    </tr>
    <tr>
      <td>discovering</td>
      <td><code>boolean</code></td>
      <td>目前是否处于搜索状态</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBeaconServiceChange | ✔️ |  |  |
