---
title: Taro.getExtConfigSync()
sidebar_label: getExtConfigSync
---

Taro.getExtConfig 的同步版本。

**Tips**
1. 本接口暂时无法通过 Taro.canIUse 判断是否兼容，开发者需要自行判断 Taro.getExtConfigSync 是否存在来兼容

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ext/wx.getExtConfigSync.html)

## 类型

```tsx
() => TaroGeneral.IAnyObject
```

## 参数

### ExtInfo

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| extConfig | `TaroGeneral.IAnyObject` | 第三方平台自定义的数据 |

## 示例代码

```tsx
let extConfig = Taro.getExtConfigSync? Taro.getExtConfigSync(): {}

console.log(extConfig)
```
