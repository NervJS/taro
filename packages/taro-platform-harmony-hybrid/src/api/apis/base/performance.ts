import Taro from '@tarojs/taro'

/**
 * 程序测速上报
 * 
 * @canNotUse reportPerformance
 */
export { reportPerformance } from '@tarojs/taro-h5'

/**
 * 预加载下个页面的 WebView
 * 
 * @canNotUse preloadWebview
 */
export { preloadWebview } from '@tarojs/taro-h5'

/**
 * 预加载下个页面所需要的 Skyline 运行环境
 * 
 * @canNotUse preloadSkylineView
 */
export { preloadSkylineView } from '@tarojs/taro-h5'

/**
 * 为视图层预加载媒体资源文件
 * 
 * @canNotUse preloadAssets
 */
export { preloadAssets } from '@tarojs/taro-h5'

/**
 * 程序测速上报
 * 
 * @canUse getPerformance
 * @null_implementation
 */
export const getPerformance: typeof Taro.getPerformance = () => {
  return new Performance()
}

/**
 * 获取性能数据及创建性能监听器
 * 
 * @canUse Performance
 * @null_implementation
 */
class Performance implements Taro.Performance {
  _res = {
    /** 开始时间，不同指标的具体含义会有差异 */ 
    startTime: 0,
    /** 耗时 ms。仅对于表示阶段的指标有效。 */
    duration: 0,
    /** 页面路径。仅 render 和 navigation 类型指标有效。 */
    path: '',
    /** 路由真正响应开始时间。仅 navigation 类型指标有效。 */
    navigationStart: 0,
    /** 路由详细类型，与小程序路由方法对应。仅 navigation 类型指标有效。 */
    navigationType: '',
    /** 分包名，主包表示为 APP。仅 evaluateScript 指标有效。 */
    moduleName: '',
    /** 注入文件列表。仅 evaluateScript 指标有效。 */
    fileList: [''],
    /** 渲染层代码注入完成时间。仅 firstRender 指标有效。 */
    viewLayerReadyTime: 0,
    /** 首次渲染参数从逻辑层发出的时间。仅 firstRender 指标有效。 */
    initDataSendTime: 0,
    /** 首次渲染参数在渲染层收到的时间。仅 firstRender 指标有效。 */
    initDataRecvTime: 0,
    /** 渲染层执行渲染开始时间。仅 firstRender 指标有效。 */
    viewLayerRenderStartTime: 0,
    /** 渲染层执行渲染结束时间。仅 firstRender 指标有效。 */
    viewLayerRenderEndTime: 0,
  }

  createObserver (callback): Taro.PerformanceObserver {
    if (typeof callback === 'function') {
      // do nothing 
    }
    const result: Taro.PerformanceEntry = {
      /** 指标类型 */
      entryType: 'navigation',
      /** 指标名称 */
      name: 'appLaunch',
      ...this._res,
    }
    const disconnect = () => {}
    const observe = (option: Taro.PerformanceObserver.observe.Option) => { 
      if (typeof option === 'object') {
        // do nothing 
      }
    }
    const performanceObserver: Taro.PerformanceObserver = {
      supportedEntryTypes: [result],
      disconnect,
      observe,
    }
    return performanceObserver
  }

  getEntries (): Taro.PerformanceEntry[] {
    const result: Taro.PerformanceEntry = {
      /** 指标类型 */
      entryType: 'navigation',
      /** 指标名称 */
      name: 'appLaunch',
      ...this._res,
    }
    return [result]
  }

  getEntriesByName (name: string, entryType: string): Taro.PerformanceEntry[] {
    const result: Taro.PerformanceEntry = {
      /** 指标类型 */
      entryType: entryType as keyof Taro.PerformanceEntry.EntryType,
      /** 指标名称 */
      name: name as keyof Taro.PerformanceEntry.EntryName,
      ...this._res,
    }
    return [result]
  }

  getEntriesByType (entryType: string): Taro.PerformanceEntry[] {
    const result: Taro.PerformanceEntry = {
      /** 指标类型 */
      entryType: entryType as keyof Taro.PerformanceEntry.EntryType,
      /** 指标名称 */
      name: 'appLaunch',
      ...this._res,
    }
    return [result]
  }

  setBufferSize (size: number): void { 
    if (typeof size === 'number') {
      // do nothing 
    } 
  }
}

/**
 * EntryList 对象
 * 
 * @canNotUse EntryList
 */

/**
 * 单条性能数据
 * 
 * @canNotUse PerformanceEntry
 */

/**
 * PerformanceObserver 对象，用于监听性能相关事件
 * 
 * @canNotUse PerformanceObserver
 */