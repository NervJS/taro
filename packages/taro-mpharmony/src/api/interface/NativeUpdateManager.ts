import Taro from '@tarojs/api'

import native from '../NativeApi'

export class NativeUpdateManager implements Taro.UpdateManager {

  private static nativeUpdateManager: NativeUpdateManager

  static getUpdateManager () {

    if ( !NativeUpdateManager.nativeUpdateManager ) {
      NativeUpdateManager.nativeUpdateManager =  new NativeUpdateManager()
    }
    return NativeUpdateManager.nativeUpdateManager
  }

  applyUpdate () {
    native.applyUpdate()
  }

  onCheckForUpdate (callback: Taro.UpdateManager.OnCheckForUpdateCallback) {
    native.onCheckForUpdate(callback)
  }


  onUpdateFailed (callback: (res: TaroGeneral.CallbackResult) => void) {
    native.onUpdateFailed(callback)

  }

  onUpdateReady (callback: (res: TaroGeneral.CallbackResult) => void) {
    native.onUpdateReady(callback)
  }
}
