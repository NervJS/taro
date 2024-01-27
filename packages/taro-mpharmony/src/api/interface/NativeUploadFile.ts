import Taro from '@tarojs/api'

import native from '../NativeApi'

export class NativeUploadFile implements Taro.UploadTask {
  private objectId: number

  constructor ( objectId: number) {
    this.objectId = objectId
  }

  static getUploadTask (objectId: number) {
    return new NativeUploadFile(objectId)
  }

  abort (): void {
    native.abort({}, this.objectId )
  }

  offHeadersReceived (option: any): void {
    native.offHeadersReceived(option, this.objectId)
  }

  offProgressUpdate (option: any): void {
    native.offProgressUpdate(option, this.objectId)
  }

  onHeadersReceived (option: any): void {
    native.onHeadersReceived(option, this.objectId)
  }

  onProgressUpdate (option: any): void {
    native.onProgressUpdate(option, this.objectId)
  }
}
