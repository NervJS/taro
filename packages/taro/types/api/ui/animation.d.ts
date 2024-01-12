import Taro from '../../index'

declare module '../../index' {
  namespace createAnimation {
    interface Option {
      /** 动画持续时间，单位 ms */
      duration?: number
      /** 动画的效果 */
      timingFunction?: keyof TimingFunction
      /** 动画延迟时间，单位 ms
       * @default 0
       */
      delay?: number
      /** @default "50% 50% 0" */
      transformOrigin?: string
      /**
       * 单位
       * @supported h5
       */
      unit?: string
    }
    interface TimingFunction {
      /** 动画从头到尾的速度是相同的 */
      linear
      /** 动画以低速开始，然后加快，在结束前变慢 */
      ease
      /** 动画以低速开始 */
      'ease-in'
      /** 动画以低速开始和结束 */
      'ease-in-out'
      /** 动画以低速结束 */
      'ease-out'
      /** 动画第一帧就跳至结束状态直到结束 */
      'step-start'
      /** 动画一直保持开始状态，最后一帧跳到结束状态 */
      'step-end'
    }
  }

  /** 动画对象
   * @supported weapp, h5, tt, harmony_hybrid
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.html
   */
  interface Animation {
    /** 导出动画队列。**export 方法每次调用后会清掉之前的动画操作**。
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.export.html
     */
    export(): {
      actions: TaroGeneral.IAnyObject[]
    }
    /** 表示一组动画完成。可以在一组动画中调用任意多个动画方法，一组动画中的所有动画会同时开始，一组动画完成后才会进行下一组动画。
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.step.html
     */
    step(option?: Animation.StepOption): Animation
    /** 同 [transform-function matrix](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix)
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.matrix.html
     */
    matrix(a: number, b: number, c: number, d: number, tx: number, ty: number): Animation
    /** 同 [transform-function matrix3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d)
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.matrix3d.html
     */
    matrix3d(a1: number, b1: number, c1: number, d1: number, a2: number, b2: number, c2: number, d2: number, a3: number, b3: number, c3: number, d3: number, a4: number, b4: number, c4: number, d4: number): Animation
    /** 从原点顺时针旋转一个角度
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotate.html
     */
    rotate(
      /** 旋转的角度。范围 [-180, 180] */
      angle: number,
    ): Animation
    /** 从 固定 轴顺时针旋转一个角度
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotate3d.html
     */
    rotate3d(
      /** 旋转轴的 x 坐标 */
      x: number,
      /** 旋转轴的 y 坐标 */
      y?: number,
      /** 旋转轴的 z 坐标 */
      z?: number,
      /** 旋转的角度。范围 [-180, 180] */
      angle?: number,
    ): Animation
    /** 从 X 轴顺时针旋转一个角度
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotateX.html
     */
    rotateX(
      /** 旋转的角度。范围 [-180, 180] */
      angle: number,
    ): Animation
    /** 从 Y 轴顺时针旋转一个角度
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotateY.html
     */
    rotateY(
      /** 旋转的角度。范围 [-180, 180] */
      angle: number,
    ): Animation
    /** 从 Z 轴顺时针旋转一个角度
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotateZ.html
     */
    rotateZ(
      /** 旋转的角度。范围 [-180, 180] */
      angle: number,
    ): Animation
    /** 缩放
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scale.html
     */
    scale(
      /** 当仅有 sx 参数时，表示在 X 轴、Y 轴同时缩放sx倍数 */
      sx: number,
      /** 在 Y 轴缩放 sy 倍数 */
      sy?: number,
    ): Animation
    /** 缩放
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scale3d.html
     */
    scale3d(
      /** x 轴的缩放倍数 */
      sx: number,
      /** y 轴的缩放倍数 */
      sy: number,
      /** z 轴的缩放倍数 */
      sz: number,
    ): Animation
    /** 缩放 X 轴
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scaleX.html
     */
    scaleX(
      /** X 轴的缩放倍数 */
      scale: number,
    ): Animation
    /** 缩放 Y 轴
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scaleY.html
     */
    scaleY(
      /** Y 轴的缩放倍数 */
      scale: number,
    ): Animation
    /** 缩放 Z 轴
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scaleZ.html
     */
    scaleZ(
      /** Z 轴的缩放倍数 */
      scale: number,
    ): Animation
    /** 对 X、Y 轴坐标进行倾斜
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.skew.html
     */
    skew(
      /** 对 X 轴坐标倾斜的角度，范围 [-180, 180] */
      ax: number,
      /** 对 Y 轴坐标倾斜的角度，范围 [-180, 180] */
      ay: number,
    ): Animation
    /** 对 X 轴坐标进行倾斜
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.skewX.html
     */
    skewX(
      /** 倾斜的角度，范围 [-180, 180] */
      angle: number,
    ): Animation
    /** 对 Y 轴坐标进行倾斜
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.skewY.html
     */
    skewY(
      /** 倾斜的角度，范围 [-180, 180] */
      angle: number,
    ): Animation
    /** 平移变换
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translate.html
     */
    translate(
      /** 当仅有该参数时表示在 X 轴偏移 tx，单位 px */
      tx?: number,
      /** 在 Y 轴平移的距离，单位为 px */
      ty?: number,
    ): Animation
    /** 对 xyz 坐标进行平移变换
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translate3d.html
     */
    translate3d(
      /** 在 X 轴平移的距离，单位为 px */
      tx?: number,
      /** 在 Y 轴平移的距离，单位为 px */
      ty?: number,
      /** 在 Z 轴平移的距离，单位为 px */
      tz?: number,
    ): Animation
    /** 对 X 轴平移
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translateX.html
     */
    translateX(
      /** 在 X 轴平移的距离，单位为 px */
      translation: number,
    ): Animation
    /** 对 Y 轴平移
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translateY.html
     */
    translateY(
      /** 在 Y 轴平移的距离，单位为 px */
      translation: number,
    ): Animation
    /** 对 Z 轴平移
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translateZ.html
     */
    translateZ(
      /** 在 Z 轴平移的距离，单位为 px */
      translation: number,
    ): Animation
    /** 设置透明度
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.opacity.html
     */
    opacity(
      /** 透明度，范围 0-1 */
      value: number,
    ): Animation
    /** 设置背景色
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.backgroundColor.html
     */
    backgroundColor(
      /** 颜色值 */
      value: string,
    ): Animation
    /** 设置宽度
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.width.html
     */
    width(
      /** 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 */
      value: number | string,
    ): Animation
    /** 设置高度
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.height.html
     */
    height(
      /** 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 */
      value: number | string,
    ): Animation
    /** 设置 left 值
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.left.html
     */
    left(
      /** 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 */
      value: number | string,
    ): Animation
    /** 设置 right 值
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.right.html
     */
    right(
      /** 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 */
      value: number | string,
    ): Animation
    /** 设置 top 值
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.top.html
     */
    top(
      /** 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 */
      value: number | string,
    ): Animation
    /** 设置 bottom 值
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.bottom.html
     */
    bottom(
      /** 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 */
      value: number | string,
    ): Animation
  }

  namespace Animation {
    interface StepOption {
      /** 动画延迟时间，单位 ms */
      delay?: number
      /** 动画持续时间，单位 ms */
      duration?: number
      /** 动画的效果 */
      timingFunction?: keyof TimingFunction
      transformOrigin?: string
    }
    interface TimingFunction {
      /** 动画从头到尾的速度是相同的 */
      linear
      /** 动画以低速开始，然后加快，在结束前变慢 */
      ease
      /** 动画以低速开始 */
      'ease-in'
      /** 动画以低速开始和结束 */
      'ease-in-out'
      /** 动画以低速结束 */
      'ease-out'
      /** 动画第一帧就跳至结束状态直到结束 */
      'step-start'
      /** 动画一直保持开始状态，最后一帧跳到结束状态 */
      'step-end'
    }
  }

  /** @ignore */
  interface KeyFrame {
    /** 关键帧的偏移，范围[0-1] */
    offset?: number
    /** 动画缓动函数 */
    ease?: string
    /** 基点位置，即 CSS transform-origin */
    transformOrigin?: string
    /** 背景颜色，即 CSS background-color */
    backgroundColor?: string
    /** 底边位置，即 CSS bottom */
    bottom?: number | string
    /** 高度，即 CSS height */
    height?: number | string
    /** 左边位置，即 CSS left */
    left?: number | string
    /** 宽度，即 CSS width */
    width?: number | string
    /** 不透明度，即 CSS opacity */
    opacity?: number | string
    /** 右边位置，即 CSS right */
    right?: number | string
    /** 顶边位置，即 CSS top */
    top?: number | string
    /** 变换矩阵，即 CSS transform matrix */
    matrix?: number[]
    /** 三维变换矩阵，即 CSS transform matrix3d */
    matrix3d?: number[]
    /** 旋转，即 CSS transform rotate */
    rotate?: number
    /** 三维旋转，即 CSS transform rotate3d */
    rotate3d?: number[]
    /** X 方向旋转，即 CSS transform rotateX */
    rotateX?: number
    /** Y 方向旋转，即 CSS transform rotateY */
    rotateY?: number
    /** Z 方向旋转，即 CSS transform rotateZ */
    rotateZ?: number
    /** 缩放，即 CSS transform scale */
    scale?: number[]
    /** 三维缩放，即 CSS transform scale3d */
    scale3d?: number[]
    /** X 方向缩放，即 CSS transform scaleX */
    scaleX?: number
    /** Y 方向缩放，即 CSS transform scaleY */
    scaleY?: number
    /** Z 方向缩放，即 CSS transform scaleZ */
    scaleZ?: number
    /** 倾斜，即 CSS transform skew */
    skew?: number[]
    /** X 方向倾斜，即 CSS transform skewX */
    skewX?: number
    /** Y 方向倾斜，即 CSS transform skewY */
    skewY?: number
    /** 位移，即 CSS transform translate */
    translate?: Array<number | string>
    /** 三维位移，即 CSS transform translate3d */
    translate3d?: Array<number | string>
    /** X 方向位移，即 CSS transform translateX */
    translateX?: number | string
    /** Y 方向位移，即 CSS transform translateY */
    translateY?: number | string
    /** Z 方向位移，即 CSS transform translateZ */
    translateZ?: number | string
    composite?: 'replace' | 'add' | 'accumulate' | 'auto'
    easing?: string
    [property: string]: any
  }

  /** @ignore */
  type ClearAnimationOptions = Record<keyof KeyFrame, boolean>

  /** @ignore */
  interface ScrollTimelineOption {
    /** 指定滚动元素的选择器（只支持 scroll-view），该元素滚动时会驱动动画的进度 */
    scrollSource: string
    /** 指定滚动的方向。有效值为 horizontal 或 vertical */
    orientation?: string
    /** 指定开始驱动动画进度的滚动偏移量，单位 px */
    startScrollOffset: number
    /** 指定停止驱动动画进度的滚动偏移量，单位 px */
    endScrollOffset: number
    /** 起始和结束的滚动范围映射的时间长度，该时间可用于与关键帧动画里的时间 (duration) 相匹配，单位 ms */
    timeRange: number
  }

  interface TaroStatic {
    /** 创建一个动画实例 [animation](../Animation)。调用实例的方法来描述动画。最后通过动画实例的 export 方法导出动画数据传递给组件的 animation 属性。
     * @supported weapp, h5, tt, harmony_hybrid
     * @example
     * ```tsx
     * var animation = Taro.createAnimation({
     *   transformOrigin: "50% 50%",
     *   duration: 1000,
     *   timingFunction: "ease",
     *   delay: 0
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/wx.createAnimation.html
     */
    createAnimation(option: createAnimation.Option): Animation
  }
}
