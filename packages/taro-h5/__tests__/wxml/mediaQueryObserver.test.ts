import { MediaQueryObserver } from '../../src/api/wxml/MediaQueryObserver'

import type Taro from '@tarojs/api'

const narrow = { minWidth: 480 } as Taro.MediaQueryObserver.descriptor
const wide = { minWidth: 960 } as Taro.MediaQueryObserver.descriptor

function createMediaQueryList (media: string, legacy: boolean) {
  const target = new EventTarget()
  const list = {
    media,
    matches: false,
    ...(legacy ? {
      addListener: (listener: EventListener) => target.addEventListener('change', listener),
      removeListener: (listener: EventListener) => target.removeEventListener('change', listener)
    } : {
      addEventListener: target.addEventListener.bind(target),
      removeEventListener: target.removeEventListener.bind(target)
    })
  }

  return {
    list: list as unknown as MediaQueryList,
    change (matches: boolean) {
      list.matches = matches
      target.dispatchEvent(Object.assign(new Event('change'), { matches }))
    }
  }
}

describe.each(['modern', 'legacy'])('MediaQueryObserver with %s listeners', mode => {
  let observer: MediaQueryObserver
  let lists: ReturnType<typeof createMediaQueryList>[]
  let originalMatchMedia: PropertyDescriptor | undefined

  beforeEach(() => {
    observer = new MediaQueryObserver()
    lists = []
    originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia')
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: jest.fn((media: string) => {
        const entry = createMediaQueryList(media, mode === 'legacy')
        lists.push(entry)
        return entry.list
      })
    })
  })

  afterEach(() => {
    observer.disconnect()
    if (originalMatchMedia) Object.defineProperty(window, 'matchMedia', originalMatchMedia)
    else Reflect.deleteProperty(window, 'matchMedia')
  })

  test('reports the initial state and changes until disconnected', () => {
    const callback = jest.fn()
    observer.observe(narrow, callback)
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 480px)')
    expect(callback).toHaveBeenNthCalledWith(1, { matches: false })

    lists[0].change(true)
    expect(callback).toHaveBeenNthCalledWith(2, { matches: true })
    observer.disconnect()
    observer.disconnect()
    lists[0].change(false)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('can disconnect from the initial callback', () => {
    const callback = jest.fn(() => observer.disconnect())
    observer.observe(narrow, callback)
    lists[0].change(true)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('replaces the previous observation when observing again', () => {
    const first = jest.fn()
    const second = jest.fn()
    observer.observe(narrow, first)
    observer.observe(wide, second)

    lists[0].change(true)
    lists[1].change(true)
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(2)
    expect(second).toHaveBeenLastCalledWith({ matches: true })
  })

  test('stops all notifications after observing twice and disconnecting', () => {
    const first = jest.fn()
    const second = jest.fn()
    observer.observe(narrow, first)
    observer.observe(wide, second)
    observer.disconnect()

    lists[0].change(true)
    lists[1].change(true)
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(1)
  })

  test('can replace the observation from the initial callback', () => {
    const second = jest.fn()
    const first = jest.fn(() => observer.observe(wide, second))
    observer.observe(narrow, first)

    lists[0].change(true)
    lists[1].change(true)
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(2)
    observer.disconnect()
    lists[1].change(false)
    expect(second).toHaveBeenCalledTimes(2)
  })

  test('can disconnect from a nested initial callback', () => {
    const second = jest.fn(() => observer.disconnect())
    const first = jest.fn(() => observer.observe(wide, second))
    observer.observe(narrow, first)

    lists[0].change(true)
    lists[1].change(true)
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(1)
  })

  test('can observe again after disconnecting', () => {
    const first = jest.fn()
    const second = jest.fn()
    observer.disconnect()
    observer.observe(narrow, first)
    observer.disconnect()
    observer.observe(wide, second)

    lists[0].change(true)
    lists[1].change(true)
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(2)
  })

  test('keeps separate observer instances independent', () => {
    const other = new MediaQueryObserver()
    const first = jest.fn()
    const second = jest.fn()
    try {
      observer.observe(narrow, first)
      other.observe(wide, second)
      observer.disconnect()

      lists[0].change(true)
      lists[1].change(true)
      expect(first).toHaveBeenCalledTimes(1)
      expect(second).toHaveBeenCalledTimes(2)
    } finally {
      other.disconnect()
    }
  })
})
