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

  loopDestroy (): void {
    throw new Error('Method not implemented.')
  }

  init (el?: HTMLElement | undefined): ISwiper {
    throw new Error('Method not implemented.')
  }

  creativeEffect: CreativeEffectMethods
  cardsEffect: CardsEffectMethods
  freeMode: FreeModeMethods
  params: SwiperOptions
  el: HTMLElement
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
