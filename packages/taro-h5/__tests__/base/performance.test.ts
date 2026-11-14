import * as Taro from '@tarojs/taro-h5'

import { getPerformance } from '../../src/api/base/performance'

const performanceMethods = ['getEntries', 'getEntriesByName', 'getEntriesByType', 'setResourceTimingBufferSize'] as const

const navigationEntry = { name: 'http://localhost/', entryType: 'navigation', startTime: 0, duration: 120 }
const paintEntry = { name: 'first-contentful-paint', entryType: 'paint', startTime: 80, duration: 0 }

describe('getPerformance', () => {
  const originalMethods = performanceMethods.map(name => [name, Object.getOwnPropertyDescriptor(window.performance, name)] as const)

  beforeEach(() => {
    window.performance.getEntries = jest.fn(() => [navigationEntry, paintEntry] as any)
    window.performance.getEntriesByName = jest.fn(() => [paintEntry] as any)
    window.performance.getEntriesByType = jest.fn(() => [navigationEntry] as any)
    window.performance.setResourceTimingBufferSize = jest.fn()
  })

  afterEach(() => {
    originalMethods.forEach(([name, descriptor]) => {
      if (descriptor) {
        Object.defineProperty(window.performance, name, descriptor)
      } else {
        delete (window.performance as any)[name]
      }
    })
  })

  test('is exposed by @tarojs/taro-h5 and returns the same instance on every call', () => {
    const performance = Taro.getPerformance()

    expect(performance).not.toBeInstanceOf(Promise)
    expect(getPerformance()).toBe(performance)
    expect(typeof performance.createObserver).toBe('function')
  })

  test('reads performance entries from the browser', () => {
    const performance = getPerformance()

    expect(performance.getEntries()).toEqual([navigationEntry, paintEntry])
    expect(performance.getEntriesByName('first-contentful-paint', 'paint')).toEqual([paintEntry])
    expect(window.performance.getEntriesByName).toHaveBeenCalledWith('first-contentful-paint', 'paint')
    expect(performance.getEntriesByType('navigation')).toEqual([navigationEntry])
    expect(window.performance.getEntriesByType).toHaveBeenCalledWith('navigation')
  })

  test('sets the resource timing buffer size', () => {
    getPerformance().setBufferSize(100)

    expect(window.performance.setResourceTimingBufferSize).toHaveBeenCalledWith(100)
  })

  test('returns empty lists and ignores setBufferSize when the browser lacks the timeline API', () => {
    performanceMethods.forEach(name => {
      Object.defineProperty(window.performance, name, { value: undefined, configurable: true, writable: true })
    })
    const performance = getPerformance()

    expect(performance.getEntries()).toEqual([])
    expect(performance.getEntriesByName('first-contentful-paint', 'paint')).toEqual([])
    expect(performance.getEntriesByType('navigation')).toEqual([])
    expect(() => performance.setBufferSize(100)).not.toThrow()
  })
})

describe('Performance.createObserver', () => {
  const originalObserver = Object.getOwnPropertyDescriptor(window, 'PerformanceObserver')

  afterEach(() => {
    if (originalObserver) {
      Object.defineProperty(window, 'PerformanceObserver', originalObserver)
    } else {
      delete (window as any).PerformanceObserver
    }
  })

  function mockPerformanceObserver (supportedEntryTypes = ['mark', 'measure', 'navigation', 'paint', 'resource']) {
    const instances: { callback: PerformanceObserverCallback, observe: jest.Mock, disconnect: jest.Mock }[] = []
    class MockPerformanceObserver {
      static supportedEntryTypes = Object.freeze([...supportedEntryTypes])

      observe = jest.fn()
      disconnect = jest.fn()

      constructor (public callback: PerformanceObserverCallback) {
        instances.push(this)
      }
    }
    Object.defineProperty(window, 'PerformanceObserver', { value: MockPerformanceObserver, configurable: true, writable: true })
    return instances
  }

  test('observes browser performance entries and passes the entry list to the callback', () => {
    const instances = mockPerformanceObserver()
    const callback = jest.fn()

    const observer = getPerformance().createObserver(callback)
    observer.observe({ entryTypes: ['navigation', 'paint'] } as any)

    expect(instances).toHaveLength(1)
    expect(instances[0].observe).toHaveBeenCalledWith({ entryTypes: ['navigation', 'paint'] })

    const entryList = {
      getEntries: () => [paintEntry],
      getEntriesByName: () => [paintEntry],
      getEntriesByType: () => [paintEntry]
    }
    instances[0].callback(entryList as any, instances[0] as any)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback.mock.calls[0][0]).toBe(entryList)
    expect(callback.mock.calls[0][0].getEntries()).toEqual([paintEntry])

    observer.disconnect()
    expect(instances[0].disconnect).toHaveBeenCalledTimes(1)
  })

  test('passes a single entry type through to the browser observer', () => {
    const instances = mockPerformanceObserver()

    getPerformance().createObserver(jest.fn()).observe({ type: 'paint', buffered: true } as any)

    expect(instances[0].observe).toHaveBeenCalledWith({ type: 'paint', buffered: true })
  })

  test('creates an independent browser observer for each call', () => {
    const instances = mockPerformanceObserver()
    const performance = getPerformance()

    const first = performance.createObserver(jest.fn())
    const second = performance.createObserver(jest.fn())
    first.disconnect()

    expect(instances).toHaveLength(2)
    expect(instances[0].disconnect).toHaveBeenCalledTimes(1)
    expect(instances[1].disconnect).not.toHaveBeenCalled()
    expect(second).not.toBe(first)
  })

  test('reports the entry types supported by the browser', () => {
    mockPerformanceObserver(['navigation', 'paint'])

    const observer = getPerformance().createObserver(jest.fn())

    expect(observer.supportedEntryTypes).toEqual(['navigation', 'paint'])
  })

  test('does nothing when the browser lacks PerformanceObserver', () => {
    delete (window as any).PerformanceObserver
    const callback = jest.fn()

    const observer = getPerformance().createObserver(callback)

    expect(observer.supportedEntryTypes).toEqual([])
    expect(() => observer.observe({ entryTypes: ['navigation'] })).not.toThrow()
    expect(() => observer.disconnect()).not.toThrow()
    expect(callback).not.toHaveBeenCalled()
  })
})
