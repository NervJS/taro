import Taro from '@tarojs/api'

export class cloud implements Taro.cloud {
  Cloud: new (options: Taro.cloud.IOptions) => Taro.Cloud

  init = (config?: Taro.cloud.IInitConfig) => {
    if (config && typeof config === 'object') {
      // do nothing
    } else {
      // do nothing
    }
    Promise.resolve()
  }

  CloudID = (cloudID: string) => {
    if (typeof cloudID === 'string') {
      // do nothing
    }
  }

  // @ts-ignore
  callFunction = (param: any) => {
    if (typeof param === 'object') {
      // do nothing
    }
  }

  // @ts-ignore
  uploadFile = (param: any) => {
    if (typeof param === 'object') {
      // do nothing
    }
  }

  // @ts-ignore
  downloadFile = (param: any) => {
    if (typeof param === 'object') {
      // do nothing
    }
  }

  // @ts-ignore
  getTempFileURL = (param: any) => {
    if (typeof param === 'object') {
      // do nothing
    }
  }

  // @ts-ignore
  deleteFile = (param: any) => {
    if (typeof param === 'object') {
      // do nothing
    }
  }

  // @ts-ignore
  database = (config?: Taro.cloud.IConfig) => {
    if (config && typeof config === 'object') {
      // do nothing
    }
  }

  // @ts-ignore
  callContainer = (params: any) => {
    if (typeof params === 'object') {
      // do nothing
    }
  }
}
