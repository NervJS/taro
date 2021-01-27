import type { Component } from 'react'
import { PageConfig } from './types/index'

interface Show {
  onShow?(options?: unknown): void
  onHide?(options?: unknown): void
  componentDidShow?(options?: unknown): void
  componentDidHide?(options?: unknown): void
}

export interface PageLifeCycle extends Show {
  onPullDownRefresh?(): void
  onReachBottom?(): void
  onPageScroll?(obj: { scrollTop: number }): void
  onResize?(options: unknown): void
  onTabItemTap?(obj: { index: string, pagePath: string, text: string }): void,
  onReady?(): void
  onLoad?(options: Record<string, unknown>): void
  onUnload?(): void
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface Instance<T = {}> extends Component<T>, PageLifeCycle {
}

export interface PageInstance extends PageLifeCycle {
  config: PageConfig
  route: string
  getOpenerEventChannel?(): object
}

export interface AppInstance extends Show {
  onLaunch?(options?: string): void
}
