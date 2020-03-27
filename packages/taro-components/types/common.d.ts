import {CSSProperties} from 'react';

export type Omit<T, K extends keyof T> = Pick<T, ({ [P in keyof T]: P } & { [P in K]: never } & { [x: string]: never })[keyof T]>;

export interface StandardProps extends EventProps {
  /** 组件的唯一标示, 保持整个页面唯一 */
  id?: string
  /** 同 `class`，在 React/Nerv 里一般使用 `className` 作为 `class` 的代称 */
  className?: string
  /** 组件的内联样式, 可以动态设置的内联样式 */
  style?: string | CSSProperties
  /** 如果列表中项目的位置会动态改变或者有新的项目添加到列表中，
   * 需要使用 `wx:key` 来指定列表中项目的唯一的标识符。
   */
  key?: string | number
  /** 组件是否显示, 所有组件默认显示 */
  hidden?: boolean
  /** 动画属性 */
  animation?: { actions: object[] }
  /** 引用 */
  ref?: string | ((node: any) => any)
}

export interface FormItemProps {
  /** 表单数据标识 */
  name?: string
}

export interface EventProps {
  /** 手指触摸动作开始 */
  onTouchStart?: (event: ITouchEvent) => any

  /** 手指触摸后移动 */
  onTouchMove?: (event: ITouchEvent) => any

  /** 手指触摸动作被打断，如来电提醒，弹窗 */
  onTouchCancel?: (event: ITouchEvent) => any

  /** 手指触摸动作结束 */
  onTouchEnd?: (event: ITouchEvent) => any

  /** 手指触摸后马上离开 */
  onClick?: (event: ITouchEvent) => any

  /** 手指触摸后，超过350ms再离开，如果指定了事件回调函数并触发了这个事件，tap事件将不被触发 */
  onLongPress?: (event: CommonEvent) => any

  /** 手指触摸后，超过350ms再离开（推荐使用longpress事件代替） */
  onLongClick?: (event: CommonEvent) => any

  /** 会在 WXSS transition 或 Taro.createAnimation 动画结束后触发 */
  onTransitionEnd?: (event: CommonEvent) => any

  /** 会在一个 WXSS animation 动画开始时触发 */
  onAnimationStart?: (event: CommonEvent) => any

  /** 会在一个 WXSS animation 一次迭代结束时触发 */
  onAnimationIteration?: (event: CommonEvent) => any

  /** 会在一个 WXSS animation 动画完成时触发 */
  onAnimationEnd?: (event: CommonEvent) => any

  /** 在支持 3D Touch 的 iPhone 设备，重按时会触发 */
  onTouchForceChange?: (event: CommonEvent) => any
}

export type BaseEventOrigFunction<T> = (event: BaseEventOrig<T>) => any

export type TouchEventFunction = (event: ITouchEvent) => any

export type CommonEvent = BaseEventOrig<any>

export type CommonEventFunction<T = any> = BaseEventOrigFunction<T>

export interface BaseEventOrig<T> {
  /** 事件类型 */
  type: string

  /** 事件生成时的时间戳 */
  timeStamp: number

  /** 触发事件的组件的一些属性值集合 */
  target: Target

  /** 当前组件的一些属性值集合 */
  currentTarget: currentTarget

  /** 额外的信息 */
  detail: T

  /** 阻止元素发生默认的行为 */
  preventDefault: () => void

  /** 阻止事件冒泡到父元素,阻止任何父事件处理程序被执行 */
  stopPropagation: () => void
}

export interface ITouchEvent extends BaseEventOrig<any> {
  /** 触摸事件，当前停留在屏幕中的触摸点信息的数组 */
  touches: Array<ITouch>

  /** 触摸事件，当前变化的触摸点信息的数组 */
  changedTouches: Array<CanvasTouch>
}

export interface CanvasTouch {
  identifier: number
  x: number
  y: number
}

export interface ITouch extends Touch {
  /** 触摸点的标识符 */
  identifier: number
  /** 距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴 */
  pageX: number
  /** 距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴 */
  pageY: number
  /** 距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴 */
  clientX: number
  /** 距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴 */
  clientY: number
}

export interface Target {
  /** 事件源组件的id */
  id: string
  /** 当前组件的类型 */
  tagName: string
  /** 事件源组件上由data-开头的自定义属性组成的集合 */
  dataset: {
    [key: string]: any
  }
}

/**
 * @ignore
 */
export interface currentTarget extends Target {}

/** 网络状态数据 */
export interface netStatus {
  /* 当前视频编/码器输出的比特率，单位 kbps */
  videoBitrate?: number
  /* 当前音频编/码器输出的比特率，单位 kbps */
  audioBitrate?: number
  /* 当前视频帧率 */
  videoFPS?: number | string
  /* 当前视频 GOP,也就是每两个关键帧(I帧)间隔时长，单位 s */
  videoGOP?: number
  /* 当前的发送/接收速度 */
  netSpeed?: number
  /* 网络抖动情况，为 0 时表示没有任何抖动，值越大表明网络抖动越大，网络越不稳定 */
  netJitter?: number
  /* 视频画面的宽度 */
  videoWidth?: number | string
  /* 视频画面的高度 */
  videoHeight?: number | string
}
