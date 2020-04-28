---
title: Taro.onCompassChange(callback)
sidebar_label: onCompassChange
---

监听罗盘数据变化事件。频率：5 次/秒，接口调用后会自动开始监听，可使用 Taro.stopCompass 停止监听。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.onCompassChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

罗盘数据变化事件的回调函数

```tsx
(result: OnCompassChangeCallbackResult) => void
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
      <td><code>OnCompassChangeCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnCompassChangeCallbackResult

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
      <td>accuracy</td>
      <td><code>string | number</code></td>
      <td>精度<br /><br />由于平台差异，accuracy 在 iOS/Android 的值不同。<br /><br />- iOS：accuracy 是一个 number 类型的值，表示相对于磁北极的偏差。0 表示设备指向磁北，90 表示指向东，180 表示指向南，依此类推。<br />- Android：accuracy 是一个 string 类型的枚举值。</td>
    </tr>
    <tr>
      <td>direction</td>
      <td><code>number</code></td>
      <td>面对的方向度数</td>
    </tr>
  </tbody>
</table>

### accuracy

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>high</td>
      <td>高精度</td>
    </tr>
    <tr>
      <td>medium</td>
      <td>中等精度</td>
    </tr>
    <tr>
      <td>low</td>
      <td>低精度</td>
    </tr>
    <tr>
      <td>no-contact</td>
      <td>不可信，传感器失去连接</td>
    </tr>
    <tr>
      <td>unreliable</td>
      <td>不可信，原因未知</td>
    </tr>
    <tr>
      <td>unknow ${value}</td>
      <td>未知的精度枚举值，即该 Android 系统此时返回的表示精度的 value 不是一个标准的精度枚举值</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.onCompassChange(function (res) {
  console.log(res.direction)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onCompassChange | ✔️ | ✔️ |  |
