---
title: Taro.onAppHide(callback)
sidebar_label: onAppHide
---

Listens on the event that Mini Program is switched to background. The callback timing for this event is consistent with that of [`App.onHide`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onhide).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/app/app-event/wx.onAppHide.html)

## Type

```tsx
(callback: (res: CallbackResult) => void) => void
```

## Parameters

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>The callback function for the event that Mini Program is switched to background.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onAppHide | ✔️ |  |  |
