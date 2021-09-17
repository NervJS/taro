---
title: Taro.removeStorageSync(key)
sidebar_label: removeStorageSync
---

The synchronous version of `Taro.removeStorage`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/storage/wx.removeStorageSync.html)

## Type

```tsx
{ (key: string): void; (key: string): void; }
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

### Example 1

```tsx
try {
  Taro.removeStorageSync('key')
} catch (e) {
  // Do something when catch error
}
```

### Example 2

```tsx
Taro.removeStorage({
  key: 'key',
  success: function (res) {
    console.log(res)
  }
})
```

```tsx
try {
  Taro.removeStorageSync('key')
} catch (e) {
  // Do something when catch error
}
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.removeStorageSync | ✔️ | ✔️ |  |
