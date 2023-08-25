import {
  chalk,
  fs,
  printLog,
  processTypeEnum,
  promoteRelativePath,
  REG_SCRIPT,
  REG_TYPESCRIPT,
  resolveScriptPath,
} from '@tarojs/helper'
import * as path from 'path'

import type * as t from '@babel/types'

const NODE_MODULES = 'node_modules'

export function getRootPath (): string {
  return path.resolve(__dirname, '../../')
}

export function getPkgVersion (): string {
  return require(path.join(getRootPath(), 'package.json')).version
}

function getRelativePath (rootPath: string, sourceFilePath: string, oriPath: string) {
  // 处理以/开头的绝对路径，比如 /a/b
  if (path.isAbsolute(oriPath)) {
    if (oriPath.indexOf('/') !== 0) {
      return ''
    }
    const vpath = path.resolve(rootPath, oriPath.substr(1))
    if (!fs.existsSync(vpath)) {
      return ''
    }
    let relativePath = path.relative(path.dirname(sourceFilePath), vpath)
    relativePath = promoteRelativePath(relativePath)
    if (relativePath.indexOf('.') !== 0) {
      return './' + relativePath
    }
    return relativePath
  }
  // 处理非正常路径，比如 a/b
  if (oriPath.indexOf('.') !== 0) {
    const vpath = path.resolve(sourceFilePath, '..', oriPath)
    if (fs.existsSync(vpath)) {
      return `./${oriPath}`
    } else if (fs.existsSync(`${vpath}.js`)) {
      // 微信小程序中js文件的引用可不加后缀，需考虑
      return `./${oriPath}.js`
    }
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
      // 如果是符号链接，获取链接的目标路径并创建新的符号链接
      const target = fs.readlinkSync(sourcePath)
      fs.symlinkSync(target, destinationPath)
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
  external: string[],
  miniprogramRoot: string,
  convertDir: string,
  isTsProject?: boolean
) {
  // 支持用户在convert.config.json中配置不转换的目录
  let valueAbs: string = path.resolve(sourceFilePath, '..', value)
  // 正则匹配需要正斜杠,win32默认反斜杠，先转posix
  valueAbs = valueAbs.split(path.sep).join(path.posix.sep)
  if (external) {
    for (let iExternal of external) {
      iExternal = iExternal.split(path.sep).join(path.posix.sep)
      const reg = new RegExp(iExternal)
      if (reg.test(valueAbs)) {
        // 分隔符改回win32 再操作路径
        valueAbs = valueAbs.split(path.posix.sep).join(path.sep)
        const outputFilePath = valueAbs.replace(isTsProject ? miniprogramRoot : rootPath, convertDir)
        copyFileToTaro(valueAbs, outputFilePath)
        return
      }
    }
  }

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
