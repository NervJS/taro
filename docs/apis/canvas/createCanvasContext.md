---
title: Taro.createCanvasContext(canvasId, component)
sidebar_label: createCanvasContext
---

创建 canvas 的绘图上下文 [CanvasContext](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.html) 对象

**Tip**: 需要指定 canvasId，该绘图上下文只作用于对应的 `<canvas/>`

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.createCanvasContext.html)

## 类型

```tsx
(canvasId: string, component?: Record<string, any>) => CanvasContext
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
      <td>canvasId</td>
      <td><code>string</code></td>
      <td>要获取上下文的 <a href="https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html">canvas</a> 组件 canvas-id 属性</td>
    </tr>
    <tr>
      <td>component</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>在自定义组件下，当前组件实例的this，表示在这个自定义组件下查找拥有 canvas-id 的 <a href="https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html">canvas</a> ，如果省略则不在任何自定义组件内查找</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createCanvasContext | ✔️ | ✔️ |  |
