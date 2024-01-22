import Taro from '@tarojs/api'

import native from '../NativeApi'

export class NativeUploadFile implements Taro.UploadTask {
  private taskID: string

  constructor ( taskID: string) {
    this.taskID = taskID
  }

  static getUploadTask (taskID: string) {
    return new NativeUploadFile(taskID)
  }

  abort (): void {
    native.abortBridgeAsync(this.taskID)
  }

  offHeadersReceived (option: any): void {
    native.offHeadersReceivedBridgeAsync(option, this.taskID)
  }

  offProgressUpdate (option: any): void {
    native.offProgressUpdateBridgeAsync(option, this.taskID)
  }

  onHeadersReceived (option: any): void {
    native.onHeadersReceivedBridgeAsync(option, this.taskID)
  }

  onProgressUpdate (option: any): void {
    native.onProgressUpdateBridgeAsync(option, this.taskID)
  }
}
