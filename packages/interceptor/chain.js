export default class Chain{
  constructor(requestParams, interceptors=[], index=0){
    this.index = index;
    this.requestParams = requestParams;
    this.interceptors = interceptors;
  }
  proceed(requestParams){
    this.requestParams = requestParams;
    let nextInterceptor = this.getNextInterceptor();
    if(this.index >= this.interceptors.length){
      throw new Error('chain参数错误, 请勿直接修改request.chain');
    }
    let nextChain = this.getNextChain();
    return nextInterceptor(nextChain);
  }

  getNextInterceptor(){
    return this.interceptors[this.index]
  }
  getNextChain(){
    return new Chain(this.requestParams, this.interceptors, this.index + 1);
  }
}
