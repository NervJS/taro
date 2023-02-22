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

import { listeners } from './mixins/listeners'
import { refs } from './mixins/refs'

export default {
  name: 'taro-scroll-view',
  mixins: [listeners, refs],
  props: {
    scrollX: Boolean,
    scrollY: Boolean
  },
  render (createElement) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    const attrs = {}
    if (self.scrollX) attrs['scroll-x'] = true
    if (self.scrollY) attrs['scroll-y'] = true

    return createElement('taro-scroll-view-core', {
      class: ['hydrated', {
        'taro-scroll-view__scroll-x': self.scrollX,
        'taro-scroll-view__scroll-y': self.scrollY
      }],
      attrs,
      on: {
        ...self.listeners,
        scroll (e) {
          if (e instanceof CustomEvent) {
            self.$emit('scroll', e)
          }
        }
      }
    }, self.$slots.default)
  }
}
