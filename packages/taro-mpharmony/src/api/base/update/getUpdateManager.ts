import Taro from '@tarojs/api'

import { NativeUpdateManager } from '../../interface/NativeUpdateManager'

/**
 * 获取全局唯一的版本更新管理器
 *
 * @canUse getUpdateManager
 * @null_implementation
 */
export const getUpdateManager: typeof Taro.getUpdateManager = () => {
  // 使用native方法
  return NativeUpdateManager.getUpdateManager()
}
