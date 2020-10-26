export default class Chain {
  constructor (requestParams, interceptors = [], index = 0) {
    this.index = index
    this.requestParams = requestParams
    this.interceptors = interceptors
  }

  proceed (requestParams) {
    this.requestParams = requestParams
    if (this.index >= this.interceptors.length) {
      throw new Error('chain 参数错误, 请勿直接修改 request.chain')
    }
    const nextInterceptor = this._getNextInterceptor()
    const nextChain = this._getNextChain()
    const p = nextInterceptor(nextChain)
    const res = p.catch(err => Promise.reject(err))
    if (typeof p.abort === 'function') res.abort = p.abort
    return res
  }

  _getNextInterceptor () {
    return this.interceptors[this.index]
  }

  _getNextChain () {
    return new Chain(this.requestParams, this.interceptors, this.index + 1)
  }
}
