/* eslint-disable no-console */
import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../utils'

export const setEnableDebug = /* @__PURE__ */ temporarilyNotSupport('setEnableDebug')

/**
 * H5 端没有日志上报能力，日志会输出到浏览器控制台
 */
class LogManager implements Taro.LogManager {
  debug = (...args: any[]) => console.debug(...args)
  info = (...args: any[]) => console.info(...args)
  log = (...args: any[]) => console.log(...args)
  warn = (...args: any[]) => console.warn(...args)
}

class RealtimeTagLogManager implements Taro.RealtimeTagLogManager {
  private prefix: string

  constructor (tagName: string) {
    this.prefix = `[${tagName}]`
  }

  // Note: 过滤关键字仅用于在小程序管理后台中检索日志，H5 端没有对应的能力
  addFilterMsg = (_msg: string) => {}
  setFilterMsg = (_msg: string) => {}
  error = (key: string, value: unknown) => console.error(this.prefix, key, value)
  info = (key: string, value: unknown) => console.info(this.prefix, key, value)
  warn = (key: string, value: unknown) => console.warn(this.prefix, key, value)
}

class RealtimeLogManager implements Taro.RealtimeLogManager {
  // Note: 过滤关键字和页面参数仅用于在小程序管理后台中检索日志，H5 端没有对应的能力
  addFilterMsg = (_msg: string) => {}
  setFilterMsg = (_msg: string) => {}
  in = (_pageInstance: unknown) => {}
  error = (...args: any[]) => console.error(...args)
  info = (...args: any[]) => console.info(...args)
  warn = (...args: any[]) => console.warn(...args)
  tag = (tagName: string) => new RealtimeTagLogManager(tagName)
}

let logManager: LogManager | null = null
let realtimeLogManager: RealtimeLogManager | null = null

/**
 * 获取实时日志管理器对象
 */
export const getRealtimeLogManager: typeof Taro.getRealtimeLogManager = () => {
  if (!realtimeLogManager) realtimeLogManager = new RealtimeLogManager()
  return realtimeLogManager
}

/**
 * 获取日志管理器对象
 */
export const getLogManager: typeof Taro.getLogManager = () => {
  if (!logManager) logManager = new LogManager()
  return logManager
}
