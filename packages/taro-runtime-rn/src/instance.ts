/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
  options: Record<string, any>
  getOpenerEventChannel?(): Record<string, any>
}

export interface AppInstance extends Show {
  onLaunch?(options?: string): void
}
