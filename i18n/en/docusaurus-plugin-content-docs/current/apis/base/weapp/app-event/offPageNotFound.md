---
title: Taro.offPageNotFound(callback)
sidebar_label: offPageNotFound
---

Un-listens on the event that a page to be opened by the Mini Program does not exist.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/app/app-event/wx.offPageNotFound.html)

## Type

```tsx
(callback: (res: CallbackResult) => void) => void
```

## Parameters

<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>The callback function for the event that a page to be opened by the Mini Program does not exist.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offPageNotFound | ✔️ |  |  |
