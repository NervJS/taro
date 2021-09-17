---
title: Taro.createCanvasContext(canvasId, component)
sidebar_label: createCanvasContext
---

Creates a [CanvasContext](./CanvasContext.md) object.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/wx.createCanvasContext.html)

## Type

```tsx
(canvasId: string, component?: Record<string, any>) => CanvasContext
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
      <td>canvasId</td>
      <td><code>string</code></td>
      <td>The canvas-id property of the <code>canvas</code> component whose context needs to be obtained.</td>
    </tr>
    <tr>
      <td>component</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>In a custom component, the "this" of the current component instance means to search for the canvas with the canvas-id in this custom component. If this parameter is not specified, no search is performed in any custom component.</td>
    </tr>
  </tbody>
</table>

## API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createCanvasContext | ✔️ | ✔️ |  |
