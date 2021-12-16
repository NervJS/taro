import Taro from '@tarojs/api'
import { temporarilyNotSupport } from '../utils'

export class cloud implements Taro.cloud {
  Cloud: new (options: Taro.cloud.IOptions) => Taro.Cloud;

  init = temporarilyNotSupport('cloud.init')

  CloudID = temporarilyNotSupport('cloud.CloudID')

  callFunction = temporarilyNotSupport('cloud.callFunction')

  // @ts-ignore
  uploadFile = temporarilyNotSupport('cloud.uploadFile')

  // @ts-ignore
  downloadFile = temporarilyNotSupport('cloud.downloadFile')

  getTempFileURL = temporarilyNotSupport('cloud.getTempFileURL')

  deleteFile = temporarilyNotSupport('cloud.deleteFile')

  // @ts-ignore
  database = temporarilyNotSupport('cloud.database')

  callContainer = temporarilyNotSupport('cloud.callContainer')
}
