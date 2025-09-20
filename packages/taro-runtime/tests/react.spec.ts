import { afterAll, describe, expect, test, vi } from 'vitest'

import * as runtime from '../src/index'

describe('react', () => {
  process.env.FRAMEWORK = 'react'
  const document = runtime.document

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  test('event should work', () => {
    const div = document.createElement('div')
    const spy = vi.fn()
    div.addEventListener('tap', spy, null)
    const event = runtime.createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
  })
})
