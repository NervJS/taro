import Taro from '@tarojs/taro'
import { isNumber, isString } from '@tarojs/shared'
import { callCallbackFail, callCallbackSuccess, notSupport, notSupportAsync } from './utils'
import { validateParams } from '../utils'

const app = require('@system.app')
const zlib = require('@ohos.zlib')
const file = require('@system.file')
const fileio = require('@ohos.fileio')

const rootDataPath = `/data/data/${app.getInfo().appID}`
const rootSavedFilePath = `${rootDataPath}/files`

const accessSchema = {
  path: 'String'
}

const copyFileSchema = {
  srcPath: 'String',
  destPath: 'String'
}

const filePathSchema = {
  filePath: 'String'
}

const dirPathSchema = {
  dirPath: 'String'
}

const readSchema = {
  fd: 'String',
  arrayBuffer: 'Object'
}

const writeSchema = {
  fd: 'String',
  data: 'String'
}

const renameSchema = {
  newPath: 'String',
  oldPath: 'String'
}

const fdSchema = {
  fd: 'String'
}

const saveFileSchema = {
  tempFilePath: 'String'
}

const unzipSchema = {
  targetPath: 'String',
  zipFilePath: 'String'
}
interface ReadOption {
  offset?: number,
  length?: number,
  position?: number
}

interface WriteOption extends ReadOption {
  encoding: 'utf-8'
}

interface ReadFileOption {
  position?: number,
  length?: number,
  encoding: 'utf-8'
}
interface ReadResult {
  bytesRead: number,
  arrayBuffer: ArrayBuffer
}

interface WriteResult {
  bytesWritten: number
}

function convertFilePathToUri (filePath: string): string {
  return filePath.replace(rootDataPath, 'internal:/')
}

function convertDataToString (data: string | ArrayBuffer): string {
  if (isString(data)) {
    return data
  }
  return String.fromCharCode.apply(null, new Uint8Array(data))
}

function convertReadOption (option: Taro.FileSystemManager.ReadOption | Taro.FileSystemManager.ReadSyncOption): ReadOption {
  const result: ReadOption = {}
  const { offset, length, position } = option
  if (isNumber(offset)) {
    result.offset = offset
  }
  if (isNumber(length)) {
    result.length = length
  }
  if (isNumber(position)) {
    result.position = position
  }
  return result
}

function convertWriteOption (option: Taro.FileSystemManager.WriteOption | Taro.FileSystemManager.WriteSyncOption): WriteOption {
  const result: WriteOption = {
    encoding: 'utf-8'
  }
  const { offset, length, position } = option
  if (isNumber(offset)) {
    result.offset = offset
  }
  if (isNumber(length)) {
    result.length = length
  }
  if (isNumber(position)) {
    result.position = position
  }
  return result
}

function convertReadFileOption (option: Taro.FileSystemManager.ReadFileOption): ReadFileOption {
  const result: ReadFileOption = {
    encoding: 'utf-8'
  }
  const { position, length } = option
  if (isNumber(position)) {
    result.position = position
  }
  if (isNumber(length)) {
    result.length = length
  }
  return result
}

function convertFd (fd: string): number {
  return parseInt(fd, 10)
}

/**
 * HarmonyOS flag 详情参见：
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-fileio-0000001168366687#section1153565865716
 */
function convertOpenFlag (flag?: keyof Taro.FileSystemManager.flag): number {
  if (typeof flag === 'string') {
    switch (flag) {
      case 'a':
        return 0o1 | 0o100 | 0o2000
      case 'ax':
        return 0o1 | 0o100 | 0o2000 | 0o200
      case 'a+':
        return 0o2 | 0o100 | 0o2000
      case 'ax+':
        return 0o2 | 0o100 | 0o2000 | 0o200
      case 'as':
        return 0o1 | 0o100 | 0o2000 | 0o4010000
      case 'as+':
        return 0o2 | 0o100 | 0o2000 | 0o4010000
      case 'r':
        return 0o0
      case 'r+':
        return 0o2
      case 'w':
        return 0o1 | 0o100 | 0o1000
      case 'wx':
        return 0o1 | 0o100 | 0o200
      case 'w+':
        return 0o2 | 0o100 | 0o1000
      case 'wx+':
        return 0o2 | 0o100 | 0o200
      default:
        return 0o0
    }
  } else {
    return 0o0
  }
}

function validateSavedFilePath (savedFilePath: string) {
  if (savedFilePath.indexOf(rootSavedFilePath) !== 0) {
    throw new Error(`The filePath should in ${rootSavedFilePath}`)
  }
}

function parseSavedFilePath (srcPath: string, savedFilePath: string | undefined) : string {
  if (isString(savedFilePath) && savedFilePath.length > 0) {
    validateSavedFilePath(savedFilePath)
    return savedFilePath
  }
  return `${rootSavedFilePath}/${srcPath.split('/').pop()}`
}

function isFileExist (filePath: string): boolean {
  try {
    accessSync(filePath)
    return true
  } catch (_) {
    return false
  }
}

function readCompressedFile (option: Taro.FileSystemManager.readCompressedFile.Option): Promise<Taro.FileSystemManager.readCompressedFile.Promised> {
  return notSupportAsync('readCompressedFile', option)
}

function readCompressedFileSync (_: Taro.FileSystemManager.readCompressedFileSync.Option): ArrayBuffer {
  notSupport('readCompressedFileSync')
  return new ArrayBuffer(0)
}

function readZipEntry (option: Taro.FileSystemManager.readZipEntry.Option): Promise<Taro.FileSystemManager.readZipEntry.Promised> {
  return notSupportAsync('readZipEntry', option)
}

function access (option: Taro.FileSystemManager.AccessOption) {
  try {
    validateParams('access', option, accessSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  fileio.access(option.path, (error) => {
    if (error) {
      const res = { errMsg: error.message ? error.message : error }
      callCallbackFail(res, option)
    } else {
      callCallbackSuccess(undefined, option)
    }
  })
}

function accessSync (path: string) {
  fileio.accessSync(path)
}

function mkdir (option: Taro.FileSystemManager.MkdirOption) {
  try {
    validateParams('mkdir', option, dirPathSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  file.mkdir({
    uri: convertFilePathToUri(option.dirPath),
    recursive: true,
    success: () => callCallbackSuccess(undefined, option),
    fail: (data, code) => {
      const res = { errMsg: `mkdir invoke failed, code: ${code}, data: ${data}` }
      callCallbackFail(res, option)
    }
  })
}

function mkdirSync (dirPath: string, recursive?: boolean) {
  if (recursive === true) {
    const parentDirPath = dirPath.split('/').slice(0, -1).join('/')
    if (isFileExist(parentDirPath)) {
      fileio.mkdirSync(dirPath)
    } else {
      mkdirSync(parentDirPath, true)
    }
  } else {
    fileio.mkdirSync(dirPath)
  }
}

function rmdir (option: Taro.FileSystemManager.RmdirOption) {
  try {
    validateParams('rmdir', option, dirPathSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  file.rmdir({
    uri: convertFilePathToUri(option.dirPath),
    recursive: true,
    success: () => callCallbackSuccess(undefined, option),
    fail: (data, code) => {
      const res = { errMsg: `rmdir invoke failed, code: ${code}, data: ${data}` }
      callCallbackFail(res, option)
    }
  })
}

function rmdirSync (dirPath: string, recursive?: boolean) {
  if (recursive === true) {
    notSupport('rmdirSync recursive')
  } else {
    fileio.rmdirSync(dirPath)
  }
}

function copyFile (option: Taro.FileSystemManager.CopyFileOption) {
  try {
    validateParams('copyFile', option, copyFileSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  fileio.copyFile(option.srcPath, option.destPath, 0, (error) => {
    if (error) {
      const res = { errMsg: error.message ? error.message : error }
      callCallbackFail(res, option)
    } else {
      callCallbackSuccess(undefined, option)
    }
  })
}

function copyFileSync (srcPath: string, destPath: string) {
  fileio.copyFileSync(srcPath, destPath, 0)
}

function open (option: Taro.FileSystemManager.OpenOption) {
  try {
    validateParams('open', option, filePathSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  // 由于 HarmonyOS 异步方法 fileio.open 在【文件不存在则创建】模式下依旧抛出 No such file or directory 异常，
  // 为保证接口的可用性，此处降级使用 fileio.openSync 方法。
  const openPromise = new Promise((resolve, reject) => {
    try {
      const fd = fileio.openSync(option.filePath, convertOpenFlag(option.flag), 0o666)
      resolve({ fd: fd.toString() })
    } catch (error) {
      reject(new Error(error.message ? error.message : error))
    }
  })
  openPromise.then((res) => callCallbackSuccess(res, option))
    .catch((error) => callCallbackFail({ errMsg: error.message }, option))
}

function openSync (option: Taro.FileSystemManager.OpenSyncOption): string {
  validateParams('openSync', option, filePathSchema)
  return fileio.openSync(option.filePath, convertOpenFlag(option.flag), 0o666).toString()
}

function getFileInfo (option: Taro.FileSystemManager.getFileInfoOption) {
  open({
    filePath: option.filePath,
    flag: 'r',
    success: ({ fd }) => {
      const fstatPromise = new Promise((resolve) => {
        fstat({
          fd,
          success: ({ stats }) => resolve({
            error: null,
            res: { size: stats.size }
          }),
          fail: (res) => resolve({
            error: res,
            res: null
          })
        })
      })
      fstatPromise.then(({ error, res }) => {
        close({
          fd,
          success: () => {
            if (error === null) {
              callCallbackSuccess(res, option)
            } else {
              callCallbackFail(error, option)
            }
          },
          fail: (res) => callCallbackFail(res, option)
        })
      })
    },
    fail: (res) => callCallbackFail(res, option)
  })
}

function read (option: Taro.FileSystemManager.ReadOption) {
  try {
    validateParams('read', option, readSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }

  fileio.read(convertFd(option.fd), option.arrayBuffer, convertReadOption(option), (error, readOut) => {
    if (error) {
      const res = { errMsg: error.message ? error.message : error }
      callCallbackFail(res, option)
    } else {
      callCallbackSuccess({ bytesRead: readOut.bytesRead, arrayBuffer: readOut.buffer }, option)
    }
  })
}

function readSync (option: Taro.FileSystemManager.ReadSyncOption): ReadResult {
  validateParams('readSync', option, readSchema)
  return {
    bytesRead: fileio.readSync(convertFd(option.fd), option.arrayBuffer, convertReadOption(option)),
    arrayBuffer: option.arrayBuffer
  }
}

/**
 * HarmonyOS encoding 目前仅支持 utf-8，详情参见：
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-fileio-0000001168366687#section17477155374810
 */
function readFile (option: Taro.FileSystemManager.ReadFileOption) {
  try {
    validateParams('readFile', option, filePathSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }

  fileio.readText(option.filePath, convertReadFileOption(option), (error, data) => {
    if (error) {
      const res = { errMsg: error.message ? error.message : error }
      callCallbackFail(res, option)
    } else {
      callCallbackSuccess({ data }, option)
    }
  })
}

/**
 * HarmonyOS encoding 目前仅支持 utf-8，详情参见：
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-fileio-0000001168366687#section4147155065718
 */
function readFileSync (filePath: string, encoding?: keyof Taro.FileSystemManager.Encoding, position?: number, length?: number): string | ArrayBuffer {
  return fileio.readTextSync(filePath, convertReadFileOption({ filePath, encoding, length, position }))
}

/**
 * HarmonyOS encoding 目前仅支持 utf-8，详情参见：
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-fileio-0000001168366687#section140547195118
 */
function write (option: Taro.FileSystemManager.WriteOption) {
  const data = convertDataToString(option.data)
  try {
    validateParams('write', { ...option, data }, writeSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  fileio.write(convertFd(option.fd), data, convertWriteOption(option), (error, bytesWritten) => {
    if (error) {
      const res = { errMsg: error.message ? error.message : error }
      callCallbackFail(res, option)
    } else {
      callCallbackSuccess({ bytesWritten }, option)
    }
  })
}

/**
 * HarmonyOS encoding 目前仅支持 utf-8，详情参见：
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-fileio-0000001168366687#section144923345218
 */
function writeSync (option: Taro.FileSystemManager.WriteSyncOption): WriteResult {
  const data = convertDataToString(option.data)
  validateParams('writeSync', { ...option, data }, writeSchema)
  return {
    bytesWritten: fileio.writeSync(convertFd(option.fd), data, convertWriteOption(option))
  }
}

function writeFileWithFlag (option: Taro.FileSystemManager.WriteFileOption, flag: keyof Taro.FileSystemManager.flag) {
  open({
    flag,
    filePath: option.filePath,
    success: ({ fd }) => {
      const writePromise = new Promise((resolve) => {
        write({
          fd,
          data: option.data,
          success: (res) => resolve({
            error: null,
            res
          }),
          fail: (res) => resolve({
            error: res,
            res: null
          })
        })
      })
      writePromise.then(({ error, res }) => {
        close({
          fd,
          success: () => {
            if (error === null) {
              callCallbackSuccess(res, option)
            } else {
              callCallbackFail(error, option)
            }
          },
          fail: (res) => callCallbackFail(res, option)
        })
      })
    },
    fail: (res) => callCallbackFail(res, option)
  })
}

function writeFile (option: Taro.FileSystemManager.WriteFileOption) {
  writeFileWithFlag(option, 'w')
}

function writeFileSyncWithFlag (filePath: string, data: string | ArrayBuffer, flag: keyof Taro.FileSystemManager.flag) {
  const fd = openSync({ filePath, flag })
  writeSync({ fd, data })
  closeSync({ fd })
}

function writeFileSync (filePath: string, data: string | ArrayBuffer) {
  writeFileSyncWithFlag(filePath, data, 'w')
}

function appendFile (option: Taro.FileSystemManager.AppendFileOption) {
  writeFileWithFlag(option, 'a')
}

function appendFileSync (filePath: string, data: string | ArrayBuffer) {
  writeFileSyncWithFlag(filePath, data, 'a')
}

function rename (option: Taro.FileSystemManager.RenameOption) {
  try {
    validateParams('rename', option, renameSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  fileio.rename(option.oldPath, option.newPath, (error) => {
    if (error) {
      const res = { errMsg: error.message ? error.message : error }
      callCallbackFail(res, option)
    } else {
      callCallbackSuccess(undefined, option)
    }
  })
}

function renameSync (oldPath: string, newPath: string) {
  fileio.renameSync(oldPath, newPath)
}

function unlink (option: Taro.FileSystemManager.UnlinkOption) {
  try {
    validateParams('unlink', option, filePathSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }

  fileio.unlink(option.filePath, (error) => {
    if (error) {
      const res = { errMsg: error.message ? error.message : error }
      callCallbackFail(res, option)
    } else {
      callCallbackSuccess(undefined, option)
    }
  })
}

function unlinkSync (filePath: string) {
  fileio.unlinkSync(filePath)
}

function fstat (option: Taro.FileSystemManager.FstatOption) {
  try {
    validateParams('fstat', option, fdSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  fileio.fstat(convertFd(option.fd), (error, stats) => {
    if (error) {
      const res = { errMsg: error.message ? error.message : error }
      callCallbackFail(res, option)
    } else {
      const res = {
        mode: stats.mode.toString(),
        size: stats.size,
        lastAccessedTime: stats.atime,
        lastModifiedTime: stats.mtime,
        isDirectory: () => stats.isDirectory(),
        isFile: () => stats.isFile()
      }
      callCallbackSuccess({ stats: res }, option)
    }
  })
}

function fstatSync (option: Taro.FileSystemManager.FstatSyncOption): Taro.Stats {
  validateParams('fstatSync', option, fdSchema)
  const stats = fileio.fstatSync(convertFd(option.fd))
  return {
    mode: stats.mode.toString(),
    size: stats.size,
    lastAccessedTime: stats.atime,
    lastModifiedTime: stats.mtime,
    isDirectory: () => stats.isDirectory(),
    isFile: () => stats.isFile()
  }
}

function ftruncate (option: Taro.FileSystemManager.FtruncateOption) {
  try {
    validateParams('ftruncate', option, fdSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }

  fileio.ftruncate(convertFd(option.fd), option.length ?? 0, (error) => {
    if (error) {
      const res = { errMsg: error.message ? error.message : error }
      callCallbackFail(res, option)
    } else {
      callCallbackSuccess(undefined, option)
    }
  })
}

function ftruncateSync (option: Taro.FileSystemManager.FtruncateSyncOption) {
  validateParams('ftruncateSync', option, fdSchema)
  fileio.ftruncateSync(convertFd(option.fd), option.length ?? 0)
}

function truncate (option: Taro.FileSystemManager.TruncateOption) {
  try {
    validateParams('truncate', option, filePathSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }

  fileio.truncate(option.filePath, option.length ?? 0, (error) => {
    if (error) {
      const res = { errMsg: error.message ? error.message : error }
      callCallbackFail(res, option)
    } else {
      callCallbackSuccess(undefined, option)
    }
  })
}

function truncateSync (option: Taro.FileSystemManager.TruncateSyncOption) {
  validateParams('truncateSync', option, filePathSchema)
  fileio.truncateSync(option.filePath, option.length ?? 0)
}

function close (option: Taro.FileSystemManager.CloseOption) {
  try {
    validateParams('close', option, fdSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  fileio.close(convertFd(option.fd), (error) => {
    if (error) {
      const res = { errMsg: error.message ? error.message : error }
      callCallbackFail(res, option)
    } else {
      callCallbackSuccess(undefined, option)
    }
  })
}

function closeSync (option: Taro.FileSystemManager.CloseSyncOption) {
  validateParams('closeSync', option, fdSchema)
  fileio.closeSync(convertFd(option.fd))
}

function saveFile (option: Taro.FileSystemManager.SaveFileOption) {
  try {
    validateParams('saveFile', option, saveFileSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }

  try {
    const savedFilePath = parseSavedFilePath(option.tempFilePath, option.filePath)
    rename({
      oldPath: option.tempFilePath,
      newPath: savedFilePath,
      success: () => {
        callCallbackSuccess({ savedFilePath }, option)
      },
      fail: (res) => {
        callCallbackFail(res, option)
      }
    })
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
}

function saveFileSync (tempFilePath: string, filePath?: string): string {
  const savedFilePath = parseSavedFilePath(tempFilePath, filePath)
  renameSync(tempFilePath, savedFilePath)
  return savedFilePath
}

function removeSavedFile (option: Taro.FileSystemManager.RemoveSavedFileOption) {
  try {
    validateParams('removeSavedFile', option, filePathSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  try {
    validateSavedFilePath(option.filePath)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  unlink(option)
}

function unzip (option: Taro.FileSystemManager.UnzipOption) {
  try {
    validateParams('unzip', option, unzipSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  zlib.unzipFile(option.zipFilePath, option.targetPath).then(() => {
    callCallbackSuccess(undefined, option)
  }).catch(error => {
    const res = { errMsg: error.message ? error.message : error }
    callCallbackFail(res, option)
  })
}

export function getFileSystemManager () {
  return {
    access,
    accessSync,
    appendFile,
    appendFileSync,
    close,
    closeSync,
    copyFile,
    copyFileSync,
    fstat,
    fstatSync,
    ftruncate,
    ftruncateSync,
    getFileInfo,
    mkdir,
    mkdirSync,
    open,
    openSync,
    read,
    readCompressedFile,
    readCompressedFileSync,
    readFile,
    readFileSync,
    readSync,
    readZipEntry,
    removeSavedFile,
    rename,
    renameSync,
    rmdir,
    rmdirSync,
    saveFile,
    saveFileSync,
    truncate,
    truncateSync,
    unlink,
    unlinkSync,
    unzip,
    write,
    writeFile,
    writeFileSync,
    writeSync
  }
}
