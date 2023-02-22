/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { PageConfig } from './types/index'

import type { Component } from 'react'

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
  onTabItemTap?(obj: { index: string, pagePath: string, text: string }): void
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
  options: Record<string, any>
  getOpenerEventChannel?(): Record<string, any>
  __safeExecute?(lifecycle: keyof Instance, ...args: unknown[]): void
  __isReactComponent: boolean
}

export interface AppInstance extends Show {
  onLaunch?(options?: string): void
}
