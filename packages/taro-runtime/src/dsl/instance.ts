import VueCtor, { ComponentOptions, VNode } from 'vue'

import type { Component as Vue3Component } from '@vue/runtime-core'
import type { Component, ComponentClass } from 'react'
import type { CombinedVueInstance } from 'vue/types/vue'
import type { TaroElement } from '../dom/element'
import type { Func, MpEvent } from '../interface'

export interface Instance<T = Record<string, any>> extends Component<T>, Show, PageInstance {
  tid?: string
  $forceUpdate?(): void
  $nextTick?(cb: () => void): void
  $options: Instance
}

export interface VueAppInstance extends ComponentOptions<VueCtor> {
  $options: AppInstance
}

export type VueInstance<M = Record<string, any>, P = Record<string, any>> = CombinedVueInstance<VueCtor, Record<string, any>, M, P, Record<never, any>> & VueInternal

interface VueInternal {
  _render(): VNode
  _update(vnode: VNode, hyrate: boolean): void
}

export interface PageProps {
  tid?: string
}

export interface ReactPageComponent<T = PageProps> extends ComponentClass<T>, PageInstance {
  //
}

export interface ReactPageInstance<T = PageProps> extends Component<T>, PageInstance {
  componentDidShow?(): void
  componentDidHide?(): void
}

export interface ReactAppInstance<T = AppInstance> extends Component<T>, AppInstance {
  //
}

export interface PageLifeCycle extends Show {
  eh?(event: MpEvent): void
  onAddToFavorites?(): void
  onLoad?(options: Record<string, unknown>, cb?: Func): void
  onOptionMenuClick?(): void
  onPageScroll?(obj: { scrollTop: number }): void
  onPullDownRefresh?(): void
  onPullIntercept?(): void
  onPopMenuClick?(): void
  onReachBottom?(): void
  onReady?(): void
  onResize?(options: unknown): void
  onSaveExitState?(): void
  onShareAppMessage?(obj: { from: string, target?: TaroElement, webViewUrl: string }): void
  onShareTimeline?(): void
  onTabItemTap?(obj: { index: string, pagePath: string, text: string }): void
  onTitleClick?(): void
  onUnload?(): void
}

export interface PageInstance extends PageLifeCycle {
  /** 页面的初始数据 */
  data?: Record<string, unknown>
  /** 页面路径 */
  path?: string
  /** 页面的组件选项 */
  options?: Record<string, unknown>
}

interface Show {
  componentDidShow?(): void
  componentDidHide?(): void
  onShow?(): void
  onHide?(): void
}

export interface AppInstance extends Show {
  componentDidShow?(options?: Record<string, unknown>): void
  mount? (component: React.ComponentClass | ComponentOptions<VueCtor> | Vue3Component, id: string, cb: (...args: any[]) => void): void
  onError? (error: string): void
  onLaunch? (options?: Record<string, unknown>): void
  onPageNotFound? (res: any): void
  onUnhandledRejection? (error: any): void
  onShow?(options?: Record<string, unknown>): void
  unmount? (id: string, cb?: () => void): void
  taroGlobalData?: Record<any, any>
  config?: Record<any, any>
}
