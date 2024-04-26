import { NativeApi } from './NativeApi'
import osChannelApi from './osChannelApi'
import { RequestTask } from './request'

export let judgeUseAxios = false

export interface Status {
  done: boolean
  data: string
  errorMsg: string
}

class CacheStorageProxy {
  private cacheMap: Map<any, any>
  private readonly nativeApi: NativeApi
  private readonly asyncToSyncProxy: any

  constructor (nativeApi: NativeApi) {
    this.nativeApi = nativeApi
    this.cacheMap = new Map<string, any>()
    this.asyncToSyncProxy = new Proxy(nativeApi, new AsyncToSyncProxy(this.nativeApi))
  }

  // @ts-ignore
  get (target: { [x: string]: any }, prop: string) {
    if (prop === 'getStorageSync') {
      return (...args: any[]) => {
        const key = args[0].key
        if (this.cacheMap.has(key)) {
          return this.cacheMap.get(key)
        } else {
          const status = this.asyncToSyncProxy.getStorageSync({ key })
          if (status.done && status.errMsg === '') {
            this.cacheMap.set(key, status)
          }
          return status
        }
      }
    }
    if (prop === 'setStorageSync') {
      return (...args: any[]) => {
        const { key, data } = args[0]
        const status = this.asyncToSyncProxy.setStorageSync({ key, data })
        if (status.done && status.errMsg === '') {
          this.cacheMap.set(key, status)
        }
        return status
      }
    }
    return (...args: any[]) => {
      return this.asyncToSyncProxy[prop](...args)
    }
  }
}

class AsyncToSyncProxy {
  private readonly nativeApi: NativeApi
  private readonly STATUS: Status = { done: false, data: '', errorMsg: `search timeout` }
  private methods = ['setStorageSync', 'removeStorageSync', 'getStorageSync', 'getStorageInfoSync', 'clearStorageSync']

  constructor (nativeApi: NativeApi) {
    this.nativeApi = nativeApi
  }

  get (target: { [x: string]: any }, prop: string) {
    if (this.methods.includes(prop)) {
      return (...args: any[]) => {
        const asyncFunc = prop.substring(0, prop.length - 'Sync'.length)
        this.nativeApi[asyncFunc](...args)

        let count = 0
        while (count < 20000) {
          count++
          if (count % 2000 === 0) {
            const status = this.nativeApi.getExecStatus({ method: prop, key: args[0].key })
            if (status.done || status.errorMsg) {
              return status
            }
          }
        }
        return this.STATUS
      }
    }
    return target[prop]
  }
}

export class HybridProxy {
  private readonly useAxios: boolean
  private readonly useOsChannel: boolean
  private readonly cacheProxy: any
  private readonly requestApi = 'request'

  constructor (useAxios: boolean, useOsChannel: boolean, nativeApi: NativeApi) {
    this.useAxios = useAxios
    this.useOsChannel = useOsChannel
    this.cacheProxy = new Proxy(nativeApi, new CacheStorageProxy(nativeApi))
  }

  get (_target: any, prop: string) {
    return (...args: any) => {
      if (this.useAxios && prop === this.requestApi) {
        judgeUseAxios = this.useAxios
        // @ts-ignore
        return new RequestTask(...args)
      }
      if (this.useOsChannel && osChannelApi.hasOwnProperty(prop)) {
        return osChannelApi[prop](...args)
      }
      return this.cacheProxy[prop](...args)
    }
  }
}
