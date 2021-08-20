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

import { listeners } from './mixins/listeners'
import { refs } from './mixins/refs'
export default function createFormsComponent (name, event, modelValue = 'value', classNames = []) {
  const props = {}
  if (name === 'taro-input') {
    props.focus = Boolean
  }

  return {
    name,
    mixins: [listeners, refs],
    model: {
      prop: modelValue,
      event: 'model'
    },
    props,
    methods: {
      input (e) {
        this.$emit('input', e)
        this.$emit('model', e.target.value)
      },
      change (e) {
        this.$emit('change', e)
        this.$emit('model', e.target.value)
      }
    },
    render (createElement) {
      // eslint-disable-next-line
      const self = this;

      const attrs = {}
      if (name === 'taro-input') {
        attrs['auto-focus'] = self.focus
      }

      const on = { ...self.listeners }
      on[event] = self[event]

      return createElement(`${name}-core`, {
        class: ['hydrated', ...classNames],
        attrs,
        on
      }, self.$slots.default)
    }
  }
}
