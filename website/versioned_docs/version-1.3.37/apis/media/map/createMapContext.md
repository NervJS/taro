---
title: Taro.createMapContext(mapId, component)
sidebar_label: createMapContext
id: version-1.3.37-createMapContext
original_id: createMapContext
---

创建 [map](https://developers.weixin.qq.com/miniprogram/dev/component/map.html) 上下文 [MapContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.html) 对象。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/wx.createMapContext.html)

## 类型

```tsx
(mapId: string, component?: Record<string, any>) => MapContext
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| mapId | `string` | Map 组件的 id |
| component | `Record<string, any>` | 在自定义组件下，当前组件实例的this，以操作组件内 Map 组件 |

## 示例代码

```tsx
const mapCtx = Taro.createMapContext('myMap')
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createMapContext | ✔️ |  |  |
