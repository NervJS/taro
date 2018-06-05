import { ComponentType } from 'react'

interface StandardProps extends EventProps {
  id?: string,
  className?: string,
  key?: string,
  hidden?: boolean
}

interface EventProps {
  onTouchStart?: (event: ITouchEvent) => any,
  onTouchMove?: (event: ITouchEvent) => any,
  onTouchCancel?: (event: ITouchEvent) => any,
  onTouchEnd?: (event: ITouchEvent) => any,
  onClick?: (event: ITouchEvent) => any,
  onLongPress?: (event: BaseEvent) => any,
  onLongClick?: (event: BaseEvent) => any,
  onTransitionEnd?: (event: BaseEvent) => any,
  onAnimationStart?: (event: BaseEvent) => any,
  onAnimationIteration?: (event: BaseEvent) => any,
  onAnimationEnd?: (event: BaseEvent) => any,
  onTouchForceChange?: (event: BaseEvent) => any
}

interface BaseEvent {
  type: string,
  timeStamp: number,
  target: Target,
  currentTarget: currentTarget,
  detail: Object
}

interface ITouchEvent extends BaseEvent {
  touches: Array<ITouch>,
  changedTouches: Array<CanvasTouch>
}

interface CanvasTouch {
  identifier: number,
  x: number,
  y: number
}

interface ITouch extends Touch {
  identifier: number,
  pageX: number,
  pageY: number,
  clientX: number,
  clientY: number
}

interface Target {
  id: string,
  tagName: string,
  dataset: object
}

interface currentTarget extends Target {}

interface ViewProps {
  hoverClass?: string,
  hoverStopPropagation?: boolean,
  hoverStartTime?: number,
  hoverStayTime?: number
}

type View = ComponentType<ViewProps>

interface ScrollViewProps {
  scrollX?: boolean,
  scrollY?: boolean,
  upperThreshold?: number,
  lowerThreshold?: number,
  scrollTop?: number,
  scrollLeft?: number,
  scrollIntoView?: string,
  enableBackToTop?: boolean,
  scrollWithAnimation?: boolean,
  onScrollToUpper?: (event: BaseEvent) => any,
  onScrollToLower?: (event: BaseEvent) => any,
  onScroll?: (event: BaseEvent) => any
}

type ScrollView = ComponentType<ViewProps>

export {
  View,
  ScrollView
}
