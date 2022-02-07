import Taro from '@tarojs/api'
import { temporarilyNotSupport } from '../utils'

export class cloud implements Taro.cloud {
  Cloud: new (options: Taro.cloud.IOptions) => Taro.Cloud

  init = temporarilyNotSupport('cloud.init')

  CloudID = temporarilyNotSupport('cloud.CloudID')

  // @ts-ignore
  callFunction = temporarilyNotSupport('cloud.callFunction')

  // @ts-ignore
  uploadFile = temporarilyNotSupport('cloud.uploadFile')

  // @ts-ignore
  downloadFile = temporarilyNotSupport('cloud.downloadFile')

  // @ts-ignore
  getTempFileURL = temporarilyNotSupport('cloud.getTempFileURL')

  // @ts-ignore
  deleteFile = temporarilyNotSupport('cloud.deleteFile')

  // @ts-ignore
  database = temporarilyNotSupport('cloud.database')

  // @ts-ignore
  callContainer = temporarilyNotSupport('cloud.callContainer')
}
