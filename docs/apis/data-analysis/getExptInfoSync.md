---
title: Taro.getExptInfoSync(keys)
sidebar_label: getExptInfoSync
---

给定实验参数数组，获取对应的实验参数值

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.getExptInfoSync.html)

## 类型

```tsx
(keys?: string[]) => TaroGeneral.IAnyObject
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| keys | `string[]` | 实验参数数组，不填则获取所有实验参数 |

## 示例代码

```tsx
Taro.getExptInfoSync(['color'])
```
