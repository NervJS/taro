---
title: Taro.setStorage(option)
sidebar_label: setStorage
---

Stores data in the specified key in the local cache. This operation will overwrite the original content of the key. The data storage lifecycle is consistent with the Mini Program, that is, data is always available unless manually deleted by the user or automatically deleted after a certain period of time. The maximum size of data stored in a single key is 1 MB, and the total size for data storage is limited to 10 MB.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/storage/wx.setStorage.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><code>any</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Contents to be stored can only be native types, dates, and objects that can be serialized via <code>JSON.stringify</code>.</td>
    </tr>
    <tr>
      <td>key</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The specified key in the local cache</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.setStorage({
  key:"key",
  data:"value"
})
```
```tsx
try {
  Taro.setStorageSync('key', 'value')
} catch (e) { }
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setStorage | ✔️ | ✔️ | ✔️ |
