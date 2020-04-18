---
title: Taro.onGetWifiList(callback)
sidebar_label: onGetWifiList
id: version-2.1.1-onGetWifiList
original_id: onGetWifiList
---

监听获取到 Wi-Fi 列表数据事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.onGetWifiList.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

获取到 Wi-Fi 列表数据事件的回调函数

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
      <td>wifiList</td>
      <td><code>WifiInfo[]</code></td>
      <td>Wi-Fi 列表数据</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onGetWifiList | ✔️ |  |  |
