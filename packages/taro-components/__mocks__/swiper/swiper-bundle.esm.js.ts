/* eslint-disable @typescript-eslint/no-unused-vars */
import { SwiperOptions } from 'swiper'
import { A11yMethods } from 'swiper/types/components/a11y'
import { AutoplayMethods } from 'swiper/types/components/autoplay'
import { ControllerMethods } from 'swiper/types/components/controller'
import { CoverflowEffectMethods } from 'swiper/types/components/effect-coverflow'
import { CubeEffectMethods } from 'swiper/types/components/effect-cube'
import { FadeEffectMethods } from 'swiper/types/components/effect-fade'
import { FlipEffectMethods } from 'swiper/types/components/effect-flip'
import { HashNavigationMethods } from 'swiper/types/components/hash-navigation'
import { HistoryMethods } from 'swiper/types/components/history'
import { KeyboardMethods } from 'swiper/types/components/keyboard'
import { LazyMethods } from 'swiper/types/components/lazy'
import { MousewheelMethods } from 'swiper/types/components/mousewheel'
import { NavigationMethods } from 'swiper/types/components/navigation'
import { PaginationMethods } from 'swiper/types/components/pagination'
import { ParallaxMethods } from 'swiper/types/components/parallax'
import { ScrollbarMethods } from 'swiper/types/components/scrollbar'
import { ThumbsMethods } from 'swiper/types/components/thumbs'
import { VirtualMethods } from 'swiper/types/components/virtual'
import { ZoomMethods } from 'swiper/types/components/zoom'
import { SwiperEvents } from 'swiper/types/swiper-events'

import type ISwiper from 'swiper'

export default class Swiper implements ISwiper {
  params: SwiperOptions
  $el
  el: HTMLElement
  $wrapperEl
  wrapperEl: HTMLElement
  slides
  width: number
  height: number
  translate: number
  progress: number
  activeIndex: number
  realIndex: number
  previousIndex: number
  isBeginning: boolean
  isEnd: boolean
  animating: boolean
  touches: { startX: number, startY: number, currentX: number, currentY: number, diff: number }
  clickedIndex: number
  clickedSlide: HTMLElement
  allowSlideNext: boolean
  allowSlidePrev: boolean
  allowTouchMove: boolean
  rtlTranslate: boolean
  disable (): void {}

  enable (): void {}

  setProgress (progress: number, speed?: number | undefined): void {}

  slideNext (speed?: number | undefined, runCallbacks?: boolean | undefined): void {}

  slidePrev (speed?: number | undefined, runCallbacks?: boolean | undefined): void {}

  slideTo (index: number, speed?: number | undefined, runCallbacks?: boolean | undefined): void {}

  slideToLoop (index: number, speed?: number | undefined, runCallbacks?: boolean | undefined): void {}

  slideReset (speed?: number | undefined, runCallbacks?: boolean | undefined): void {}

  slideToClosest (speed?: number | undefined, runCallbacks?: boolean | undefined): void {}

  updateAutoHeight (speed?: number | undefined): void {}

  update (): void {}

  updateSize (): void {}

  updateSlides (): void {}

  updateProgress (): void {}

  updateSlidesClasses (): void {}

  changeDirection (direction?: 'horizontal' | 'vertical' | undefined, needUpdate?: boolean | undefined): void {}

  detachEvents (): void {}

  attachEvents (): void {}

  init (): void {}

  destroy (deleteInstance?: boolean | undefined, cleanStyles?: boolean | undefined): void {}

  appendSlide (slides: string | HTMLElement | string[] | HTMLElement[]): void {}

  prependSlide (slides: string | HTMLElement | string[] | HTMLElement[]): void {}

  addSlide (index: number, slides: string | HTMLElement | string[] | HTMLElement[]): void {}

  removeSlide (slideIndex: number | number[]): void {}

  removeAllSlides (): void {}

  setTranslate (translate: any): void {}

  getTranslate () {}

  translateTo (translate: number, speed: number, runCallbacks?: boolean | undefined, translateBounds?: boolean | undefined) {}

  unsetGrabCursor (): void {}

  setGrabCursor (): void {}

  onAny (handler: (eventName: string, ...args: any[]) => void): void {}

  offAny (handler: (eventName: string, ...args: any[]) => void): void {}

  isHorizontal (): boolean {
    return false
  }

  getBreakpoint (breakpoints: { [width: number]: SwiperOptions,[ratio: string]: SwiperOptions } | undefined): string {
    return ''
  }

  setBreakpoint (): void {}

  currentBreakpoint: any
  destroyed: boolean
  modules: any[]
  a11y: A11yMethods
  autoplay: AutoplayMethods
  controller: ControllerMethods
  coverflowEffect: CoverflowEffectMethods
  cubeEffect: CubeEffectMethods
  fadeEffect: FadeEffectMethods
  flipEffect: FlipEffectMethods
  hashNavigation: HashNavigationMethods
  history: HistoryMethods
  keyboard: KeyboardMethods
  lazy: LazyMethods
  mousewheel: MousewheelMethods
  navigation: NavigationMethods
  pagination: PaginationMethods
  parallax: ParallaxMethods
  scrollbar: ScrollbarMethods
  thumbs: ThumbsMethods
  virtual: VirtualMethods
  zoom: ZoomMethods
  on<E extends keyof SwiperEvents> (event: E, handler: SwiperEvents[E]): void {}

  once<E extends keyof SwiperEvents> (event: E, handler: SwiperEvents[E]): void {}

  off<E extends keyof SwiperEvents> (event: E, handler: SwiperEvents[E]): void;
  off<E extends keyof SwiperEvents> (event: E): void;
  off (event: unknown, handler?: unknown): void {}

  emit<E extends keyof SwiperEvents> (event: E, ...args: any[]): void {}
}
