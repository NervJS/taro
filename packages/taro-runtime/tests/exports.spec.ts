import { afterAll, describe, expect, test } from 'vitest'

import * as runtime from '../src/index'

describe('style', () => {
  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  test('bom', () => {
    const window = runtime.window
    expect(window).not.toBeUndefined()
    expect(window.navigator).not.toBeUndefined()
    expect(window.document).not.toBeUndefined()
    expect(runtime.document).toBe(window.document)
    expect(runtime.navigator).toBe(window.navigator)
  })

  test('dom', () => {
    expect(runtime.TaroElement).not.toBeUndefined()
    expect(runtime.TaroNode).not.toBeUndefined()
    expect(runtime.TaroText).not.toBeUndefined()
  })

  test('event', () => {
    expect(runtime.createEvent).not.toBeUndefined()
    expect(runtime.TaroEvent).not.toBeUndefined()
  })

  test('dsl', () => {
    expect(runtime.createComponentConfig).not.toBeUndefined()
    expect(runtime.createPageConfig).not.toBeUndefined()
  })
})
