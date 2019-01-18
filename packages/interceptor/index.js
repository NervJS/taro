import Chain from './chain';

export default class Link{

  constructor(interceptors){
    this.chain = new Chain(null, interceptors, 0)
  }

  request(requestParams){
    return this.chain.proceed({method: 'GET', ...requestParams})
  }

  addInterceptor(interceptor){
    this.chain.interceptors.unshift(interceptor)
  }
}
