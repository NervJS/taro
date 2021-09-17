---
title: Taro.onPageNotFound(callback)
sidebar_label: onPageNotFound
---

Listens on the event that a page to be opened by the Mini Program does not exist. The callback timing for this event is consistent with that of [`App.onPageNotFound`](https://developers.weixin.qq.com/miniprogram/en/dev/reference/api/App.html#onpagenotfoundobject-object).

**NOTE**

- Developers can implement page redirection during callback only when the callback processing is synchronous. This approach is invalid for asynchronous processing (such as the asynchronous execution of setTimeout).
- If the developer neither calls the [Taro.onPageNotFound](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/app/app-event/wx.onPageNotFound.html) for listening nor declares App.onPageNotFound, when the redirected page does not exist, the WeChat app's native 404 page is pushed.
- If the callback redirects to another page that does not exist, the WeChat app's native 404 page is pushed and the API is not called back again.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/app/app-event/wx.onPageNotFound.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Result

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
      <td>isEntryPage</td>
      <td><code>boolean</code></td>
      <td>Indicates whether this is the first page for this launch (for example, from sharing and other entries, the first page is the shared page configured by the developer).</td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td>The path to the nonexistent page</td>
    </tr>
    <tr>
      <td>query</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The query parameter for the nonexistent page</td>
    </tr>
  </tbody>
</table>

### Callback

The callback function for the event that a page to be opened by the Mini Program does not exist.

```tsx
(res: Result) => void
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
      <td><code>Result</code></td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onPageNotFound | ✔️ |  |  |
