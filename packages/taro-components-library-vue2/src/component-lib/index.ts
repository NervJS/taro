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

import Vue from 'vue'

import components from './components'
import createComponent from './createComponent'
import createFormsComponent from './createFormsComponent'

components.forEach(params => {
  if (typeof params === 'string') {
    Vue.component(params, createComponent(params))
  } else if (params instanceof Array) {
    const [name, props] = params as [string, Record<string, any>]
    const { classNames, type = 'simple' } = props

    if (type === 'simple') {
      Vue.component(name, createComponent(name, classNames))
    } else if (type === 'forms') {
      const { event, modelValue } = props
      Vue.component(name, createFormsComponent(name, event, modelValue, classNames))
    } else if (type === 'component') {
      Vue.component(name, props.component)
    }
  }
})

Vue.config.ignoredElements = [
  'root',
  'block',
  /^taro-/
]
