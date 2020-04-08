---
title: Taro.offWindowResize(callback)
sidebar_label: offWindowResize
id: version-2.1.1-offWindowResize
original_id: offWindowResize
---

取消监听窗口尺寸变化事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.offWindowResize.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

窗口尺寸变化事件的回调函数

```tsx
(res: CallbackResult) => void
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
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offWindowResize | ✔️ | ✔️ |  |
