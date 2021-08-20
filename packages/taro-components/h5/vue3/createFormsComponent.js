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

import { h, toRefs, computed } from 'vue'

export default function createFormsComponent (name, eventName, modelValue = 'value', classNames = []) {
  const props = {
    modelValue: null
  }
  if (name === 'taro-input') {
    props.focus = Boolean
  }

  return {
    emits: ['tap', 'update:modelValue'],
    props,
    setup (props, { slots, emit }) {
      const { modelValue: model, focus } = toRefs(props)

      const attrs = computed(() => {
        return name === 'taro-input'
          ? {
            [modelValue]: model.value,
            'auto-focus': focus.value
          }
          : {
            [modelValue]: model.value
          }
      })

      return () => (
        h(
          `${name}-core`,
          {
            class: ['hydrated', ...classNames],
            ...attrs.value,
            onClick (e) {
              emit('tap', e)
            },
            [`on${eventName}`] (e) {
              emit('update:modelValue', e.detail.value)
            }
          },
          slots
        )
      )
    }
  }
}
