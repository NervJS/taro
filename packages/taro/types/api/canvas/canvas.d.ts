declare namespace Taro {
  /**
   * @since 微信小程序 2.7.0
   *
   * 创建离屏 canvas 实例
   */
  function createOffscreenCanvas(): OffscreenCanvas
  interface OffscreenCanvas {
    /**
     *
     * @param contextType
     *
     * 该方法返回 OffscreenCanvas 的绘图上下文
     */
    getContext(contextType: string): any
  }

  /**
   *
   * **定义：**
   *
   * 创建 canvas 绘图上下文（指定 canvasId）。在自定义组件下，第二个参数传入组件实例this，以操作组件内 `<canvas/>` 组件
   *
   * **Tip**: 需要指定 canvasId，该绘图上下文只作用于对应的 `<canvas/>`
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.createCanvasContext.html
   */
  function createCanvasContext(canvasId: string, componentInstance: any): CanvasContext
  interface Color {}
  namespace CanvasContext {
    namespace draw { type Param1 = () => any }
  }
  interface CanvasContext {
    /** 填充颜色。用法同 [CanvasContext.setFillStyle()]。
     *
     * 最低基础库： `1.9.90` */
    fillStyle: string
    /** 当前字体样式的属性。符合 [CSS font 语法](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font) 的 DOMString 字符串，至少需要提供字体大小和字体族名。默认值为 10px sans-serif。
     *
     * 最低基础库： `1.9.90` */
    font: string
    /** 全局画笔透明度。范围 0-1，0 表示完全透明，1 表示完全不透明。 */
    globalAlpha: number
    /** 在绘制新形状时应用的合成操作的类型。目前安卓版本只适用于 `fill` 填充块的合成，用于 `stroke` 线段的合成效果都是 `source-over`。
     *
     * 目前支持的操作有
     * - 安卓：xor, source-over, source-atop, destination-out, lighter, overlay, darken, lighten, hard-light
     * - iOS：xor, source-over, source-atop, destination-over, destination-out, lighter, multiply, overlay, darken, lighten, color-dodge, color-burn, hard-light, soft-light, difference, exclusion, saturation, luminosity
     *
     * 最低基础库： `1.9.90` */
    globalCompositeOperation: string
    /** 线条的端点样式。用法同 [CanvasContext.setLineCap()]。
     *
     * 最低基础库： `1.9.90` */
    lineCap: number
    /** 虚线偏移量，初始值为0
     *
     * 最低基础库： `1.9.90` */
    lineDashOffset: number
    /** 线条的交点样式。用法同 [CanvasContext.setLineJoin()]。
     *
     * 最低基础库： `1.9.90` */
    lineJoin: number
    /** 线条的宽度。用法同 [CanvasContext.setLineWidth()]。
     *
     * 最低基础库： `1.9.90` */
    lineWidth: number
    /** 最大斜接长度。用法同 [CanvasContext.setMiterLimit()]。
     *
     * 最低基础库： `1.9.90` */
    miterLimit: number
    /** 阴影的模糊级别
     *
     * 最低基础库： `1.9.90` */
    shadowBlur: number
    /** 阴影的颜色
     *
     * 最低基础库： `1.9.90` */
    shadowColor: number
    /** 阴影相对于形状在水平方向的偏移
     *
     * 最低基础库： `1.9.90` */
    shadowOffsetX: number
    /** 阴影相对于形状在竖直方向的偏移
     *
     * 最低基础库： `1.9.90` */
    shadowOffsetY: number
    /** 边框颜色。用法同 [CanvasContext.setFillStyle()]。
     *
     * 最低基础库： `1.9.90` */
    strokeStyle: string
    /** [CanvasContext.arc(number x, number y, number r, number sAngle, number eAngle, boolean counterclockwise)](CanvasContext.arc.md)
     *
     * 创建一条弧线。
     *
     *   - 创建一个圆可以指定起始弧度为 0，终止弧度为 2 * Math.PI。
     *   - 用 `stroke` 或者 `fill` 方法来在 `canvas` 中画弧线。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // Draw coordinates
   ctx.arc(100, 75, 50, 0, 2   Math.PI)
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
   ctx.fillText('0.5 PI', 83, 145)
   ctx.fillText('1 PI', 15, 78)
   ctx.fillText('1.5 PI', 83, 10)
   // Draw points
   ctx.beginPath()
   ctx.arc(100, 75, 2, 0, 2   Math.PI)
   ctx.setFillStyle('lightgreen')
   ctx.fill()
   ctx.beginPath()
   ctx.arc(100, 25, 2, 0, 2   Math.PI)
   ctx.setFillStyle('blue')
   ctx.fill()
   ctx.beginPath()
   ctx.arc(150, 75, 2, 0, 2   Math.PI)
   ctx.setFillStyle('red')
   ctx.fill()
   // Draw arc
   ctx.beginPath()
   ctx.arc(100, 75, 50, 0, 1.5   Math.PI)
   ctx.setStrokeStyle('#333333')
   ctx.stroke()
   ctx.draw()
   ```
     *
     * ![]
     *
     * 针对 arc(100, 75, 50, 0, 1.5 * Math.PI)的三个关键坐标如下：
     *
     * - 绿色: 圆心 (100, 75)
     * - 红色: 起始弧度 (0)
     * - 蓝色: 终止弧度 (1.5 * Math.PI) */
    arc(
      /** 圆心的 x 坐标 */
      x: number,
      /** 圆心的 y 坐标 */
      y: number,
      /** 圆的半径 */
      r: number,
      /** 起始弧度，单位弧度（在3点钟方向） */
      sAngle: number,
      /** 终止弧度 */
      eAngle: number,
      /** 弧度的方向是否是逆时针 */
      counterclockwise?: boolean
    ): void
    /** [CanvasContext.arcTo(number x1, number y1, number x2, number y2, number radius)](CanvasContext.arcTo.md)
     *
     * 根据控制点和半径绘制圆弧路径。
     *
     * 最低基础库： `1.9.90` */
    arcTo(
      /** 第一个控制点的 x 轴坐标 */
      x1: number,
      /** 第一个控制点的 y 轴坐标 */
      y1: number,
      /** 第二个控制点的 x 轴坐标 */
      x2: number,
      /** 第二个控制点的 y 轴坐标 */
      y2: number,
      /** 圆弧的半径 */
      radius: number
    ): void
    /** [CanvasContext.beginPath()](CanvasContext.beginPath.md)
     *
     * 开始创建一个路径。需要调用 `fill` 或者 `stroke` 才会使用路径进行填充或描边
     *
     *   - 在最开始的时候相当于调用了一次 `beginPath`。
     *   - 同一个路径内的多次 `setFillStyle`、`setStrokeStyle`、`setLineWidth`等设置，以最后一次设置为准。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
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
     *
     * ![] */
    beginPath(): void
    /** [CanvasContext.bezierCurveTo()](CanvasContext.bezierCurveTo.md)
     *
     * 创建三次方贝塞尔曲线路径。曲线的起始点为路径中前一个点。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // Draw points
   ctx.beginPath()
   ctx.arc(20, 20, 2, 0, 2   Math.PI)
   ctx.setFillStyle('red')
   ctx.fill()
   ctx.beginPath()
   ctx.arc(200, 20, 2, 0, 2   Math.PI)
   ctx.setFillStyle('lightgreen')
   ctx.fill()
   ctx.beginPath()
   ctx.arc(20, 100, 2, 0, 2   Math.PI)
   ctx.arc(200, 100, 2, 0, 2   Math.PI)
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
     *
     * ![]
     *
     * 针对 moveTo(20, 20) bezierCurveTo(20, 100, 200, 100, 200, 20) 的三个关键坐标如下：
     *
     * - 红色：起始点(20, 20)
     * - 蓝色：两个控制点(20, 100) (200, 100)
     * - 绿色：终止点(200, 20) */
    bezierCurveTo(): void
    /** [CanvasContext.clearRect(number x, number y, number width, number height)](CanvasContext.clearRect.md)
     *
     * 清除画布上在该矩形区域内的内容
     *
     * **示例代码**
     *
     *
     * clearRect 并非画一个白色的矩形在地址区域，而是清空，为了有直观感受，对 canvas 加了一层背景色。
   ```html
   <canvas canvas-id="myCanvas" style="border: 1px solid; background: #123456;"/>
   ```
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.fillRect(0, 0, 150, 200)
   ctx.setFillStyle('blue')
   ctx.fillRect(150, 0, 150, 200)
   ctx.clearRect(10, 10, 150, 75)
   ctx.draw()
   ```
     * ![] */
    clearRect(
      /** 矩形路径左上角的横坐标 */
      x: number,
      /** 矩形路径左上角的纵坐标 */
      y: number,
      /** 矩形路径的宽度 */
      width: number,
      /** 矩形路径的高度 */
      height: number
    ): void
    /** [CanvasContext.clip()](CanvasContext.clip.md)
     *
     * 从原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。可以在使用 `clip` 方法前通过使用 `save` 方法对当前画布区域进行保存，并在以后的任意时间通过`restore`方法对其进行恢复。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   wx.downloadFile({
   url: 'http://is5.mzstatic.com/image/thumb/Purple128/v4/75/3b/90/753b907c-b7fb-5877-215a-759bd73691a4/source/50x50bb.jpg',
   success: function(res) {
   ctx.save()
   ctx.beginPath()
   ctx.arc(50, 50, 25, 0, 2 Math.PI)
   ctx.clip()
   ctx.drawImage(res.tempFilePath, 25, 25)
   ctx.restore()
   ctx.draw()
   }
   })
   ```
     * ![]
     *
     * 最低基础库： `1.6.0` */
    clip(): void
    /** [CanvasContext.closePath()](CanvasContext.closePath.md)
     *
     * 关闭一个路径。会连接起点和终点。如果关闭路径后没有调用 `fill` 或者 `stroke` 并开启了新的路径，那之前的路径将不会被渲染。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.moveTo(10, 10)
   ctx.lineTo(100, 10)
   ctx.lineTo(100, 100)
   ctx.closePath()
   ctx.stroke()
   ctx.draw()
   ```
     * ![]
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
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
     *
     * ![] */
    closePath(): void
    /** [CanvasContext.createPattern(string image, string repetition)](CanvasContext.createPattern.md)
     *
     * 对指定的图像创建模式的方法，可在指定的方向上重复元图像
     *
     * 最低基础库： `1.9.90` */
    createPattern(
      /** 重复的图像源，仅支持包内路径和临时路径 */
      image: string,
      /** 如何重复图像 */
      repetition: string
    ): void
    /** [CanvasContext.draw(boolean reserve, function callback)](CanvasContext.draw.md)
     *
     * 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
     *
     * **示例代码**
     *
     *
     * 第二次 draw() reserve 为 true。所以保留了上一次的绘制结果，在上下文设置的 fillStyle 'red' 也变成了默认的 'black'。
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 100)
   ctx.draw()
   ctx.fillRect(50, 50, 150, 100)
   ctx.draw(true)
   ```
     * ![]
     *
     * **示例代码**
     *
     *
     * 第二次 draw() reserve 为 false。所以没有保留了上一次的绘制结果和在上下文设置的 fillStyle 'red'。
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 100)
   ctx.draw()
   ctx.fillRect(50, 50, 150, 100)
   ctx.draw()
   ```
     * ![] */
    draw(
      /** 本次绘制是否接着上一次绘制。即 reserve 参数为 false，则在本次调用绘制之前 native 层会先清空画布再继续绘制；若 reserve 参数为 true，则保留当前画布上的内容，本次调用 drawCanvas 绘制的内容覆盖在上面，默认 false。 */
      reserve?: boolean,
      /** 绘制完成后执行的回调函数 */
      callback?: Function
    ): void
    /** [CanvasContext.drawImage(string imageResource, number sx, number sy, number sWidth, number sHeight, number dx, number dy, number dWidth, number dHeight)](CanvasContext.drawImage.md)
     *
     * 绘制图像到画布
     *
     * **示例代码**
     *
     *
     *
     * 有三个版本的写法：
     *
     * - drawImage(imageResource, dx, dy)
     * - drawImage(imageResource, dx, dy, dWidth, dHeight)
     * - drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) 从 1.9.0 起支持
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   wx.chooseImage({
   success: function(res){
   ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
   ctx.draw()
   }
   })
   ```
     * ![] */
    drawImage(
      /** 所要绘制的图片资源 */
      imageResource: string,
      /** 图像的左上角在目标 canvas 上 x 轴的位置 */
      dx: number,
      /** 图像的左上角在目标 canvas 上 y 轴的位置 */
      dy: number
    ): void

    drawImage(
      /** 所要绘制的图片资源 */
      imageResource: string,
      /** 图像的左上角在目标 canvas 上 x 轴的位置 */
      dx: number,
      /** 图像的左上角在目标 canvas 上 y 轴的位置 */
      dy: number,
      /** 在目标画布上绘制图像的宽度，允许对绘制的图像进行缩放 */
      dWidth: number,
      /** 在目标画布上绘制图像的高度，允许对绘制的图像进行缩放 */
      dHeight: number
    ): void

    drawImage(
      /** 所要绘制的图片资源 */
      imageResource: string,
      /** 源图像的矩形选择框的左上角 x 坐标 */
      sx: number,
      /** 源图像的矩形选择框的左上角 y 坐标 */
      sy: number,
      /** 源图像的矩形选择框的宽度 */
      sWidth: number,
      /** 源图像的矩形选择框的高度 */
      sHeight: number,
      /** 图像的左上角在目标 canvas 上 x 轴的位置 */
      dx: number,
      /** 图像的左上角在目标 canvas 上 y 轴的位置 */
      dy: number,
      /** 在目标画布上绘制图像的宽度，允许对绘制的图像进行缩放 */
      dWidth: number,
      /** 在目标画布上绘制图像的高度，允许对绘制的图像进行缩放 */
      dHeight: number
    ): void
    /** [CanvasContext.fill()](CanvasContext.fill.md)
     *
     * 对当前路径中的内容进行填充。默认的填充色为黑色。
     *
     * **示例代码**
     *
     *
     *
     * 如果当前路径没有闭合，fill() 方法会将起点和终点进行连接，然后填充。
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.moveTo(10, 10)
   ctx.lineTo(100, 10)
   ctx.lineTo(100, 100)
   ctx.fill()
   ctx.draw()
   ```
     *
     * fill() 填充的的路径是从 beginPath() 开始计算，但是不会将 fillRect() 包含进去。
     *
     * ![]
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
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
     *
     * ![] */
    fill(): void
    /** [CanvasContext.fillRect(number x, number y, number width, number height)](CanvasContext.fillRect.md)
     *
     * 填充一个矩形。用 [`setFillStyle`] 设置矩形的填充色，如果没设置默认是黑色。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 75)
   ctx.draw()
   ```
     * ![] */
    fillRect(
      /** 矩形路径左上角的横坐标 */
      x: number,
      /** 矩形路径左上角的纵坐标 */
      y: number,
      /** 矩形路径的宽度 */
      width: number,
      /** 矩形路径的高度 */
      height: number
    ): void
    /** [CanvasContext.fillText(string text, number x, number y, number maxWidth)](CanvasContext.fillText.md)
     *
     * 在画布上绘制被填充的文本
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFontSize(20)
   ctx.fillText('Hello', 20, 20)
   ctx.fillText('MINA', 100, 100)
   ctx.draw()
   ```
     * ![] */
    fillText(
      /** 在画布上输出的文本 */
      text: string,
      /** 绘制文本的左上角 x 坐标位置 */
      x: number,
      /** 绘制文本的左上角 y 坐标位置 */
      y: number,
      /** 需要绘制的最大宽度，可选 */
      maxWidth?: number
    ): void
    /** [CanvasContext.lineTo(number x, number y)](CanvasContext.lineTo.md)
     *
     * 增加一个新点，然后创建一条从上次指定点到目标点的线。用 `stroke` 方法来画线条
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.moveTo(10, 10)
   ctx.rect(10, 10, 100, 50)
   ctx.lineTo(110, 60)
   ctx.stroke()
   ctx.draw()
   ```
     * ![] */
    lineTo(
      /** 目标位置的 x 坐标 */
      x: number,
      /** 目标位置的 y 坐标 */
      y: number
    ): void
    /** [CanvasContext.moveTo(number x, number y)](CanvasContext.moveTo.md)
     *
     * 把路径移动到画布中的指定点，不创建线条。用 `stroke` 方法来画线条
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.moveTo(10, 10)
   ctx.lineTo(100, 10)
   ctx.moveTo(10, 50)
   ctx.lineTo(100, 50)
   ctx.stroke()
   ctx.draw()
   ```
     * ![] */
    moveTo(
      /** 目标位置的 x 坐标 */
      x: number,
      /** 目标位置的 y 坐标 */
      y: number
    ): void
    /** [CanvasContext.quadraticCurveTo(number cpx, number cpy, number x, number y)](CanvasContext.quadraticCurveTo.md)
     *
     * 创建二次贝塞尔曲线路径。曲线的起始点为路径中前一个点。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // Draw points
   ctx.beginPath()
   ctx.arc(20, 20, 2, 0, 2   Math.PI)
   ctx.setFillStyle('red')
   ctx.fill()
   ctx.beginPath()
   ctx.arc(200, 20, 2, 0, 2   Math.PI)
   ctx.setFillStyle('lightgreen')
   ctx.fill()
   ctx.beginPath()
   ctx.arc(20, 100, 2, 0, 2   Math.PI)
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
     *
     * ![]
     *
     * 针对 moveTo(20, 20) quadraticCurveTo(20, 100, 200, 20) 的三个关键坐标如下：
     *
     * - 红色：起始点(20, 20)
     * - 蓝色：控制点(20, 100)
     * - 绿色：终止点(200, 20) */
    quadraticCurveTo(
      /** 贝塞尔控制点的 x 坐标 */
      cpx: number,
      /** 贝塞尔控制点的 y 坐标 */
      cpy: number,
      /** 结束点的 x 坐标 */
      x: number,
      /** 结束点的 y 坐标 */
      y: number
    ): void
    /** [CanvasContext.rect(number x, number y, number width, number height)](CanvasContext.rect.md)
     *
     * 创建一个矩形路径。需要用 [`fill`] 方法将矩形真正的画到 `canvas` 中
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.rect(10, 10, 150, 75)
   ctx.setFillStyle('red')
   ctx.fill()
   ctx.draw()
   ```
     * ![] */
    rect(
      /** 矩形路径左上角的横坐标 */
      x: number,
      /** 矩形路径左上角的纵坐标 */
      y: number,
      /** 矩形路径的宽度 */
      width: number,
      /** 矩形路径的高度 */
      height: number
    ): void
    /** [CanvasContext.restore()](CanvasContext.restore.md)
     *
     * 恢复之前保存的绘图上下文。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // save the default fill style
   ctx.save()
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 100)
   // restore to the previous saved state
   ctx.restore()
   ctx.fillRect(50, 50, 150, 100)
   ctx.draw()
   ```
     * ![] */
    restore(): void
    /** [CanvasContext.rotate(number rotate)](CanvasContext.rotate.md)
     *
     * 以原点为中心顺时针旋转当前坐标轴。多次调用旋转的角度会叠加。原点可以用 `translate` 方法修改。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.strokeRect(100, 10, 150, 100)
   ctx.rotate(20   Math.PI / 180)
   ctx.strokeRect(100, 10, 150, 100)
   ctx.rotate(20   Math.PI / 180)
   ctx.strokeRect(100, 10, 150, 100)
   ctx.draw()
   ```
     * ![] */
    rotate(
      /** 旋转角度，以弧度计 degrees * Math.PI/180；degrees 范围为 0-360 */
      rotate: number
    ): void
    /** [CanvasContext.save()](CanvasContext.save.md)
     *
     * 保存绘图上下文。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // save the default fill style
   ctx.save()
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 100)
   // restore to the previous saved state
   ctx.restore()
   ctx.fillRect(50, 50, 150, 100)
   ctx.draw()
   ```
     * ![] */
    save(): void
    /** [CanvasContext.scale(number scaleWidth, number scaleHeight)](CanvasContext.scale.md)
     *
     * 在调用后，之后创建的路径其横纵坐标会被缩放。多次调用倍数会相乘。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.strokeRect(10, 10, 25, 15)
   ctx.scale(2, 2)
   ctx.strokeRect(10, 10, 25, 15)
   ctx.scale(2, 2)
   ctx.strokeRect(10, 10, 25, 15)
   ctx.draw()
   ```
     * ![] */
    scale(
      /** 横坐标缩放的倍数 (1 = 100%，0.5 = 50%，2 = 200%) */
      scaleWidth: number,
      /** 纵坐标轴缩放的倍数 (1 = 100%，0.5 = 50%，2 = 200%) */
      scaleHeight: number
    ): void
    /** [CanvasContext.setFillStyle([Color] color)](CanvasContext.setFillStyle.md)
     *
     * 设置填充色。
     *
     * **代码示例**
     *
     *
   ```js
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 75)
   ctx.draw()
   ```
     * ![] */
    setFillStyle(
      /** [Color]
       *
       * 填充的颜色，默认颜色为 black。 */
      color: Color
    ): void
    /** [CanvasContext.setFontSize(number fontSize)](CanvasContext.setFontSize.md)
     *
     * 设置字体的字号
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
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
     * ![] */
    setFontSize(
      /** 字体的字号 */
      fontSize: number
    ): void
    /** [CanvasContext.setGlobalAlpha(number alpha)](CanvasContext.setGlobalAlpha.md)
     *
     * 设置全局画笔透明度。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 100)
   ctx.setGlobalAlpha(0.2)
   ctx.setFillStyle('blue')
   ctx.fillRect(50, 50, 150, 100)
   ctx.setFillStyle('yellow')
   ctx.fillRect(100, 100, 150, 100)
   ctx.draw()
   ```
     * ![] */
    setGlobalAlpha(
      /** 透明度。范围 0-1，0 表示完全透明，1 表示完全不透明。 */
      alpha: number
    ): void
    /** [CanvasContext.setLineCap(string lineCap)](CanvasContext.setLineCap.md)
     *
     * 设置线条的端点样式
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
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
     * ![] */
    setLineCap(
      /** 线条的结束端点样式 */
      lineCap: string
    ): void
    /** [CanvasContext.setLineDash(Array.<number> pattern, number offset)](CanvasContext.setLineDash.md)
     *
     * 设置虚线样式。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setLineDash([10, 20], 5);
   ctx.beginPath();
   ctx.moveTo(0,100);
   ctx.lineTo(400, 100);
   ctx.stroke();
   ctx.draw()
   ```
     * ![]
     *
     * 最低基础库： `1.6.0` */
    setLineDash(
      /** 一组描述交替绘制线段和间距（坐标空间单位）长度的数字 */
      pattern: Array<number>,
      /** 虚线偏移量 */
      offset: number
    ): void
    /** [CanvasContext.setLineJoin(string lineJoin)](CanvasContext.setLineJoin.md)
     *
     * 设置线条的交点样式
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
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
     * ![] */
    setLineJoin(
      /** 线条的结束交点样式 */
      lineJoin: string
    ): void
    /** [CanvasContext.setLineWidth(number lineWidth)](CanvasContext.setLineWidth.md)
     *
     * 设置线条的宽度
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
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
     *
     * ![] */
    setLineWidth(
      /** 线条的宽度，单位px */
      lineWidth: number
    ): void
    /** [CanvasContext.setMiterLimit(number miterLimit)](CanvasContext.setMiterLimit.md)
     *
     * 设置最大斜接长度。斜接长度指的是在两条线交汇处内角和外角之间的距离。当 [CanvasContext.setLineJoin()] 为 miter 时才有效。超过最大倾斜长度的，连接处将以 lineJoin 为 bevel 来显示。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
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
     * ![] */
    setMiterLimit(
      /** 最大斜接长度 */
      miterLimit: number
    ): void
    /** [CanvasContext.setShadow(number offsetX, number offsetY, number blur, string color)](CanvasContext.setShadow.md)
     *
     * 设定阴影样式。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.setShadow(10, 50, 50, 'blue')
   ctx.fillRect(10, 10, 150, 75)
   ctx.draw()
   ```
     * ![] */
    setShadow(
      /** 阴影相对于形状在水平方向的偏移，默认值为 0。 */
      offsetX: number,
      /** 阴影相对于形状在竖直方向的偏移，默认值为 0。 */
      offsetY: number,
      /** 阴影的模糊级别，数值越大越模糊。范围 0- 100。，默认值为 0。 */
      blur: number,
      /** 阴影的颜色。默认值为 black。 */
      color: string
    ): void
    /** [CanvasContext.setStrokeStyle([Color] color)](CanvasContext.setStrokeStyle.md)
     *
     * 设置描边颜色。
     *
     * **代码示例**
     *
     *
   ```js
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setStrokeStyle('red')
   ctx.strokeRect(10, 10, 150, 75)
   ctx.draw()
   ```
     * ![] */
    setStrokeStyle(
      /** [Color]
       *
       * 描边的颜色，默认颜色为 black。 */
      color: Color
    ): void
    /** [CanvasContext.setTextAlign(string align)](CanvasContext.setTextAlign.md)
     *
     * 设置文字的对齐
     *
     * **示例代码**
     *
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
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
     *
     * ![]
     *
     * 最低基础库： `1.1.0` */
    setTextAlign(
      /** 文字的对齐方式 */
      align: string
    ): void
    /** [CanvasContext.setTextBaseline(string textBaseline)](CanvasContext.setTextBaseline.md)
     *
     * 设置文字的竖直对齐
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
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
     * ![]
     *
     * 最低基础库： `1.4.0` */
    setTextBaseline(
      /** 文字的竖直对齐方式 */
      textBaseline: string
    ): void
    /** [CanvasContext.setTransform(number scaleX, number scaleY, number skewX, number skewY, number translateX, number translateY)](CanvasContext.setTransform.md)
     *
     * 使用矩阵重新设置（覆盖）当前变换的方法
     *
     * 最低基础库： `1.9.90` */
    setTransform(
      /** 水平缩放 */
      scaleX: number,
      /** 垂直缩放 */
      scaleY: number,
      /** 水平倾斜 */
      skewX: number,
      /** 垂直倾斜 */
      skewY: number,
      /** 水平移动 */
      translateX: number,
      /** 垂直移动 */
      translateY: number
    ): void
    /** [CanvasContext.stroke()](CanvasContext.stroke.md)
     *
     * 画出当前路径的边框。默认颜色色为黑色。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.moveTo(10, 10)
   ctx.lineTo(100, 10)
   ctx.lineTo(100, 100)
   ctx.stroke()
   ctx.draw()
   ```
     * ![]
     *
     * stroke() 描绘的的路径是从 beginPath() 开始计算，但是不会将 strokeRect() 包含进去。
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
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
     *
     * ![] */
    stroke(): void
    /** [CanvasContext.strokeRect(number x, number y, number width, number height)](CanvasContext.strokeRect.md)
     *
     * 画一个矩形(非填充)。 用 [`setStrokeStyle`] 设置矩形线条的颜色，如果没设置默认是黑色。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setStrokeStyle('red')
   ctx.strokeRect(10, 10, 150, 75)
   ctx.draw()
   ```
     * ![] */
    strokeRect(
      /** 矩形路径左上角的横坐标 */
      x: number,
      /** 矩形路径左上角的纵坐标 */
      y: number,
      /** 矩形路径的宽度 */
      width: number,
      /** 矩形路径的高度 */
      height: number
    ): void
    /** [CanvasContext.strokeText(string text, number x, number y, number maxWidth)](CanvasContext.strokeText.md)
     *
     * 给定的 (x, y) 位置绘制文本描边的方法
     *
     * 最低基础库： `1.9.90` */
    strokeText(
      /** 要绘制的文本 */
      text: string,
      /** 文本起始点的 x 轴坐标 */
      x: number,
      /** 文本起始点的 y 轴坐标 */
      y: number,
      /** 需要绘制的最大宽度，可选 */
      maxWidth?: number
    ): void
    /** [CanvasContext.transform(number scaleX, number scaleY, number skewX, number skewY, number translateX, number translateY)](CanvasContext.transform.md)
     *
     * 使用矩阵多次叠加当前变换的方法
     *
     * 最低基础库： `1.9.90` */
    transform(
      /** 水平缩放 */
      scaleX: number,
      /** 垂直缩放 */
      scaleY: number,
      /** 水平倾斜 */
      skewX: number,
      /** 垂直倾斜 */
      skewY: number,
      /** 水平移动 */
      translateX: number,
      /** 垂直移动 */
      translateY: number
    ): void
    /** [CanvasContext.translate(number x, number y)](CanvasContext.translate.md)
     *
     * 对当前坐标系的原点 (0, 0) 进行变换。默认的坐标系原点为页面左上角。
     *
     * **示例代码**
     *
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.strokeRect(10, 10, 150, 100)
   ctx.translate(20, 20)
   ctx.strokeRect(10, 10, 150, 100)
   ctx.translate(20, 20)
   ctx.strokeRect(10, 10, 150, 100)
   ctx.draw()
   ```
     *
     * ![] */
    translate(
      /** 水平坐标平移量 */
      x: number,
      /** 竖直坐标平移量 */
      y: number
    ): void
    /** [Object CanvasContext.measureText(string text)](CanvasContext.measureText.md)
     *
     * 测量文本尺寸信息。目前仅返回文本宽度。同步接口。
     *
     * 最低基础库： `1.9.90` */
    measureText(
      /** 要测量的文本 */
      text: string
    ): TextMetrics
    /** [[CanvasGradient] CanvasContext.createCircularGradient(number x, number y, number r)](CanvasContext.createCircularGradient.md)
     *
     * 创建一个圆形的渐变颜色。起点在圆心，终点在圆环。返回的`CanvasGradient`对象需要使用 [CanvasGradient.addColorStop()] 来指定渐变点，至少要两个。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // Create circular gradient
   const grd = ctx.createCircularGradient(75, 50, 50)
   grd.addColorStop(0, 'red')
   grd.addColorStop(1, 'white')
   // Fill with gradient
   ctx.setFillStyle(grd)
   ctx.fillRect(10, 10, 150, 80)
   ctx.draw()
   ```
     * ![] */
    createCircularGradient(
      /** 圆心的 x 坐标 */
      x: number,
      /** 圆心的 y 坐标 */
      y: number,
      /** 圆的半径 */
      r: number
    ): CanvasGradient
    /** [[CanvasGradient] CanvasContext.createLinearGradient(number x0, number y0, number x1, number y1)](CanvasContext.createLinearGradient.md)
     *
     * 创建一个线性的渐变颜色。返回的`CanvasGradient`对象需要使用 [CanvasGradient.addColorStop()] 来指定渐变点，至少要两个。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // Create linear gradient
   const grd = ctx.createLinearGradient(0, 0, 200, 0)
   grd.addColorStop(0, 'red')
   grd.addColorStop(1, 'white')
   // Fill with gradient
   ctx.setFillStyle(grd)
   ctx.fillRect(10, 10, 150, 80)
   ctx.draw()
   ```
     * ![] */
    createLinearGradient(
      /** 起点的 x 坐标 */
      x0: number,
      /** 起点的 y 坐标 */
      y0: number,
      /** 终点的 x 坐标 */
      x1: number,
      /** 终点的 y 坐标 */
      y1: number
    ): CanvasGradient
  }

  namespace canvasToTempFilePath {
    type Param0 = {
      /**
       * 画布x轴起点（默认0）
       *
       * @since 1.2.0
       */
      x?: number
      /**
       * 画布y轴起点（默认0）
       *
       * @since 1.2.0
       */
      y?: number
      /**
       * 画布宽度（默认为canvas宽度-x）
       *
       * @since 1.2.0
       */
      width?: number
      /**
       * 画布高度（默认为canvas高度-y）
       *
       * @since 1.2.0
       */
      height?: number
      /**
       * 输出图片宽度（默认为width）
       *
       * @since 1.2.0
       */
      destWidth?: number
      /**
       * 输出图片高度（默认为height）
       *
       * @since 1.2.0
       */
      destHeight?: number
      /**
       * 画布标识，传入 [`<canvas/>`](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 的 canvas-id
       */
      canvasId: string
      /**
       * 目标文件的类型，只支持 'jpg' 或 'png'。默认为 'png'
       *
       * @since 1.7.0
       */
      fileType?: string
      /**
       * 图片的质量，取值范围为 (0, 1]，不在范围内时当作1.0处理
       *
       * @since 1.7.0
       */
      quality?: number
      /**
       * 接口调用成功的回调函数
       */
      success?: Param0PropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: Param0PropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: Param0PropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type Param0PropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type Param0PropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type Param0PropComplete = () => any
  }
  /**
   * 把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 在 `draw` 回调里调用该方法才能保证图片导出成功。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.canvasToTempFilePath({
     x: 100,
     y: 200,
     width: 50,
     height: 50,
     destWidth: 100,
     destHeight: 100,
     canvasId: 'myCanvas',
     success: function(res) {
       console.log(res.tempFilePath)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasToTempFilePath.html
   */
  function canvasToTempFilePath(OBJECT: canvasToTempFilePath.Param0, instance?: any): void

  namespace canvasPutImageData {
    type Param = {
      /**
       * 画布标识，传入 [`<canvas />`](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 的 canvas-id
       */
      canvasId: string
      /**
       * 图像像素点数据，一维数组，每四项表示一个像素点的rgba
       */
      data: Uint8ClampedArray
      /**
       * 源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量）
       */
      x: number
      /**
       * 源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量）
       */
      y: number
      /**
       * 源图像数据矩形区域的宽度
       */
      width: number
      /**
       * 源图像数据矩形区域的高度
       */
      height?: number
    }
  }
  /**
   * @since 1.9.0
   *
   * 将像素数据绘制到画布的方法
   *
   * **示例代码：**
   *
   ```javascript
   const data = new Uint8ClampedArray([255, 0, 0, 1])
   Taro.canvasPutImageData({
     canvasId: 'myCanvas',
     x: 0,
     y: 0,
     width: 1,
     data: data,
     success(res) {}
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasPutImageData.html
   */
  function canvasPutImageData(OBJECT: canvasPutImageData.Param): Promise<any>

  namespace canvasGetImageData {
    type Promised = {
      /**
       * errMsg
       */
      errMsg: string
      /**
       * 图像数据矩形的宽度
       */
      width: number
      /**
       * 图像数据矩形的高度
       */
      height: number
      /**
       * 图像像素点数据，一维数组，每四项表示一个像素点的rgba
       */
      data: Uint8ClampedArray
    }
    type Param = {
      /**
       * 画布标识，传入 [`<canvas />`](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 的 canvas-id
       */
      canvasId: string
      /**
       * 将要被提取的图像数据矩形区域的左上角 x 坐标
       */
      x: number
      /**
       * 将要被提取的图像数据矩形区域的左上角 y 坐标
       */
      y: number
      /**
       * 将要被提取的图像数据矩形区域的宽度
       */
      width: number
      /**
       * 将要被提取的图像数据矩形区域的高度
       */
      height: number
    }
  }
  /**
   * @since 1.9.0
   *
   * 返回一个数组，用来描述 canvas 区域隐含的像素数据
   *
   * **示例代码：**
   *
   ```javascript
   Taro.canvasGetImageData({
     canvasId: 'myCanvas',
     x: 0,
     y: 0,
     width: 100,
     height: 100,
     success(res) {
       console.log(res.width) // 100
       console.log(res.height) // 100
       console.log(res.data instanceof Uint8ClampedArray) // true
       console.log(res.data.length) // 100   100   4
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasGetImageData.html
   */
  function canvasGetImageData(OBJECT: canvasGetImageData.Param): Promise<canvasGetImageData.Promised>

  // TODO: RenderingContext
}
