import Taro from '@tarojs/api'

export const getUpdateManager: typeof Taro.getUpdateManager = () => {
  return new UpdateManager()
}

// null-implementation
class UpdateManager implements Taro.UpdateManager {
  applyUpdate (): void {

  }

  onCheckForUpdate (callback: Taro.UpdateManager.OnCheckForUpdateCallback) {
    const info: Taro.UpdateManager.OnCheckForUpdateResult = {
      hasUpdate: false
    }
    callback(info)
  }

  onUpdateReady (callback: (res: TaroGeneral.CallbackResult) => void) {
    const info: TaroGeneral.CallbackResult = {
      errMsg: 'fail'
    }
    callback(info)
  }

  onUpdateFailed (callback: (res: TaroGeneral.CallbackResult) => void) {
    const info: TaroGeneral.CallbackResult = {
      errMsg: 'fail'
    }
    callback(info)
  }
}
