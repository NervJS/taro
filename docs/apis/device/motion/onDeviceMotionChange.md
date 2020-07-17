---
title: Taro.onDeviceMotionChange(callback)
sidebar_label: onDeviceMotionChange
---

监听设备方向变化事件。频率根据 Taro.startDeviceMotionListening() 的 interval 参数。可以使用 Taro.stopDeviceMotionListening() 停止监听。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.onDeviceMotionChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

设备方向变化事件的回调函数

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
      <td>alpha</td>
      <td><code>number</code></td>
      <td>当 手机坐标 X/Y 和 地球 X/Y 重合时，绕着 Z 轴转动的夹角为 alpha，范围值为 [0, 2*PI)。逆时针转动为正。</td>
    </tr>
    <tr>
      <td>beta</td>
      <td><code>number</code></td>
      <td>当手机坐标 Y/Z 和地球 Y/Z 重合时，绕着 X 轴转动的夹角为 beta。范围值为 [-1*PI, PI) 。顶部朝着地球表面转动为正。也有可能朝着用户为正。</td>
    </tr>
    <tr>
      <td>gamma</td>
      <td><code>number</code></td>
      <td>当手机 X/Z 和地球 X/Z 重合时，绕着 Y 轴转动的夹角为 gamma。范围值为 [-1*PI/2, PI/2)。右边朝着地球表面转动为正。</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onDeviceMotionChange | ✔️ | ✔️ | ✔️ |
