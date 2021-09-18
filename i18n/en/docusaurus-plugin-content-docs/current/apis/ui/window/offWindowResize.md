---
title: Taro.offWindowResize(callback)
sidebar_label: offWindowResize
---

Un-listens on the window size change event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/window/wx.offWindowResize.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the window size change event.

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offWindowResize | ✔️ | ✔️ | ✔️ |
