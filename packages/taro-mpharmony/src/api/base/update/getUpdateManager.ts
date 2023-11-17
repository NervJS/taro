import Taro from '@tarojs/api'

/**
 * 获取全局唯一的版本更新管理器
 * 
 * @canUse getUpdateManager
 * @null_implementation
 */
export const getUpdateManager: typeof Taro.getUpdateManager = () => {
  return new UpdateManager()
}

/**
 * UpdateManager更新管理类
 * 
 * @canUse UpdateManager
 * @null_implementation
 */
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
