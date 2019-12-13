declare namespace Taro {
  namespace createAnimation {
    interface Option {
      /** 动画延迟时间，单位 ms */
      delay?: number
      /** 动画持续时间，单位 ms */
      duration?: number
      /** 动画的效果 */
      timingFunction?: keyof timingFunction
      transformOrigin?: string
    }
    interface timingFunction {
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

  /** 创建一个动画实例 animation。调用实例的方法来描述动画。最后通过动画实例的 export 方法导出动画数据传递给组件的 animation 属性。
   * @supported weapp, h5
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
  function createAnimation(option: createAnimation.Option): Animation

  interface Animation {
    /** 导出动画队列。**export 方法每次调用后会清掉之前的动画操作。**
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.export.html
     */
    export(): General.IAnyObject[]
    /** 设置背景色
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.backgroundColor.html
     */
    backgroundColor(
      /** 颜色值 */
      value: string,
    ): Animation
    /** 设置 bottom 值
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.bottom.html
     */
    bottom(
      /** 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 */
      value: number | string,
    ): Animation
    /** 设置高度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.height.html
     */
    height(
      /** 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 */
      value: number | string,
    ): Animation
    /** 设置 left 值
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.left.html
     */
    left(
      /** 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 */
      value: number | string,
    ): Animation
    /** 同 [transform-function matrix](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix)
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.matrix.html
     */
    matrix(): Animation
    /** 同 [transform-function matrix3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d)
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.matrix3d.html
     */
    matrix3d(): Animation
    /** 设置透明度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.opacity.html
     */
    opacity(
      /** 透明度，范围 0-1 */
      value: number,
    ): Animation
    /** 设置 right 值
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.right.html
     */
    right(
      /** 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 */
      value: number | string,
    ): Animation
    /** 从原点顺时针旋转一个角度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotate.html
     */
    rotate(
      /** 旋转的角度。范围 [-180, 180] */
      angle: number,
    ): Animation
    /** 从 固定 轴顺时针旋转一个角度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotate3d.html
     */
    rotate3d(
      /** 旋转轴的 x 坐标 */
      x: number,
      /** 旋转轴的 y 坐标 */
      y: number,
      /** 旋转轴的 z 坐标 */
      z: number,
      /** 旋转的角度。范围 [-180, 180] */
        angle: number,
    ): Animation
    /** 从 X 轴顺时针旋转一个角度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotateX.html
     */
    rotateX(
      /** 旋转的角度。范围 [-180, 180] */
      angle: number,
    ): Animation
    /** 从 Y 轴顺时针旋转一个角度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotateY.html
     */
    rotateY(
      /** 旋转的角度。范围 [-180, 180] */
      angle: number,
    ): Animation
    /** 从 Z 轴顺时针旋转一个角度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotateZ.html
     */
    rotateZ(
      /** 旋转的角度。范围 [-180, 180] */
      angle: number,
    ): Animation
    /** 缩放
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scale.html
     */
    scale(
      /** 当仅有 sx 参数时，表示在 X 轴、Y 轴同时缩放sx倍数 */
      sx: number,
      /** 在 Y 轴缩放 sy 倍数 */
      sy?: number,
    ): Animation
    /** 缩放
     * @supported weapp
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
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scaleX.html
     */
    scaleX(
      /** X 轴的缩放倍数 */
      scale: number,
    ): Animation
    /** 缩放 Y 轴
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scaleY.html
     */
    scaleY(
      /** Y 轴的缩放倍数 */
      scale: number,
    ): Animation
    /** 缩放 Z 轴
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scaleZ.html
     */
    scaleZ(
      /** Z 轴的缩放倍数 */
      scale: number,
    ): Animation
    /** 对 X、Y 轴坐标进行倾斜
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.skew.html
     */
    skew(
      /** 对 X 轴坐标倾斜的角度，范围 [-180, 180] */
      ax: number,
      /** 对 Y 轴坐标倾斜的角度，范围 [-180, 180] */
      ay: number,
    ): Animation
    /** 对 X 轴坐标进行倾斜
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.skewX.html
     */
    skewX(
      /** 倾斜的角度，范围 [-180, 180] */
      angle: number,
    ): Animation
    /** 对 Y 轴坐标进行倾斜
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.skewY.html
     */
    skewY(
      /** 倾斜的角度，范围 [-180, 180] */
      angle: number,
    ): Animation
    /** 表示一组动画完成。可以在一组动画中调用任意多个动画方法，一组动画中的所有动画会同时开始，一组动画完成后才会进行下一组动画。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.step.html
     */
    step(option?: Animation.StepOption): Animation
    /** 设置 top 值
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.top.html
     */
    top(
      /** 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 */
      value: number | string,
    ): Animation
    /** 平移变换
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translate.html
     */
    translate(
      /** 当仅有该参数时表示在 X 轴偏移 tx，单位 px */
      tx?: number,
      /** 在 Y 轴平移的距离，单位为 px */
      ty?: number,
    ): Animation
    /** 对 xyz 坐标进行平移变换
     * @supported weapp
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
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translateX.html
     */
    translateX(
      /** 在 X 轴平移的距离，单位为 px */
      translation: number,
    ): Animation
    /** 对 Y 轴平移
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translateY.html
     */
    translateY(
      /** 在 Y 轴平移的距离，单位为 px */
      translation: number,
    ): Animation
    /** 对 Z 轴平移
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translateZ.html
     */
    translateZ(
      /** 在 Z 轴平移的距离，单位为 px */
      translation: number,
    ): Animation
    /** 设置宽度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.width.html
     */
    width(
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
      timingFunction?: keyof timingFunction
      transformOrigin?: string
    }
    interface timingFunction {
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
}
