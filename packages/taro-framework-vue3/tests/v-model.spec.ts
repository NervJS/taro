import { createEvent, document } from '@tarojs/runtime'
import { afterEach, describe, expect, test } from 'vitest'
import { createApp, h, nextTick, ref, vModelText, withDirectives } from 'vue'

import type { FormElement } from '@tarojs/runtime'
import type { App } from 'vue'

describe('text v-model on mini program nodes', () => {
  let app: App | undefined
  let container: ReturnType<typeof document.createElement> | undefined

  afterEach(() => {
    app?.unmount()
    container?.remove()
    app = undefined
    container = undefined
  })

  function mount (tag: string, modifiers = {}, connected = true) {
    const value = ref<string | number>('initial')
    container = document.createElement('view')
    if (connected) document.body.appendChild(container)
    app = createApp({
      render: () => withDirectives(h(tag, {
        'onUpdate:modelValue': next => { value.value = next }
      }), [[vModelText, value.value, undefined, modifiers]])
    })
    app.mount(container as unknown as Element)
    return { value, input: container.firstChild as FormElement & { composing?: boolean } }
  }

  for (const tag of ['input', 'textarea']) {
    test.each([{}, { trim: true }, { number: true }, { lazy: true }])(`${tag} updates from the model with %j`, async modifiers => {
      const { value, input } = mount(tag, modifiers)
      expect(input.value).toBe('initial')
      value.value = 'replacement'
      await nextTick()
      expect(input.value).toBe('replacement')
      value.value = ''
      await nextTick()
      expect(input.value).toBe('')
    })

    test(`${tag} updates inside a detached container`, async () => {
      const { value, input } = mount(tag, {}, false)
      value.value = 'detached update'
      await nextTick()
      expect(input.value).toBe('detached update')
      expect(input.getRootNode()).toBe(container)
    })
  }

  test('preserves composing text until composition ends', async () => {
    const { value, input } = mount('input')
    input.composing = true
    value.value = 'pending'
    await nextTick()
    expect(input.value).toBe('initial')
    input.composing = false
    value.value = 'confirmed'
    await nextTick()
    expect(input.value).toBe('confirmed')
  })

  test.each([
    [{ trim: true, lazy: true }, '42'],
    [{ number: true, lazy: true }, 42]
  ])('propagates change events back to the model with %j', async (modifiers, expected) => {
    const { value, input } = mount('input', modifiers)
    input.value = ' 42 '
    input.dispatchEvent(createEvent({ type: 'change', detail: { value: ' 42 ' } }, input))
    await nextTick()
    expect(value.value).toBe(expected)
  })
})
