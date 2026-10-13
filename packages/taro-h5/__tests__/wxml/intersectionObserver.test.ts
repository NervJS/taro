import { Current } from '@tarojs/runtime'

import { TaroH5IntersectionObserver } from '../../src/api/wxml/IntersectionObserver'
import * as utils from '../../src/utils'

const mockConsole = require('jest-mock-console')

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  observed: Element[] = []
  callback: IntersectionObserverCallback
  options?: IntersectionObserverInit

  constructor (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
    MockIntersectionObserver.instances.push(this)
  }

  observe (element: Element) {
    this.observed.push(element)
  }

  unobserve = jest.fn()
  disconnect = jest.fn()

  trigger (element: Element, intersectionRatio: number) {
    this.callback([{
      target: element,
      intersectionRatio,
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
    mockConsole()
    jest.useFakeTimers()
    MockIntersectionObserver.instances = []
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
    jest.spyOn(utils, 'findDOM').mockImplementation(instance => instance as HTMLElement)
    Current.router = null
    Current.page = { path: '/pages/index/index?stamp=0' }
    document.body.innerHTML = `<div id="${Current.page.path}" class="taro_page"><div id="scope" class="item"><div id="child" class="item" /></div></div>`
    container = document.getElementById('scope')!
  })

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  const flushObservation = () => jest.advanceTimersByTime(200)

  test('observes the container itself when no descendant matches', () => {
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(container)
    observer.relativeToViewport().observe('#scope', callback)
    flushObservation()
    const instance = MockIntersectionObserver.instances[0]
    expect(instance.observed).toEqual([container])
    instance.trigger(container, 1)
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ intersectionRatio: 1 }))
  })

  test('prefers a descendant when both container and descendant match', () => {
    const observer = new TaroH5IntersectionObserver(container)
    observer.relativeToViewport().observe('.item', jest.fn())
    flushObservation()
    expect(MockIntersectionObserver.instances[0].observed).toEqual([document.getElementById('child')])
  })

  test('observeAll observes the matching container before descendants', () => {
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(container, { observeAll: true })
    observer.relativeToViewport().observe('.item', callback)
    flushObservation()
    const instance = MockIntersectionObserver.instances[0]
    const child = document.getElementById('child')!
    expect(instance.observed).toEqual([container, child])
    instance.trigger(container, 1)
    instance.trigger(child, 1)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('warns on every missing target without calling the callback', () => {
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(container)
    observer.relativeToViewport()
    observer.observe('.missing', callback)
    observer.observe('.missing', callback)
    flushObservation()
    expect(console.warn).toHaveBeenCalledTimes(2)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('selector: .missing, container: div#scope'))
    expect(callback).not.toHaveBeenCalled()
  })

  test('warns on every call when the relative area was not configured', () => {
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(container)
    observer.observe('.item', callback)
    observer.observe('.item', callback)
    expect(console.warn).toHaveBeenCalledTimes(2)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('observer has not been created'))
    expect(callback).not.toHaveBeenCalled()
  })

  test('warns separately when the relative area and then the target are missing', () => {
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(container)
    observer.observe('.missing', callback)
    observer.relativeToViewport()
    observer.observe('.missing', callback)
    observer.observe('.missing', callback)
    expect(console.warn).toHaveBeenCalledTimes(3)
    expect(console.warn).toHaveBeenNthCalledWith(1, expect.stringContaining('observer has not been created'))
    expect(console.warn).toHaveBeenNthCalledWith(2, expect.stringContaining('target was not found'))
    expect(console.warn).toHaveBeenNthCalledWith(3, expect.stringContaining('target was not found'))
    expect(callback).not.toHaveBeenCalled()
  })

  test('warns when observeAll finds no targets', () => {
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(container, { observeAll: true })
    observer.relativeToViewport().observe('.missing', callback)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('target was not found'))
    expect(callback).not.toHaveBeenCalled()
  })

  test('explicit relativeTo warns on each missing reference and still observes with the viewport', () => {
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(container)
    expect(observer.relativeTo('#nope')).toBe(observer)
    expect(observer.relativeTo('#nope')).toBe(observer)
    expect(console.warn).toHaveBeenCalledTimes(2)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('selector: #nope, container: div#scope'))
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('mounted when relativeTo is called'))
    observer.observe('#child', callback)
    flushObservation()
    const instance = MockIntersectionObserver.instances[1]
    expect(instance.options?.root).toBeNull()
    expect(instance.observed).toEqual([document.getElementById('child')])
    instance.trigger(document.getElementById('child')!, 1)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('passes margins in CSS order and thresholds to the native observer', () => {
    const thresholds = [0, 0.5, 1]
    const observer = new TaroH5IntersectionObserver(container, { thresholds })
    observer.relativeTo('#nope', { top: 1, right: 2, bottom: 3, left: 4 })
    expect(MockIntersectionObserver.instances[0].options).toEqual(expect.objectContaining({
      root: null,
      rootMargin: '1px 2px 3px 4px',
      threshold: thresholds
    }))
  })

  test('relativeToViewport keeps the page root when querying the document', () => {
    new TaroH5IntersectionObserver(null).relativeToViewport()
    expect(MockIntersectionObserver.instances[0].options?.root).toBe(document.querySelector('.taro_page'))
    expect(console.warn).not.toHaveBeenCalled()
  })

  test('relativeToViewport falls back to the viewport without warning when scoped to the page', () => {
    const page = document.querySelector('.taro_page')!
    new TaroH5IntersectionObserver(page).relativeToViewport()
    expect(MockIntersectionObserver.instances[0].options?.root).toBeNull()
    expect(console.warn).not.toHaveBeenCalled()
  })

  test('explicit relativeTo warns even when the selector is .taro_page', () => {
    const page = document.querySelector('.taro_page')!
    new TaroH5IntersectionObserver(page).relativeTo('.taro_page')
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('selector: .taro_page'))
  })

  test('searches the document when no component is provided', () => {
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(null)
    observer.relativeToViewport()
    observer.observe('.missing', callback)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('container: document'))
    observer.observe('#child', callback)
    flushObservation()
    expect(MockIntersectionObserver.instances[0].observed).toEqual([document.getElementById('child')])
  })

  test('maps the observed target fields into the callback result', () => {
    container.dataset.example = 'value'
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(container)
    observer.relativeToViewport().observe('#scope', callback)
    flushObservation()
    MockIntersectionObserver.instances[0].trigger(container, 1)
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({
      id: 'scope',
      dataset: expect.objectContaining({ example: 'value' }),
      time: expect.any(Number),
      relativeRect: { left: 0, right: 0, top: 0, bottom: 0 }
    }))
  })

  test('preserves initialRatio suppression', () => {
    const callback = jest.fn()
    const observer = new TaroH5IntersectionObserver(container)
    observer.relativeToViewport().observe('#scope', callback)
    flushObservation()
    const instance = MockIntersectionObserver.instances[0]
    instance.trigger(container, 0)
    expect(callback).not.toHaveBeenCalled()
    instance.trigger(container, 1)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
