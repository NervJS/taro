---
title: Taro.createMapContext(mapId, component)
sidebar_label: createMapContext
---

Creates the [MapContext](https://developers.weixin.qq.com/miniprogram/en/dev/api/map/MapContext.html) object for the [map](https://developers.weixin.qq.com/miniprogram/en/dev/component/map.html).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/map/wx.createMapContext.html)

## Type

```tsx
(mapId: string, component?: Record<string, any>) => MapContext
```

## Parameters

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>mapId</td>
      <td><code>string</code></td>
      <td>ID of the &lt;map/&gt; component</td>
    </tr>
    <tr>
      <td>component</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>Under custom components, current component instance "this" operates the &lt;map/&gt; component</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
const mapCtx = Taro.createMapContext('myMap')
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createMapContext | ✔️ |  |  |
