---
title: Taro.onError(callback)
sidebar_label: onError
---

Listens on the Mini Program error event. This event is triggered as a result of script error or failed API call. The callback timing and parameters of this event are consistent with those of [`App.onError`](https://developers.weixin.qq.com/miniprogram/en/dev/reference/api/App.html#onerrorstring-error).


> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/app/app-event/wx.onError.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the Mini Program error event.

```tsx
(error: string) => void
```

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
      <td>error</td>
      <td><code>string</code></td>
      <td>Error message, including stacks.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onError | ✔️ |  |  |
