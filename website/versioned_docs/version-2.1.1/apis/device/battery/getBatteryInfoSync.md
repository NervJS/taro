---
title: Taro.getBatteryInfoSync()
sidebar_label: getBatteryInfoSync
id: version-2.1.1-getBatteryInfoSync
original_id: getBatteryInfoSync
---

Taro.getBatteryInfo 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/battery/wx.getBatteryInfoSync.html)

## 类型

```tsx
() => Result
```

## 参数

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
      <td>isCharging</td>
      <td><code>boolean</code></td>
      <td>是否正在充电中</td>
    </tr>
    <tr>
      <td>level</td>
      <td><code>string</code></td>
      <td>设备电量，范围 1 - 100</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBatteryInfoSync | ✔️ |  |  |
