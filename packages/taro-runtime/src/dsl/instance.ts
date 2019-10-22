import { Component, ComponentClass } from 'react'
import { CommonEvent } from '@tarojs/components'

export interface Instance<T = {}> extends Component<T>, Show, PageInstance {
  $forceUpdate?(): void
  $nextTick?(cb: () => void): void
}

export interface PageProps {
  tid?: string
}

export interface ReactPageComponent<T = PageProps> extends ComponentClass<T>, Show, PageInstance {
  //
}

export interface ReactPageInstance<T = PageProps> extends Component<T>, Show, PageInstance {
  //
}

export interface PageInstance extends Show {
  onPullDownRefresh?(): void
  onReachBottom?(): void
  onPageScroll?(obj: { scrollTop: number }): void
  onShareAppMessage?(obj: { from: string, target: Record<string, string>, webViewUrl: string }): void
  onResize?(options: unknown): void
  onTabItemTap?(obj: { index: string, pagePath: string, text: string }): void
  componentWillPreload?(): void
  onTitleClick?(): void
  onOptionMenuClick?(): void
  onPopMenuClick?(): void
  onPullIntercept?(): void
  eh?(event: CommonEvent): void
  onLoad(): void
  onUnload(): void
}

interface Show {
  componentDidShow?(options?: unknown): void
  componentDidHide?(options?: unknown): void
  onShow?(options?: unknown): void
  onHide?(options?: unknown): void
}

export interface AppInstance extends Show {
  onLaunch (options: string): void
  mount (component: React.ComponentClass, id: string, cb: () => void): void
  unmount (id: string, cb: () => void): void
}
