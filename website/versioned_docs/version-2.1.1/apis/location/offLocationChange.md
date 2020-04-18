---
title: Taro.offLocationChange(callback)
sidebar_label: offLocationChange
id: version-2.1.1-offLocationChange
original_id: offLocationChange
---

取消监听实时地理位置变化事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.offLocationChange.html)

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
      <td>实时地理位置变化事件的回调函数</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offLocationChange | ✔️ |  |  |
