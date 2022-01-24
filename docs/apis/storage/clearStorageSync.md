---
title: Taro.clearStorageSync()
sidebar_label: clearStorageSync
---

Taro.clearStorage 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorageSync.html)

## 类型

```tsx
() => void
```

## 参数

## 示例代码

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
