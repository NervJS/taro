import { isFunction } from '@tarojs/shared'

export type TInterceptor = (c: Chain) => Promise<void>

export interface IRequestParams {
  timeout?: number
  method?: string
  url?: string
  data?: unknown
}

export default class Chain {
  index: number
  requestParams: IRequestParams
  interceptors: TInterceptor[]

  constructor (requestParams?: IRequestParams, interceptors?: TInterceptor[], index?: number) {
    this.index = index || 0
    this.requestParams = requestParams || {}
    this.interceptors = interceptors || []
  }

  proceed (requestParams: IRequestParams = {}) {
    this.requestParams = requestParams
    if (this.index >= this.interceptors.length) {
      throw new Error('chain 参数错误, 请勿直接修改 request.chain')
    }
    const nextInterceptor = this._getNextInterceptor()
    const nextChain = this._getNextChain()
    const p = nextInterceptor(nextChain)
    const res = p.catch(err => Promise.reject(err))
    Object.keys(p).forEach(k => isFunction(p[k]) && (res[k] = p[k]))
    return res
  }

  _getNextInterceptor () {
    return this.interceptors[this.index]
  }

  _getNextChain () {
    return new Chain(this.requestParams, this.interceptors, this.index + 1)
  }
}
