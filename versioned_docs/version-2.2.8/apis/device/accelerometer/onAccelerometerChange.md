---
title: Taro.onAccelerometerChange(callback)
sidebar_label: onAccelerometerChange
---

监听加速度数据，频率：5次/秒，接口调用后会自动开始监听，可使用 `Taro.stopAccelerometer` 停止监听。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.onAccelerometerChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

```tsx
(res: Result) => void
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
      <td>res</td>
      <td><code>Result</code></td>
    </tr>
  </tbody>
</table>

### Result

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
      <td>X 轴</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>Y 轴</td>
    </tr>
    <tr>
      <td>z</td>
      <td><code>number</code></td>
      <td>Z 轴</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.onAccelerometerChange(res => {
  console.log(res.x)
  console.log(res.y)
  console.log(res.z)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onAccelerometerChange | ✔️ | ✔️ | ✔️ |
