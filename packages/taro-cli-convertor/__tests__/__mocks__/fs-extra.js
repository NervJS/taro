'use strict'

const path = require('path')

// 存储文件信息，包括文件路径和对应的内容
const oriFileMap = new Map()

// 保存转换后的文件
const resFileMap = new Map()

/**
 * 保存文件信息
 * 
 * @param { string } root 工程根目录 
 * @param { map } newMockFiles 
 */
function setMockFiles (root, newMockFiles) {
  for (const file in newMockFiles) {
    oriFileMap.set(normalizePath(path.join(root, file)), newMockFiles[file])
  }
}


/**
 * 获取原始的mock文件
 * 
 * @returns 
 */
function getMockFiles () {
  return oriFileMap
}

/**
 * 更新oriFileMap
 * 
 * @param { map } updateFiles 
 */
function updateMockFiles (root, updateFiles) {
  for (const file in updateFiles) {
    oriFileMap.set(normalizePath(path.join(root, file)), updateFiles[file])
  }
}

// 返回结果文件
function getResMapFile () {
  return resFileMap
}

/**
 * 清空fileMap
 * 
 */
function clearMockFiles () {
  oriFileMap.clear()
  resFileMap.clear()
}

/**
 * 删除oriFileMap中元素
 * 
 * @param { 文件路径 } key 
 */
function deleteMockFiles (key) {
  oriFileMap.delete(key)
}

/**
 * 读取文件
 * 
 * @param { 文件路径 } path 
 * @returns 
 */
function readFileSyncMock (path) {
  if (path === undefined || path === null || path === '') {
    throw new Error(`文件路径异常，path：${path}`)
  }

  path = normalizePath(path)

  if (!existsSyncMock(path)) {
    throw new Error(`文件不存在，path：${path}`)
  }

  return oriFileMap.get(path)
}

/**
 * 判断文件是否存在
 * 
 */
function existsSyncMock (path) {
  if (typeof path !== 'string' || path === '') {
    return false
  }

  path = normalizePath(path)

  const parts = path.split('/')
  // 根据是否有后缀名判断为文件
  if (parts[parts.length - 1].includes('.')) {
    if (oriFileMap.get(path) === undefined) {
      return false
    }
    return true
  }

  // 文件夹内默认不存在
  return false
}

/**
 * 保证文件夹存在，不存在则创建
 * 
 * @returns 默认存在
 */
function ensureDirSyncMock () {
  return true
}

/**
 * 保证文件夹存在，不存在则创建
 * 
 * @returns 默认存在
 */
function ensureDirMock () {
  return true
}

/**
 * 创建文件夹
 * 
 * @returns 
 */
function mkdirSyncMock () {
  return true
}

/**
 * 向文件中追加内容
 * 
 * @param { string } path 
 * @param { 追加的内容 } appendContent 
 * @returns 
 */
function appendFileMock (path, appendContent) {
  if (typeof path !== 'string' || path === '') {
    return
  }

  path = normalizePath(path)
  if (oriFileMap.get(path)) {
    const newContent = oriFileMap.get(path) + appendContent
    oriFileMap.set(path, newContent)
  }
  oriFileMap.set(path, appendContent)
}

/**
 * 向文件中写内容
 * 
 * @param { string } path 
 * @param { string } data 
 * @returns 
 */
function writeFileSyncMock (path, data) {
  if (typeof path !== 'string' || path === '') {
    return
  }

  path = normalizePath(path)

  resFileMap.set(path, data)
}

/**
 * 复制文件
 * 
 * @param { string } from 
 * @param { string } to 
 * @returns 
 */
function copySyncMock (from, to) {
  if (typeof from !== 'string' || from === '') {
    return
  }

  from = normalizePath(from)

  if (typeof to !== 'string' || to === '') {
    return
  }

  to = normalizePath(to)

  if (isDir(from) && isDir(to)) {
    oriFileMap.forEach((content, path) => {
      if (path.startsWith(from)) {
        const fileRelPath = path.substring(from.length)
        resFileMap.set(`${to}${fileRelPath}`, content)
      }
    })
  } else if (isDir(from) || isDir(to)) {
    throw new Error(`文件和文件夹之前无法copy, from: ${from} to: ${to}`)
  } else {
    resFileMap.set(to, oriFileMap.get(from))
  }
}

/**
 * 判断路径是否为文件夹
 * 
 * @param { string } path 
 * @returns boolean
 */
function isDir (path) {
  if (path === undefined || path === null || path === '') {
    return false
  }

  path = normalizePath(path)

  const parts = path.split('/')
  // 根据是否有后缀名判断为文件
  if (parts[parts.length - 1].includes('.')) {
    return false
  }
  return true
}

/**
 * 获取文件或目录状态，在处理路径为符号链接时返回链接指向的文件或目录的状态
 */
function statSyncMock (path) {
  if (typeof path !== 'string' || path === '') {
    return
  }

  path = normalizePath(path)
  // 返回包含状态信息的对象
  return {
    isFile: () => customIsFile(path),
    isDirectory: () => customIsDirectory(path)
  }
}

/**
 * 获取文件或目录状态，在处理路径为符号链接时返回链接自身的文件或目录的状态
 */
function lstatSyncMock (path) {
  if (typeof path !== 'string' || path === '') {
    return
  }

  path = normalizePath(path)
  // 返回包含状态信息的对象
  return {
    isFile: () => customIsFile(path),
    isDirectory: () => customIsDirectory(path)
  }
}

// 自定义的 isFile 函数
function customIsFile (path) {
  return oriFileMap.get(path)
}

// 自定义的 isDirectory 函数
function customIsDirectory (path) {
  if (typeof path === 'string' && path.includes('.') && path.indexOf('.') !== 0) {
    return false
  }
  return true
}

/**
 * 路径格式化
 * 
 * @param { string } path 
 * @returns 
 */
function normalizePath (path) {
  return path.replace(/\\/g, '/').replace(/\/{2,}/g, '/')
}

module.exports = {
  ...jest.requireActual('fs-extra'),
  readFileSync: jest.fn((content) => readFileSyncMock(content)),
  existsSync: jest.fn((path) => existsSyncMock(path)),
  ensureDirSync: jest.fn(() => ensureDirSyncMock()),
  ensureDir: jest.fn(() => ensureDirMock()),
  mkdirSync: jest.fn(() => mkdirSyncMock()),
  appendFile: jest.fn((path, appendContent) => appendFileMock(path, appendContent)),
  writeFileSync: jest.fn((path, data) => writeFileSyncMock(path, data)),
  copySync: jest.fn((from, to) => copySyncMock(from, to)),
  statSync: jest.fn((path) => statSyncMock(path)),
  lstatSync: jest.fn((path) => lstatSyncMock(path)),
}

module.exports.setMockFiles = setMockFiles
module.exports.getMockFiles = getMockFiles
module.exports.clearMockFiles = clearMockFiles
module.exports.getResMapFile = getResMapFile
module.exports.updateMockFiles = updateMockFiles
module.exports.deleteMockFiles = deleteMockFiles