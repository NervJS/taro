---
title: Taro.getStorageInfoSync()
sidebar_label: getStorageInfoSync
---

Taro.getStorageInfo 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

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
try {
  const res = Taro.getStorageInfoSync()
  console.log(res.keys)
  console.log(res.currentSize)
  console.log(res.limitSize)
} catch (e) {
  // Do something when catch error
}
```
