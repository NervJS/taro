import Taro from '@tarojs/taro'

import { NativeFileSystemManager } from '../interface/NativeFileSystemManager'
/**
 * 获取全局唯一的文件管理器
 *
 * @canUse getFileSystemManager
 */
export const getFileSystemManager: typeof Taro.getFileSystemManager = () => {
  return NativeFileSystemManager.getFileSystemManager()
}
