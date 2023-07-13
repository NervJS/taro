import Taro from "@tarojs/taro"

/**
 * 获取全局唯一的文件管理器
 */
export const getFileSystemManager: typeof Taro.getFileSystemManager = () =>{
  // @ts-ignore
  return native.getFileSystemManager()
}