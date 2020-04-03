---
title: Taro.onBluetoothAdapterStateChange(callback)
sidebar_label: onBluetoothAdapterStateChange
---

监听蓝牙适配器状态变化事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothAdapterStateChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

蓝牙适配器状态变化事件的回调函数

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
      <td>蓝牙适配器是否可用</td>
    </tr>
    <tr>
      <td>discovering</td>
      <td><code>boolean</code></td>
      <td>蓝牙适配器是否处于搜索状态</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.onBluetoothAdapterStateChange(function (res) {
  console.log('adapterState changed, now is', res)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBluetoothAdapterStateChange | ✔️ |  |  |
