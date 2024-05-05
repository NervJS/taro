import Taro from '@tarojs/api'

import native from '../NativeApi'

export class NativeRequest implements Taro.RequestTask<any> {
  readonly [Symbol.toStringTag]: string = 'NativeRequest'
  private objectId: number
  constructor (objectId: number) {
    this.objectId = objectId
  }

  static createRequestTask (option: any) {
    const objectId = native.callInstance(option, {
      type: 'create',
      name: 'RequestTask',
      objectId: -1,
      isAsync: false,
      autoRelease: true
    })
    return new NativeRequest(objectId)
  }

  abort (): void {
    native.callInstance({}, {
      type: 'function',
      name: 'abort',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  onHeadersReceived (option: any): void {
    native.callInstance(option, {
      type: 'function',
      name: 'onHeadersReceived',
      objectId: this.objectId,
      isAsync: true,
      autoRelease: false
    })
  }

  offHeadersReceived (option: any): void {
    native.callInstance(option, {
      type: 'function',
      name: 'offHeadersReceived',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  catch<TResult = never> (
    onrejected?: ((reason: any) => PromiseLike<TResult> | TResult) | undefined | null
  ): Promise<any> {
    return Promise.resolve(onrejected)
  }

  offChunkReceived (option: any): void {
    return option
  }

  onChunkReceived (option: any): void {
    return option
  }

  then<TResult = never> (
    onrejected?: ((reason: any) => PromiseLike<TResult> | TResult) | undefined | null
  ): Promise<any> {
    return Promise.resolve(onrejected)
  }

  finally (onfinally?: (() => void) | null | undefined): any {
    throw new Error(onfinally as undefined)
  }
}
