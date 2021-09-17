---
title: Taro.setStorageSync(key, data)
sidebar_label: setStorageSync
---

The synchronous version of `Taro.setStorage`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/storage/wx.setStorageSync.html)

## Type

```tsx
(key: string, data: any) => void
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
      <td>key</td>
      <td><code>string</code></td>
      <td>The specified key in the local cache</td>
    </tr>
    <tr>
      <td>data</td>
      <td><code>any</code></td>
      <td>Contents to be stored can only be native types, dates, and objects that can be serialized via <code>JSON.stringify</code>.</td>
    </tr>
  </tbody>
</table>

## Sample Code

### Example 1

```tsx
Taro.setStorage({
  key:"key",
  data:"value"
})
```

### Example 2

```tsx
try {
  Taro.setStorageSync('key', 'value')
} catch (e) { }
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setStorageSync | ✔️ | ✔️ |  |
