import Taro from '@tarojs/taro'

declare function openUrl<T>(opts?: {}): Promise<T>

interface TaroRN {
  openUrl: typeof openUrl
}

declare const TaroRN: (TaroRN & typeof Taro)
export = TaroRN
