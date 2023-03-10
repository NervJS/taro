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

import Vue from 'vue'
import { ExtendedVue } from 'vue/types/vue'
import Fragment from 'vue-fragment'

import * as components from './components'

export function initVue2Components () {
  const ignoredElements = [/^taro-/, 'root', 'block']
  if (!Vue.config.ignoredElements?.includes(ignoredElements[0])) {
    Vue.config.ignoredElements = [...Vue.config.ignoredElements, ...ignoredElements]
  }

  Vue.use(Fragment.Plugin)
  Object.entries(components).forEach(params => {
    const [name, definition] = params as [string, ExtendedVue<Vue, unknown, unknown, unknown, Record<string, unknown>>]
    if (definition) {
      const tagName = 'taro' + name.replace(new RegExp('([A-Z])', 'g'), '-$1').toLowerCase()
      Vue.component(tagName, definition)
    }
  })
}

export * from './components'
