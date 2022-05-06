import Taro from '@tarojs/taro'
import { isNumber, isString } from '@tarojs/shared'
import { validateParams, callCallbackSuccess, callCallbackFail } from '../utils'

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

const writeSchema = {
  fd: 'String',
  data: 'String'
}

interface ReadOrWriteOption {
  offset: number,
  length: number,
  position: number,
  encoding: 'utf-8'
}

function convertDataToString (data: string | ArrayBuffer): string {
  if (isString(data)) {
    return data
  }
  return String.fromCharCode.apply(null, data)
}

function convertReadOrWriteOption (option: Taro.FileSystemManager.WriteOption | Taro.FileSystemManager.WriteSyncOption): ReadOrWriteOption | null {
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

  // 由于 HarmonyOS fileio 的 open 异步方法在【文件不存在】，并在【指定不存在则创建文件标志】后依旧会抛出：
  // No such file or directory 异常，为保证接口的可用性，此处降级使用 fileio 的 openSync 方法。
  try {
    const fd = fileio.openSync(option.filePath, convertOpenFlag(option.flag), 0o666)
    callCallbackSuccess({ fd: `${fd}` }, option)
  } catch (error) {
    const res = { errMsg: error.message ? error.message : error }
    callCallbackFail(res, option)
  }
}

function openSync (option: Taro.FileSystemManager.OpenSyncOption): string {
  validateParams('openSync', option, openSchema)
  return `${fileio.openSync(option.filePath, convertOpenFlag(option.flag), 0o666)}`
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
  fileio.write(parseInt(option.fd, 10), data, convertReadOrWriteOption(option), (error, bytesWritten) => {
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
function writeSync (option: Taro.FileSystemManager.WriteSyncOption): { bytesWritten: number } {
  const data = convertDataToString(option.data)
  validateParams('writeSync', { ...option, data }, writeSchema)
  return {
    bytesWritten: fileio.writeSync(parseInt(option.fd, 10), data, convertReadOrWriteOption(option))
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

export function getFileSystemManager () {
  return {
    access,
    accessSync,
    copyFile,
    copyFileSync,
    open,
    openSync,
    write,
    writeSync,
    writeFile,
    writeFileSync
  }
}
