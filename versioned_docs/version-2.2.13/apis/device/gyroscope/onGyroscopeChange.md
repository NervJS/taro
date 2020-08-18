---
title: Taro.onGyroscopeChange(callback)
sidebar_label: onGyroscopeChange
---

监听陀螺仪数据变化事件。频率根据 Taro.startGyroscope() 的 interval 参数。可以使用 Taro.stopGyroscope() 停止监听。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/gyroscope/wx.onGyroscopeChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

陀螺仪数据变化事件的回调函数

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
      <td>x</td>
      <td><code>number</code></td>
      <td>x 轴的角速度</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>y 轴的角速度</td>
    </tr>
    <tr>
      <td>z</td>
      <td><code>number</code></td>
      <td>z 轴的角速度</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onGyroscopeChange | ✔️ |  |  |
