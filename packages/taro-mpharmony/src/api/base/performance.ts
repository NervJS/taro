import Taro from '@tarojs/taro'

import { temporarilyNotSupport } from '../../utils'

// 性能
export const reportPerformance = /* @__PURE__ */ temporarilyNotSupport('reportPerformance')

// null-implementation
export const getPerformance: typeof Taro.getPerformance = () => {
  const res = {
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

  const createObserver = (callback) => {
    if (typeof callback === 'function') {
      // do nothing 
    }
    const result: Taro.PerformanceEntry = {
      /** 指标类型 */
      entryType: 'navigation',
      /** 指标名称 */
      name: 'appLaunch',
      ...res,
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

  const getEntries = () => {
    const result: Taro.PerformanceEntry = {
      /** 指标类型 */
      entryType: 'navigation',
      /** 指标名称 */
      name: 'appLaunch',
      ...res,
    }
    return [result]
  }

  const getEntriesByName = (name: string, entryType: string) => {
    const result: Taro.PerformanceEntry = {
      /** 指标类型 */
      entryType: entryType as keyof Taro.PerformanceEntry.EntryType,
      /** 指标名称 */
      name: name as keyof Taro.PerformanceEntry.EntryName,
      ...res,
    }
    return [result]
  }

  const getEntriesByType = (entryType: string) => {
    const result: Taro.PerformanceEntry = {
      /** 指标类型 */
      entryType: entryType as keyof Taro.PerformanceEntry.EntryType,
      /** 指标名称 */
      name: 'appLaunch',
      ...res,
    }
    return [result]
  }

  const setBufferSize = (size: number) => { 
    if (typeof size === 'number') {
      // do nothing 
    } 
  }

  const performance: Taro.Performance = {
    createObserver,
    getEntries,
    getEntriesByName,
    getEntriesByType,
    setBufferSize
  }
  return performance
}