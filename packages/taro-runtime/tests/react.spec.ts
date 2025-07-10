import { afterAll, describe, expect, it, vi } from 'vitest'

import * as runtime from '../src/index'

describe('react', () => {
  process.env.FRAMEWORK = 'react'
  const document = runtime.document

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  it('event should work', () => {
    const div = document.createElement('div')
    const spy = vi.fn()
    div.addEventListener('tap', spy)
    const event = runtime.createEvent({ type: 'tap' }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
  })
})
