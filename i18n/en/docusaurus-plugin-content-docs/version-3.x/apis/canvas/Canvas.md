---
title: Canvas
sidebar_label: Canvas
---

The canvas instance, which can be obtained via `SelectorQuery`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/Canvas.html)

## Methods

### cancelAnimationFrame

Cancels the animation frame request added to the plan by requestAnimationFrame (only supported in WebGL).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/Canvas.cancelAnimationFrame.html)

```tsx
(requestID: number) => void
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
      <td>requestID</td>
      <td><code>number</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.cancelAnimationFrame | ✔️ |  |  |

### createImageData

Creates an ImageData object. Only supported for use in 2D Canvas.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.createImageData.html)

```tsx
() => ImageData
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.createImageData | ✔️ |  |  |

### createImage

Creates an image object. Supports use in 2D Canvas and WebGL Canvas, but does not support mixing 2D and WebGL methods.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/Canvas.createImage.html)

```tsx
() => Image
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.createImage | ✔️ |  |  |

### getContext

Returns the Canvas drawing context.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/Canvas.getContext.html)

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
| Canvas.getContext | ✔️ |  |  |

### requestAnimationFrame

Executed upon the next redrawing (only supported in WebGL).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/Canvas.requestAnimationFrame.html)

```tsx
(callback: (...args: any[]) => any) => number
```

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
      <td>callback</td>
      <td><code>(...args: any[]) =&gt; any</code></td>
      <td>执行的 callback</td>
    </tr>
  </tbody>
</table>

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.requestAnimationFrame | ✔️ |  |  |

## API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.cancelAnimationFrame | ✔️ |  |  |
| Canvas.createImageData | ✔️ |  |  |
| Canvas.createImage | ✔️ |  |  |
| Canvas.getContext | ✔️ |  |  |
| Canvas.requestAnimationFrame | ✔️ |  |  |
