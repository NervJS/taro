---
title: Canvas
sidebar_label: Canvas
id: version-1.3.37-Canvas
original_id: Canvas
---

Canvas 实例，可通过 SelectorQuery 获取。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.html)

## 方法

### cancelAnimationFrame

取消由 requestAnimationFrame 添加到计划中的动画帧请求。支持在 2D Canvas 和 WebGL Canvas 下使用, 但不支持混用 2D 和 WebGL 的方法。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.cancelAnimationFrame.html)

```tsx
(requestID: number) => void
```

| 参数 | 类型 |
| --- | --- |
| requestID | `number` |

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

| 参数 | 类型 |
| --- | --- |
| contextType | `string` |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(...args: any[]) => any` | 执行的 callback |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.requestAnimationFrame | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas.cancelAnimationFrame | ✔️ |  |  |
| Canvas.createImageData | ✔️ |  |  |
| Canvas.createImage | ✔️ |  |  |
| Canvas.getContext | ✔️ |  |  |
| Canvas.requestAnimationFrame | ✔️ |  |  |
