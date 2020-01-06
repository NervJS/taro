declare namespace Taro {
  /** 创建离屏 canvas 实例
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.createOffscreenCanvas.html
   */
  function createOffscreenCanvas(): OffscreenCanvas

  /** 创建 canvas 的绘图上下文 [CanvasContext](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.html) 对象
   * 
   * **Tip**: 需要指定 canvasId，该绘图上下文只作用于对应的 `<canvas/>`
   * @supported weapp, h5
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.createCanvasContext.html
   */
  function createCanvasContext(
    /** 要获取上下文的 [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 组件 canvas-id 属性 */
    canvasId: string,
    /** 在自定义组件下，当前组件实例的this，表示在这个自定义组件下查找拥有 canvas-id 的 [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) ，如果省略则不在任何自定义组件内查找 */
    component?: General.IAnyObject,
  ): CanvasContext

  /** 把当前画布指定区域的内容导出生成指定大小的图片。在 `draw()` 回调里调用该方法才能保证图片导出成功。
   * 
   * **Bug & Tip：**
   *
   * 1.  `tip`: 在 `draw` 回调里调用该方法才能保证图片导出成功。
   * @example
   * ```tsx
   * Taro.canvasToTempFilePath({
   *   x: 100,
   *   y: 200,
   *   width: 50,
   *   height: 50,
   *   destWidth: 100,
   *   destHeight: 100,
   *   canvasId: 'myCanvas',
   *   success: function (res) {
   *     console.log(res.tempFilePath)
   *   }
   * })
   * ```
   * @supported weapp, h5
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasToTempFilePath.html
   */
  function canvasToTempFilePath(
    option: canvasToTempFilePath.Option,
    /** 在自定义组件下，当前组件实例的this，以操作组件内 [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 组件 */
    component?: General.IAnyObject,
  ): Promise<canvasToTempFilePath.SuccessCallbackResult>
  namespace canvasToTempFilePath {
    interface Option {
      /** 画布标识，传入 [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 组件实例 （canvas type="2d" 时使用该属性）。 */
      canvas?: string
      /** 画布标识，传入 [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 组件的 canvas-id */
      canvasId: string
      /** 图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。 */
      quality?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 输出的图片的高度 */
      destHeight?: number
      /** 输出的图片的宽度 */
      destWidth?: number
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 目标文件的类型
       * @default "png"
       */
      fileType?: keyof fileType
      /** 指定的画布区域的高度 */
      height?: number
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 指定的画布区域的宽度 */
      width?: number
      /** 指定的画布区域的左上角横坐标 */
      x?: number
      /** 指定的画布区域的左上角纵坐标 */
      y?: number
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 生成文件的临时路径 */
      tempFilePath: string
      /** 调用结果 */
      errMsg: string
    }
    interface fileType {
      /** jpg 图片 */
      jpg
      /** png 图片 */
      png
    }
  }

  /** 将像素数据绘制到画布。在自定义组件下，第二个参数传入自定义组件实例 this，以操作组件内 <canvas> 组件
   * @supported weapp, h5
   * @example
   * ```tsx
   * const data = new Uint8ClampedArray([255, 0, 0, 1])
   * Taro.canvasPutImageData({
   *   canvasId: 'myCanvas',
   *   x: 0,
   *   y: 0,
   *   width: 1,
   *   data: data,
   *   success: function (res) {}
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasPutImageData.html
   */
  function canvasPutImageData(
    option: canvasPutImageData.Option,
    /** 在自定义组件下，当前组件实例的this，以操作组件内 [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 组件 */
    component?: General.IAnyObject,
  ): Promise<General.CallbackResult>
  namespace canvasPutImageData {
    interface Option {
      /** 画布标识，传入 [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 组件的 canvas-id 属性。 */
      canvasId: string
      /** 图像像素点数据，一维数组，每四项表示一个像素点的 rgba */
      data: Uint8ClampedArray
      /** 源图像数据矩形区域的高度 */
      height: number
      /** 源图像数据矩形区域的宽度 */
      width: number
      /** 源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量） */
      x: number
      /** 源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量） */
      y: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 获取 canvas 区域隐含的像素数据。
   * @supported weapp, h5
   * @example
   * ```tsx
   * Taro.canvasGetImageData({
   *   canvasId: 'myCanvas',
   *   x: 0,
   *   y: 0,
   *   width: 100,
   *   height: 100,
   *   success: function (res) {
   *     console.log(res.width) // 100
   *     console.log(res.height) // 100
   *     console.log(res.data instanceof Uint8ClampedArray) // true
   *     console.log(res.data.length) // 100 * 100 * 4
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasGetImageData.html
   */
  function canvasGetImageData(
    option: canvasGetImageData.Option,
    /** 在自定义组件下，当前组件实例的this，以操作组件内 [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 组件 */
    component?: General.IAnyObject,
  ): Promise<canvasGetImageData.SuccessCallbackResult>
  namespace canvasGetImageData {
    interface Option {
      /** 画布标识，传入 [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 组件的 `canvas-id` 属性。 */
      canvasId: string
      /** 将要被提取的图像数据矩形区域的高度 */
      height: number
      /** 将要被提取的图像数据矩形区域的宽度 */
      width: number
      /** 将要被提取的图像数据矩形区域的左上角横坐标 */
      x: number
      /** 将要被提取的图像数据矩形区域的左上角纵坐标 */
      y: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 图像像素点数据，一维数组，每四项表示一个像素点的 rgba */
      data: Uint8ClampedArray
      /** 图像数据矩形的高度 */
      height: number
      /** 图像数据矩形的宽度 */
      width: number
      /** 调用结果 */
      errMsg: string
    }
  }

  /** Canvas 实例，可通过 SelectorQuery 获取。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.html
   */
  interface Canvas {
    /** 取消由 requestAnimationFrame 添加到计划中的动画帧请求。支持在 2D Canvas 和 WebGL Canvas 下使用, 但不支持混用 2D 和 WebGL 的方法。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.cancelAnimationFrame.html
     */
    cancelAnimationFrame(requestID: number): void
    /** 创建一个 ImageData 对象。仅支持在 2D Canvas 中使用。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.createImageData.html
     */
    createImageData(): ImageData
    /** 创建一个图片对象。 支持在 2D Canvas 和 WebGL Canvas 下使用, 但不支持混用 2D 和 WebGL 的方法。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.createImage.html
     */
    createImage(): Image
    /** 支持获取 2D 和 WebGL 绘图上下文
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.getContext.html
     */
    getContext(contextType: string): RenderingContext
    /** 在下次进行重绘时执行。 支持在 2D Canvas 和 WebGL Canvas 下使用, 但不支持混用 2D 和 WebGL 的方法。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.requestAnimationFrame.html
     */
    requestAnimationFrame(
      /** 执行的 callback */
      callback: (...args: any[]) => any,
    ): number
  }

  /** canvas 组件的绘图上下文
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.html
   */
  interface CanvasContext {
    /** 创建一条弧线。
     *
     *   - 创建一个圆可以指定起始弧度为 0，终止弧度为 2 * Math.PI。
     *   - 用 `stroke` 或者 `fill` 方法来在 `canvas` 中画弧线。
     *
     * 针对 arc(100, 75, 50, 0, 1.5 * Math.PI)的三个关键坐标如下：
     *
     * - 绿色: 圆心 (100, 75)
     * - 红色: 起始弧度 (0)
     * - 蓝色: 终止弧度 (1.5 * Math.PI)
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * // Draw coordinates
     * ctx.arc(100, 75, 50, 0, 2 * Math.PI)
     * ctx.setFillStyle('#EEEEEE')
     * ctx.fill()
     * ctx.beginPath()
     * ctx.moveTo(40, 75)
     * ctx.lineTo(160, 75)
     * ctx.moveTo(100, 15)
     * ctx.lineTo(100, 135)
     * ctx.setStrokeStyle('#AAAAAA')
     * ctx.stroke()
     * ctx.setFontSize(12)
     * ctx.setFillStyle('black')
     * ctx.fillText('0', 165, 78)
     * ctx.fillText('0.5*PI', 83, 145)
     * ctx.fillText('1*PI', 15, 78)
     * ctx.fillText('1.5*PI', 83, 10)
     * // Draw points
     * ctx.beginPath()
     * ctx.arc(100, 75, 2, 0, 2 * Math.PI)
     * ctx.setFillStyle('lightgreen')
     * ctx.fill()
     * ctx.beginPath()
     * ctx.arc(100, 25, 2, 0, 2 * Math.PI)
     * ctx.setFillStyle('blue')
     * ctx.fill()
     * ctx.beginPath()
     * ctx.arc(150, 75, 2, 0, 2 * Math.PI)
     * ctx.setFillStyle('red')
     * ctx.fill()
     * // Draw arc
     * ctx.beginPath()
     * ctx.arc(100, 75, 50, 0, 1.5 * Math.PI)
     * ctx.setStrokeStyle('#333333')
     * ctx.stroke()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.arc.html
     */
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
      counterclockwise?: boolean,
    ): void
    /** 根据控制点和半径绘制圆弧路径。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.arcTo.html
     */
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
      radius: number,
    ): void
    /** 开始创建一个路径。需要调用 `fill` 或者 `stroke` 才会使用路径进行填充或描边
     *
     *   - 在最开始的时候相当于调用了一次 `beginPath`。
     *   - 同一个路径内的多次 `setFillStyle`、`setStrokeStyle`、`setLineWidth`等设置，以最后一次设置为准。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * // begin path
     * ctx.rect(10, 10, 100, 30)
     * ctx.setFillStyle('yellow')
     * ctx.fill()
     * // begin another path
     * ctx.beginPath()
     * ctx.rect(10, 40, 100, 30)
     * // only fill this rect, not in current path
     * ctx.setFillStyle('blue')
     * ctx.fillRect(10, 70, 100, 30)
     * ctx.rect(10, 100, 100, 30)
     * // it will fill current path
     * ctx.setFillStyle('red')
     * ctx.fill()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.beginPath.html
     */
    beginPath(): void
    /** 创建三次方贝塞尔曲线路径。曲线的起始点为路径中前一个点。
     *
     * 针对 moveTo(20, 20) bezierCurveTo(20, 100, 200, 100, 200, 20) 的三个关键坐标如下：
     *
     * - 红色：起始点(20, 20)
     * - 蓝色：两个控制点(20, 100) (200, 100)
     * - 绿色：终止点(200, 20)
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * // Draw points
     * ctx.beginPath()
     * ctx.arc(20, 20, 2, 0, 2 * Math.PI)
     * ctx.setFillStyle('red')
     * ctx.fill()
     * ctx.beginPath()
     * ctx.arc(200, 20, 2, 0, 2 * Math.PI)
     * ctx.setFillStyle('lightgreen')
     * ctx.fill()
     * ctx.beginPath()
     * ctx.arc(20, 100, 2, 0, 2 * Math.PI)
     * ctx.arc(200, 100, 2, 0, 2 * Math.PI)
     * ctx.setFillStyle('blue')
     * ctx.fill()
     * ctx.setFillStyle('black')
     * ctx.setFontSize(12)
     * // Draw guides
     * ctx.beginPath()
     * ctx.moveTo(20, 20)
     * ctx.lineTo(20, 100)
     * ctx.lineTo(150, 75)
     * ctx.moveTo(200, 20)
     * ctx.lineTo(200, 100)
     * ctx.lineTo(70, 75)
     * ctx.setStrokeStyle('#AAAAAA')
     * ctx.stroke()
     * // Draw quadratic curve
     * ctx.beginPath()
     * ctx.moveTo(20, 20)
     * ctx.bezierCurveTo(20, 100, 200, 100, 200, 20)
     * ctx.setStrokeStyle('black')
     * ctx.stroke()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.bezierCurveTo.html
     */
    bezierCurveTo(
      /** 第一个贝塞尔控制点的 x 坐标 */
      cp1x: number,
      /** 第一个贝塞尔控制点的 y 坐标 */
      cp1y: number,
      /** 第二个贝塞尔控制点的 x 坐标 */
      cp2x: number,
      /** 第二个贝塞尔控制点的 y 坐标 */
      cp2y: number,
      /** 结束点的 x 坐标 */
      x: number,
      /** 结束点的 y 坐标 */
      y: number,
    ): void
    /** 清除画布上在该矩形区域内的内容
     * @supported weapp
     * @example
     * clearRect 并非画一个白色的矩形在地址区域，而是清空，为了有直观感受，对 canvas 加了一层背景色。
     * ```html
     * <canvas canvas-id="myCanvas" style="border: 1px solid; background: #123456;"/>
     * ```
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setFillStyle('red')
     * ctx.fillRect(0, 0, 150, 200)
     * ctx.setFillStyle('blue')
     * ctx.fillRect(150, 0, 150, 200)
     * ctx.clearRect(10, 10, 150, 75)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.clearRect.html
     */
    clearRect(
      /** 矩形路径左上角的横坐标 */
      x: number,
      /** 矩形路径左上角的纵坐标 */
      y: number,
      /** 矩形路径的宽度 */
      width: number,
      /** 矩形路径的高度 */
      height: number,
    ): void
    /** 从原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。可以在使用 `clip` 方法前通过使用 `save` 方法对当前画布区域进行保存，并在以后的任意时间通过`restore`方法对其进行恢复。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * Taro.downloadFile({
     *   url: 'http://is5.mzstatic.com/image/thumb/Purple128/v4/75/3b/90/753b907c-b7fb-5877-215a-759bd73691a4/source/50x50bb.jpg',
     *   success: function(res) {
     *     ctx.save()
     *     ctx.beginPath()
     *     ctx.arc(50, 50, 25, 0, 2*Math.PI)
     *     ctx.clip()
     *     ctx.drawImage(res.tempFilePath, 25, 25)
     *     ctx.restore()
     *     ctx.draw()
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.clip.html
     */
    clip(): void
    /** 关闭一个路径。会连接起点和终点。如果关闭路径后没有调用 `fill` 或者 `stroke` 并开启了新的路径，那之前的路径将不会被渲染。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.moveTo(10, 10)
     * ctx.lineTo(100, 10)
     * ctx.lineTo(100, 100)
     * ctx.closePath()
     * ctx.stroke()
     * ctx.draw()
     * ```
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * // begin path
     * ctx.rect(10, 10, 100, 30)
     * ctx.closePath()
     * // begin another path
     * ctx.beginPath()
     * ctx.rect(10, 40, 100, 30)
     * // only fill this rect, not in current path
     * ctx.setFillStyle('blue')
     * ctx.fillRect(10, 70, 100, 30)
     * ctx.rect(10, 100, 100, 30)
     * // it will fill current path
     * ctx.setFillStyle('red')
     * ctx.fill()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.closePath.html
     */
    closePath(): void
    /** 对指定的图像创建模式的方法，可在指定的方向上重复元图像
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.createPattern.html
     */
    createPattern(
      /** 重复的图像源，仅支持包内路径和临时路径 */
      image: string,
      /** 如何重复图像 */
      repetition: keyof CanvasContext.repetition,
    ): void
    /** 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
     * @supported weapp
     * @example
     * 第二次 draw() reserve 为 true。所以保留了上一次的绘制结果，在上下文设置的 fillStyle 'red' 也变成了默认的 'black'。
     *
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setFillStyle('red')
     * ctx.fillRect(10, 10, 150, 100)
     * ctx.draw()
     * ctx.fillRect(50, 50, 150, 100)
     * ctx.draw(true)
     * ```
     * @example
     * 第二次 draw() reserve 为 false。所以没有保留了上一次的绘制结果和在上下文设置的 fillStyle 'red'。
     *
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setFillStyle('red')
     * ctx.fillRect(10, 10, 150, 100)
     * ctx.draw()
     * ctx.fillRect(50, 50, 150, 100)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.draw.html
     */
    draw(
      /** 本次绘制是否接着上一次绘制。即 reserve 参数为 false，则在本次调用绘制之前 native 层会先清空画布再继续绘制；若 reserve 参数为 true，则保留当前画布上的内容，本次调用 drawCanvas 绘制的内容覆盖在上面，默认 false。 */
      reserve?: boolean,
      /** 绘制完成后执行的回调函数 */
      callback?: (...args: any[]) => any,
    ): void
    /** 绘制图像到画布
     * @supported weapp
     * @example
     * 有三个版本的写法：
     *
     * - drawImage(imageResource, dx, dy)
     * - drawImage(imageResource, dx, dy, dWidth, dHeight)
     * - drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) 从 1.9.0 起支持
     *
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * Taro.chooseImage({
     *   success: function(res){
     *     ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
     *     ctx.draw()
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.drawImage.html
     */
    drawImage(
      /** 所要绘制的图片资源（网络图片要通过 getImageInfo / downloadFile 先下载） */
      imageResource: string,
      /** imageResource的左上角在目标 canvas 上 x 轴的位置 */
      dx: number,
      /** imageResource的左上角在目标 canvas 上 y 轴的位置 */
      dy: number,
    ): void
    /** 绘制图像到画布
     * @supported weapp
     * @example
     * 有三个版本的写法：
     *
     * - drawImage(imageResource, dx, dy)
     * - drawImage(imageResource, dx, dy, dWidth, dHeight)
     * - drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) 从 1.9.0 起支持
     *
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * Taro.chooseImage({
     *   success: function(res){
     *     ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
     *     ctx.draw()
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.drawImage.html
     */
    drawImage(
      /** 所要绘制的图片资源（网络图片要通过 getImageInfo / downloadFile 先下载） */
      imageResource: string,
      /** imageResource的左上角在目标 canvas 上 x 轴的位置 */
      dx: number,
      /** imageResource的左上角在目标 canvas 上 y 轴的位置 */
      dy: number,
      /** 在目标画布上绘制imageResource的宽度，允许对绘制的imageResource进行缩放 */
      dWidth: number,
      /** 在目标画布上绘制imageResource的高度，允许对绘制的imageResource进行缩放 */
      dHeight: number,
    ): void
    /** 绘制图像到画布
     * @supported weapp
     * @example
     * 有三个版本的写法：
     *
     * - drawImage(imageResource, dx, dy)
     * - drawImage(imageResource, dx, dy, dWidth, dHeight)
     * - drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) 从 1.9.0 起支持
     *
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * Taro.chooseImage({
     *   success: function(res){
     *     ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
     *     ctx.draw()
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.drawImage.html
     */
    drawImage(
      /** 所要绘制的图片资源（网络图片要通过 getImageInfo / downloadFile 先下载） */
      imageResource: string,
      /** 需要绘制到画布中的，imageResource的矩形（裁剪）选择框的左上角 x 坐标 */
      sx: number,
      /** 需要绘制到画布中的，imageResource的矩形（裁剪）选择框的左上角 y 坐标 */
      sy: number,
      /** 需要绘制到画布中的，imageResource的矩形（裁剪）选择框的宽度 */
      sWidth: number,
      /** 需要绘制到画布中的，imageResource的矩形（裁剪）选择框的高度 */
      sHeight: number,
      /** imageResource的左上角在目标 canvas 上 x 轴的位置 */
      dx: number,
      /** imageResource的左上角在目标 canvas 上 y 轴的位置 */
      dy: number,
      /** 在目标画布上绘制imageResource的宽度，允许对绘制的imageResource进行缩放 */
      dWidth: number,
      /** 在目标画布上绘制imageResource的高度，允许对绘制的imageResource进行缩放 */
      dHeight: number,
    ): void
    /** 对当前路径中的内容进行填充。默认的填充色为黑色。
     * @supported weapp
     * @example
     * 如果当前路径没有闭合，fill() 方法会将起点和终点进行连接，然后填充。
     *
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.moveTo(10, 10)
     * ctx.lineTo(100, 10)
     * ctx.lineTo(100, 100)
     * ctx.fill()
     * ctx.draw()
     * ```
     * @example
     * fill() 填充的的路径是从 beginPath() 开始计算，但是不会将 fillRect() 包含进去。
     *
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * // begin path
     * ctx.rect(10, 10, 100, 30)
     * ctx.setFillStyle('yellow')
     * ctx.fill()
     * // begin another path
     * ctx.beginPath()
     * ctx.rect(10, 40, 100, 30)
     * // only fill this rect, not in current path
     * ctx.setFillStyle('blue')
     * ctx.fillRect(10, 70, 100, 30)
     * ctx.rect(10, 100, 100, 30)
     * // it will fill current path
     * ctx.setFillStyle('red')
     * ctx.fill()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.fill.html
     */
    fill(): void
    /** 填充一个矩形。用 [`setFillStyle`](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setFillStyle.html) 设置矩形的填充色，如果没设置默认是黑色。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setFillStyle('red')
     * ctx.fillRect(10, 10, 150, 75)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.fillRect.html
     */
    fillRect(
      /** 矩形路径左上角的横坐标 */
      x: number,
      /** 矩形路径左上角的纵坐标 */
      y: number,
      /** 矩形路径的宽度 */
      width: number,
      /** 矩形路径的高度 */
      height: number,
    ): void
    /** 在画布上绘制被填充的文本
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setFontSize(20)
     * ctx.fillText('Hello', 20, 20)
     * ctx.fillText('MINA', 100, 100)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.fillText.html
     */
    fillText(
      /** 在画布上输出的文本 */
      text: string,
      /** 绘制文本的左上角 x 坐标位置 */
      x: number,
      /** 绘制文本的左上角 y 坐标位置 */
      y: number,
      /** 需要绘制的最大宽度，可选 */
      maxWidth?: number,
    ): void
    /** 增加一个新点，然后创建一条从上次指定点到目标点的线。用 `stroke` 方法来画线条
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.moveTo(10, 10)
     * ctx.rect(10, 10, 100, 50)
     * ctx.lineTo(110, 60)
     * ctx.stroke()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.lineTo.html
     */
    lineTo(
      /** 目标位置的 x 坐标 */
      x: number,
      /** 目标位置的 y 坐标 */
      y: number,
    ): void
    /** 把路径移动到画布中的指定点，不创建线条。用 `stroke` 方法来画线条
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.moveTo(10, 10)
     * ctx.lineTo(100, 10)
     * ctx.moveTo(10, 50)
     * ctx.lineTo(100, 50)
     * ctx.stroke()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.moveTo.html
     */
    moveTo(
      /** 目标位置的 x 坐标 */
      x: number,
      /** 目标位置的 y 坐标 */
      y: number,
    ): void
    /** 创建二次贝塞尔曲线路径。曲线的起始点为路径中前一个点。
     * 
     * 针对 moveTo(20, 20) quadraticCurveTo(20, 100, 200, 20) 的三个关键坐标如下：
     *
     * - 红色：起始点(20, 20)
     * - 蓝色：控制点(20, 100)
     * - 绿色：终止点(200, 20)
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * // Draw points
     * ctx.beginPath()
     * ctx.arc(20, 20, 2, 0, 2 * Math.PI)
     * ctx.setFillStyle('red')
     * ctx.fill()
     * ctx.beginPath()
     * ctx.arc(200, 20, 2, 0, 2 * Math.PI)
     * ctx.setFillStyle('lightgreen')
     * ctx.fill()
     * ctx.beginPath()
     * ctx.arc(20, 100, 2, 0, 2 * Math.PI)
     * ctx.setFillStyle('blue')
     * ctx.fill()
     * ctx.setFillStyle('black')
     * ctx.setFontSize(12)
     * // Draw guides
     * ctx.beginPath()
     * ctx.moveTo(20, 20)
     * ctx.lineTo(20, 100)
     * ctx.lineTo(200, 20)
     * ctx.setStrokeStyle('#AAAAAA')
     * ctx.stroke()
     * // Draw quadratic curve
     * ctx.beginPath()
     * ctx.moveTo(20, 20)
     * ctx.quadraticCurveTo(20, 100, 200, 20)
     * ctx.setStrokeStyle('black')
     * ctx.stroke()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.quadraticCurveTo.html
     */
    quadraticCurveTo(
      /** 贝塞尔控制点的 x 坐标 */
      cpx: number,
      /** 贝塞尔控制点的 y 坐标 */
      cpy: number,
      /** 结束点的 x 坐标 */
      x: number,
      /** 结束点的 y 坐标 */
      y: number,
    ): void
    /** 创建一个矩形路径。需要用 [`fill`](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.fill.html) 或者 [`stroke`](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.stroke.html) 方法将矩形真正的画到 `canvas` 中
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.rect(10, 10, 150, 75)
     * ctx.setFillStyle('red')
     * ctx.fill()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.rect.html
     */
    rect(
      /** 矩形路径左上角的横坐标 */
      x: number,
      /** 矩形路径左上角的纵坐标 */
      y: number,
      /** 矩形路径的宽度 */
      width: number,
      /** 矩形路径的高度 */
      height: number,
    ): void
    /** 恢复之前保存的绘图上下文。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * // save the default fill style
     * ctx.save()
     * ctx.setFillStyle('red')
     * ctx.fillRect(10, 10, 150, 100)
     * // restore to the previous saved state
     * ctx.restore()
     * ctx.fillRect(50, 50, 150, 100)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.restore.html
     */
    restore(): void
    /** 以原点为中心顺时针旋转当前坐标轴。多次调用旋转的角度会叠加。原点可以用 `translate` 方法修改。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.strokeRect(100, 10, 150, 100)
     * ctx.rotate(20 * Math.PI / 180)
     * ctx.strokeRect(100, 10, 150, 100)
     * ctx.rotate(20 * Math.PI / 180)
     * ctx.strokeRect(100, 10, 150, 100)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.rotate.html
     */
    rotate(
      /** 旋转角度，以弧度计 degrees * Math.PI/180；degrees 范围为 0-360 */
      rotate: number,
    ): void
    /** 保存绘图上下文。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * // save the default fill style
     * ctx.save()
     * ctx.setFillStyle('red')
     * ctx.fillRect(10, 10, 150, 100)
     * // restore to the previous saved state
     * ctx.restore()
     * ctx.fillRect(50, 50, 150, 100)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.save.html
     */
    save(): void
    /** 在调用后，之后创建的路径其横纵坐标会被缩放。多次调用倍数会相乘。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.strokeRect(10, 10, 25, 15)
     * ctx.scale(2, 2)
     * ctx.strokeRect(10, 10, 25, 15)
     * ctx.scale(2, 2)
     * ctx.strokeRect(10, 10, 25, 15)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.scale.html
     */
    scale(
      /** 横坐标缩放的倍数 (1 = 100%，0.5 = 50%，2 = 200%) */
      scaleWidth: number,
      /** 纵坐标轴缩放的倍数 (1 = 100%，0.5 = 50%，2 = 200%) */
      scaleHeight: number,
    ): void
    /** 设置填充色。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setFillStyle('red')
     * ctx.fillRect(10, 10, 150, 75)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setFillStyle.html
     */
    setFillStyle(
      /** 填充的颜色，默认颜色为 black。 */
      color: string | CanvasGradient,
    ): void
    /** 设置字体的字号
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setFontSize(20)
     * ctx.fillText('20', 20, 20)
     * ctx.setFontSize(30)
     * ctx.fillText('30', 40, 40)
     * ctx.setFontSize(40)
     * ctx.fillText('40', 60, 60)
     * ctx.setFontSize(50)
     * ctx.fillText('50', 90, 90)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setFontSize.html
     */
    setFontSize(
      /** 字体的字号 */
      fontSize: number,
    ): void
    /** 设置全局画笔透明度。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setFillStyle('red')
     * ctx.fillRect(10, 10, 150, 100)
     * ctx.setGlobalAlpha(0.2)
     * ctx.setFillStyle('blue')
     * ctx.fillRect(50, 50, 150, 100)
     * ctx.setFillStyle('yellow')
     * ctx.fillRect(100, 100, 150, 100)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setGlobalAlpha.html
     */
    setGlobalAlpha(
      /** 透明度。范围 0-1，0 表示完全透明，1 表示完全不透明。 */
      alpha: number,
    ): void
    /** 设置线条的端点样式
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.beginPath()
     * ctx.moveTo(10, 10)
     * ctx.lineTo(150, 10)
     * ctx.stroke()
     * ctx.beginPath()
     * ctx.setLineCap('butt')
     * ctx.setLineWidth(10)
     * ctx.moveTo(10, 30)
     * ctx.lineTo(150, 30)
     * ctx.stroke()
     * ctx.beginPath()
     * ctx.setLineCap('round')
     * ctx.setLineWidth(10)
     * ctx.moveTo(10, 50)
     * ctx.lineTo(150, 50)
     * ctx.stroke()
     * ctx.beginPath()
     * ctx.setLineCap('square')
     * ctx.setLineWidth(10)
     * ctx.moveTo(10, 70)
     * ctx.lineTo(150, 70)
     * ctx.stroke()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineCap.html
     */
    setLineCap(
      /** 线条的结束端点样式 */
      lineCap: keyof CanvasContext.lineCap,
    ): void
    /** 设置虚线样式。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setLineDash([10, 20], 5);
     * ctx.beginPath();
     * ctx.moveTo(0,100);
     * ctx.lineTo(400, 100);
     * ctx.stroke();
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineDash.html
     */
    setLineDash(
      /** 一组描述交替绘制线段和间距（坐标空间单位）长度的数字 */
      pattern: number[],
      /** 虚线偏移量 */
      offset: number,
    ): void
    /** 设置线条的交点样式
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.beginPath()
     * ctx.moveTo(10, 10)
     * ctx.lineTo(100, 50)
     * ctx.lineTo(10, 90)
     * ctx.stroke()
     * ctx.beginPath()
     * ctx.setLineJoin('bevel')
     * ctx.setLineWidth(10)
     * ctx.moveTo(50, 10)
     * ctx.lineTo(140, 50)
     * ctx.lineTo(50, 90)
     * ctx.stroke()
     * ctx.beginPath()
     * ctx.setLineJoin('round')
     * ctx.setLineWidth(10)
     * ctx.moveTo(90, 10)
     * ctx.lineTo(180, 50)
     * ctx.lineTo(90, 90)
     * ctx.stroke()
     * ctx.beginPath()
     * ctx.setLineJoin('miter')
     * ctx.setLineWidth(10)
     * ctx.moveTo(130, 10)
     * ctx.lineTo(220, 50)
     * ctx.lineTo(130, 90)
     * ctx.stroke()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineJoin.html
     */
    setLineJoin(
      /** 线条的结束交点样式 */
      lineJoin: keyof CanvasContext.lineJoin,
    ): void
    /** 设置线条的宽度
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.beginPath()
     * ctx.moveTo(10, 10)
     * ctx.lineTo(150, 10)
     * ctx.stroke()
     * ctx.beginPath()
     * ctx.setLineWidth(5)
     * ctx.moveTo(10, 30)
     * ctx.lineTo(150, 30)
     * ctx.stroke()
     * ctx.beginPath()
     * ctx.setLineWidth(10)
     * ctx.moveTo(10, 50)
     * ctx.lineTo(150, 50)
     * ctx.stroke()
     * ctx.beginPath()
     * ctx.setLineWidth(15)
     * ctx.moveTo(10, 70)
     * ctx.lineTo(150, 70)
     * ctx.stroke()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineWidth.html
     */
    setLineWidth(
      /** 线条的宽度，单位px */
      lineWidth: number,
    ): void
    /** 设置最大斜接长度。斜接长度指的是在两条线交汇处内角和外角之间的距离。当 [CanvasContext.setLineJoin()](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineJoin.html) 为 miter 时才有效。超过最大倾斜长度的，连接处将以 lineJoin 为 bevel 来显示。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.beginPath()
     * ctx.setLineWidth(10)
     * ctx.setLineJoin('miter')
     * ctx.setMiterLimit(1)
     * ctx.moveTo(10, 10)
     * ctx.lineTo(100, 50)
     * ctx.lineTo(10, 90)
     * ctx.stroke()
     * ctx.beginPath()
     * ctx.setLineWidth(10)
     * ctx.setLineJoin('miter')
     * ctx.setMiterLimit(2)
     * ctx.moveTo(50, 10)
     * ctx.lineTo(140, 50)
     * ctx.lineTo(50, 90)
     * ctx.stroke()
     * ctx.beginPath()
     * ctx.setLineWidth(10)
     * ctx.setLineJoin('miter')
     * ctx.setMiterLimit(3)
     * ctx.moveTo(90, 10)
     * ctx.lineTo(180, 50)
     * ctx.lineTo(90, 90)
     * ctx.stroke()
     * ctx.beginPath()
     * ctx.setLineWidth(10)
     * ctx.setLineJoin('miter')
     * ctx.setMiterLimit(4)
     * ctx.moveTo(130, 10)
     * ctx.lineTo(220, 50)
     * ctx.lineTo(130, 90)
     * ctx.stroke()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setMiterLimit.html
     */
    setMiterLimit(
      /** 最大斜接长度 */
      miterLimit: number,
    ): void
    /** 设定阴影样式。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setFillStyle('red')
     * ctx.setShadow(10, 50, 50, 'blue')
     * ctx.fillRect(10, 10, 150, 75)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setShadow.html
     */
    setShadow(
      /** 阴影相对于形状在水平方向的偏移，默认值为 0。 */
      offsetX: number,
      /** 阴影相对于形状在竖直方向的偏移，默认值为 0。 */
      offsetY: number,
      /** 阴影的模糊级别，数值越大越模糊。范围 0- 100。，默认值为 0。 */
      blur: number,
      /** 阴影的颜色。默认值为 black。 */
      color: string,
    ): void
    /** 设置描边颜色。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setStrokeStyle('red')
     * ctx.strokeRect(10, 10, 150, 75)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setStrokeStyle.html
     */
    setStrokeStyle(
      /** 描边的颜色，默认颜色为 black。 */
      color: string | CanvasGradient,
    ): void
    /** 设置文字的对齐
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setStrokeStyle('red')
     * ctx.moveTo(150, 20)
     * ctx.lineTo(150, 170)
     * ctx.stroke()
     * ctx.setFontSize(15)
     * ctx.setTextAlign('left')
     * ctx.fillText('textAlign=left', 150, 60)
     * ctx.setTextAlign('center')
     * ctx.fillText('textAlign=center', 150, 80)
     * ctx.setTextAlign('right')
     * ctx.fillText('textAlign=right', 150, 100)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setTextAlign.html
     */
    setTextAlign(
      /** 文字的对齐方式 */
      align: keyof CanvasContext.align,
    ): void
    /** 设置文字的竖直对齐
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setStrokeStyle('red')
     * ctx.moveTo(5, 75)
     * ctx.lineTo(295, 75)
     * ctx.stroke()
     * ctx.setFontSize(20)
     * ctx.setTextBaseline('top')
     * ctx.fillText('top', 5, 75)
     * ctx.setTextBaseline('middle')
     * ctx.fillText('middle', 50, 75)
     * ctx.setTextBaseline('bottom')
     * ctx.fillText('bottom', 120, 75)
     * ctx.setTextBaseline('normal')
     * ctx.fillText('normal', 200, 75)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setTextBaseline.html
     */
    setTextBaseline(
      /** 文字的竖直对齐方式 */
      textBaseline: keyof CanvasContext.textBaseline,
    ): void
    /** 使用矩阵重新设置（覆盖）当前变换的方法
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setTransform.html
     */
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
      translateY: number,
    ): void
    /** 画出当前路径的边框。默认颜色色为黑色。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.moveTo(10, 10)
     * ctx.lineTo(100, 10)
     * ctx.lineTo(100, 100)
     * ctx.stroke()
     * ctx.draw()
     * ```
     * @example
     * stroke() 描绘的的路径是从 beginPath() 开始计算，但是不会将 strokeRect() 包含进去。
     *
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * // begin path
     * ctx.rect(10, 10, 100, 30)
     * ctx.setStrokeStyle('yellow')
     * ctx.stroke()
     * // begin another path
     * ctx.beginPath()
     * ctx.rect(10, 40, 100, 30)
     * // only stoke this rect, not in current path
     * ctx.setStrokeStyle('blue')
     * ctx.strokeRect(10, 70, 100, 30)
     * ctx.rect(10, 100, 100, 30)
     * // it will stroke current path
     * ctx.setStrokeStyle('red')
     * ctx.stroke()
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.stroke.html
     */
    stroke(): void
    /** 画一个矩形(非填充)。 用 [`setStrokeStyle`](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setStrokeStyle.html) 设置矩形线条的颜色，如果没设置默认是黑色。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.setStrokeStyle('red')
     * ctx.strokeRect(10, 10, 150, 75)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.strokeRect.html
     */
    strokeRect(
      /** 矩形路径左上角的横坐标 */
      x: number,
      /** 矩形路径左上角的纵坐标 */
      y: number,
      /** 矩形路径的宽度 */
      width: number,
      /** 矩形路径的高度 */
      height: number,
    ): void
    /** 给定的 (x, y) 位置绘制文本描边的方法
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.strokeText.html
     */
    strokeText(
      /** 要绘制的文本 */
      text: string,
      /** 文本起始点的 x 轴坐标 */
      x: number,
      /** 文本起始点的 y 轴坐标 */
      y: number,
      /** 需要绘制的最大宽度，可选 */
      maxWidth?: number,
    ): void
    /** 使用矩阵多次叠加当前变换的方法
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.transform.html
     */
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
      translateY: number,
    ): void
    /** 对当前坐标系的原点 (0, 0) 进行变换。默认的坐标系原点为页面左上角。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * ctx.strokeRect(10, 10, 150, 100)
     * ctx.translate(20, 20)
     * ctx.strokeRect(10, 10, 150, 100)
     * ctx.translate(20, 20)
     * ctx.strokeRect(10, 10, 150, 100)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.translate.html
     */
    translate(
      /** 水平坐标平移量 */
      x: number,
      /** 竖直坐标平移量 */
      y: number,
    ): void
    /** 测量文本尺寸信息。目前仅返回文本宽度。同步接口。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.measureText.html
     */
    measureText(
      /** 要测量的文本 */
      text: string,
    ): TextMetrics
    /** 创建一个圆形的渐变颜色。起点在圆心，终点在圆环。返回的`CanvasGradient`对象需要使用 [CanvasGradient.addColorStop()](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasGradient.addColorStop.html) 来指定渐变点，至少要两个。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * // Create circular gradient
     * const grd = ctx.createCircularGradient(75, 50, 50)
     * grd.addColorStop(0, 'red')
     * grd.addColorStop(1, 'white')
     * // Fill with gradient
     * ctx.setFillStyle(grd)
     * ctx.fillRect(10, 10, 150, 80)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.createCircularGradient.html
     */
    createCircularGradient(
      /** 圆心的 x 坐标 */
      x: number,
      /** 圆心的 y 坐标 */
      y: number,
      /** 圆的半径 */
      r: number,
    ): CanvasGradient
    /** 创建一个线性的渐变颜色。返回的`CanvasGradient`对象需要使用 [CanvasGradient.addColorStop()](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasGradient.addColorStop.html) 来指定渐变点，至少要两个。
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * // Create linear gradient
     * const grd = ctx.createLinearGradient(0, 0, 200, 0)
     * grd.addColorStop(0, 'red')
     * grd.addColorStop(1, 'white')
     * // Fill with gradient
     * ctx.setFillStyle(grd)
     * ctx.fillRect(10, 10, 150, 80)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.createLinearGradient.html
     */
    createLinearGradient(
      /** 起点的 x 坐标 */
      x0: number,
      /** 起点的 y 坐标 */
      y0: number,
      /** 终点的 x 坐标 */
      x1: number,
      /** 终点的 y 坐标 */
      y1: number,
    ): CanvasGradient
    /** 填充颜色。用法同 [CanvasContext.setFillStyle()]。 */
    fillStyle: string
    /** 当前字体样式的属性。符合 [CSS font 语法](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font) 的 DOMString 字符串，至少需要提供字体大小和字体族名。默认值为 10px sans-serif。 */
    font: string
    /** 全局画笔透明度。范围 0-1，0 表示完全透明，1 表示完全不透明。 */
    globalAlpha: number
    /** 在绘制新形状时应用的合成操作的类型。目前安卓版本只适用于 `fill` 填充块的合成，用于 `stroke` 线段的合成效果都是 `source-over`。
     *
     * 目前支持的操作有
     * - 安卓：xor, source-over, source-atop, destination-out, lighter, overlay, darken, lighten, hard-light
     * - iOS：xor, source-over, source-atop, destination-over, destination-out, lighter, multiply, overlay, darken, lighten, color-dodge, color-burn, hard-light, soft-light, difference, exclusion, saturation, luminosity */
    globalCompositeOperation: string
    /** 线条的端点样式。用法同 [CanvasContext.setLineCap()]。 */
    lineCap: number
    /** 虚线偏移量，初始值为0 */
    lineDashOffset: number
    /** 线条的交点样式。用法同 [CanvasContext.setLineJoin()]。 */
    lineJoin: number
    /** 线条的宽度。用法同 [CanvasContext.setLineWidth()]。 */
    lineWidth: number
    /** 最大斜接长度。用法同 [CanvasContext.setMiterLimit()]。 */
    miterLimit: number
    /** 阴影的模糊级别 */
    shadowBlur: number
    /** 阴影的颜色 */
    shadowColor: number
    /** 阴影相对于形状在水平方向的偏移 */
    shadowOffsetX: number
    /** 阴影相对于形状在竖直方向的偏移 */
    shadowOffsetY: number
    /** 边框颜色。用法同 [CanvasContext.setFillStyle()]。 */
    strokeStyle: string
  }
  namespace CanvasContext {
    /** 参数 repetition 可选值 */
    interface repetition {
      /** 水平竖直方向都重复 */
      'repeat'
      /** 水平方向重复 */
      'repeat-x'
      /** 竖直方向重复 */
      'repeat-y'
      /** 不重复 */
      'no-repeat'
    }

    /** 参数 lineCap 可选值 */
    interface lineCap {
      /** 向线条的每个末端添加平直的边缘。 */
      butt
      /** 向线条的每个末端添加圆形线帽。 */
      round
      /** 向线条的每个末端添加正方形线帽。 */
      square
    }
    /** 参数 lineJoin 可选值 */
    interface lineJoin {
      /** 斜角 */
      bevel
      /** 圆角 */
      round
      /** 尖角 */
      miter
    }
    /** 参数 align 可选值 */
    interface align {
      /** 左对齐 */
      left
      /** 居中对齐 */
      center
      /** 右对齐 */
      right
    }
      /** 参数 textBaseline 可选值 */
    interface textBaseline {
      /** 顶部对齐 */
      top
      /** 底部对齐 */
      bottom
      /** 居中对齐 */
      middle
      normal
    }
  }

  /** 创建 canvas 的绘图上下文 CanvasContext 对象
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasGradient.html
   */
  interface CanvasGradient {
    /** 添加颜色的渐变点。小于最小 stop 的部分会按最小 stop 的 color 来渲染，大于最大 stop 的部分会按最大 stop 的 color 来渲染
     * @supported weapp
     * @example
     * ```tsx
     * const ctx = Taro.createCanvasContext('myCanvas')
     * // Create circular gradient
     * const grd = ctx.createLinearGradient(30, 10, 120, 10)
     * grd.addColorStop(0, 'red')
     * grd.addColorStop(0.16, 'orange')
     * grd.addColorStop(0.33, 'yellow')
     * grd.addColorStop(0.5, 'green')
     * grd.addColorStop(0.66, 'cyan')
     * grd.addColorStop(0.83, 'blue')
     * grd.addColorStop(1, 'purple')
     * // Fill with gradient
     * ctx.setFillStyle(grd)
     * ctx.fillRect(10, 10, 150, 80)
     * ctx.draw()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasGradient.addColorStop.html
     */
    addColorStop(
      /** 表示渐变中开始与结束之间的位置，范围 0-1。 */
      stop: number,
      /** 渐变点的颜色。 */
      color: string,
    ): void
  }

  /** 颜色。可以用以下几种方式来表示 canvas 中使用的颜色：
   *
   * - RGB 颜色： 如 `'rgb(255, 0, 0)'`
   * - RGBA 颜色：如 `'rgba(255, 0, 0, 0.3)'`
   * - 16 进制颜色： 如 `'#FF0000'`
   * - 预定义的颜色： 如 `'red'`
   *
   * 其中预定义颜色有以下148个：
   * *注意**: Color Name 大小写不敏感
   *
   * | Color Name           | HEX     |
   * | -------------------- | ------- |
   * | AliceBlue            | #F0F8FF |
   * | AntiqueWhite         | #FAEBD7 |
   * | Aqua                 | #00FFFF |
   * | Aquamarine           | #7FFFD4 |
   * | Azure                | #F0FFFF |
   * | Beige                | #F5F5DC |
   * | Bisque               | #FFE4C4 |
   * | Black                | #000000 |
   * | BlanchedAlmond       | #FFEBCD |
   * | Blue                 | #0000FF |
   * | BlueViolet           | #8A2BE2 |
   * | Brown                | #A52A2A |
   * | BurlyWood            | #DEB887 |
   * | CadetBlue            | #5F9EA0 |
   * | Chartreuse           | #7FFF00 |
   * | Chocolate            | #D2691E |
   * | Coral                | #FF7F50 |
   * | CornflowerBlue       | #6495ED |
   * | Cornsilk             | #FFF8DC |
   * | Crimson              | #DC143C |
   * | Cyan                 | #00FFFF |
   * | DarkBlue             | #00008B |
   * | DarkCyan             | #008B8B |
   * | DarkGoldenRod        | #B8860B |
   * | DarkGray             | #A9A9A9 |
   * | DarkGrey             | #A9A9A9 |
   * | DarkGreen            | #006400 |
   * | DarkKhaki            | #BDB76B |
   * | DarkMagenta          | #8B008B |
   * | DarkOliveGreen       | #556B2F |
   * | DarkOrange           | #FF8C00 |
   * | DarkOrchid           | #9932CC |
   * | DarkRed              | #8B0000 |
   * | DarkSalmon           | #E9967A |
   * | DarkSeaGreen         | #8FBC8F |
   * | DarkSlateBlue        | #483D8B |
   * | DarkSlateGray        | #2F4F4F |
   * | DarkSlateGrey        | #2F4F4F |
   * | DarkTurquoise        | #00CED1 |
   * | DarkViolet           | #9400D3 |
   * | DeepPink             | #FF1493 |
   * | DeepSkyBlue          | #00BFFF |
   * | DimGray              | #696969 |
   * | DimGrey              | #696969 |
   * | DodgerBlue           | #1E90FF |
   * | FireBrick            | #B22222 |
   * | FloralWhite          | #FFFAF0 |
   * | ForestGreen          | #228B22 |
   * | Fuchsia              | #FF00FF |
   * | Gainsboro            | #DCDCDC |
   * | GhostWhite           | #F8F8FF |
   * | Gold                 | #FFD700 |
   * | GoldenRod            | #DAA520 |
   * | Gray                 | #808080 |
   * | Grey                 | #808080 |
   * | Green                | #008000 |
   * | GreenYellow          | #ADFF2F |
   * | HoneyDew             | #F0FFF0 |
   * | HotPink              | #FF69B4 |
   * | IndianRed            | #CD5C5C |
   * | Indigo               | #4B0082 |
   * | Ivory                | #FFFFF0 |
   * | Khaki                | #F0E68C |
   * | Lavender             | #E6E6FA |
   * | LavenderBlush        | #FFF0F5 |
   * | LawnGreen            | #7CFC00 |
   * | LemonChiffon         | #FFFACD |
   * | LightBlue            | #ADD8E6 |
   * | LightCoral           | #F08080 |
   * | LightCyan            | #E0FFFF |
   * | LightGoldenRodYellow | #FAFAD2 |
   * | LightGray            | #D3D3D3 |
   * | LightGrey            | #D3D3D3 |
   * | LightGreen           | #90EE90 |
   * | LightPink            | #FFB6C1 |
   * | LightSalmon          | #FFA07A |
   * | LightSeaGreen        | #20B2AA |
   * | LightSkyBlue         | #87CEFA |
   * | LightSlateGray       | #778899 |
   * | LightSlateGrey       | #778899 |
   * | LightSteelBlue       | #B0C4DE |
   * | LightYellow          | #FFFFE0 |
   * | Lime                 | #00FF00 |
   * | LimeGreen            | #32CD32 |
   * | Linen                | #FAF0E6 |
   * | Magenta              | #FF00FF |
   * | Maroon               | #800000 |
   * | MediumAquaMarine     | #66CDAA |
   * | MediumBlue           | #0000CD |
   * | MediumOrchid         | #BA55D3 |
   * | MediumPurple         | #9370DB |
   * | MediumSeaGreen       | #3CB371 |
   * | MediumSlateBlue      | #7B68EE |
   * | MediumSpringGreen    | #00FA9A |
   * | MediumTurquoise      | #48D1CC |
   * | MediumVioletRed      | #C71585 |
   * | MidnightBlue         | #191970 |
   * | MintCream            | #F5FFFA |
   * | MistyRose            | #FFE4E1 |
   * | Moccasin             | #FFE4B5 |
   * | NavajoWhite          | #FFDEAD |
   * | Navy                 | #000080 |
   * | OldLace              | #FDF5E6 |
   * | Olive                | #808000 |
   * | OliveDrab            | #6B8E23 |
   * | Orange               | #FFA500 |
   * | OrangeRed            | #FF4500 |
   * | Orchid               | #DA70D6 |
   * | PaleGoldenRod        | #EEE8AA |
   * | PaleGreen            | #98FB98 |
   * | PaleTurquoise        | #AFEEEE |
   * | PaleVioletRed        | #DB7093 |
   * | PapayaWhip           | #FFEFD5 |
   * | PeachPuff            | #FFDAB9 |
   * | Peru                 | #CD853F |
   * | Pink                 | #FFC0CB |
   * | Plum                 | #DDA0DD |
   * | PowderBlue           | #B0E0E6 |
   * | Purple               | #800080 |
   * | RebeccaPurple        | #663399 |
   * | Red                  | #FF0000 |
   * | RosyBrown            | #BC8F8F |
   * | RoyalBlue            | #4169E1 |
   * | SaddleBrown          | #8B4513 |
   * | Salmon               | #FA8072 |
   * | SandyBrown           | #F4A460 |
   * | SeaGreen             | #2E8B57 |
   * | SeaShell             | #FFF5EE |
   * | Sienna               | #A0522D |
   * | Silver               | #C0C0C0 |
   * | SkyBlue              | #87CEEB |
   * | SlateBlue            | #6A5ACD |
   * | SlateGray            | #708090 |
   * | SlateGrey            | #708090 |
   * | Snow                 | #FFFAFA |
   * | SpringGreen          | #00FF7F |
   * | SteelBlue            | #4682B4 |
   * | Tan                  | #D2B48C |
   * | Teal                 | #008080 |
   * | Thistle              | #D8BFD8 |
   * | Tomato               | #FF6347 |
   * | Turquoise            | #40E0D0 |
   * | Violet               | #EE82EE |
   * | Wheat                | #F5DEB3 |
   * | White                | #FFFFFF |
   * | WhiteSmoke           | #F5F5F5 |
   * | Yellow               | #FFFF00 |
   * | YellowGreen          | #9ACD32 |
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Color.html
   */
  interface Color {}

  /** 图片对象
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Image.html
   */
  interface Image {
    /** 图片的真实高度 */
    height: number
    /** 图片加载发生错误后触发的回调函数 */
    onerror: (...args: any[]) => any
    /** 图片加载完成后触发的回调函数 */
    onload: (...args: any[]) => any
    /** 图片的 URL */
    src: string
    /** 图片的真实宽度 */
    width: number
  }
  
  /** ImageData 对象
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/ImageData.html
   */
  interface ImageData {
    /** 一维数组，包含以 RGBA 顺序的数据，数据使用 0 至 255（包含）的整数表示 */
    data: Uint8ClampedArray
    /** 使用像素描述 ImageData 的实际高度 */
    height: number
    /** 使用像素描述 ImageData 的实际宽度 */
    width: number
  }

  /** 离屏 canvas 实例，可通过 Taro.createOffscreenCanvas 创建。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/OffscreenCanvas.html
   */
  interface OffscreenCanvas {
    /** 该方法返回 OffscreenCanvas 的绘图上下文
     *
     * ****
     * 
     * 当前仅支持获取 WebGL 绘图上下文
     * @supported weapp
     */
    getContext(contextType: string): RenderingContext
  }

  /** Canvas 绘图上下文。
   *
   * ****
   *
   * - 通过 Canvas.getContext('2d') 接口可以获取 CanvasRenderingContext2D 对象，实现了 [HTML Canvas 2D Context](https://www.w3.org/TR/2dcontext/) 定义的属性、方法。
   * - 通过 Canvas.getContext('webgl') 或 OffscreenCanvas.getContext('webgl') 接口可以获取 WebGLRenderingContext 对象，实现了 [WebGL 1.0](https://www.khronos.org/registry/webgl/specs/latest/1.0/) 定义的所有属性、方法、常量。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/RenderingContext.html
   */
  interface RenderingContext {}
}
