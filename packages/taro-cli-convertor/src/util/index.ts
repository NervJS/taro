import {
  chalk,
  CSS_IMPORT_REG,
  fs,
  printLog,
  processTypeEnum,
  promoteRelativePath,
  REG_SCRIPT,
  REG_TYPESCRIPT,
  resolveScriptPath,
  SCRIPT_EXT,
} from '@tarojs/helper'
import * as path from 'path'

import { globals } from './global'

import type * as t from '@babel/types'

const NODE_MODULES = 'node_modules'

interface IReportMsg {
  filePath: string // 报告信息文件路径
  message: string // 报告信息
  type?: string // 报告信息类型
  childReportMsg?: IReportMsg[]
}

export function getRootPath (): string {
  return path.resolve(__dirname, '../../')
}

export function getPkgVersion (): string {
  return require(path.join(getRootPath(), 'package.json')).version
}

// 文件存在或添加后缀.js、.jsx、.ts、.tsx存在则返回文件路径，否则返回null
function revertScriptPath (absolutePath: string, SCRIPT_EXT: string[]) {
  for (const item of SCRIPT_EXT) {
    if (fs.existsSync(absolutePath)) {
      return absolutePath
    } else if (fs.existsSync(`${absolutePath}${item}`)) {
      return `${absolutePath}${item}`
    }
  }
  return null
}

function getRelativePath (_rootPath: string, sourceFilePath: string, oriPath: string) {
  // 处理以/开头的绝对路径，比如 /a/b
  if (path.isAbsolute(oriPath)) {
    if (oriPath.indexOf('/') !== 0) {
      return ''
    }
    const absolutePath = revertScriptPath(path.resolve(sourceFilePath, '..' + oriPath), SCRIPT_EXT)
    if (absolutePath == null) {
      return ''
    }

    let relativePath = path.relative(path.dirname(sourceFilePath), absolutePath)
    relativePath = promoteRelativePath(relativePath)
    if (relativePath.indexOf('.') !== 0) {
      return `./${relativePath}`
    }
    return relativePath
  }
  // 处理非正常路径，比如 a/b
  if (oriPath.indexOf('.') !== 0) {
    const absolutePath = revertScriptPath(path.resolve(sourceFilePath, '..', oriPath), SCRIPT_EXT)

    // 可能为三方库
    if (absolutePath == null) {
      return oriPath
    }

    let relativePath = path.relative(path.dirname(sourceFilePath), absolutePath)
    relativePath = promoteRelativePath(relativePath)
    if (relativePath.indexOf('.') !== 0) {
      return `./${relativePath}`
    }
    return relativePath
  }
  return oriPath
}

export function copyFileToTaro (from: string, to: string, options?: fs.CopyOptionsSync) {
  const filename = path.basename(from)
  if (fs.statSync(from).isFile() && !path.extname(to)) {
    fs.ensureDir(to)
    return fs.copySync(from, path.join(to, filename), options)
  }
  fs.ensureDir(path.dirname(to))
  return fs.copySync(from, to, options)
}

// 递归复制文件夹
function copyFolderToTaro (source: string, destination: string) {
  // 创建目标文件夹
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true })
  }

  // 获取源文件夹中的所有项
  const items = fs.readdirSync(source)
  for (const item of items) {
    const sourcePath = path.join(source, item)
    const destinationPath = path.join(destination, item)

    const stat = fs.lstatSync(sourcePath)
    if (stat.isSymbolicLink()) {
      // 如果是符号链接，获取链接的目标路径并进行复制
      const target = fs.readlinkSync(sourcePath)
      copyFolderToTaro(target, destinationPath)
    } else if (stat.isDirectory()) {
      // 如果是子文件夹，则递归复制
      copyFolderToTaro(sourcePath, destinationPath)
    } else {
      // 如果是普通文件，则直接复制
      fs.copyFileSync(sourcePath, destinationPath)
    }
  }
}

export function analyzeImportUrl (
  rootPath: string,
  sourceFilePath: string,
  scriptFiles: Set<string>,
  source: t.StringLiteral,
  value: string,
  isTsProject?: boolean
) {
  // 将参数记录到log文件
  printToLogFile(`funName: analyzeImportUrl, sourceFilePath: ${sourceFilePath}, value: ${value} ${getLineBreak()}`)
  const valueExtname = path.extname(value)
  const rpath = getRelativePath(rootPath, sourceFilePath, value)
  if (!rpath) {
    printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
    return
  }
  if (rpath !== value) {
    value = rpath
    source.value = rpath
  }
  if (value.indexOf('.') === 0) {
    if (REG_SCRIPT.test(valueExtname) || REG_TYPESCRIPT.test(valueExtname)) {
      const vpath = path.resolve(sourceFilePath, '..', value)
      let fPath = value
      if (fs.existsSync(vpath)) {
        fPath = vpath
      } else {
        printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
      }
      scriptFiles.add(fPath)
    } else {
      let vpath = resolveScriptPath(path.resolve(sourceFilePath, '..', value))
      if (vpath) {
        if (!fs.existsSync(vpath)) {
          printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
        } else {
          if (fs.lstatSync(vpath).isDirectory()) {
            if (fs.existsSync(path.join(vpath, 'index.js'))) {
              vpath = path.join(vpath, 'index.js')
            } else {
              printLog(processTypeEnum.ERROR, '引用目录', `文件 ${sourceFilePath} 中引用了目录 ${value}！`)
              return
            }
          }
          let relativePath = path.relative(sourceFilePath, vpath)
          const relativePathExtname = path.extname(relativePath)
          scriptFiles.add(vpath)
          relativePath = promoteRelativePath(relativePath)
          if (/\.wxs/.test(relativePathExtname)) {
            relativePath += '.js'
          } else if (!isTsProject) {
            relativePath = relativePath.replace(relativePathExtname, '.js')
          }
          source.value = relativePath
        }
      }
    }
  } else {
    if (value.startsWith('/') || value.startsWith('@tarojs') || value.startsWith('react')) {
      return
    }
    scriptFiles.add(value)
  }
}

export const incrementId = () => {
  let n = 0
  return () => (n++).toString()
}

// 处理三方库引用
export function handleThirdPartyLib (filePath: string, nodePath: string[], root: string, convertRoot: string) {
  // 默认使用node_modules中的三方库
  if (typeof nodePath === 'undefined') {
    nodePath = [NODE_MODULES]
  }

  try {
    let isThirdPartyLibExist = false
    for (const modulePath of nodePath) {
      const parts = filePath.split('/')
      const npmModulePath = path.resolve(root, modulePath, parts[0])
      if (fs.existsSync(npmModulePath)) {
        isThirdPartyLibExist = true
        // 转换后的三方库放在node_modules中
        const moduleConvertPath = path.resolve(convertRoot, NODE_MODULES, parts[0])
        if (!fs.existsSync(moduleConvertPath)) {
          copyFolderToTaro(npmModulePath, moduleConvertPath)
          printLog(processTypeEnum.COPY, '三方库', normalizePath(npmModulePath.replace(path.join(root, '/'), '')))
        }
        break
      }
    }

    if (!isThirdPartyLibExist) {
      console.log(chalk.red(`在[${nodePath.toString()}]中没有找到依赖的三方库${filePath}，请安装依赖后运行`))
    }
  } catch (error) {
    console.log(chalk.red(`转换三方库${filePath}异常，请手动处理, error message:${error}`))
  }
}

export function getMatchUnconvertDir (importPath: string, externalPaths: string[]) {
  if (importPath === undefined || externalPaths === undefined) {
    return null
  }
  // 支持用户在convert.config.json中配置不转换的目录
  for (let externalPath of externalPaths) {
    externalPath = normalizePath(externalPath).replace('*', '.*')
    const reg = new RegExp(externalPath)
    const match = reg.exec(normalizePath(importPath))
    // external字段配置如 1：../demo 2：../demo/* 3：../demo/*/demo
    if (match) {
      // 处理../demo/*
      if (externalPath.length >= 2 && externalPath.endsWith('*')) {
        // 去掉结尾的".*"
        return externalPath.slice(0, externalPath.length - 3)
      }
      return match[0]
    }
  }
  return null
}

export function handleUnconvertDir (matchUnconvertDir: string, rootPath: string, convertRoot: string) {
  if (matchUnconvertDir == null) {
    return
  }
  // 支持用户在convert.config.json中配置不转换的目录
  const outputFilePath = matchUnconvertDir.replace(normalizePath(rootPath), normalizePath(convertRoot))
  if (!fs.existsSync(outputFilePath)) {
    copyFileToTaro(matchUnconvertDir, outputFilePath)
    printLog(processTypeEnum.COPY, '不转换目录', matchUnconvertDir.replace(normalizePath(path.join(rootPath, '/')), ''))
  }
}

export function getMatchDirPath (filePath: string, matchStr: string) {
  const reg = new RegExp(matchStr)
  const match = reg.exec(filePath)
  if (match) {
    if (matchStr.length >= 2 && matchStr.endsWith('*')) {
      return matchStr.slice(0, matchStr.length - 2)
    }
    return match[0]
  }
}

// 路径标准化
function normalizePath (path) {
  if (typeof path === 'undefined') {
    return ''
  }
  return path.replace(/\\/g, '/')
}

// 将数组中的相对路径转换为绝对路径
export function transRelToAbsPath (baseFilePath: string, fileRelativePaths: string[]) {
  if (typeof fileRelativePaths === 'undefined') {
    return []
  }
  const absolutePath: string[] = []
  for (const fileRelativePath of fileRelativePaths) {
    // 相对路径转为绝对路径
    absolutePath.push(path.resolve(baseFilePath, '..', fileRelativePath))
  }
  return absolutePath
}

// 获取wxss中引用文件的相对路径集合
export function getWxssImports (content: string) {
  if (content == null) {
    return []
  }
  // 匹配 /* ... */ 形式的注释
  const regex = /\/\*([\s\S]*?)\*\//g
  // 去掉css中的注释
  const contentWithoutComment = content.replace(regex, '')

  let match
  const imports: string[] = []
  const cssImportReg = new RegExp(CSS_IMPORT_REG)
  while ((match = cssImportReg.exec(contentWithoutComment)) !== null) {
    imports.push(match[2])
  }
  return imports
}

/**
 * copyFileTo： 将报告模版文件复制到转换后 taroConvert 目录中
 *
 * @param { string } sourceFilePath 源文件路径
 * @param { string } targeFileDir 转换后文件所在目录
 * @param { string } targeFileName 转换后文件名
 * @param { IReportMsg[] } reportErroMsg 报错信息
 */
export function generateReportFile (sourceFilePath, targeFileDir, targeFileName, reportErroMsg?: IReportMsg[]) {
  try {
    if (!fs.existsSync(targeFileDir)) {
      fs.mkdirSync(targeFileDir)
    }
    let data = fs.readFileSync(sourceFilePath, 'utf-8')
    if (reportErroMsg) {
      data = data.replace('__errorMsgReport__', JSON.stringify(reportErroMsg))
    }
    fs.writeFileSync(path.join(targeFileDir, targeFileName), data)
  } catch (error) {
    console.log(`文件${sourceFilePath}写入失败，errorMsg：${error}`)
  }
}

/**
 * 创建文件夹
 *
 * @param dirPath 文件夹路径
 */
export function generateDir (dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
  } catch (error) {
    console.log(`创建文件夹${dirPath}失败`)
  }
}

/**
 * 获取不同操作系统下的换行符
 *
 * @returns { string } 换行符
 */
export function getLineBreak () {
  if (process.platform === 'win32') {
    return '\r\n'
  }
  return '\n'
}

/**
 * 记录数据到日志文件中
 *
 * @param data 日志数据
 */
export function printToLogFile (data: string) {
  try {
    // 将参数记录到log文件
    fs.appendFile(globals.logFilePath, data)
  } catch (error) {
    console.log('写日志文件异常')
    throw error
  }
}

// eslint-disable-next-line camelcase
export const DEFAULT_Component_SET = new Set<string>([
  'View',
  'Icon',
  'Progress',
  'RichText',
  'Text',
  'Button',
  'Checkbox',
  'CheckboxGroup',
  'Form',
  'Input',
  'Label',
  'Picker',
  'PickerView',
  'PickerViewColumn',
  'Radio',
  'RadioGroup',
  'Slider',
  'Switch',
  'CoverImage',
  'Textarea',
  'CoverView',
  'MovableArea',
  'MovableView',
  'ScrollView',
  'Swiper',
  'SwiperItem',
  'Navigator',
  'Audio',
  'Camera',
  'Image',
  'LivePlayer',
  'Video',
  'Canvas',
  'Ad',
  'WebView',
  'Block',
  'Map',
  'Slot',
  'SlotView',
  'Editor',
  'MatchMedia',
  'FunctionalPageNavigator',
  'LivePusher',
  'OfficialAccount',
  'OpenData',
  'NavigationBar',
  'PageMeta',
  'VoipRoom',
  'AdCustom',
])
