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

describe('H5 IntersectionObserver target lookup', () => {
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

  test('keeps the descendant first when both container and descendant match', () => {
    new TaroH5IntersectionObserver(container).relativeToViewport().observe('.item', jest.fn())
    jest.runAllTimers()
    expect(MockIntersectionObserver.instances[0].observed).toEqual([document.getElementById('child')])
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
})
