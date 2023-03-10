/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import { addLeadingSlash } from '../utils'

import type { MpaRouterConfig, SpaRouterConfig } from '../../types/router'

export class RouterConfig {
  private static __config: SpaRouterConfig | MpaRouterConfig

  static set config (e: SpaRouterConfig | MpaRouterConfig) {
    this.__config = e
  }

  static get config () {
    return this.__config
  }

  static get pages () {
    return this.config.pages || []
  }

  static get router () {
    return this.config.router || {}
  }

  static get mode () {
    return this.router.mode || 'hash'
  }

  static get customRoutes () { return this.router.customRoutes || {} }

  static isPage (url = '') {
    return this.pages.findIndex(e => addLeadingSlash(e) === url) !== -1
  }
}
