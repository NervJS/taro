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
  name: 'taro-picker',
  mixins: [listeners, refs],
  model: {
    event: 'model'
  },
  props: {
    range: Array,
    rangeKey: String,
    value: [Number, String, Array]
  },
  mounted () {
    this.$el.value = this.value
  },
  watch: {
    value (newVal) {
      this.$el.value = newVal
    }
  },
  render (createElement) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    return createElement('taro-picker-core', {
      class: 'hydrated',
      domProps: {
        range: self.range
      },
      on: {
        ...self.listeners,
        change (e) {
          self.$emit('change', e)
          self.$emit('model', e.target.value)
        }
      }
    }, self.$slots.default)
  }
}
