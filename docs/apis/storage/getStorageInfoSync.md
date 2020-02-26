---
title: Taro.getStorageInfoSync()
sidebar_label: getStorageInfoSync
---

Taro.getStorageInfo 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageInfoSync.html)

## 类型

```tsx
() => Option
```

## 参数

### Option

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| currentSize | `number` | 当前占用的空间大小, 单位 KB |
| keys | `string[]` | 当前 storage 中所有的 key |
| limitSize | `number` | 限制的空间大小，单位 KB |

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
