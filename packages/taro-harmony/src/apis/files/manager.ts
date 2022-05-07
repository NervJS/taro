import Taro from '@tarojs/taro'
import { isNumber, isString } from '@tarojs/shared'
import { callCallbackFail, callCallbackSuccess, notSupport } from './utils'
import { validateParams } from '../utils'

const fileio = require('@ohos.fileio')

const accessSchema = {
  path: 'String'
}

const copyFileSchema = {
  srcPath: 'String',
  destPath: 'String'
}

const openSchema = {
  filePath: 'String'
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

interface ReadOption {
  offset: number,
  length: number,
  position: number
}

interface WriteOption extends ReadOption {
  encoding: 'utf-8'
}

interface ReadFileOption {
  length: number,
  position: number,
  encoding: 'utf-8'
}
interface ReadResult {
  bytesRead: number,
  arrayBuffer: ArrayBuffer
}

interface WriteResult {
  bytesWritten: number
}

function convertDataToString (data: string | ArrayBuffer): string {
  if (isString(data)) {
    return data
  }
  return String.fromCharCode.apply(null, new Uint8Array(data))
}

function convertWriteOption (option: Taro.FileSystemManager.WriteOption | Taro.FileSystemManager.WriteSyncOption): WriteOption | null {
  const { offset, length, position } = option
  if (isNumber(offset) && isNumber(length) && isNumber(position)) {
    return {
      offset,
      length,
      position,
      encoding: 'utf-8'
    }
  }
  return null
}

function convertReadOption (option: Taro.FileSystemManager.ReadOption | Taro.FileSystemManager.ReadSyncOption): ReadOption | null {
  const { offset, length, position } = option
  if (isNumber(offset) && isNumber(length) && isNumber(position)) {
    return {
      offset,
      length,
      position
    }
  }
  return null
}

function convertReadFileOption (option: Taro.FileSystemManager.ReadFileOption): ReadFileOption | null {
  const { length, position } = option
  if (isNumber(length) && isNumber(position)) {
    return {
      length,
      position,
      encoding: 'utf-8'
    }
  }
  return null
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

function accessSync (path: string): void {
  fileio.accessSync(path)
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
    validateParams('open', option, openSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }
  // 由于 HarmonyOS 异步方法 fileio.open 在【文件不存在】，并在【指定不存在则创建文件标志】后依旧抛出 No such file or directory 异常，
  // 为保证接口的可用性，此处降级使用 fileio.openSync 方法。
  const openPromise = new Promise((resolve, reject) => {
    try {
      const fd = fileio.openSync(option.filePath, convertOpenFlag(option.flag), 0o666)
      resolve({ fd: `${fd}` })
    } catch (error) {
      reject(new Error(error.message ? error.message : error))
    }
  })
  openPromise.then((res) => callCallbackSuccess(res, option))
    .catch((error) => callCallbackFail({ errMsg: error.message }, option))
}

function openSync (option: Taro.FileSystemManager.OpenSyncOption): string {
  validateParams('openSync', option, openSchema)
  return `${fileio.openSync(option.filePath, convertOpenFlag(option.flag), 0o666)}`
}

function read (option: Taro.FileSystemManager.ReadOption) {
  try {
    validateParams('read', option, readSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }

  fileio.read(parseInt(option.fd, 10), option.arrayBuffer, convertReadOption(option), (error, readOut) => {
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
    bytesRead: fileio.readSync(parseInt(option.fd, 10), option.arrayBuffer, convertReadOption(option)),
    arrayBuffer: option.arrayBuffer
  }
}

function readCompressedFile (option: Taro.FileSystemManager.readCompressedFile.Option) {
  notSupport('readCompressedFile', option)
}

function readCompressedFileSync (_: Taro.FileSystemManager.readCompressedFileSync.Option): ArrayBuffer {
  notSupport('readCompressedFileSync')
  return new ArrayBuffer(0)
}

/**
 * HarmonyOS encoding 目前仅支持 utf-8，详情参见：
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-fileio-0000001168366687#section17477155374810
 */
function readFile (option: Taro.FileSystemManager.ReadFileOption) {
  try {
    validateParams('readFile', option, openSchema)
  } catch (error) {
    const res = { errMsg: error.message }
    return callCallbackFail(res, option)
  }

  // 由于 HarmonyOS 异步方法 fileio.readText 方法不能正常工作，
  // 为保证接口的可用性，此处降级使用 fileio.readTextSync 方法。
  const readFilePromise = new Promise((resolve, reject) => {
    try {
      const data = fileio.readTextSync(option.filePath, convertReadFileOption(option))
      resolve({ data })
    } catch (error) {
      reject(new Error(error.message ? error.message : error))
    }
  })
  readFilePromise.then((res) => callCallbackSuccess(res, option))
    .catch((error) => callCallbackFail({ errMsg: error.message }, option))
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
  fileio.write(parseInt(option.fd, 10), data, convertWriteOption(option), (error, bytesWritten) => {
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
    bytesWritten: fileio.writeSync(parseInt(option.fd, 10), data, convertWriteOption(option))
  }
}

function writeFile (option: Taro.FileSystemManager.WriteFileOption) {
  open({
    filePath: option.filePath,
    flag: 'w',
    success: ({ fd }) => {
      write({
        fd,
        data: option.data,
        success: (res) => callCallbackSuccess(res, option),
        fail: (res) => callCallbackFail(res, option)
      })
    },
    fail: (res) => callCallbackFail(res, option)
  })
}

function writeFileSync (filePath: string, data: string | ArrayBuffer) {
  const fd = openSync({ filePath, flag: 'w' })
  writeSync({ fd, data })
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
    validateParams('unlink', option, openSchema)
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

export function getFileSystemManager () {
  return {
    access,
    accessSync,
    copyFile,
    copyFileSync,
    open,
    openSync,
    read,
    readSync,
    readCompressedFile,
    readCompressedFileSync,
    readFile,
    readFileSync,
    write,
    writeSync,
    writeFile,
    writeFileSync,
    rename,
    renameSync,
    unlink,
    unlinkSync
  }
}
