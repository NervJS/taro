/*
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

import { listeners } from '../mixins/listeners'
import { refs } from '../mixins/refs'
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
