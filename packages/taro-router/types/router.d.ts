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

import type { AppConfig, PageConfig } from '@tarojs/taro'
import type { IH5RouterConfig } from '@tarojs/taro/types/compile'

export interface Route extends PageConfig {
  path?: string
  load?: () => Promise<any>
}

export interface Router {
  mode: IH5RouterConfig['mode']
  basename: string
  customRoutes?: Record<string, string | string[]>
  pathname: string
  forcePath?: string
}

export interface SpaRouterConfig extends AppConfig {
  routes: Route[]
  router: Router
  // 下拉刷新组件
  PullDownRefresh?: any
}

export interface MpaRouterConfig extends AppConfig {
  route: Route,
  pageName: string
  router: Router
  // 下拉刷新组件
  PullDownRefresh?: any
}
