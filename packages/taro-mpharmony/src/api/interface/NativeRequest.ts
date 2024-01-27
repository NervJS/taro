import Taro from '@tarojs/api'

import native from '../NativeApi'


export class NativeRequest implements Taro.RequestTask<any> {
  readonly [Symbol.toStringTag]: string = 'NativeRequest'
  private objectId: number
  constructor (objectId: number) {
    this.objectId = objectId
  }

  static getRequestTask (objectId: number) {
    return new NativeRequest(objectId)
  }

  abort (): void {
    native.abort( {}, this.objectId)
  }

  onHeadersReceived (option: any): void {
    native.onHeadersReceived(option, this.objectId)
  }

  offHeadersReceived (option: any): void {
    native.offHeadersReceived(option, this.objectId)
  }

  catch<TResult = never> (onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | undefined | null): Promise<any> {
    return Promise.resolve(onrejected)
  }

  offChunkReceived (option: any): void {
    return option
  }

  onChunkReceived (option: any): void {
    return option
  }

  then<TResult = never> (onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | undefined | null): Promise<any> {
    return Promise.resolve(onrejected)
  }

  finally (onfinally?: (() => void) | null | undefined): any {
    throw new Error(onfinally as undefined)
  }


}
