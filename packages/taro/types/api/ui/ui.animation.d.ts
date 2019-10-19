declare namespace Taro {
  namespace createAnimation {
    type Param = {
      /**
       * 动画持续时间，单位ms
       *
       * @default 400
       */
      duration?: number
      /**
       * 定义动画的效果
       *
       * **timingFunction 有效值：**
       *
       *   值            |  说明
       * ----------------|--------------------------
       *   linear        |动画从头到尾的速度是相同的
       *   ease          |动画以低速开始，然后加快，在结束前变慢
       *   ease-in       |  动画以低速开始
       *   ease-in-out   |  动画以低速开始和结束
       *   ease-out      |  动画以低速结束
       *   step-start    |动画第一帧就跳至结束状态直到结束
       *   step-end      |动画一直保持开始状态，最后一帧跳到结束状态
       *
       * @default linear
       */
      timingFunction?: string
      /**
       * 动画延迟时间，单位 ms
       *
       * @default 0
       */
      delay?: number
      /**
       * 设置transform-origin
       *
       * @default 50% 50% 0
       */
      transformOrigin?: string
    }
  }
  /**
   * 创建一个动画实例[animation](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.html)。调用实例的方法来描述动画。最后通过动画实例的`export`方法导出动画数据传递给组件的`animation`属性。
   *
   * **注意: `export` 方法每次调用后会清掉之前的动画操作**
   *
   * **timingFunction 有效值：**
   *
   ```javascript
   var animation = Taro.createAnimation({
     transformOrigin: "50% 50%",
     duration: 1000,
     timingFunction: "ease",
     delay: 0
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/wx.createAnimation.html
   */
  function createAnimation(OBJECT: createAnimation.Param): Animation

  class Animation {
    /**
     * 导出动画队列
     * export 方法每次调用后会清掉之前的动画操作
     */
    export(): object[]
    /**
     * 表示一组动画完成
     * 可以在一组动画中调用任意多个动画方法，一组动画中的所有动画会同时开始，一组动画完成后才会进行下一组动画
     * @param obj
     */
    step(obj: object): any
    /**
     * 透明度，参数范围 0~1
     */
    opacity(value: any): any
    /**
     * 颜色值
     */
    backgroundColor(color: any): any
    /**
     * 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值
     */
    width(length: any): any
    /**
     * 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值
     */
    height(length: any): any
    /**
     * 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值
     */
    top(length: any): any
    /**
     * 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值
     */
    left(length: any): any
    /**
     * 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值
     */
    bottom(length: any): any
    /**
     * 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值
     */
    right(length: any): any
    /**
     * deg的范围-180~180，从原点顺时针旋转一个deg角度
     */
    rotate(deg: any): any
    /**
     * deg的范围-180~180，在X轴旋转一个deg角度
     */
    rotateX(deg: any): any
    /**
     * deg的范围-180~180，在Y轴旋转一个deg角度
     */
    rotateY(deg: any): any
    /**
     * deg的范围-180~180，在Z轴旋转一个deg角度
     */
    rotateZ(deg: any): any
    /**
     * 同[transform-function rotate3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d)
     */
    rotate3d(x: any, y: any, z: any, deg: any): any
    /**
     * 一个参数时，表示在X轴、Y轴同时缩放sx倍数；两个参数时表示在X轴缩放sx倍数，在Y轴缩放sy倍数
     */
    scale(sx: any, sy?: any): any
    /**
     * 在X轴缩放sx倍数
     */
    scaleX(sx: any): any
    /**
     * 在Y轴缩放sy倍数
     */
    scaleY(sy: any): any
    /**
     * 在Z轴缩放sy倍数
     */
    scaleZ(sz: any): any
    /**
     * 在X轴缩放sx倍数，在Y轴缩放sy倍数，在Z轴缩放sz倍数
     */
    scale3d(sx: any, sy: any, sz: any): any
    /**
     * 一个参数时，表示在X轴偏移tx，单位px；两个参数时，表示在X轴偏移tx，在Y轴偏移ty，单位px。
     */
    translate(tx: any, ty?: any): any
    /**
     * 在X轴偏移tx，单位px
     */
    translateX(tx: any): any
    /**
     * 在Y轴偏移tx，单位px
     */
    translateY(ty: any): any
    /**
     * 在Z轴偏移tx，单位px
     */
    translateZ(tz: any): any
    /**
     * 在X轴偏移tx，在Y轴偏移ty，在Z轴偏移tz，单位px
     */
    translate3d(tx: any, ty: any, tz: any): any
    /**
     * 参数范围-180~180；一个参数时，Y轴坐标不变，X轴坐标延顺时针倾斜ax度；两个参数时，分别在X轴倾斜ax度，在Y轴倾斜ay度
     */
    skew(ax: any, ay?: any): any
    /**
     * 参数范围-180~180；Y轴坐标不变，X轴坐标延顺时针倾斜ax度
     */
    skewX(ax: any): any
    /**
     * 参数范围-180~180；X轴坐标不变，Y轴坐标延顺时针倾斜ay度
     */
    skewY(ay: any): any
    /**
     * 同[transform-function matrix](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix)
     */
    matrix(a: any, b: any, c: any, d: any, tx: any, ty: any): any
    /**
     * 同[transform-function matrix3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d)
     */
    matrix3d(): any
  }
}
