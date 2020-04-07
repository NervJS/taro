---
title: Taro.offGetWifiList(callback)
sidebar_label: offGetWifiList
id: version-2.1.1-offGetWifiList
original_id: offGetWifiList
---

取消监听获取到 Wi-Fi 列表数据事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.offGetWifiList.html)

## 类型

```tsx
(callback: (...args: any[]) => any) => void
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
      <td><code>(...args: any[]) =&gt; any</code></td>
      <td>获取到 Wi-Fi 列表数据事件的回调函数</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offGetWifiList | ✔️ |  |  |
