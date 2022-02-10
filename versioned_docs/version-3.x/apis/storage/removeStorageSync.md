---
title: Taro.removeStorageSync(key)
sidebar_label: removeStorageSync
---

从本地缓存中同步移除指定 key 。
Taro.removeStorage 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorageSync.html)

## 类型

```tsx
{ (key: string): void; (key: string): void; }
```

## 参数

| 参数 | 类型 |
| --- | --- |
| key | `string` |

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
