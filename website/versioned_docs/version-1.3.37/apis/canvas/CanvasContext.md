---
title: CanvasContext
sidebar_label: CanvasContext
id: version-1.3.37-CanvasContext
original_id: CanvasContext
---

canvas 组件的绘图上下文

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| fillStyle | `string` | 填充颜色。用法同 [CanvasContext.setFillStyle()]。 |
| font | `string` | 当前字体样式的属性。符合 [CSS font 语法](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font) 的 DOMString 字符串，至少需要提供字体大小和字体族名。默认值为 10px sans-serif。 |
| globalAlpha | `number` | 全局画笔透明度。范围 0-1，0 表示完全透明，1 表示完全不透明。 |
| globalCompositeOperation | `string` | 在绘制新形状时应用的合成操作的类型。目前安卓版本只适用于 `fill` 填充块的合成，用于 `stroke` 线段的合成效果都是 `source-over`。<br /><br />目前支持的操作有<br />- 安卓：xor, source-over, source-atop, destination-out, lighter, overlay, darken, lighten, hard-light<br />- iOS：xor, source-over, source-atop, destination-over, destination-out, lighter, multiply, overlay, darken, lighten, color-dodge, color-burn, hard-light, soft-light, difference, exclusion, saturation, luminosity |
| lineCap | `number` | 线条的端点样式。用法同 [CanvasContext.setLineCap()]。 |
| lineDashOffset | `number` | 虚线偏移量，初始值为0 |
| lineJoin | `number` | 线条的交点样式。用法同 [CanvasContext.setLineJoin()]。 |
| lineWidth | `number` | 线条的宽度。用法同 [CanvasContext.setLineWidth()]。 |
| miterLimit | `number` | 最大斜接长度。用法同 [CanvasContext.setMiterLimit()]。 |
| shadowBlur | `number` | 阴影的模糊级别 |
| shadowColor | `number` | 阴影的颜色 |
| shadowOffsetX | `number` | 阴影相对于形状在水平方向的偏移 |
| shadowOffsetY | `number` | 阴影相对于形状在竖直方向的偏移 |
| strokeStyle | `string` | 边框颜色。用法同 [CanvasContext.setFillStyle()]。 |

### arc

创建一条弧线。

- 创建一个圆可以指定起始弧度为 0，终止弧度为 2 * Math.PI。
- 用 `stroke` 或者 `fill` 方法来在 `canvas` 中画弧线。

针对 arc(100, 75, 50, 0, 1.5 * Math.PI)的三个关键坐标如下：

- 绿色: 圆心 (100, 75)
- 红色: 起始弧度 (0)
- 蓝色: 终止弧度 (1.5 * Math.PI)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.arc.html)

```tsx
(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise?: boolean) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | 圆心的 x 坐标 |
| y | `number` | 圆心的 y 坐标 |
| r | `number` | 圆的半径 |
| sAngle | `number` | 起始弧度，单位弧度（在3点钟方向） |
| eAngle | `number` | 终止弧度 |
| counterclockwise | `boolean` | 弧度的方向是否是逆时针 |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.arc | ✔️ |  |  |

### arcTo

根据控制点和半径绘制圆弧路径。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.arcTo.html)

```tsx
(x1: number, y1: number, x2: number, y2: number, radius: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x1 | `number` | 第一个控制点的 x 轴坐标 |
| y1 | `number` | 第一个控制点的 y 轴坐标 |
| x2 | `number` | 第二个控制点的 x 轴坐标 |
| y2 | `number` | 第二个控制点的 y 轴坐标 |
| radius | `number` | 圆弧的半径 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.arcTo | ✔️ |  |  |

### beginPath

开始创建一个路径。需要调用 `fill` 或者 `stroke` 才会使用路径进行填充或描边

- 在最开始的时候相当于调用了一次 `beginPath`。
- 同一个路径内的多次 `setFillStyle`、`setStrokeStyle`、`setLineWidth`等设置，以最后一次设置为准。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.beginPath.html)

```tsx
() => void
```

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.beginPath | ✔️ |  |  |

### bezierCurveTo

创建三次方贝塞尔曲线路径。曲线的起始点为路径中前一个点。

针对 moveTo(20, 20) bezierCurveTo(20, 100, 200, 100, 200, 20) 的三个关键坐标如下：

- 红色：起始点(20, 20)
- 蓝色：两个控制点(20, 100) (200, 100)
- 绿色：终止点(200, 20)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.bezierCurveTo.html)

```tsx
(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| cp1x | `number` | 第一个贝塞尔控制点的 x 坐标 |
| cp1y | `number` | 第一个贝塞尔控制点的 y 坐标 |
| cp2x | `number` | 第二个贝塞尔控制点的 x 坐标 |
| cp2y | `number` | 第二个贝塞尔控制点的 y 坐标 |
| x | `number` | 结束点的 x 坐标 |
| y | `number` | 结束点的 y 坐标 |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.bezierCurveTo | ✔️ |  |  |

### clearRect

清除画布上在该矩形区域内的内容

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.clearRect.html)

```tsx
(x: number, y: number, width: number, height: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | 矩形路径左上角的横坐标 |
| y | `number` | 矩形路径左上角的纵坐标 |
| width | `number` | 矩形路径的宽度 |
| height | `number` | 矩形路径的高度 |

#### 示例代码

clearRect 并非画一个白色的矩形在地址区域，而是清空，为了有直观感受，对 canvas 加了一层背景色。
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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.clearRect | ✔️ |  |  |

### clip

从原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。可以在使用 `clip` 方法前通过使用 `save` 方法对当前画布区域进行保存，并在以后的任意时间通过`restore`方法对其进行恢复。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.clip.html)

```tsx
() => void
```

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
Taro.downloadFile({
  url: 'http://is5.mzstatic.com/image/thumb/Purple128/v4/75/3b/90/753b907c-b7fb-5877-215a-759bd73691a4/source/50x50bb.jpg',
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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.clip | ✔️ |  |  |

### closePath

关闭一个路径。会连接起点和终点。如果关闭路径后没有调用 `fill` 或者 `stroke` 并开启了新的路径，那之前的路径将不会被渲染。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.closePath.html)

```tsx
() => void
```

#### 示例代码

##### 示例 1

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.moveTo(10, 10)
ctx.lineTo(100, 10)
ctx.lineTo(100, 100)
ctx.closePath()
ctx.stroke()
ctx.draw()
```

##### 示例 2

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.closePath | ✔️ |  |  |

### createPattern

对指定的图像创建模式的方法，可在指定的方向上重复元图像

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.createPattern.html)

```tsx
(image: string, repetition: "repeat" | "repeat-x" | "repeat-y" | "no-repeat") => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| image | `string` | 重复的图像源，仅支持包内路径和临时路径 |
| repetition | `"repeat" | "repeat-x" | "repeat-y" | "no-repeat"` | 如何重复图像 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.createPattern | ✔️ |  |  |

### draw

将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.draw.html)

```tsx
(reserve?: boolean, callback?: (...args: any[]) => any) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| reserve | `boolean` | 本次绘制是否接着上一次绘制。即 reserve 参数为 false，则在本次调用绘制之前 native 层会先清空画布再继续绘制；若 reserve 参数为 true，则保留当前画布上的内容，本次调用 drawCanvas 绘制的内容覆盖在上面，默认 false。 |
| callback | `(...args: any[]) => any` | 绘制完成后执行的回调函数 |

#### 示例代码

##### 示例 1

第二次 draw() reserve 为 true。所以保留了上一次的绘制结果，在上下文设置的 fillStyle 'red' 也变成了默认的 'black'。

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFillStyle('red')
ctx.fillRect(10, 10, 150, 100)
ctx.draw()
ctx.fillRect(50, 50, 150, 100)
ctx.draw(true)
```

##### 示例 2

第二次 draw() reserve 为 false。所以没有保留了上一次的绘制结果和在上下文设置的 fillStyle 'red'。

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFillStyle('red')
ctx.fillRect(10, 10, 150, 100)
ctx.draw()
ctx.fillRect(50, 50, 150, 100)
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.draw | ✔️ |  |  |

### drawImage

绘制图像到画布
绘制图像到画布
绘制图像到画布

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.drawImage.html)

```tsx
{ (imageResource: string, dx: number, dy: number): void; (imageResource: string, dx: number, dy: number, dWidth: number, dHeight: number): void; (imageResource: string, sx: number, sy: number, sWidth: number, sHeight: number, dx: number, dy: number, dWidth: number, dHeight: number): void; }
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| imageResource | `string` | 所要绘制的图片资源（网络图片要通过 getImageInfo / downloadFile 先下载） |
| sx | `number` | 需要绘制到画布中的，imageResource的矩形（裁剪）选择框的左上角 x 坐标 |
| sy | `number` | 需要绘制到画布中的，imageResource的矩形（裁剪）选择框的左上角 y 坐标 |
| sWidth | `number` | 需要绘制到画布中的，imageResource的矩形（裁剪）选择框的宽度 |
| sHeight | `number` | 需要绘制到画布中的，imageResource的矩形（裁剪）选择框的高度 |
| dx | `number` | imageResource的左上角在目标 canvas 上 x 轴的位置 |
| dy | `number` | imageResource的左上角在目标 canvas 上 y 轴的位置 |
| dWidth | `number` | 在目标画布上绘制imageResource的宽度，允许对绘制的imageResource进行缩放 |
| dHeight | `number` | 在目标画布上绘制imageResource的高度，允许对绘制的imageResource进行缩放 |

#### 示例代码

##### 示例 1

有三个版本的写法：

- drawImage(imageResource, dx, dy)
- drawImage(imageResource, dx, dy, dWidth, dHeight)
- drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) 从 1.9.0 起支持

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
Taro.chooseImage({
  success: function(res){
    ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
    ctx.draw()
  }
})
```

##### 示例 2

有三个版本的写法：

- drawImage(imageResource, dx, dy)
- drawImage(imageResource, dx, dy, dWidth, dHeight)
- drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) 从 1.9.0 起支持

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
Taro.chooseImage({
  success: function(res){
    ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
    ctx.draw()
  }
})
```

##### 示例 3

有三个版本的写法：

- drawImage(imageResource, dx, dy)
- drawImage(imageResource, dx, dy, dWidth, dHeight)
- drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) 从 1.9.0 起支持

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
Taro.chooseImage({
  success: function(res){
    ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
    ctx.draw()
  }
})
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.drawImage | ✔️ |  |  |

### fill

对当前路径中的内容进行填充。默认的填充色为黑色。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.fill.html)

```tsx
() => void
```

#### 示例代码

##### 示例 1

如果当前路径没有闭合，fill() 方法会将起点和终点进行连接，然后填充。

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.moveTo(10, 10)
ctx.lineTo(100, 10)
ctx.lineTo(100, 100)
ctx.fill()
ctx.draw()
```

##### 示例 2

fill() 填充的的路径是从 beginPath() 开始计算，但是不会将 fillRect() 包含进去。

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.fill | ✔️ |  |  |

### fillRect

填充一个矩形。用 [`setFillStyle`](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setFillStyle.html) 设置矩形的填充色，如果没设置默认是黑色。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.fillRect.html)

```tsx
(x: number, y: number, width: number, height: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | 矩形路径左上角的横坐标 |
| y | `number` | 矩形路径左上角的纵坐标 |
| width | `number` | 矩形路径的宽度 |
| height | `number` | 矩形路径的高度 |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFillStyle('red')
ctx.fillRect(10, 10, 150, 75)
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.fillRect | ✔️ |  |  |

### fillText

在画布上绘制被填充的文本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.fillText.html)

```tsx
(text: string, x: number, y: number, maxWidth?: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| text | `string` | 在画布上输出的文本 |
| x | `number` | 绘制文本的左上角 x 坐标位置 |
| y | `number` | 绘制文本的左上角 y 坐标位置 |
| maxWidth | `number` | 需要绘制的最大宽度，可选 |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFontSize(20)
ctx.fillText('Hello', 20, 20)
ctx.fillText('MINA', 100, 100)
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.fillText | ✔️ |  |  |

### lineTo

增加一个新点，然后创建一条从上次指定点到目标点的线。用 `stroke` 方法来画线条

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.lineTo.html)

```tsx
(x: number, y: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | 目标位置的 x 坐标 |
| y | `number` | 目标位置的 y 坐标 |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.moveTo(10, 10)
ctx.rect(10, 10, 100, 50)
ctx.lineTo(110, 60)
ctx.stroke()
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.lineTo | ✔️ |  |  |

### moveTo

把路径移动到画布中的指定点，不创建线条。用 `stroke` 方法来画线条

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.moveTo.html)

```tsx
(x: number, y: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | 目标位置的 x 坐标 |
| y | `number` | 目标位置的 y 坐标 |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.moveTo(10, 10)
ctx.lineTo(100, 10)
ctx.moveTo(10, 50)
ctx.lineTo(100, 50)
ctx.stroke()
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.moveTo | ✔️ |  |  |

### quadraticCurveTo

创建二次贝塞尔曲线路径。曲线的起始点为路径中前一个点。

针对 moveTo(20, 20) quadraticCurveTo(20, 100, 200, 20) 的三个关键坐标如下：

- 红色：起始点(20, 20)
- 蓝色：控制点(20, 100)
- 绿色：终止点(200, 20)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.quadraticCurveTo.html)

```tsx
(cpx: number, cpy: number, x: number, y: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| cpx | `number` | 贝塞尔控制点的 x 坐标 |
| cpy | `number` | 贝塞尔控制点的 y 坐标 |
| x | `number` | 结束点的 x 坐标 |
| y | `number` | 结束点的 y 坐标 |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.quadraticCurveTo | ✔️ |  |  |

### rect

创建一个矩形路径。需要用 [`fill`](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.fill.html) 或者 [`stroke`](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.stroke.html) 方法将矩形真正的画到 `canvas` 中

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.rect.html)

```tsx
(x: number, y: number, width: number, height: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | 矩形路径左上角的横坐标 |
| y | `number` | 矩形路径左上角的纵坐标 |
| width | `number` | 矩形路径的宽度 |
| height | `number` | 矩形路径的高度 |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.rect(10, 10, 150, 75)
ctx.setFillStyle('red')
ctx.fill()
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.rect | ✔️ |  |  |

### restore

恢复之前保存的绘图上下文。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.restore.html)

```tsx
() => void
```

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.restore | ✔️ |  |  |

### rotate

以原点为中心顺时针旋转当前坐标轴。多次调用旋转的角度会叠加。原点可以用 `translate` 方法修改。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.rotate.html)

```tsx
(rotate: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| rotate | `number` | 旋转角度，以弧度计 degrees * Math.PI/180；degrees 范围为 0-360 |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.strokeRect(100, 10, 150, 100)
ctx.rotate(20 * Math.PI / 180)
ctx.strokeRect(100, 10, 150, 100)
ctx.rotate(20 * Math.PI / 180)
ctx.strokeRect(100, 10, 150, 100)
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.rotate | ✔️ |  |  |

### save

保存绘图上下文。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.save.html)

```tsx
() => void
```

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.save | ✔️ |  |  |

### scale

在调用后，之后创建的路径其横纵坐标会被缩放。多次调用倍数会相乘。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.scale.html)

```tsx
(scaleWidth: number, scaleHeight: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| scaleWidth | `number` | 横坐标缩放的倍数 (1 = 100%，0.5 = 50%，2 = 200%) |
| scaleHeight | `number` | 纵坐标轴缩放的倍数 (1 = 100%，0.5 = 50%，2 = 200%) |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.strokeRect(10, 10, 25, 15)
ctx.scale(2, 2)
ctx.strokeRect(10, 10, 25, 15)
ctx.scale(2, 2)
ctx.strokeRect(10, 10, 25, 15)
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.scale | ✔️ |  |  |

### setFillStyle

设置填充色。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setFillStyle.html)

```tsx
(color: string | CanvasGradient) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| color | `string | CanvasGradient` | 填充的颜色，默认颜色为 black。 |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFillStyle('red')
ctx.fillRect(10, 10, 150, 75)
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setFillStyle | ✔️ |  |  |

### setFontSize

设置字体的字号

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setFontSize.html)

```tsx
(fontSize: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| fontSize | `number` | 字体的字号 |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setFontSize | ✔️ |  |  |

### setGlobalAlpha

设置全局画笔透明度。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setGlobalAlpha.html)

```tsx
(alpha: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| alpha | `number` | 透明度。范围 0-1，0 表示完全透明，1 表示完全不透明。 |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setGlobalAlpha | ✔️ |  |  |

### setLineCap

设置线条的端点样式

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineCap.html)

```tsx
(lineCap: "butt" | "round" | "square") => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| lineCap | `"butt" | "round" | "square"` | 线条的结束端点样式 |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setLineCap | ✔️ |  |  |

### setLineDash

设置虚线样式。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineDash.html)

```tsx
(pattern: number[], offset: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| pattern | `number[]` | 一组描述交替绘制线段和间距（坐标空间单位）长度的数字 |
| offset | `number` | 虚线偏移量 |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setLineDash([10, 20], 5);
ctx.beginPath();
ctx.moveTo(0,100);
ctx.lineTo(400, 100);
ctx.stroke();
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setLineDash | ✔️ |  |  |

### setLineJoin

设置线条的交点样式

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineJoin.html)

```tsx
(lineJoin: "round" | "bevel" | "miter") => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| lineJoin | `"round" | "bevel" | "miter"` | 线条的结束交点样式 |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setLineJoin | ✔️ |  |  |

### setLineWidth

设置线条的宽度

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineWidth.html)

```tsx
(lineWidth: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| lineWidth | `number` | 线条的宽度，单位px |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setLineWidth | ✔️ |  |  |

### setMiterLimit

设置最大斜接长度。斜接长度指的是在两条线交汇处内角和外角之间的距离。当 [CanvasContext.setLineJoin()](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineJoin.html) 为 miter 时才有效。超过最大倾斜长度的，连接处将以 lineJoin 为 bevel 来显示。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setMiterLimit.html)

```tsx
(miterLimit: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| miterLimit | `number` | 最大斜接长度 |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setMiterLimit | ✔️ |  |  |

### setShadow

设定阴影样式。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setShadow.html)

```tsx
(offsetX: number, offsetY: number, blur: number, color: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| offsetX | `number` | 阴影相对于形状在水平方向的偏移，默认值为 0。 |
| offsetY | `number` | 阴影相对于形状在竖直方向的偏移，默认值为 0。 |
| blur | `number` | 阴影的模糊级别，数值越大越模糊。范围 0- 100。，默认值为 0。 |
| color | `string` | 阴影的颜色。默认值为 black。 |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setFillStyle('red')
ctx.setShadow(10, 50, 50, 'blue')
ctx.fillRect(10, 10, 150, 75)
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setShadow | ✔️ |  |  |

### setStrokeStyle

设置描边颜色。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setStrokeStyle.html)

```tsx
(color: string | CanvasGradient) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| color | `string | CanvasGradient` | 描边的颜色，默认颜色为 black。 |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setStrokeStyle('red')
ctx.strokeRect(10, 10, 150, 75)
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setStrokeStyle | ✔️ |  |  |

### setTextAlign

设置文字的对齐

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setTextAlign.html)

```tsx
(align: "left" | "center" | "right") => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| align | `"left" | "center" | "right"` | 文字的对齐方式 |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setTextAlign | ✔️ |  |  |

### setTextBaseline

设置文字的竖直对齐

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setTextBaseline.html)

```tsx
(textBaseline: "top" | "bottom" | "middle" | "normal") => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| textBaseline | `"top" | "bottom" | "middle" | "normal"` | 文字的竖直对齐方式 |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setTextBaseline | ✔️ |  |  |

### setTransform

使用矩阵重新设置（覆盖）当前变换的方法

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setTransform.html)

```tsx
(scaleX: number, scaleY: number, skewX: number, skewY: number, translateX: number, translateY: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| scaleX | `number` | 水平缩放 |
| scaleY | `number` | 垂直缩放 |
| skewX | `number` | 水平倾斜 |
| skewY | `number` | 垂直倾斜 |
| translateX | `number` | 水平移动 |
| translateY | `number` | 垂直移动 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.setTransform | ✔️ |  |  |

### stroke

画出当前路径的边框。默认颜色色为黑色。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.stroke.html)

```tsx
() => void
```

#### 示例代码

##### 示例 1

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.moveTo(10, 10)
ctx.lineTo(100, 10)
ctx.lineTo(100, 100)
ctx.stroke()
ctx.draw()
```

##### 示例 2

stroke() 描绘的的路径是从 beginPath() 开始计算，但是不会将 strokeRect() 包含进去。

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.stroke | ✔️ |  |  |

### strokeRect

画一个矩形(非填充)。 用 [`setStrokeStyle`](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setStrokeStyle.html) 设置矩形线条的颜色，如果没设置默认是黑色。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.strokeRect.html)

```tsx
(x: number, y: number, width: number, height: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | 矩形路径左上角的横坐标 |
| y | `number` | 矩形路径左上角的纵坐标 |
| width | `number` | 矩形路径的宽度 |
| height | `number` | 矩形路径的高度 |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.setStrokeStyle('red')
ctx.strokeRect(10, 10, 150, 75)
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.strokeRect | ✔️ |  |  |

### strokeText

给定的 (x, y) 位置绘制文本描边的方法

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.strokeText.html)

```tsx
(text: string, x: number, y: number, maxWidth?: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| text | `string` | 要绘制的文本 |
| x | `number` | 文本起始点的 x 轴坐标 |
| y | `number` | 文本起始点的 y 轴坐标 |
| maxWidth | `number` | 需要绘制的最大宽度，可选 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.strokeText | ✔️ |  |  |

### transform

使用矩阵多次叠加当前变换的方法

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.transform.html)

```tsx
(scaleX: number, scaleY: number, skewX: number, skewY: number, translateX: number, translateY: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| scaleX | `number` | 水平缩放 |
| scaleY | `number` | 垂直缩放 |
| skewX | `number` | 水平倾斜 |
| skewY | `number` | 垂直倾斜 |
| translateX | `number` | 水平移动 |
| translateY | `number` | 垂直移动 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.transform | ✔️ |  |  |

### translate

对当前坐标系的原点 (0, 0) 进行变换。默认的坐标系原点为页面左上角。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.translate.html)

```tsx
(x: number, y: number) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | 水平坐标平移量 |
| y | `number` | 竖直坐标平移量 |

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
ctx.strokeRect(10, 10, 150, 100)
ctx.translate(20, 20)
ctx.strokeRect(10, 10, 150, 100)
ctx.translate(20, 20)
ctx.strokeRect(10, 10, 150, 100)
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.translate | ✔️ |  |  |

### measureText

测量文本尺寸信息。目前仅返回文本宽度。同步接口。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.measureText.html)

```tsx
(text: string) => TextMetrics
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| text | `string` | 要测量的文本 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.measureText | ✔️ |  |  |

### createCircularGradient

创建一个圆形的渐变颜色。起点在圆心，终点在圆环。返回的`CanvasGradient`对象需要使用 [CanvasGradient.addColorStop()](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasGradient.addColorStop.html) 来指定渐变点，至少要两个。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.createCircularGradient.html)

```tsx
(x: number, y: number, r: number) => CanvasGradient
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | 圆心的 x 坐标 |
| y | `number` | 圆心的 y 坐标 |
| r | `number` | 圆的半径 |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.createCircularGradient | ✔️ |  |  |

### createLinearGradient

创建一个线性的渐变颜色。返回的`CanvasGradient`对象需要使用 [CanvasGradient.addColorStop()](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasGradient.addColorStop.html) 来指定渐变点，至少要两个。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.createLinearGradient.html)

```tsx
(x0: number, y0: number, x1: number, y1: number) => CanvasGradient
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x0 | `number` | 起点的 x 坐标 |
| y0 | `number` | 起点的 y 坐标 |
| x1 | `number` | 终点的 x 坐标 |
| y1 | `number` | 终点的 y 坐标 |

#### 示例代码

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

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasContext.createLinearGradient | ✔️ |  |  |

## 参数

### repetition

参数 repetition 可选值

| 参数 | 说明 |
| --- | --- |
| repeat | 水平竖直方向都重复 |
| repeat-x | 水平方向重复 |
| repeat-y | 竖直方向重复 |
| no-repeat | 不重复 |

### lineCap

参数 lineCap 可选值

| 参数 | 说明 |
| --- | --- |
| butt | 向线条的每个末端添加平直的边缘。 |
| round | 向线条的每个末端添加圆形线帽。 |
| square | 向线条的每个末端添加正方形线帽。 |

### lineJoin

参数 lineJoin 可选值

| 参数 | 说明 |
| --- | --- |
| bevel | 斜角 |
| round | 圆角 |
| miter | 尖角 |

### align

参数 align 可选值

| 参数 | 说明 |
| --- | --- |
| left | 左对齐 |
| center | 居中对齐 |
| right | 右对齐 |

### textBaseline

参数 textBaseline 可选值

| 参数 | 说明 |
| --- | --- |
| top | 顶部对齐 |
| bottom | 底部对齐 |
| middle | 居中对齐 |
| normal |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
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
