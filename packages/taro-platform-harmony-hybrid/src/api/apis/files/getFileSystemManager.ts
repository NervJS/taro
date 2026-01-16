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

/**
 * 文件管理器
 *
 * @canUse FileSystemManager
 * @__class
 * [access, accessSync, appendFile, appendFileSync, close, closeSync, copyFile, copyFileSync, fstat,\
 * ftruncate, ftruncateSync, getFileInfo, mkdir, mkdirSync, open, openSync, read, readdir, readdirSync,\
 * readFile, readFileSync, readSync, rename, renameSync, rmdir, rmdirSync, truncate, truncateSync]
 */

/**
 * 文件读取结果。 通过 FileSystemManager.readSync 接口返回
 *
 * @canUse ReadResult
 * @__class [bytesRead, arrayBuffer]
 */

/**
 * 文件写入结果。 通过 FileSystemManager.writeSync 接口返回
 *
 * @canNotUse WriteResult
 */
