import { Current } from '@tarojs/runtime'

import { TaroH5IntersectionObserver } from '../../src/api/wxml/IntersectionObserver'
import * as utils from '../../src/utils'

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  observed: Element[] = []
  callback: IntersectionObserverCallback

  constructor (callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  observe (element: Element) {
    this.observed.push(element)
  }

  unobserve = jest.fn()
  disconnect = jest.fn()

  trigger (element: Element) {
    this.callback([{
      target: element,
      intersectionRatio: 1,
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRect: element.getBoundingClientRect(),
      rootBounds: null
    } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }
}

describe('H5 IntersectionObserver', () => {
  let container: HTMLElement
  const originalIntersectionObserver = window.IntersectionObserver

  beforeEach(() => {
    jest.useFakeTimers()
    MockIntersectionObserver.instances = []
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
    jest.spyOn(utils, 'findDOM').mockImplementation(instance => instance as HTMLElement)
    Current.router = null
    document.body.innerHTML = '<div class="taro_page"><div id="scope" class="item"><div id="child" class="item" /></div></div>'
    container = document.getElementById('scope')!
  })

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  test('observes the container itself when no descendant matches', () => {
    const callback = jest.fn()
    new TaroH5IntersectionObserver(container).relativeToViewport().observe('#scope', callback)
    jest.runAllTimers()
    const instance = MockIntersectionObserver.instances[0]
    expect(instance.observed).toEqual([container])
    instance.trigger(container)
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ intersectionRatio: 1 }))
  })

  test('prefers the container when both container and descendant match', () => {
    new TaroH5IntersectionObserver(container).relativeToViewport().observe('.item', jest.fn())
    jest.runAllTimers()
    expect(MockIntersectionObserver.instances[0].observed).toEqual([container])
  })

  test('observeAll includes the container before matching descendants', () => {
    new TaroH5IntersectionObserver(container, { observeAll: true }).relativeToViewport().observe('.item', jest.fn())
    jest.runAllTimers()
    expect(MockIntersectionObserver.instances[0].observed).toEqual([container, document.getElementById('child')])
  })

  test('keeps descendant lookup when the container does not match', () => {
    new TaroH5IntersectionObserver(container).relativeToViewport().observe('#child', jest.fn())
    jest.runAllTimers()
    expect(MockIntersectionObserver.instances[0].observed).toEqual([document.getElementById('child')])
  })

  test.each([false, true])('cancels pending observations with observeAll=%s', observeAll => {
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(container, { observeAll }).relativeToViewport()
    observer.observe('.item', callback)
    observer.disconnect()
    jest.runAllTimers()

    const instance = MockIntersectionObserver.instances[0]
    instance.trigger(container)
    instance.trigger(document.getElementById('child')!)
    expect(instance.observed).toEqual([])
    expect(callback).not.toHaveBeenCalled()
  })

  test('can disconnect repeatedly before registration', () => {
    const observer = new TaroH5IntersectionObserver(container).relativeToViewport()
    observer.observe('#child', jest.fn())
    observer.disconnect()
    observer.disconnect()
    jest.runAllTimers()

    expect(MockIntersectionObserver.instances[0].observed).toEqual([])
  })

  test('can start a new observation without reviving a cancelled one', () => {
    const cancelled = jest.fn()
    const current = jest.fn()
    const observer = new TaroH5IntersectionObserver(container).relativeToViewport()
    observer.observe('#child', cancelled)
    observer.disconnect()
    observer.observe('#child', current)
    jest.runAllTimers()

    const instance = MockIntersectionObserver.instances[0]
    const child = document.getElementById('child')!
    instance.trigger(child)
    expect(instance.observed).toEqual([child])
    expect(cancelled).not.toHaveBeenCalled()
    expect(current).toHaveBeenCalledTimes(1)
  })

  test('does not attach a pending observation to a replacement observer', () => {
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(container).relativeToViewport()
    observer.observe('#child', callback)
    observer.relativeToViewport({ bottom: 100 })
    jest.runAllTimers()

    for (const instance of MockIntersectionObserver.instances) {
      expect(instance.observed).toEqual([])
      instance.trigger(document.getElementById('child')!)
    }
    expect(callback).not.toHaveBeenCalled()
  })

  test('only registers the new observation after replacing the relative node', () => {
    const cancelled = jest.fn()
    const current = jest.fn()
    const observer = new TaroH5IntersectionObserver(container).relativeToViewport()
    observer.observe('#child', cancelled)
    observer.relativeToViewport({ bottom: 100 })
    observer.observe('#scope', current)
    jest.runAllTimers()

    const [previous, replacement] = MockIntersectionObserver.instances
    expect(previous.observed).toEqual([])
    expect(replacement.observed).toEqual([container])
    replacement.trigger(document.getElementById('child')!)
    replacement.trigger(container)
    expect(cancelled).not.toHaveBeenCalled()
    expect(current).toHaveBeenCalledTimes(1)
  })

  test('only observes the first selector when called twice before registration', () => {
    const first = jest.fn()
    const second = jest.fn()
    const observer = new TaroH5IntersectionObserver(container).relativeToViewport()
    observer.observe('#scope', first)
    observer.observe('#child', second)
    jest.runAllTimers()

    const instance = MockIntersectionObserver.instances[0]
    expect(instance.observed).toEqual([container])
    instance.trigger(container)
    instance.trigger(document.getElementById('child')!)
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).not.toHaveBeenCalled()
  })

  test('cancels all pending registrations after repeated observe calls', () => {
    const observer = new TaroH5IntersectionObserver(container).relativeToViewport()
    observer.observe('#scope', jest.fn())
    observer.observe('#child', jest.fn())
    observer.disconnect()
    jest.runAllTimers()

    expect(MockIntersectionObserver.instances[0].observed).toEqual([])
  })

  test('does not cancel pending observations on another instance', () => {
    const observer = new TaroH5IntersectionObserver(container).relativeToViewport()
    const other = new TaroH5IntersectionObserver(container).relativeToViewport()
    const callback = jest.fn()
    observer.observe('#scope', jest.fn())
    other.observe('#child', callback)
    observer.disconnect()
    jest.runAllTimers()

    const [cancelled, active] = MockIntersectionObserver.instances
    const child = document.getElementById('child')!
    expect(cancelled.observed).toEqual([])
    expect(active.observed).toEqual([child])
    active.trigger(child)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('still disconnects registered targets and suppresses subsequent callbacks', () => {
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(container, { observeAll: true }).relativeToViewport()
    observer.observe('.item', callback)
    jest.runAllTimers()

    const instance = MockIntersectionObserver.instances[0]
    const child = document.getElementById('child')!
    instance.trigger(container)
    expect(callback).toHaveBeenCalledTimes(1)
    observer.disconnect()
    expect(instance.unobserve).toHaveBeenCalledWith(container)
    expect(instance.unobserve).toHaveBeenCalledWith(child)
    expect(instance.disconnect).toHaveBeenCalledTimes(1)
    instance.trigger(container)
    instance.trigger(child)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
