---
title: Canvas
sidebar_label: Canvas
---

Canvas 实例，可通过 SelectorQuery 获取。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.html)

## 方法

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
      <td>width</td>
      <td><code>number</code></td>
      <td>画布宽度<br />API 支持度: weapp<br /><a href="https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.html">参考地址</a></td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>画布高度<br />API 支持度: weapp<br /><a href="https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.html">参考地址</a></td>
    </tr>
  </tbody>
</table>

### toDataURL

返回一个包含图片展示的 data URI 。可以使用 type 参数其类型，默认为 PNG 格式。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.toDataURL.html)

```tsx
(type: string, encoderOptions: number) => string
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
      <td>type</td>
      <td><code>string</code></td>
    </tr>
    <tr>
      <td>encoderOptions</td>
      <td><code>number</code></td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.toDataURL | ✔️ |  |  |

### createPath2D

创建 Path2D 对象

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.createPath2D.html)

```tsx
(path: Path2D) => Path2D
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
      <td>path</td>
      <td><code>Path2D</code></td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.createPath2D | ✔️ |  |  |

### cancelAnimationFrame

取消由 requestAnimationFrame 添加到计划中的动画帧请求。支持在 2D Canvas 和 WebGL Canvas 下使用, 但不支持混用 2D 和 WebGL 的方法。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.cancelAnimationFrame.html)

```tsx
(requestID: number) => void
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
      <td>requestID</td>
      <td><code>number</code></td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.cancelAnimationFrame | ✔️ |  |  |

### createImageData

创建一个 ImageData 对象。仅支持在 2D Canvas 中使用。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.createImageData.html)

```tsx
() => ImageData
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.createImageData | ✔️ |  |  |

### createImage

创建一个图片对象。 支持在 2D Canvas 和 WebGL Canvas 下使用, 但不支持混用 2D 和 WebGL 的方法。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.createImage.html)

```tsx
() => Image
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.createImage | ✔️ |  |  |

### getContext

支持获取 2D 和 WebGL 绘图上下文

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.getContext.html)

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
| Canvas.getContext | ✔️ |  |  |

### requestAnimationFrame

在下次进行重绘时执行。 支持在 2D Canvas 和 WebGL Canvas 下使用, 但不支持混用 2D 和 WebGL 的方法。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.requestAnimationFrame.html)

```tsx
(callback: (...args: any[]) => any) => number
```

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
      <td>callback</td>
      <td><code>(...args: any[]) =&gt; any</code></td>
      <td>执行的 callback</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.requestAnimationFrame | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.width | ✔️ |  |  |
| Canvas.height | ✔️ |  |  |
| Canvas.toDataURL | ✔️ |  |  |
| Canvas.createPath2D | ✔️ |  |  |
| Canvas.cancelAnimationFrame | ✔️ |  |  |
| Canvas.createImageData | ✔️ |  |  |
| Canvas.createImage | ✔️ |  |  |
| Canvas.getContext | ✔️ |  |  |
| Canvas.requestAnimationFrame | ✔️ |  |  |
