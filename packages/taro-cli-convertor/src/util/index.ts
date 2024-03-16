import generate from '@babel/generator'
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
import * as prettier from 'prettier'

import { globals } from './global'

import type * as t from '@babel/types'

const NODE_MODULES = 'node_modules'

/* 代码格式化参数 */
const prettierJSConfig: prettier.Options = {
  semi: false,
  singleQuote: true,
  parser: 'babel',
}

/* 转换报告信息 */
export interface IReportData {
  projectName: string // 工程名称
  projectPath: string	// 工程路径
  pagesNum: number	// 页面数
  filesNum: number 	// 文件数
  errMsgList: Array<ErrMsgs>	// 异常信息列表
}

/* 单个错误信息 */
export interface ErrMsgs {
  filePath: string	// 文件路径
  msgType: string   // 异常类型
  mesDescribe: string // 信息描述
  errCodeList: Array<ErrCodeMsg>	// 异常代码信息列表
}

/* 单个错误的代码信息 */
export interface ErrCodeMsg {
  msgType: string       // 错误类型
  describe: string   // 信息描述
  codeBeforeConvert?: {  // 转换之前的异常代码信息
    filePath: string	  // 异常文件路径
    code: string		    // 异常代码
    location?: Location	// 异常代码位置
  }
  codeAfterConvert?: {   // 转换之后的异常代码信息
    filePath: string	  // 异常文件路径
    code: string		    // 异常代码
    location?: Location	// 异常代码位置
  }
}

/* 代码位置 */
export interface Location {
  start?: {	// 开始位置
    col: number	// 列
    row: number	// 行
  }
  end?: {		// 结束位置
    col: number	// 列
    row: number	// 行
  }
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

function getRelativePath (_rootPath: string, sourceFilePath: string, oriPath: string, alias?: object) {
  // 处理以/开头的绝对路径，比如 /a/b
  if (path.isAbsolute(oriPath)) {
    if (oriPath.indexOf('/') !== 0) {
      return ''
    }
    const absolutePath = revertScriptPath(path.join(sourceFilePath, '..' + oriPath), SCRIPT_EXT)
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
    let absolutePath
    // 根据app.json中是否有resolveAlias 配置项自定义模块路径的映射规则来获取引用文件的绝对路径
    if (alias) {
      // 预防用户定义了模块路径的映射规则但没有使用的情况
      absolutePath = revertScriptPath(path.join(sourceFilePath, '..', oriPath), SCRIPT_EXT)
      
      Object.keys(alias).forEach((key) => {
        const newKey = key.replace(/\/\*$/, '')

        if (oriPath.startsWith(newKey)) {
          const realPath = path.join(_rootPath, alias[key].replace(/\/\*$/, ''))
          absolutePath = revertScriptPath(oriPath.replace(newKey, realPath), SCRIPT_EXT)
        }
      })
    } else {
      absolutePath = revertScriptPath(path.join(sourceFilePath, '..', oriPath), SCRIPT_EXT)
    }

    // 可能为三方库
    if (absolutePath == null) {
      return oriPath
    }

    let relativePath = path.relative(path.dirname(sourceFilePath), absolutePath)
    relativePath = normalizePath(relativePath)
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
  isTsProject?: boolean,
  pluginName?: string,
  alias?: object
) {
  // 将参数记录到log文件
  updateLogFileContent(
    `INFO [taro-cli-convertor] analyzeImportUrl - 入参 ${getLineBreak()}sourceFilePath: ${sourceFilePath} ${getLineBreak()}value: ${value} ${getLineBreak()}`
  )

  if (isPluginMainJs(value, pluginName)) {
    // 插件的入口文件单独转换
    return
  }

  const valueExtname = path.extname(value)
  const rpath = getRelativePath(rootPath, sourceFilePath, value, alias)
  if (!rpath) {
    createErrorCodeMsg(
      'ReferenceFileNotFound',
      `文件 ${sourceFilePath} 中引用 ${value} 不存在！`,
      `${value}`,
      sourceFilePath
    )
    printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
    updateLogFileContent(
      `WARN [taro-cli-convertor] analyzeImportUrl - 文件 ${sourceFilePath} 中引用 ${value} 不存在 ${getLineBreak()}`
    )
    return
  }
  if (rpath !== value) {
    value = rpath
    source.value = rpath
  }
  if (value.indexOf('.') === 0) {
    if (REG_SCRIPT.test(valueExtname) || REG_TYPESCRIPT.test(valueExtname)) {
      const vpath = path.join(sourceFilePath, '..', value)
      let fPath = value
      if (fs.existsSync(vpath)) {
        fPath = vpath
      } else {
        createErrorCodeMsg(
          'ReferenceFileNotFound',
          `文件 ${sourceFilePath} 中引用 ${value} 不存在！`,
          `${value}`,
          sourceFilePath
        )
        printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
        updateLogFileContent(
          `WARN [taro-cli-convertor] analyzeImportUrl - 文件 ${sourceFilePath} 中引用 ${value} 不存在 ${getLineBreak()}`
        )
      }
      scriptFiles.add(fPath)
    } else {
      let vpath = resolveScriptPath(path.join(sourceFilePath, '..', value))
      if (vpath) {
        if (!fs.existsSync(vpath)) {
          createErrorCodeMsg(
            'ReferenceFileNotFound',
            `文件 ${sourceFilePath} 中引用 ${value} 不存在！`,
            `${value}`,
            sourceFilePath
          )
          printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
          updateLogFileContent(
            `WARN [taro-cli-convertor] analyzeImportUrl - 文件 ${sourceFilePath} 中引用 ${value} 不存在！ ${getLineBreak()}`
          )
        } else {
          if (fs.lstatSync(vpath).isDirectory()) {
            if (fs.existsSync(path.join(vpath, 'index.js'))) {
              vpath = path.join(vpath, 'index.js')
            } else {
              createErrorCodeMsg(
                'ReferenceDirNotFound',
                `文件 ${sourceFilePath} 中引用了目录 ${value}！`,
                `${value}`,
                sourceFilePath
              )
              printLog(processTypeEnum.ERROR, '引用目录', `文件 ${sourceFilePath} 中引用了目录 ${value}！`)
              updateLogFileContent(
                `WARN [taro-cli-convertor] analyzeImportUrl - 文件 ${sourceFilePath} 中引用了目录 ${value}！ ${getLineBreak()}`
              )
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

/**
 * 判断导入模块的路径是否是plugin的module
 *
 * @param modulePath
 * @param pluginName
 * @returns
 */
function isPluginMainJs (modulePath: string, pluginName: string | undefined) {
  if (pluginName === undefined) {
    return false
  }

  const regex = new RegExp(`/${pluginName}/`)
  return regex.test(modulePath)
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
      const npmModulePath = path.join(root, modulePath, parts[0])
      if (fs.existsSync(npmModulePath)) {
        isThirdPartyLibExist = true
        // 转换后的三方库放在node_modules中
        const moduleConvertPath = path.join(convertRoot, NODE_MODULES, parts[0])
        if (!fs.existsSync(moduleConvertPath)) {
          copyFolderToTaro(npmModulePath, moduleConvertPath)
          printLog(processTypeEnum.COPY, '三方库', normalizePath(npmModulePath.replace(path.join(root, '/'), '')))
        }
        break
      }
    }

    if (!isThirdPartyLibExist) {
      createErrorCodeMsg(
        'dependencyNotFound',
        `在[${nodePath.toString()}]中没有找到依赖的三方库${filePath}，请安装依赖后运行`,
        filePath,
        globals.currentParseFile
      )
      console.log(chalk.red(`在[${nodePath.toString()}]中没有找到依赖的三方库${filePath}，请安装依赖后运行`))
      updateLogFileContent(
        `WARN [taro-cli-convertor] handleThirdPartyLib - 在 [${nodePath.toString()}] 中没有找到依赖的三方库 ${filePath}，请安装依赖后运行 ${getLineBreak()}`
      )
    }
  } catch (error) {
    createErrorCodeMsg(
      'ConvertThirdPartyLibError',
      `转换三方库${filePath}异常，请手动处理, error message:${error}`,
      filePath,
      globals.currentParseFile
    )
    console.log(chalk.red(`转换三方库${filePath}异常，请手动处理, error message:${error}`))
    updateLogFileContent(
      `WARN [taro-cli-convertor] handleThirdPartyLib - 转换三方库 ${filePath} 异常 ${getLineBreak()}${error} ${getLineBreak()}`
    )
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

// export function getMatchDirPath (filePath: string, matchStr: string) {
//   const reg = new RegExp(matchStr)
//   const match = reg.exec(filePath)
//   if (match) {
//     if (matchStr.length >= 2 && matchStr.endsWith('*')) {
//       return matchStr.slice(0, matchStr.length - 2)
//     }
//     return match[0]
//   }
// }

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
    absolutePath.push(path.join(baseFilePath, '..', fileRelativePath))
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
 * @param { IReportData } reportErroMsg 报错信息
 */
export function generateReportFile (
  sourceFilePath, 
  targeFileDir, 
  targeFileName, 
  reportErroMsg?: IReportData
) {
  try {
    if (!fs.existsSync(targeFileDir)) {
      fs.mkdirSync(targeFileDir, { recursive: true })
    }
    const fileType = ['.js', '.css', '.html']
    if (fileType.some((type) => sourceFilePath.endsWith(type))) {
      let data = fs.readFileSync(sourceFilePath, 'utf-8')
      if (reportErroMsg) {
        data = data.replace('__errorMsgReport__', JSON.stringify(reportErroMsg))
      }
      fs.writeFileSync(path.join(targeFileDir, targeFileName), data)
    } else {
      // 处理二进制文件
      const data = fs.readFileSync(sourceFilePath)
      fs.writeFileSync(path.join(targeFileDir, targeFileName), data)
    }
  } catch (error) {
    updateLogFileContent(
      `WARN [taro-cli-convertor] generateReportFile - 文件 ${sourceFilePath} 写入异常 ${getLineBreak()}${error} ${getLineBreak()}`
    )
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
    createErrorCodeMsg(
      'CreateFolderError',
      `创建文件夹${dirPath}失败`,
      '',
      dirPath
    )
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
 * 记录数据到logFileContent中
 *
 * @param data 日志数据
 */
export function updateLogFileContent (data: string) {
  try {
    globals.logFileContent += data

    // 日志分段写入log文件
    if (globals.logCount === 2000) {
      printToLogFile()
      globals.logCount = 0
    } else {
      globals.logCount++
    }
  } catch (error) {
    console.error(`记录日志数据异常 ${error.message}}`)
  }
}

/**
 * 写入数据到日志文件中
 *
 */
export function printToLogFile () {
  try {
    fs.appendFile(globals.logFilePath, globals.logFileContent)
    globals.logFileContent = ''
  } catch (error) {
    console.error(`写入日志文件异常 ${error.message}}`)
    throw new IReportError(
      '写日志文件异常',
      'WriteLogException',
      globals.logFilePath,
      ''
    )
  }
}

/**
 * 将引用插件的路径替换为引用子包插件的路径
 *
 * @param pluginComponentPath 小程序中引用的插件路径
 * @param pluginInfo 插件信息
 * @returns
 */  
export function replacePluginComponentUrl (pluginComponentPath, pluginInfo) {
  // 捕获跳转路径中的插件名和页面名，替换为子包路径
  const regexPluginUrl = /plugin:\/\/([^/]+)\/([^/?]+)/
  const matchPluginUrl = pluginComponentPath.match(regexPluginUrl)
  if (!matchPluginUrl) {      
    createErrorCodeMsg(
      'ImportSrcPathFormatError',
      `引用插件路径格式异常，插件路径：${pluginComponentPath}`,
      pluginComponentPath,
      globals.currentParseFile
    )
    console.log(`引用插件路径格式异常，插件路径：${pluginComponentPath}`)
  }

  // 捕获页面名
  const componentName = matchPluginUrl[2]  

  // 通过引用的插件组件名在注册的插件组件信息中查找组件路径
  let componentPath = null
  pluginInfo.publicComponents.forEach((publicComponent) => {
    if (publicComponent.name === componentName) {
      componentPath = publicComponent.path
    }
  })

  if (!componentPath) {
    createErrorCodeMsg(
      'UnregisteredPluginComponentError',
      `引用了未注册的插件组件，插件路径： ${pluginComponentPath}`,
      pluginComponentPath,
      globals.currentParseFile
    )
    console.log(`引用了未注册的插件组件，插件路径： ${pluginComponentPath}`)
  }

  return componentPath
}

/**
 * 将部分 ast 节点转为代码片段
 * @param ast astNode 节点
 * @returns 
 */
export function astToCode (ast) {
  if (!ast) return ''
  try {
    // 格式化生成的代码
    let formatCode = prettier.format(generate(ast).code, prettierJSConfig)
    if (formatCode.startsWith(';')) {
      formatCode = formatCode.slice(1)
    }
    return formatCode
  } catch (err) {
    //
  }
}

/**
 * 解析项目名称
 * @param projectPath 项目路径 
 * @returns { string } 项目名称
 */
export function parseProjectName (projectPath: string): string {
  if (!projectPath) return ''
  const projectPathInfo = path.parse(projectPath)
  if (projectPathInfo.name === 'miniprogram') {
    return path.parse(projectPathInfo.dir).name
  } else {
    return projectPathInfo.name
  }
}

/**
 *  统计工程目录下文件数量
 * @param projectPath 
 * @returns 
 */
export function computeProjectFileNums (projectPath: string): number {
  let count = 0
  if (!projectPath) return count
  const files = fs.readdirSync(projectPath)
  files.forEach((file) => {
    if (file !== 'taroConvert') {
      const filePath = path.join(projectPath, file)
      const stats = fs.statSync(filePath)
      if (stats.isFile()) {
        // 如果是文件，则增加计数
        count++
      } else if (stats.isDirectory()) {
        // 如果是目录，则递归统计子目录中的文件
        count += computeProjectFileNums(filePath)
      }
    }
  })
  return count
}

/**
 * 通过错误代码信息的 msgType、filePath 在 errMsgs 中寻找对应 errMsg
 * @param msgType  
 * @param filePath 
 * @param errMsgList 
 */
function findErrMsg (
  msgType: string, 
  filePath: string, 
  errMsgList: ErrMsgs[]
): undefined | ErrMsgs {
  return errMsgList.find((errMsg) => {
    return (errMsg.msgType === msgType) && (errMsg.filePath === filePath)
  })
}

/**
 * 判断 errCodeMsg 是否包含 code 代码
 * @param errCodeMsg 错误信息代码
 * @returns 
 */
function hasCode (errCodeMsg: ErrCodeMsg): boolean {
  return !!errCodeMsg.codeBeforeConvert?.code
}

/**
 * 将 errCodeMsgs 分类，生成 errMsgs 列表
 * @param errCodeMsgs 错误代码信息
 */
export function paseGlobalErrMsgs (errCodeMsgs: ErrCodeMsg[]): ErrMsgs[] {
  const errMsgList: ErrMsgs[] = []
  errCodeMsgs.forEach((errCodeMsg: ErrCodeMsg  ) => {
    const msgType = errCodeMsg.msgType
    const filePath = errCodeMsg.codeBeforeConvert?.filePath
    if (msgType && filePath) {
      const errMsgs = findErrMsg(msgType, filePath, errMsgList)
      if (errMsgs) {
        if (hasCode(errCodeMsg)) {
          errMsgs.errCodeList.push(errCodeMsg)
        }
      } else {
        errMsgList.push({ 
          filePath, 
          msgType, 
          errCodeList: [errCodeMsg], 
          mesDescribe: hasCode(errCodeMsg) ? '' : errCodeMsg.describe 
        })
      }
    }
  })

  return errMsgList
}

/**
 * 解析 catch 捕获的错误信息
 * @param { IReportError } errMsg 捕获的错误对象
 * @param { string } jsPath  js文件路径
 * @param { string } wxmlPath wxml文件路径
 */
export function parseError (
  errMsg: IReportError, 
  jsPath: string, 
  wxmlPath: string
) {
  const filePathMap = new Map([
    ['WXML_FILE', wxmlPath],
    ['JS_FILE', jsPath]
  ])
  if (errMsg.msgType) {
    const currentFilePath = filePathMap.get(errMsg.filePath) || errMsg.filePath
    const errCodeMsg: ErrCodeMsg = {
      msgType: errMsg.msgType,
      describe: errMsg.message,
      codeBeforeConvert: {
        filePath: currentFilePath,
        code: errMsg.code,
        location: { start: errMsg.location }
      }
    }
    globals.errCodeMsgs.push(errCodeMsg)
  }
}

/**
 * 存储错误信息，放到转换报告中
 * @param msgType 错误类型
 * @param describe 错误描述
 * @param code 错误代码
 * @param filePath 错误信息所在文件路径
 * @returns 
 */
export function createErrorCodeMsg (
  msgType: string, 
  describe: string, 
  code: string, 
  filePath: string, 
  position?: { col: number, row: number } | undefined
) {
  const errorCodeMst = {
    msgType,
    describe,
    codeBeforeConvert: {
      filePath,
      code,
      location: { start: position || { col: 0, row: 0 } }
    }
  }
  globals.errCodeMsgs.push(errorCodeMst)
}

/**
 *  拓展原生 Error 属性
 */
export class IReportError extends Error {

  // 错误信息类型
  msgType: string

  // 错误信息路径
  filePath: string | 'JS_FILE' | 'WXML_FILE'

  // 错误代码
  code: string

  // 错误代码位置信息
  location: { col: number, row: number } | undefined

  constructor (
    message: string,
    msgType?: string, 
    filePath?: string | 'JS_FILE' | 'WXML_FILE',
    code?: string,
    location?: { col: number, row: number } | undefined
  ) {
    super(message)
    this.msgType = msgType || ''
    this.filePath = filePath || ''
    this.code = code || ''
    this.location = location || { col: 0, row: 0 }

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
