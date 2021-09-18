---
title: Taro.getStorageInfoSync()
sidebar_label: getStorageInfoSync
---

The synchronous version of `Taro.getStorageInfo`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/storage/wx.getStorageInfoSync.html)

## Type

```tsx
() => Option
```

## Parameters

### Option

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
      <td>currentSize</td>
      <td><code>number</code></td>
      <td>Current space occupied (in KB)</td>
    </tr>
    <tr>
      <td>keys</td>
      <td><code>string[]</code></td>
      <td>All keys in the current storage</td>
    </tr>
    <tr>
      <td>limitSize</td>
      <td><code>number</code></td>
      <td>Space size limit (in KB)</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.getStorageInfo({
  success: function (res) {
    console.log(res.keys)
    console.log(res.currentSize)
    console.log(res.limitSize)
  }
})
```

```tsx
try {
  const res = Taro.getStorageInfoSync()
  console.log(res.keys)
  console.log(res.currentSize)
  console.log(res.limitSize)
} catch (e) {
  // Do something when catch error
}
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getStorageInfoSync | ✔️ | ✔️ |  |
