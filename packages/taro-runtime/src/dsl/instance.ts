import type { Component, ComponentClass } from 'react'
import VueCtor, { ComponentOptions, VNode } from 'vue'
import type { Component as Vue3Component } from '@vue/runtime-core'
import type { CombinedVueInstance } from 'vue/types/vue'
import type { MpEvent } from '../interface'
import type { TaroElement } from '../dom/element'

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

export interface ReactPageComponent<T = PageProps> extends ComponentClass<T>, Show, PageInstance {
  //
}

export interface ReactPageInstance<T = PageProps> extends Component<T>, Show, PageInstance {
  componentDidShow?(): void
  componentDidHide?(): void
}

export interface ReactAppInstance<T = AppInstance> extends Component<T>, Show, AppInstance {
  //
}

export interface PageLifeCycle extends Show {
  onPullDownRefresh?(): void
  onReachBottom?(): void
  onPageScroll?(obj: { scrollTop: number }): void
  onShareAppMessage?(obj: { from: string, target?: TaroElement, webViewUrl: string }): void
  onResize?(options: unknown): void
  onTabItemTap?(obj: { index: string, pagePath: string, text: string }): void
  onTitleClick?(): void
  onOptionMenuClick?(): void
  onPopMenuClick?(): void
  onReady?(): void
  onPullIntercept?(): void
  onShareTimeline?(): void
  onAddToFavorites?(): void
  eh?(event: MpEvent): void
  onLoad(options: Record<string, unknown>): void
  onUnload(): void
}

export interface PageInstance extends PageLifeCycle {
  data?: Record<string, unknown>
  path?: string
  options?: Record<string, unknown>
}

interface Show {
  componentDidShow?(options?: unknown): void
  componentDidHide?(options?: unknown): void
  onShow?(options?: unknown): void
  onHide?(options?: unknown): void
}

export interface AppInstance extends Show {
  onLaunch? (options?: string): void
  mount? (component: React.ComponentClass | ComponentOptions<VueCtor> | Vue3Component, id: string, cb: (...args: any[]) => void): void
  mount? (component: React.ComponentClass | ComponentOptions<VueCtor> | Vue3Component, id: string, cb: () => void): void
  unmount? (id: string): void
  unmount? (id: string, cb: () => void): void
  onPageNotFound? (res: any): void
  taroGlobalData?: Record<any, any>
}
