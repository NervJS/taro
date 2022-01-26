---
title: Taro.reportAnalytics(eventName, data)
sidebar_label: reportAnalytics
---

自定义分析数据上报接口。使用前，需要在小程序管理后台自定义分析中新建事件，配置好事件名与字段。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.reportAnalytics.html)

## 类型

```tsx
(eventName: string, data: TaroGeneral.IAnyObject) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| eventName | `string` | 事件名 |
| data | `TaroGeneral.IAnyObject` | 上报的自定义数据，key 为配置中的字段名，value 为上报的数据。 |

## 示例代码

```tsx
Taro.reportAnalytics('purchase', {
  price: 120,
  color: 'red'
})
```
