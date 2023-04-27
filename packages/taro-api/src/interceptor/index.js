import Chain from './chain'

export default class Link {
  constructor (interceptor) {
    this.taroInterceptor = interceptor
    this.chain = new Chain()
  }

  request (requestParams) {
    const chain = this.chain
    const taroInterceptor = this.taroInterceptor

    chain.interceptors = chain.interceptors
      .filter(interceptor => interceptor !== taroInterceptor)
      .concat(taroInterceptor)

    return chain.proceed({ ...requestParams })
  }

  addInterceptor (interceptor) {
    this.chain.interceptors.push(interceptor)
  }

  cleanInterceptors () {
    this.chain = new Chain()
  }
}

export function interceptorify (promiseifyApi) {
  return new Link(function (chain) {
    return promiseifyApi(chain.requestParams)
  })
}
