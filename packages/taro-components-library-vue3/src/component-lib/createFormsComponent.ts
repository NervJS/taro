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

import { computed, h, toRefs } from 'vue'

import { useForwardRef } from './forwardRef'

export default function createFormsComponent (name, eventName, modelValue = 'value', classNames = []) {
  const props: Record<string, any> = {
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

      const forwardRef = useForwardRef()

      return () => (
        h(
          `${name}-core`,
          {
            ref: forwardRef,
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
