/* eslint-disable @typescript-eslint/no-unused-vars */
import { A11yMethods } from 'swiper/types/modules/a11y'
import { AutoplayMethods } from 'swiper/types/modules/autoplay'
import { ControllerMethods } from 'swiper/types/modules/controller'
import { CardsEffectMethods } from 'swiper/types/modules/effect-cards'
import { CoverflowEffectMethods } from 'swiper/types/modules/effect-coverflow'
import { CreativeEffectMethods } from 'swiper/types/modules/effect-creative'
import { CubeEffectMethods } from 'swiper/types/modules/effect-cube'
import { FadeEffectMethods } from 'swiper/types/modules/effect-fade'
import { FlipEffectMethods } from 'swiper/types/modules/effect-flip'
import { FreeModeMethods } from 'swiper/types/modules/free-mode'
import { HashNavigationMethods } from 'swiper/types/modules/hash-navigation'
import { HistoryMethods } from 'swiper/types/modules/history'
import { KeyboardMethods } from 'swiper/types/modules/keyboard'
import { MousewheelMethods } from 'swiper/types/modules/mousewheel'
import { NavigationMethods } from 'swiper/types/modules/navigation'
import { PaginationMethods } from 'swiper/types/modules/pagination'
import { ParallaxMethods } from 'swiper/types/modules/parallax'
import { ScrollbarMethods } from 'swiper/types/modules/scrollbar'
import { ThumbsMethods } from 'swiper/types/modules/thumbs'
import { VirtualMethods } from 'swiper/types/modules/virtual'
import { ZoomMethods } from 'swiper/types/modules/zoom'
import { SwiperEvents } from 'swiper/types/swiper-events'
import { SwiperOptions } from 'swiper/types/swiper-options'

import type ISwiper from 'swiper/types/swiper-class'

export default class Swiper implements ISwiper {
  initialized = false

  constructor (el: string | HTMLElement, options: SwiperOptions = {}) {
    this.params = options
    this.el = typeof el === 'string' ? document.querySelector(el) as HTMLElement : el
    this.realIndex = options.initialSlide || 0
    this.activeIndex = this.realIndex
    this.destroyed = false
    this.autoplay = {
      running: false,
      paused: false,
      timeLeft: 0,
      start: () => { this.autoplay.running = true },
      stop: () => { this.autoplay.running = false },
      pause: () => { this.autoplay.paused = true },
      resume: () => { this.autoplay.paused = false },
    } as AutoplayMethods
    if (options.init !== false) this.init()
  }

  originalParams: SwiperOptions
  loopedSlides: number | null
  snapIndex: number
  snapGrid: number[]
  isLocked: boolean
  swipeDirection: 'next' | 'prev'
  slidesPerViewDynamic (): number {
    throw new Error('Method not implemented.')
  }

  changeLanguageDirection (direction: 'rtl' | 'ltr'): void {
    throw new Error('Method not implemented.')
  }

  loopCreate (): void {
    throw new Error('Method not implemented.')
  }

  loopFix (): void {}

  loopDestroy (): void {
    // Swiper 11 的 recalcSlides 从 slidesEl 读取子节点
    Array.from(this.slidesEl.children)
  }

  init (el?: HTMLElement | undefined): ISwiper {
    if (el) this.el = el
    if (!this.el) return this
    this.wrapperEl = this.el.querySelector('.swiper-wrapper') as HTMLElement
    if (!this.wrapperEl) return this
    this.slidesEl = this.wrapperEl
    this.slides = Array.from(this.slidesEl.querySelectorAll('taro-swiper-item-core'))
    if (this.params.loop) {
      this.slides.forEach((slide, index) => slide.setAttribute('data-swiper-slide-index', String(index)))
    }
    this.initialized = true
    if (this.params.autoplay) this.autoplay.start()
    this.params.on?.init?.call(this, this)
    return this
  }

  creativeEffect: CreativeEffectMethods
  cardsEffect: CardsEffectMethods
  freeMode: FreeModeMethods
  params: SwiperOptions
  el: HTMLElement
  wrapperEl: HTMLElement
  slidesEl: HTMLElement
  slidesGrid: number[]
  slidesSizesGrid: number[]
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

  slideNext (speed?: number | undefined, runCallbacks?: boolean | undefined): boolean { return true }

  slidePrev (speed?: number | undefined, runCallbacks?: boolean | undefined): boolean { return true }

  slideTo (index: number, speed?: number | undefined, runCallbacks?: boolean | undefined): boolean { return true }

  slideToLoop (index: number, speed?: number | undefined, runCallbacks?: boolean | undefined): ISwiper { return this }

  slideReset (speed?: number | undefined, runCallbacks?: boolean | undefined): boolean { return true }

  slideToClosest (speed?: number | undefined, runCallbacks?: boolean | undefined): boolean { return true }

  minTranslate (): number { return 0 }

  maxTranslate (): number { return 0 }

  updateAutoHeight (speed?: number | undefined): void {}

  update (): void {}

  updateSize (): void {}

  updateSlides (): void {}

  updateProgress (): void {}

  updateSlidesClasses (): void {}

  changeDirection (direction?: 'horizontal' | 'vertical' | undefined, needUpdate?: boolean | undefined): void {}

  detachEvents (): void {}

  attachEvents (): void {}

  destroy (deleteInstance?: boolean | undefined, cleanStyles?: boolean | undefined): void {
    if (this.params.loop) this.loopDestroy()
    this.autoplay.stop()
    this.initialized = false
    this.destroyed = true
  }

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

  getBreakpoint (breakpoints: { [width: number]: SwiperOptions, [ratio: string]: SwiperOptions } | undefined): string {
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
