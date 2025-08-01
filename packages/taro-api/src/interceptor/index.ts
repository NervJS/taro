import Chain from './chain'

import type { IRequestParams, TInterceptor } from './chain'

export default class Link {
  taroInterceptor: TInterceptor
  chain: Chain

  constructor (interceptor: TInterceptor) {
    this.taroInterceptor = interceptor
    this.chain = new Chain()
  }

  request (requestParams: IRequestParams) {
    const chain = this.chain
    const taroInterceptor = this.taroInterceptor

    chain.interceptors = chain.interceptors
      .filter(interceptor => interceptor !== taroInterceptor)
      .concat(taroInterceptor)

    return chain.proceed({ ...requestParams })
  }

  addInterceptor (interceptor: TInterceptor) {
    this.chain.interceptors.push(interceptor)
  }

  cleanInterceptors () {
    this.chain = new Chain()
  }
}

export function interceptorify (promisifyApi) {
  return new Link(function (chain) {
    return promisifyApi(chain.requestParams)
  })
}
