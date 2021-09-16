---
title: Taro.getStorageSync(key)
sidebar_label: getStorageSync
---

The synchronous version of `Taro.getStorage`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/storage/wx.getStorageSync.html)

## Type

```tsx
(key: string) => any
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
  </tbody>
</table>

## Sample Code

```tsx
Taro.getStorage({
  key: 'key',
  success: function (res) {
    console.log(res.data)
  }
})
```

```tsx
try {
  var value = Taro.getStorageSync('key')
  if (value) {
    // Do something with return value
  }
} catch (e) {
  // Do something when catch error
}
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getStorageSync | ✔️ | ✔️ |  |
