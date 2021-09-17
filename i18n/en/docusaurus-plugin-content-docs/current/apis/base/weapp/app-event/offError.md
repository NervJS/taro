---
title: Taro.offError(callback)
sidebar_label: offError
---

Un-listens on Mini Program error event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/InnerAudioContext.offError.html)

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
      <td>The callback function for the Mini Program error event.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offError | ✔️ |  |  |
