---
title: Taro.getStorageSync(key)
sidebar_label: getStorageSync
---

Taro.getStorage 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageSync.html)

## 类型

```tsx
<T = any>(key: string) => T
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| key | `T` | 本地缓存中指定的 key |

## 示例代码

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
