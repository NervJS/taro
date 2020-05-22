---
title: Taro.createMapContext(mapId, component)
sidebar_label: createMapContext
---

创建 [map](https://developers.weixin.qq.com/miniprogram/dev/component/map.html) 上下文 [MapContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.html) 对象。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/wx.createMapContext.html)

## 类型

```tsx
(mapId: string, component?: Record<string, any>) => MapContext
```

## 参数

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>mapId</td>
      <td><code>string</code></td>
      <td>Map 组件的 id</td>
    </tr>
    <tr>
      <td>component</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>在自定义组件下，当前组件实例的this，以操作组件内 Map 组件</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
const mapCtx = Taro.createMapContext('myMap')
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createMapContext | ✔️ |  |  |
