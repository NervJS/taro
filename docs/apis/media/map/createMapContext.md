---
title: Taro.createMapContext(mapId, component)
sidebar_label: createMapContext
---

创建 [map](/docs/components/map) 上下文 [MapContext](/docs/apis/media/map/MapContext) 对象。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/wx.createMapContext.html)

## 类型

```tsx
(mapId: string, component?: TaroGeneral.IAnyObject) => MapContext
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| mapId | `string` | Map 组件的 id |
| component | `TaroGeneral.IAnyObject` | 在自定义组件下，当前组件实例的this，以操作组件内 Map 组件 |

## 示例代码

```tsx
const mapCtx = Taro.createMapContext('myMap')
```
