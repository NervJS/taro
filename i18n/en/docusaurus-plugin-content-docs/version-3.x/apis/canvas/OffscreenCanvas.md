---
title: OffscreenCanvas
sidebar_label: OffscreenCanvas
---

The off-screen canvas instance, which can be created via `Taro.createOffscreenCanvas`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/OffscreenCanvas.html)

## Methods

### getContext

Returns the OffscreenCanvas drawing context.

****

Only WebGL drawing context can be obtained.

```tsx
(contextType: string) => RenderingContext
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>contextType</td>
      <td><code>string</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OffscreenCanvas.getContext | ✔️ |  |  |

## API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OffscreenCanvas.getContext | ✔️ |  |  |
