import Taro from '@tarojs/api'

import native from '../NativeApi'

export class NativeUploadFile implements Taro.UploadTask {
  private objectId: number

  constructor (objectId: number) {
    this.objectId = objectId
  }

  static getUploadTask (option: any) {
    const objectId = native.callInstance(option, {
      type: 'create',
      name: 'RequestTask',
      objectId: -1,
      isAsync: false,
      autoRelease: true
    })
    return new NativeUploadFile(objectId)
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

  offHeadersReceived (option: any): void {
    native.callInstance(option, {
      type: 'function',
      name: 'offHeadersReceived',
      objectId: this.objectId,
      isAsync: false,
      autoRelease: true
    })
  }

  offProgressUpdate (option: any): void {
    native.callInstance(option, {
      type: 'function',
      name: 'offProgressUpdate',
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

  onProgressUpdate (option: any): void {
    native.callInstance(option, {
      type: 'function',
      name: 'onProgressUpdate',
      objectId: this.objectId,
      isAsync: true,
      autoRelease: false
    })
  }
}
