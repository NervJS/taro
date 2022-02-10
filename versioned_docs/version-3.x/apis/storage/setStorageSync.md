---
title: Taro.setStorageSync(key, data)
sidebar_label: setStorageSync
---

Taro.setStorage 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html)

## 类型

```tsx
(key: string, data: any) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| key | `string` | 本地缓存中指定的 key |
| data | `any` | 需要存储的内容。只支持原生类型、Date、及能够通过`JSON.stringify`序列化的对象。 |

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
