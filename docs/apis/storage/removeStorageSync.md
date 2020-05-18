---
title: Taro.removeStorageSync(key)
sidebar_label: removeStorageSync
---

从本地缓存中同步移除指定 key 。
Taro.removeStorage 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorageSync.html)

## 类型

```tsx
{ (key: string): void; (key: string): void; }
```

## 参数

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
      <td>key</td>
      <td><code>string</code></td>
      <td>本地缓存中指定的 key</td>
    </tr>
  </tbody>
</table>

## 示例代码

### 示例 1

```tsx
try {
  Taro.removeStorageSync('key')
} catch (e) {
  // Do something when catch error
}
```

### 示例 2

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

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.removeStorageSync | ✔️ | ✔️ |  |
