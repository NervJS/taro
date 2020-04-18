---
title: Taro.offBeaconServiceChange(callback)
sidebar_label: offBeaconServiceChange
id: version-2.1.1-offBeaconServiceChange
original_id: offBeaconServiceChange
---

取消监听 iBeacon 服务状态变化事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.offBeaconServiceChange.html)

## 类型

```tsx
(callback: (res: CallbackResult) => void) => void
```

## 参数

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
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>iBeacon 服务状态变化事件的回调函数</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offBeaconServiceChange | ✔️ |  |  |
