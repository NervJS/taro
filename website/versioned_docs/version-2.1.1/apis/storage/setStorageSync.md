---
title: Taro.setStorageSync(key, data)
sidebar_label: setStorageSync
id: version-2.1.1-setStorageSync
original_id: setStorageSync
---

Taro.setStorage 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html)

## 类型

```tsx
(key: string, data: any) => void
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
    <tr>
      <td>data</td>
      <td><code>any</code></td>
      <td>需要存储的内容。只支持原生类型、Date、及能够通过<code>JSON.stringify</code>序列化的对象。</td>
    </tr>
  </tbody>
</table>

## 示例代码

### 示例 1

```tsx
Taro.setStorage({
  key:"key",
  data:"value"
})
```

### 示例 2

```tsx
try {
  Taro.setStorageSync('key', 'value')
} catch (e) { }
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setStorageSync | ✔️ | ✔️ |  |
