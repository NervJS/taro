---
title: Taro.getStorageSync(key)
sidebar_label: getStorageSync
id: version-1.3.37-getStorageSync
original_id: getStorageSync
---

Taro.getStorage 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageSync.html)

## 类型

```tsx
(key: string) => any
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| key | `string` | 本地缓存中指定的 key |

## 示例代码

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

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getStorageSync | ✔️ | ✔️ |  |
