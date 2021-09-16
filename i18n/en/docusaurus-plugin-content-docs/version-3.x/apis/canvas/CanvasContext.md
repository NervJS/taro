---
title: CanvasContext
sidebar_label: CanvasContext
---

The drawing context of the canvas component.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.html)

## Methods

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
      <td>fillStyle</td>
      <td><code>string</code></td>
      <td>The fill color, used in the same way as [CanvasContext.setFillStyle()].</td>
    </tr>
    <tr>
      <td>font</td>
      <td><code>string</code></td>
      <td>The current font style. It is a DOMString that conforms to the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/font">CSS font syntax</a>with at least the font size and family passed. The default value is 10px sans-serif.</td>
    </tr>
    <tr>
      <td>globalAlpha</td>
      <td><code>number</code></td>
      <td>The global brush transparency. The value range is 0-1. 0 indicates completely transparent and 1 indicates completely opaque.</td>
    </tr>
    <tr>
      <td>globalCompositeOperation</td>
      <td><code>string</code></td>
      <td>The type of compositing operation applied when drawing a new shape. The Android version only supports merging <code>fill</code> blocks, and <code>source-over</code> is used to merge <code>stroke</code> line segments.<br /><br />The following operations are supported: <br />- Android: xor, source-over, source-atop, destination-out, lighter, overlay, darken, lighten, hard-light<br />- iOS: xor, source-over, source-atop, destination-over, destination-out, lighter, multiply, overlay, darken, lighten, color-dodge, color-burn, hard-light, soft-light, difference, exclusion, saturation, luminosity</td>
    </tr>
    <tr>
      <td>lineCap</td>
      <td><code>&quot;butt&quot; | &quot;round&quot; | &quot;square&quot;</code></td>
      <td>The endpoint style of the line, used in the same way as [CanvasContext.setLineCap()].</td>
    </tr>
    <tr>
      <td>lineDashOffset</td>
      <td><code>number</code></td>
      <td>The dashed line offset, with an initial value of 0.</td>
    </tr>
    <tr>
      <td>lineJoin</td>
      <td><code>&quot;round&quot; | &quot;bevel&quot; | &quot;miter&quot;</code></td>
      <td>The intersection style of the line, used in the same way as [CanvasContext.setLineJoin()]。</td>
    </tr>
    <tr>
      <td>lineWidth</td>
      <td><code>number</code></td>
      <td>The width of the line, used in the same way as [CanvasContext.setLineWidth()]。</td>
    </tr>
    <tr>
      <td>miterLimit</td>
      <td><code>number</code></td>
      <td>The maximum miter length, used in the same ways as [CanvasContext.setMiterLimit()]。</td>
    </tr>
    <tr>
      <td>shadowBlur</td>
      <td><code>number</code></td>
      <td>The fuzziness level of the shadow.</td>
    </tr>
    <tr>
      <td>shadowColor</td>
      <td><code>number</code></td>
      <td>The color of the shadow.</td>
    </tr>
    <tr>
      <td>shadowOffsetX</td>
      <td><code>number</code></td>
      <td>The horizontal offset of the shadow relative to the shape.</td>
    </tr>
    <tr>
      <td>shadowOffsetY</td>
      <td><code>number</code></td>
      <td>The vertical offset of the shadow relative to the shape.</td>
    </tr>
    <tr>
      <td>strokeStyle</td>
      <td><code>string</code></td>
      <td>The border color, used in the same way as [CanvasContext.setFillStyle()]。</td>
    </tr>
  </tbody>
</table>

### arc

Creates an arc.

- To create a circle, specify the start radian as 0 and the end radian as 2 * Math.PI.
- Use the `stroke` or `fill` method to draw an arc in `canvas`.


The three key coordinates for the arc (100, 75, 50, 0, 1.5 * Math.PI) are as follows:

- Green: Center point (100, 75)
- Red: Start radian (0)
- Blue: End radian (1.5 * Math.PI)

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.arc.html)

```tsx
(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise?: boolean) => void
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
      <td>x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the center point.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the center point.</td>
    </tr>
    <tr>
      <td>r</td>
      <td><code>number</code></td>
      <td>The radius of the circle.</td>
    </tr>
    <tr>
      <td>sAngle</td>
      <td><code>number</code></td>
      <td>The start radian (at the 3 o'clock position).</td>
    </tr>
    <tr>
      <td>eAngle</td>
      <td><code>number</code></td>
      <td>The end radian.</td>
    </tr>
    <tr>
      <td>counterclockwise</td>
      <td><code>boolean</code></td>
      <td>Indicates whether the direction of the arc is counterclockwise.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
// Draw coordinates
ctx.arc(100, 75, 50, 0, 2 * Math.PI)
ctx.setFillStyle('#EEEEEE')
ctx.fill()
ctx.beginPath()
ctx.moveTo(40, 75)
ctx.lineTo(160, 75)
ctx.moveTo(100, 15)
ctx.lineTo(100, 135)
ctx.setStrokeStyle('#AAAAAA')
ctx.stroke()
ctx.setFontSize(12)
ctx.setFillStyle('black')
ctx.fillText('0', 165, 78)
ctx.fillText('0.5*PI', 83, 145)
ctx.fillText('1*PI', 15, 78)
ctx.fillText('1.5*PI', 83, 10)
// Draw points
ctx.beginPath()
ctx.arc(100, 75, 2, 0, 2 * Math.PI)
ctx.setFillStyle('lightgreen')
ctx.fill()
ctx.beginPath()
ctx.arc(100, 25, 2, 0, 2 * Math.PI)
ctx.setFillStyle('blue')
ctx.fill()
ctx.beginPath()
ctx.arc(150, 75, 2, 0, 2 * Math.PI)
ctx.setFillStyle('red')
ctx.fill()
// Draw arc
ctx.beginPath()
ctx.arc(100, 75, 50, 0, 1.5 * Math.PI)
ctx.setStrokeStyle('#333333')
ctx.stroke()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.arc | ✔️ |  |  |

### arcTo

Draws an arc path based on control points and radius.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.arcTo.html)

```tsx
(x1: number, y1: number, x2: number, y2: number, radius: number) => void
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
      <td>x1</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the first control point.</td>
    </tr>
    <tr>
      <td>y1</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the first control point.</td>
    </tr>
    <tr>
      <td>x2</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the second control point.</td>
    </tr>
    <tr>
      <td>y2</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the second control point.</td>
    </tr>
    <tr>
      <td>radius</td>
      <td><code>number</code></td>
      <td>The radius of the arc.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.arcTo | ✔️ |  |  |

### beginPath

Starts to create a path. You must call fill or stroke to use the path for `fill` or `stroke` operations.

- At the very beginning, it is equivalent to calling `beginPath` once.
- If there are multiple settings of `setFillStyle`, `setStrokeStyle` and `setLineWidth` in a path, the last one set prevails.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.beginPath.html)

```tsx
() => void
```

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
// begin path
ctx.rect(10, 10, 100, 30)
ctx.setFillStyle('yellow')
ctx.fill()
// begin another path
ctx.beginPath()
ctx.rect(10, 40, 100, 30)
// only fill this rect, not in current path
ctx.setFillStyle('blue')
ctx.fillRect(10, 70, 100, 30)
ctx.rect(10, 100, 100, 30)
// it will fill current path
ctx.setFillStyle('red')
ctx.fill()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.beginPath | ✔️ |  |  |

### bezierCurveTo

Creates a cubic Bézier curve path. The start point of the curve is the previous point in the path.

The three key coordinates for moveTo (20, 20) and bezierCurveTo (20, 100, 200, 100, 200, 20) are as follows:

- Red: Start point (20, 20)
- Blue: Two control points (20, 100) (200, 100)
- Green: End point (200, 20)

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.bezierCurveTo.html)

```tsx
(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void
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
      <td>cp1x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the first Bézier control point.</td>
    </tr>
    <tr>
      <td>cp1y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the first Bézier control point.</td>
    </tr>
    <tr>
      <td>cp2x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the second Bézier control point.</td>
    </tr>
    <tr>
      <td>cp2y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the second Bézier control point.</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the end point.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the end point.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
// Draw points
ctx.beginPath()
ctx.arc(20, 20, 2, 0, 2 * Math.PI)
ctx.setFillStyle('red')
ctx.fill()
ctx.beginPath()
ctx.arc(200, 20, 2, 0, 2 * Math.PI)
ctx.setFillStyle('lightgreen')
ctx.fill()
ctx.beginPath()
ctx.arc(20, 100, 2, 0, 2 * Math.PI)
ctx.arc(200, 100, 2, 0, 2 * Math.PI)
ctx.setFillStyle('blue')
ctx.fill()
ctx.setFillStyle('black')
ctx.setFontSize(12)
// Draw guides
ctx.beginPath()
ctx.moveTo(20, 20)
ctx.lineTo(20, 100)
ctx.lineTo(150, 75)
ctx.moveTo(200, 20)
ctx.lineTo(200, 100)
ctx.lineTo(70, 75)
ctx.setStrokeStyle('#AAAAAA')
ctx.stroke()
// Draw quadratic curve
ctx.beginPath()
ctx.moveTo(20, 20)
ctx.bezierCurveTo(20, 100, 200, 100, 200, 20)
ctx.setStrokeStyle('black')
ctx.stroke()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.bezierCurveTo | ✔️ |  |  |

### clearRect

Clears the content in the specified rectangular area on the canvas.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.clearRect.html)

```tsx
(x: number, y: number, width: number, height: number) => void
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
      <td>x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the top-left corner of the rectangular path.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the top-left corner of the rectangular path.</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>The width of the rectangular path.</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>The height of the rectangular path.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

Instead of drawing a white rectangle over the selected area, the clearRect operation clears the content in this rectangle. The following example adds a layer of background color to the canvas for demonstration purposes.

```html
<canvas canvas-id="myCanvas" style="border: 1px solid; background: #123456;"/>
```
```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFillStyle('red')
ctx.fillRect(0, 0, 150, 200)
ctx.setFillStyle('blue')
ctx.fillRect(150, 0, 150, 200)
ctx.clearRect(10, 10, 150, 75)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.clearRect | ✔️ |  |  |

### clip

Cuts an area of any size and shape from the original canvas. Once an area has been cut, all subsequent drawings are limited to the cut area (the other areas of the canvas cannot be accessed). You can use the save method to save the current canvas area before using the `clip` method. Then, you can use the `restore` method to restore the canvas at any later time.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.clip.html)

```tsx
() => void
```

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
Taro.downloadFile({
  url: 'https://is5.mzstatic.com/image/thumb/Purple128/v4/75/3b/90/753b907c-b7fb-5877-215a-759bd73691a4/source/50x50bb.jpg',
  success: function(res) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(50, 50, 25, 0, 2*Math.PI)
    ctx.clip()
    ctx.drawImage(res.tempFilePath, 25, 25)
    ctx.restore()
    ctx.draw()
  }
})
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.clip | ✔️ |  |  |

### closePath

Closes a path by connecting the start and end points. If you do not call `fill` or `stroke` and start a new path after closing the path, the previous path will not be rendered.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.closePath.html)

```tsx
() => void
```

#### Sample Code

##### Example 1

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.moveTo(10, 10)
ctx.lineTo(100, 10)
ctx.lineTo(100, 100)
ctx.closePath()
ctx.stroke()
ctx.draw()
```

##### Example 2

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
// begin path
ctx.rect(10, 10, 100, 30)
ctx.closePath()
// begin another path
ctx.beginPath()
ctx.rect(10, 40, 100, 30)
// only fill this rect, not in current path
ctx.setFillStyle('blue')
ctx.fillRect(10, 70, 100, 30)
ctx.rect(10, 100, 100, 30)
// it will fill current path
ctx.setFillStyle('red')
ctx.fill()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.closePath | ✔️ |  |  |

### createPattern

Creates a pattern for the specified image. It can repeat the image in the specified direction.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.createPattern.html)

```tsx
(image: string, repetition: "repeat" | "repeat-x" | "repeat-y" | "no-repeat") => void
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
      <td>image</td>
      <td><code>string</code></td>
      <td>The source of the repeated image. Only in-package paths and temporary paths are supported.</td>
    </tr>
    <tr>
      <td>repetition</td>
      <td><code>&quot;repeat&quot; | &quot;repeat-x&quot; | &quot;repeat-y&quot; | &quot;no-repeat&quot;</code></td>
      <td>Indicates how to repeat the image.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.createPattern | ✔️ |  |  |

### draw

Draws the objects (path, transformation, and style) previously described in the drawing context to the canvas.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.draw.html)

```tsx
(reserve?: boolean, callback?: (...args: any[]) => any) => void
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
      <td>reserve</td>
      <td><code>boolean</code></td>
      <td>Indicates whether this drawing follows the previous drawing. If the reserve parameter is false (default), the native layer clears the canvas before drawing the content of this call. If the reserve parameter is true, the content on the current canvas is retained and the content of the drawCanvas call is drawn over it.</td>
    </tr>
    <tr>
      <td>callback</td>
      <td><code>(...args: any[]) =&gt; any</code></td>
      <td>The callback function executed after the drawing is completed.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

##### Example 1

If the reserve parameter for the second draw() is true, the content drawn by the previous operation is retained. In the context settings, the fillStyle value 'red' changes to the default value 'black'.

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFillStyle('red')
ctx.fillRect(10, 10, 150, 100)
ctx.draw()
ctx.fillRect(50, 50, 150, 100)
ctx.draw(true)
```

##### Example 2

If the reserve parameter for the second draw() is false, the content drawn by the previous operation is not retained. In the context settings, the fillStyle value is still 'red'.

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFillStyle('red')
ctx.fillRect(10, 10, 150, 100)
ctx.draw()
ctx.fillRect(50, 50, 150, 100)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.draw | ✔️ |  |  |

### drawImage

Draws an image to the canvas.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.drawImage.html)

```tsx
{ (imageResource: string, dx: number, dy: number): void; (imageResource: string, dx: number, dy: number, dWidth: number, dHeight: number): void; (imageResource: string, sx: number, sy: number, sWidth: number, sHeight: number, dx: number, dy: number, dWidth: number, dHeight: number): void; }
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
      <td>imageResource</td>
      <td><code>string</code></td>
      <td>The source of the image to draw.</td>
    </tr>
    <tr>
      <td>sx</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the top-left corner of the source image's rectangular selection box.</td>
    </tr>
    <tr>
      <td>sy</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the top-left corner of the source image's rectangular selection box.</td>
    </tr>
    <tr>
      <td>sWidth</td>
      <td><code>number</code></td>
      <td>The width of the source image's rectangular selection box.</td>
    </tr>
    <tr>
      <td>sHeight</td>
      <td><code>number</code></td>
      <td>The height of the source image's rectangular selection box.</td>
    </tr>
    <tr>
      <td>dx</td>
      <td><code>number</code></td>
      <td>The x-axis position of the image's top-left corner on the destination canvas.</td>
    </tr>
    <tr>
      <td>dy</td>
      <td><code>number</code></td>
      <td>The y-axis position of the image's top-left corner on the destination canvas.</td>
    </tr>
    <tr>
      <td>dWidth</td>
      <td><code>number</code></td>
      <td>The width of the image drawn on the canvas. The drawn image can be zoomed in/out.</td>
    </tr>
    <tr>
      <td>dHeight</td>
      <td><code>number</code></td>
      <td>The height of the image drawn on the canvas. The drawn image can be zoomed in/out.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

The code can be written in three ways:

- drawImage(imageResource, dx, dy)
- drawImage(imageResource, dx, dy, dWidth, dHeight)
- drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) (supported as of 1.9.0)

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
Taro.chooseImage({
  success: function(res){
    ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
    ctx.draw()
  }
})
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.drawImage | ✔️ |  |  |

### fill

Fills the content in the current path. The default fill color is black.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.fill.html)

```tsx
() => void
```

#### Sample Code

##### Example 1

If the current path is not closed, the fill() method connects the start and end points and then fills the path.

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.moveTo(10, 10)
ctx.lineTo(100, 10)
ctx.lineTo(100, 100)
ctx.fill()
ctx.draw()
```

##### Example 2

The path filled via `fill()` is calculated starting from `beginPath()`, and `fillRect()` is not included.

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
// begin path
ctx.rect(10, 10, 100, 30)
ctx.setFillStyle('yellow')
ctx.fill()
// begin another path
ctx.beginPath()
ctx.rect(10, 40, 100, 30)
// only fill this rect, not in current path
ctx.setFillStyle('blue')
ctx.fillRect(10, 70, 100, 30)
ctx.rect(10, 100, 100, 30)
// it will fill current path
ctx.setFillStyle('red')
ctx.fill()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.fill | ✔️ |  |  |

### fillRect

Fills a rectangle. Use [`setFillStyle`](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setFillStyle.html) to set the fill color, which is black by default.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.fillRect.html)

```tsx
(x: number, y: number, width: number, height: number) => void
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
      <td>x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the top-left corner of the rectangular path.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the top-left corner of the rectangular path.</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>The width of the rectangular path.</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>The height of the rectangular path.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFillStyle('red')
ctx.fillRect(10, 10, 150, 75)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.fillRect | ✔️ |  |  |

### fillText

Draws filled text on the canvas.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.fillText.html)

```tsx
(text: string, x: number, y: number, maxWidth?: number) => void
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
      <td>text</td>
      <td><code>string</code></td>
      <td>The text output on the canvas.</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the top-left corner of the text to be drawn.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the top-left corner of the text to be drawn.</td>
    </tr>
    <tr>
      <td>maxWidth</td>
      <td><code>number</code></td>
      <td>The maximum width of the drawing (optional).</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFontSize(20)
ctx.fillText('Hello', 20, 20)
ctx.fillText('MINA', 100, 100)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.fillText | ✔️ |  |  |

### lineTo

Adds a new point and then creates a line from the last specified point to the target point. Use the `stroke` method to draw a line.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.lineTo.html)

```tsx
(x: number, y: number) => void
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
      <td>x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the destination location.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the destination location.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.moveTo(10, 10)
ctx.rect(10, 10, 100, 50)
ctx.lineTo(110, 60)
ctx.stroke()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.lineTo | ✔️ |  |  |

### moveTo

Moves the path to the specified point on the canvas without creating lines. Use the `stroke` method to draw lines.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.moveTo.html)

```tsx
(x: number, y: number) => void
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
      <td>x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the destination location.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the destination location.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.moveTo(10, 10)
ctx.lineTo(100, 10)
ctx.moveTo(10, 50)
ctx.lineTo(100, 50)
ctx.stroke()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.moveTo | ✔️ |  |  |

### quadraticCurveTo

Creates a quadratic Bézier curve path. The start point of the curve is the previous point in the path.

The three key coordinates for moveTo(20, 20) and quadraticCurveTo(20, 100, 200, 20) are as follows:

- Red: Start point (20, 20)
- Blue: Control point (20, 100)
- Green: End point (200, 20)

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.quadraticCurveTo.html)

```tsx
(cpx: number, cpy: number, x: number, y: number) => void
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
      <td>cpx</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the Bézier control point.</td>
    </tr>
    <tr>
      <td>cpy</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the Bézier control point.</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the end point.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the end point.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
// Draw points
ctx.beginPath()
ctx.arc(20, 20, 2, 0, 2 * Math.PI)
ctx.setFillStyle('red')
ctx.fill()
ctx.beginPath()
ctx.arc(200, 20, 2, 0, 2 * Math.PI)
ctx.setFillStyle('lightgreen')
ctx.fill()
ctx.beginPath()
ctx.arc(20, 100, 2, 0, 2 * Math.PI)
ctx.setFillStyle('blue')
ctx.fill()
ctx.setFillStyle('black')
ctx.setFontSize(12)
// Draw guides
ctx.beginPath()
ctx.moveTo(20, 20)
ctx.lineTo(20, 100)
ctx.lineTo(200, 20)
ctx.setStrokeStyle('#AAAAAA')
ctx.stroke()
// Draw quadratic curve
ctx.beginPath()
ctx.moveTo(20, 20)
ctx.quadraticCurveTo(20, 100, 200, 20)
ctx.setStrokeStyle('black')
ctx.stroke()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.quadraticCurveTo | ✔️ |  |  |

### rect

Creates a rectangular path. You must use the `fill` or `stroke` method to actually draw the rectangle to the `canvas`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.rect.html)

```tsx
(x: number, y: number, width: number, height: number) => void
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
      <td>x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the top-left corner of the rectangular path.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the top-left corner of the rectangular path.</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>The width of the rectangular path.</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>The height of the rectangular path.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.rect(10, 10, 150, 75)
ctx.setFillStyle('red')
ctx.fill()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.rect | ✔️ |  |  |

### restore

Restores a drawing context that is previously saved.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.restore.html)

```tsx
() => void
```

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
// save the default fill style
ctx.save()
ctx.setFillStyle('red')
ctx.fillRect(10, 10, 150, 100)
// restore to the previous saved state
ctx.restore()
ctx.fillRect(50, 50, 150, 100)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.restore | ✔️ |  |  |

### rotate

Rotates the current axis clockwise around the origin point. The rotation angles of multiple calls will be superimposed. The origin point can be modified using the `translate` method.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.rotate.html)

```tsx
(rotate: number) => void
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
      <td>rotate</td>
      <td><code>number</code></td>
      <td>The rotation angle in radians (degrees * Math.PI/180; degrees: 0-360).</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.strokeRect(100, 10, 150, 100)
ctx.rotate(20 * Math.PI / 180)
ctx.strokeRect(100, 10, 150, 100)
ctx.rotate(20 * Math.PI / 180)
ctx.strokeRect(100, 10, 150, 100)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.rotate | ✔️ |  |  |

### save

Saves the drawing context.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.save.html)

```tsx
() => void
```

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
// save the default fill style
ctx.save()
ctx.setFillStyle('red')
ctx.fillRect(10, 10, 150, 100)
// restore to the previous saved state
ctx.restore()
ctx.fillRect(50, 50, 150, 100)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.save | ✔️ |  |  |

### scale

Zooms in/out the x- and y- coordinates of the path created after the call. The scales in multiple calls are multiplied.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.scale.html)

```tsx
(scaleWidth: number, scaleHeight: number) => void
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
      <td>scaleWidth</td>
      <td><code>number</code></td>
      <td>The scale for horizontal coordinate zoom (1 = 100%, 0.5 = 50%, 2 = 200%).</td>
    </tr>
    <tr>
      <td>scaleHeight</td>
      <td><code>number</code></td>
      <td>The scale for vertical coordinate zoom (1 = 100%, 0.5 = 50%, 2 = 200%).</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.strokeRect(10, 10, 25, 15)
ctx.scale(2, 2)
ctx.strokeRect(10, 10, 25, 15)
ctx.scale(2, 2)
ctx.strokeRect(10, 10, 25, 15)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.scale | ✔️ |  |  |

### setFillStyle

Sets the fill color.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setFillStyle.html)

```tsx
(color: string | CanvasGradient) => void
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
      <td>color</td>
      <td><code>string | CanvasGradient</code></td>
      <td>The fill color. The default color is black.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFillStyle('red')
ctx.fillRect(10, 10, 150, 75)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setFillStyle | ✔️ |  |  |

### setFontSize

Sets the font size.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setFontSize.html)

```tsx
(fontSize: number) => void
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
      <td>fontSize</td>
      <td><code>number</code></td>
      <td>The font size.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFontSize(20)
ctx.fillText('20', 20, 20)
ctx.setFontSize(30)
ctx.fillText('30', 40, 40)
ctx.setFontSize(40)
ctx.fillText('40', 60, 60)
ctx.setFontSize(50)
ctx.fillText('50', 90, 90)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setFontSize | ✔️ |  |  |

### setGlobalAlpha

Sets the global brush transparency.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setGlobalAlpha.html)

```tsx
(alpha: number) => void
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
      <td>alpha</td>
      <td><code>number</code></td>
      <td>The transparency. The value range is 0-1. 0 indicates completely transparent and 1 indicates completely opaque.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFillStyle('red')
ctx.fillRect(10, 10, 150, 100)
ctx.setGlobalAlpha(0.2)
ctx.setFillStyle('blue')
ctx.fillRect(50, 50, 150, 100)
ctx.setFillStyle('yellow')
ctx.fillRect(100, 100, 150, 100)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setGlobalAlpha | ✔️ |  |  |

### setLineCap

Sets the endpoint style of the line.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setLineCap.html)

```tsx
(lineCap: "butt" | "round" | "square") => void
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
      <td>lineCap</td>
      <td><code>&quot;butt&quot; | &quot;round&quot; | &quot;square&quot;</code></td>
      <td>The endpoint style of the line.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.beginPath()
ctx.moveTo(10, 10)
ctx.lineTo(150, 10)
ctx.stroke()
ctx.beginPath()
ctx.setLineCap('butt')
ctx.setLineWidth(10)
ctx.moveTo(10, 30)
ctx.lineTo(150, 30)
ctx.stroke()
ctx.beginPath()
ctx.setLineCap('round')
ctx.setLineWidth(10)
ctx.moveTo(10, 50)
ctx.lineTo(150, 50)
ctx.stroke()
ctx.beginPath()
ctx.setLineCap('square')
ctx.setLineWidth(10)
ctx.moveTo(10, 70)
ctx.lineTo(150, 70)
ctx.stroke()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setLineCap | ✔️ |  |  |

### setLineDash

Sets the dashed line style.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setLineDash.html)

```tsx
(pattern: number[], offset: number) => void
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
      <td>pattern</td>
      <td><code>number[]</code></td>
      <td>A set of numbers describing the length and spacing of the line segments (unit: coordinate space)</td>
    </tr>
    <tr>
      <td>offset</td>
      <td><code>number</code></td>
      <td>The dashed line offset.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setLineDash([10, 20], 5);
ctx.beginPath();
ctx.moveTo(0,100);
ctx.lineTo(400, 100);
ctx.stroke();
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setLineDash | ✔️ |  |  |

### setLineJoin

Sets the intersection style of the line.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setLineJoin.html)

```tsx
(lineJoin: "round" | "bevel" | "miter") => void
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
      <td>lineJoin</td>
      <td><code>&quot;round&quot; | &quot;bevel&quot; | &quot;miter&quot;</code></td>
      <td>The intersection style of the line.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.beginPath()
ctx.moveTo(10, 10)
ctx.lineTo(100, 50)
ctx.lineTo(10, 90)
ctx.stroke()
ctx.beginPath()
ctx.setLineJoin('bevel')
ctx.setLineWidth(10)
ctx.moveTo(50, 10)
ctx.lineTo(140, 50)
ctx.lineTo(50, 90)
ctx.stroke()
ctx.beginPath()
ctx.setLineJoin('round')
ctx.setLineWidth(10)
ctx.moveTo(90, 10)
ctx.lineTo(180, 50)
ctx.lineTo(90, 90)
ctx.stroke()
ctx.beginPath()
ctx.setLineJoin('miter')
ctx.setLineWidth(10)
ctx.moveTo(130, 10)
ctx.lineTo(220, 50)
ctx.lineTo(130, 90)
ctx.stroke()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setLineJoin | ✔️ |  |  |

### setLineWidth

Sets the width of the line.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setLineWidth.html)

```tsx
(lineWidth: number) => void
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
      <td>lineWidth</td>
      <td><code>number</code></td>
      <td>The witdth of the line in pixels.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.beginPath()
ctx.moveTo(10, 10)
ctx.lineTo(150, 10)
ctx.stroke()
ctx.beginPath()
ctx.setLineWidth(5)
ctx.moveTo(10, 30)
ctx.lineTo(150, 30)
ctx.stroke()
ctx.beginPath()
ctx.setLineWidth(10)
ctx.moveTo(10, 50)
ctx.lineTo(150, 50)
ctx.stroke()
ctx.beginPath()
ctx.setLineWidth(15)
ctx.moveTo(10, 70)
ctx.lineTo(150, 70)
ctx.stroke()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setLineWidth | ✔️ |  |  |

### setMiterLimit

Sets the maximum miter length. The miter length is the distance between the inner corner and outer corner at the intersection of two lines. This value is valid when `CanvasContext.setLineJoin()` is set to miter. When the maximum miter length is exceeded, the lineJoin at the intersection takes the value of bevel.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setMiterLimit.html)

```tsx
(miterLimit: number) => void
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
      <td>miterLimit</td>
      <td><code>number</code></td>
      <td>The maximum miter length.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.beginPath()
ctx.setLineWidth(10)
ctx.setLineJoin('miter')
ctx.setMiterLimit(1)
ctx.moveTo(10, 10)
ctx.lineTo(100, 50)
ctx.lineTo(10, 90)
ctx.stroke()
ctx.beginPath()
ctx.setLineWidth(10)
ctx.setLineJoin('miter')
ctx.setMiterLimit(2)
ctx.moveTo(50, 10)
ctx.lineTo(140, 50)
ctx.lineTo(50, 90)
ctx.stroke()
ctx.beginPath()
ctx.setLineWidth(10)
ctx.setLineJoin('miter')
ctx.setMiterLimit(3)
ctx.moveTo(90, 10)
ctx.lineTo(180, 50)
ctx.lineTo(90, 90)
ctx.stroke()
ctx.beginPath()
ctx.setLineWidth(10)
ctx.setLineJoin('miter')
ctx.setMiterLimit(4)
ctx.moveTo(130, 10)
ctx.lineTo(220, 50)
ctx.lineTo(130, 90)
ctx.stroke()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setMiterLimit | ✔️ |  |  |

### setShadow

Sets the shadow style.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setShadow.html)

```tsx
(offsetX: number, offsetY: number, blur: number, color: string) => void
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
      <td>offsetX</td>
      <td><code>number</code></td>
      <td>The horizontal offset of the shadow relative to the shape. The default value is 0.</td>
    </tr>
    <tr>
      <td>offsetY</td>
      <td><code>number</code></td>
      <td>The vertical offset of the shadow relative to the shape. The default value is 0.</td>
    </tr>
    <tr>
      <td>blur</td>
      <td><code>number</code></td>
      <td>The fuzziness level of the shadow. Higher values indicate greater fuzziness. The value range is 0-100 and the default value is 0.</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td>The color of the shadow. The default value is black.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFillStyle('red')
ctx.setShadow(10, 50, 50, 'blue')
ctx.fillRect(10, 10, 150, 75)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setShadow | ✔️ |  |  |

### setStrokeStyle

Sets the border color.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setStrokeStyle.html)

```tsx
(color: string | CanvasGradient) => void
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
      <td>color</td>
      <td><code>string | CanvasGradient</code></td>
      <td>The border color. The default color is black.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setStrokeStyle('red')
ctx.strokeRect(10, 10, 150, 75)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setStrokeStyle | ✔️ |  |  |

### setTextAlign

Sets the text alignment.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setTextAlign.html)

```tsx
(align: "left" | "center" | "right") => void
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
      <td>align</td>
      <td><code>&quot;left&quot; | &quot;center&quot; | &quot;right&quot;</code></td>
      <td>The text alignment method.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setStrokeStyle('red')
ctx.moveTo(150, 20)
ctx.lineTo(150, 170)
ctx.stroke()
ctx.setFontSize(15)
ctx.setTextAlign('left')
ctx.fillText('textAlign=left', 150, 60)
ctx.setTextAlign('center')
ctx.fillText('textAlign=center', 150, 80)
ctx.setTextAlign('right')
ctx.fillText('textAlign=right', 150, 100)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setTextAlign | ✔️ |  |  |

### setTextBaseline

Sets the vertical text alignment.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setTextBaseline.html)

```tsx
(textBaseline: "top" | "bottom" | "middle" | "normal") => void
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
      <td>textBaseline</td>
      <td><code>&quot;top&quot; | &quot;bottom&quot; | &quot;middle&quot; | &quot;normal&quot;</code></td>
      <td>The vertical text alignment method.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setStrokeStyle('red')
ctx.moveTo(5, 75)
ctx.lineTo(295, 75)
ctx.stroke()
ctx.setFontSize(20)
ctx.setTextBaseline('top')
ctx.fillText('top', 5, 75)
ctx.setTextBaseline('middle')
ctx.fillText('middle', 50, 75)
ctx.setTextBaseline('bottom')
ctx.fillText('bottom', 120, 75)
ctx.setTextBaseline('normal')
ctx.fillText('normal', 200, 75)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setTextBaseline | ✔️ |  |  |

### setTransform

Resets (overrides) the current transformation with matrix.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.setTransform.html)

```tsx
(scaleX: number, scaleY: number, skewX: number, skewY: number, translateX: number, translateY: number) => void
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
      <td>scaleX</td>
      <td><code>number</code></td>
      <td>Horizontal zoom</td>
    </tr>
    <tr>
      <td>scaleY</td>
      <td><code>number</code></td>
      <td>Vertical zoom</td>
    </tr>
    <tr>
      <td>skewX</td>
      <td><code>number</code></td>
      <td>Horizontal skew</td>
    </tr>
    <tr>
      <td>skewY</td>
      <td><code>number</code></td>
      <td>Vertical skew</td>
    </tr>
    <tr>
      <td>translateX</td>
      <td><code>number</code></td>
      <td>Horizontal translation</td>
    </tr>
    <tr>
      <td>translateY</td>
      <td><code>number</code></td>
      <td>Vertical translation</td>
    </tr>
  </tbody>
</table>

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setTransform | ✔️ |  |  |

### stroke

Draws the borders of the current path. The default color is black.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.stroke.html)

```tsx
() => void
```

#### Sample Code

##### Example 1

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.moveTo(10, 10)
ctx.lineTo(100, 10)
ctx.lineTo(100, 100)
ctx.stroke()
ctx.draw()
```

##### Example 2

The path described via stroke() is calculated starting from beginPath(), and strokeRect() is not included.

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
// begin path
ctx.rect(10, 10, 100, 30)
ctx.setStrokeStyle('yellow')
ctx.stroke()
// begin another path
ctx.beginPath()
ctx.rect(10, 40, 100, 30)
// only stoke this rect, not in current path
ctx.setStrokeStyle('blue')
ctx.strokeRect(10, 70, 100, 30)
ctx.rect(10, 100, 100, 30)
// it will stroke current path
ctx.setStrokeStyle('red')
ctx.stroke()
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.stroke | ✔️ |  |  |

### strokeRect

Draws (but not fills) a rectangle. Use setStrokeStyle to set the line color for the rectangle. The default color is black.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.strokeRect.html)

```tsx
(x: number, y: number, width: number, height: number) => void
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
      <td>x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the top-left corner of the rectangular path.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the top-left corner of the rectangular path.</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>The width of the rectangular path.</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>The height of the rectangular path.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setStrokeStyle('red')
ctx.strokeRect(10, 10, 150, 75)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.strokeRect | ✔️ |  |  |

### strokeText

Draws text strokes at a given position (x, y).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.strokeText.html)

```tsx
(text: string, x: number, y: number, maxWidth?: number) => void
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
      <td>text</td>
      <td><code>string</code></td>
      <td>The text to be drawn.</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the text start point.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the text start point.</td>
    </tr>
    <tr>
      <td>maxWidth</td>
      <td><code>number</code></td>
      <td>The maximum width of the drawing (optional).</td>
    </tr>
  </tbody>
</table>

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.strokeText | ✔️ |  |  |

### transform

Multiplies the current transformation with matrix.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.transform.html)

```tsx
(scaleX: number, scaleY: number, skewX: number, skewY: number, translateX: number, translateY: number) => void
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
      <td>scaleX</td>
      <td><code>number</code></td>
      <td>Horizontal zoom</td>
    </tr>
    <tr>
      <td>scaleY</td>
      <td><code>number</code></td>
      <td>Vertical zoom</td>
    </tr>
    <tr>
      <td>skewX</td>
      <td><code>number</code></td>
      <td>Horizontal skew</td>
    </tr>
    <tr>
      <td>skewY</td>
      <td><code>number</code></td>
      <td>Vertical skew</td>
    </tr>
    <tr>
      <td>translateX</td>
      <td><code>number</code></td>
      <td>Horizontal translation</td>
    </tr>
    <tr>
      <td>translateY</td>
      <td><code>number</code></td>
      <td>Vertical translation</td>
    </tr>
  </tbody>
</table>

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.transform | ✔️ |  |  |

### translate

Translates the origin point (0, 0) of the current coordinate system. By default, the origin point of the coordinate system is the top-left corner of the page.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.translate.html)

```tsx
(x: number, y: number) => void
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
      <td>x</td>
      <td><code>number</code></td>
      <td>The horizontal coordinate offset.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The vertical coordinate offset.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.strokeRect(10, 10, 150, 100)
ctx.translate(20, 20)
ctx.strokeRect(10, 10, 150, 100)
ctx.translate(20, 20)
ctx.strokeRect(10, 10, 150, 100)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.translate | ✔️ |  |  |

### measureText

Measures the text size. This synchronous API only returns the text width.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.measureText.html)

```tsx
(text: string) => TextMetrics
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
      <td>text</td>
      <td><code>string</code></td>
      <td>The text to be measured.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.measureText | ✔️ |  |  |

### createCircularGradient

Creates a circular color gradient. The start point is at the center of the circle and the end point is in the outer ring. The returned CanvasGradient object must use `CanvasGradient.addColorStop()` to specify at least two gradient points.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.createCircularGradient.html)

```tsx
(x: number, y: number, r: number) => CanvasGradient
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
      <td>x</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the center point.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the center point.</td>
    </tr>
    <tr>
      <td>r</td>
      <td><code>number</code></td>
      <td>The radius of the circle.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
// Create circular gradient
const grd = ctx.createCircularGradient(75, 50, 50)
grd.addColorStop(0, 'red')
grd.addColorStop(1, 'white')
// Fill with gradient
ctx.setFillStyle(grd)
ctx.fillRect(10, 10, 150, 80)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.createCircularGradient | ✔️ |  |  |

### createLinearGradient

Creates a linear color gradient. The returned `CanvasGradient` object must use `CanvasGradient.addColorStop()` to specify at least two gradient points.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.createLinearGradient.html)

```tsx
(x0: number, y0: number, x1: number, y1: number) => CanvasGradient
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
      <td>x0</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the start point.</td>
    </tr>
    <tr>
      <td>y0</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the start point.</td>
    </tr>
    <tr>
      <td>x1</td>
      <td><code>number</code></td>
      <td>The x-coordinate of the end point.</td>
    </tr>
    <tr>
      <td>y1</td>
      <td><code>number</code></td>
      <td>The y-coordinate of the end point.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
// Create linear gradient
const grd = ctx.createLinearGradient(0, 0, 200, 0)
grd.addColorStop(0, 'red')
grd.addColorStop(1, 'white')
// Fill with gradient
ctx.setFillStyle(grd)
ctx.fillRect(10, 10, 150, 80)
ctx.draw()
```

#### API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.createLinearGradient | ✔️ |  |  |

## Parameters

### repetition

Indicates how to repeat the image.

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>repeat</td>
      <td>Repeat horizontally and vertically</td>
    </tr>
    <tr>
      <td>repeat-x</td>
      <td>Repeat horizontally</td>
    </tr>
    <tr>
      <td>repeat-y</td>
      <td>Repeat vertically</td>
    </tr>
    <tr>
      <td>no-repeat</td>
      <td>Do not repeat</td>
    </tr>
  </tbody>
</table>

### lineCap

参数 lineCap 可选值

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>butt</td>
      <td>Adds a straight edge to each end of the line</td>
    </tr>
    <tr>
      <td>round</td>
      <td>Adds a round line cap to each end of the line</td>
    </tr>
    <tr>
      <td>square</td>
      <td>Adds a square line cap to each end of the line</td>
    </tr>
  </tbody>
</table>

### lineJoin

Valid values of lineJoin

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>bevel</td>
      <td>Bevel</td>
    </tr>
    <tr>
      <td>round</td>
      <td>Round</td>
    </tr>
    <tr>
      <td>miter</td>
      <td>Sharp</td>
    </tr>
  </tbody>
</table>

### align

Valid values of align

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>left</td>
      <td>Left aligned</td>
    </tr>
    <tr>
      <td>center</td>
      <td>Center aligned</td>
    </tr>
    <tr>
      <td>right</td>
      <td>Right aligned</td>
    </tr>
  </tbody>
</table>

### textBaseline

Valid values of textBaseline

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>top</td>
      <td>Top aligned</td>
    </tr>
    <tr>
      <td>bottom</td>
      <td>Bottom aligned</td>
    </tr>
    <tr>
      <td>middle</td>
      <td>Center aligned</td>
    </tr>
    <tr>
      <td>normal</td>
      <td></td>
    </tr>
  </tbody>
</table>

## API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.arc | ✔️ |  |  |
| CanvasContext.arcTo | ✔️ |  |  |
| CanvasContext.beginPath | ✔️ |  |  |
| CanvasContext.bezierCurveTo | ✔️ |  |  |
| CanvasContext.clearRect | ✔️ |  |  |
| CanvasContext.clip | ✔️ |  |  |
| CanvasContext.closePath | ✔️ |  |  |
| CanvasContext.createPattern | ✔️ |  |  |
| CanvasContext.draw | ✔️ |  |  |
| CanvasContext.drawImage | ✔️ |  |  |
| CanvasContext.fill | ✔️ |  |  |
| CanvasContext.fillRect | ✔️ |  |  |
| CanvasContext.fillText | ✔️ |  |  |
| CanvasContext.lineTo | ✔️ |  |  |
| CanvasContext.moveTo | ✔️ |  |  |
| CanvasContext.quadraticCurveTo | ✔️ |  |  |
| CanvasContext.rect | ✔️ |  |  |
| CanvasContext.restore | ✔️ |  |  |
| CanvasContext.rotate | ✔️ |  |  |
| CanvasContext.save | ✔️ |  |  |
| CanvasContext.scale | ✔️ |  |  |
| CanvasContext.setFillStyle | ✔️ |  |  |
| CanvasContext.setFontSize | ✔️ |  |  |
| CanvasContext.setGlobalAlpha | ✔️ |  |  |
| CanvasContext.setLineCap | ✔️ |  |  |
| CanvasContext.setLineDash | ✔️ |  |  |
| CanvasContext.setLineJoin | ✔️ |  |  |
| CanvasContext.setLineWidth | ✔️ |  |  |
| CanvasContext.setMiterLimit | ✔️ |  |  |
| CanvasContext.setShadow | ✔️ |  |  |
| CanvasContext.setStrokeStyle | ✔️ |  |  |
| CanvasContext.setTextAlign | ✔️ |  |  |
| CanvasContext.setTextBaseline | ✔️ |  |  |
| CanvasContext.setTransform | ✔️ |  |  |
| CanvasContext.stroke | ✔️ |  |  |
| CanvasContext.strokeRect | ✔️ |  |  |
| CanvasContext.strokeText | ✔️ |  |  |
| CanvasContext.transform | ✔️ |  |  |
| CanvasContext.translate | ✔️ |  |  |
| CanvasContext.measureText | ✔️ |  |  |
| CanvasContext.createCircularGradient | ✔️ |  |  |
| CanvasContext.createLinearGradient | ✔️ |  |  |
