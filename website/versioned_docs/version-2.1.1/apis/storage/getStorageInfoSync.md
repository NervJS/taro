---
title: Taro.getStorageInfoSync()
sidebar_label: getStorageInfoSync
id: version-2.1.1-getStorageInfoSync
original_id: getStorageInfoSync
---

Taro.getStorageInfo 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageInfoSync.html)

## 类型

```tsx
() => Option
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>currentSize</td>
      <td><code>number</code></td>
      <td>当前占用的空间大小, 单位 KB</td>
    </tr>
    <tr>
      <td>keys</td>
      <td><code>string[]</code></td>
      <td>当前 storage 中所有的 key</td>
    </tr>
    <tr>
      <td>limitSize</td>
      <td><code>number</code></td>
      <td>限制的空间大小，单位 KB</td>
    </tr>
  </tbody>
</table>

## 示例代码

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

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getStorageInfoSync | ✔️ | ✔️ |  |
