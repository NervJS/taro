---
title: Taro.reportPerformance(id, value, dimensions)
sidebar_label: reportPerformance
---

小程序测速上报。使用前，需要在小程序管理后台配置。 详情参见[小程序测速](https://developers.weixin.qq.com/miniprogram/dev/framework/performanceReport/index.html)指南。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/wx.reportPerformance.html)

## 类型

```tsx
(id: number, value: number, dimensions?: string | string[]) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | `number` | 指标 id |
| value | `number` | 需要上报的数值 |
| dimensions | string or string[] | 自定义维度 |

## 示例代码

```tsx
Taro.reportPerformance(1101, 680)
Taro.reportPerformance(1101, 680, 'custom')
```
