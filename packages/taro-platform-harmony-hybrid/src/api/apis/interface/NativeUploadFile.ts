import Taro from '@tarojs/api'

import { ClassInstanceManager } from './ClassInstanceManager'

export class NativeUploadFile implements Taro.UploadTask {
  readonly className: string = 'NativeUploadFile'
  private objectId: number

  constructor (option: any) {
    const options = {
      ...option,
      success: (res: any) => {
        option?.success(res)
        this.destroy()
      },
      fail: (res: any) => {
        option?.fail(res)
        this.destroy()
      }
    }
    this.objectId = ClassInstanceManager.getInstance().createInstance(this.className, options)
  }

  static getUploadTask (option: any) {
    return new NativeUploadFile(option)
  }

  abort (): void {
    ClassInstanceManager.getInstance().setInstanceFunction({}, this.className, 'abort', this.objectId)
    this.destroy()
  }

  offHeadersReceived (option: any): void {
    ClassInstanceManager.getInstance().setInstanceFunction(option, this.className, 'offHeadersReceived', this.objectId)
  }

  offProgressUpdate (option: any): void {
    ClassInstanceManager.getInstance().setInstanceFunction(option, this.className, 'offProgressUpdate', this.objectId)
  }

  onHeadersReceived (option: any): void {
    ClassInstanceManager.getInstance().setInstanceFunctionAsync(option, this.className, 'onHeadersReceived', this.objectId)
  }

  onProgressUpdate (option: any): void {
    ClassInstanceManager.getInstance().setInstanceFunctionAsync(option, this.className, 'onProgressUpdate', this.objectId)
  }

  destroy (): void {
    ClassInstanceManager.getInstance().destroyInstance(this.className, this.objectId)
  }
}
