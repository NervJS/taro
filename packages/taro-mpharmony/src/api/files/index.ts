import { temporarilyNotSupport } from '../../utils'

/**
 * 保存文件系统的文件到用户磁盘，仅在 PC 端支持
 * 
 * @canNotUse saveFileToDisk
 */
export const saveFileToDisk = /* @__PURE__ */ temporarilyNotSupport('saveFileToDisk')

export * from './getFileInfo'
export * from './getFileSystemManager'
export * from './getSavedFileInfo'
export * from './getSavedFileList'
export * from './openDocument'
export * from './removeSavedFile'
export * from './saveFile'

/**
 * 描述文件状态的对象
 * 
 * @canNotUse Stats
 */