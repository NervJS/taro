import Taro from '@tarojs/api'

import native from '../NativeApi'


export class NativeRequest implements Taro.RequestTask<any> {
  readonly [Symbol.toStringTag]: string = 'NativeRequest'
  private taskID: number
  constructor (taskID: number) {
    this.taskID = taskID
  }

  static getRequestTask (taskID: number) {
    return new NativeRequest(taskID)
  }

  abort (): void {
    native.abortBridgeAsync(this.taskID)
  }

  onHeadersReceived (option: any): void {
    native.onHeadersReceivedBridgeAsync(option, this.taskID)
  }

  offHeadersReceived (option: any): void {
    native.offHeadersReceivedBridgeAsync(option, this.taskID)
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
