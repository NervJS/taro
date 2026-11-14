import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../utils'

// Note: 浏览器返回的是标准的 PerformanceEntry（navigation、resource、paint 等），与小程序的指标结构不同
const toTaroEntries = (entries?: PerformanceEntryList) => (entries || []) as unknown as Taro.PerformanceEntry[]

const isObserverSupported = () => typeof PerformanceObserver === 'function'

class TaroH5PerformanceObserver implements Taro.PerformanceObserver {
  // 浏览器不支持 PerformanceObserver 时为空，observe 与 disconnect 不做任何处理
  private _observer?: PerformanceObserver

  constructor (callback: TaroGeneral.TFunc) {
    if (isObserverSupported()) {
      this._observer = new PerformanceObserver(callback)
    }
  }

  get supportedEntryTypes () {
    const types = isObserverSupported() ? PerformanceObserver.supportedEntryTypes : undefined
    return [...(types || [])] as unknown as Taro.PerformanceEntry[]
  }

  observe (option: Taro.PerformanceObserver.observe.Option) {
    this._observer?.observe(option)
  }

  disconnect () {
    this._observer?.disconnect()
  }
}

class TaroH5Performance implements Taro.Performance {
  createObserver (callback: TaroGeneral.TFunc): Taro.PerformanceObserver {
    return new TaroH5PerformanceObserver(callback)
  }

  getEntries () {
    return toTaroEntries(window.performance?.getEntries?.())
  }

  getEntriesByName (name: string, entryType?: string) {
    return toTaroEntries(window.performance?.getEntriesByName?.(name, entryType))
  }

  getEntriesByType (entryType: string) {
    return toTaroEntries(window.performance?.getEntriesByType?.(entryType))
  }

  // Note: 浏览器只限制 resource 类型性能数据的缓冲区大小
  setBufferSize (size: number) {
    window.performance?.setResourceTimingBufferSize?.(size)
  }
}

let performanceInstance: TaroH5Performance | undefined

// 性能
export const reportPerformance = /* @__PURE__ */ temporarilyNotSupport('reportPerformance')

/**
 * 获取当前页面性能相关的信息，基于浏览器 Performance API 实现
 */
export const getPerformance: typeof Taro.getPerformance = () => {
  performanceInstance ||= new TaroH5Performance()
  return performanceInstance
}

export const preloadWebview = /* @__PURE__ */ temporarilyNotSupport('preloadWebview')
export const preloadSkylineView = /* @__PURE__ */ temporarilyNotSupport('preloadSkylineView')
export const preloadAssets = /* @__PURE__ */ temporarilyNotSupport('preloadAssets')
