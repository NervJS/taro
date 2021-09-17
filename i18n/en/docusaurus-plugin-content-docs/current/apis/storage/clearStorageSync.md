---
title: Taro.clearStorageSync()
sidebar_label: clearStorageSync
---

The synchronous version of `Taro.clearStorage`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/storage/wx.clearStorageSync.html)

## Type

```tsx
() => void
```

## Parameters

## Sample Code

```tsx
Taro.clearStorage()
```

```tsx
try {
  Taro.clearStorageSync()
} catch(e) {
// Do something when catch error
}
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.clearStorageSync | ✔️ | ✔️ |  |
