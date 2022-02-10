---
title: Taro.reportEvent(eventId, data)
sidebar_label: reportEvent
---

事件上报

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.reportEvent.html)

## 类型

```tsx
(eventId: string, data: TaroGeneral.IAnyObject) => void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| eventId | `string` | 事件名 |
| data | `TaroGeneral.IAnyObject` | 上报的自定义数据，key 为配置中的字段名，value 为上报的数据。 |

## 示例代码

```tsx
Taro.reportEvent('purchase', {
  price: 120,
  color: 'red'
})
```
