---
title: OffscreenCanvas
sidebar_label: OffscreenCanvas
id: version-2.1.1-OffscreenCanvas
original_id: OffscreenCanvas
---

离屏 canvas 实例，可通过 Taro.createOffscreenCanvas 创建。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/OffscreenCanvas.html)

## 方法

### getContext

该方法返回 OffscreenCanvas 的绘图上下文

****

当前仅支持获取 WebGL 绘图上下文

```tsx
(contextType: string) => RenderingContext
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>contextType</td>
      <td><code>string</code></td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OffscreenCanvas.getContext | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OffscreenCanvas.getContext | ✔️ |  |  |
