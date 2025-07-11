/** @ignore */
export interface KeyFrame {
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
export interface ScrollTimelineOption {
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
