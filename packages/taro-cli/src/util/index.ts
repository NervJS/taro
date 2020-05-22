import * as fs from 'fs-extra'
import * as path from 'path'
import {
  recursiveFindNodeModules,
  printLog,
  getInstalledNpmPkgVersion,
  getTaroPath,
  processTypeEnum,
  NODE_MODULES,
  chalk
} from '@tarojs/helper'

export function getRootPath (): string {
  return path.resolve(__dirname, '../../')
}

export function getPkgVersion (): string {
  return require(path.join(getRootPath(), 'package.json')).version
}

export function getPkgItemByKey (key: string) {
  const packageMap = require(path.join(getRootPath(), 'package.json'))
  if (Object.keys(packageMap).indexOf(key) === -1) {
    return {}
  } else {
    return packageMap[key]
  }
}

export function printPkgVersion () {
  const taroVersion = getPkgVersion()
  console.log(`👽 Taro v${taroVersion}`)
  console.log()
}

export async function checkCliAndFrameworkVersion (appPath, buildAdapter) {
  const pkgVersion = getPkgVersion()
  const frameworkName = `@tarojs/taro-${buildAdapter}`
  const nodeModulesPath = recursiveFindNodeModules(path.join(appPath, NODE_MODULES))
  const frameworkVersion = getInstalledNpmPkgVersion(frameworkName, nodeModulesPath)
  if (frameworkVersion) {
    if (frameworkVersion !== pkgVersion) {
      const taroCliPath = path.join(getRootPath(), 'package.json')
      const frameworkPath = path.join(nodeModulesPath, frameworkName, 'package.json')
      printLog(processTypeEnum.ERROR, '版本问题', `Taro CLI 与本地安装运行时框架 ${frameworkName} 版本不一致, 请确保版本一致！`)
      printLog(processTypeEnum.REMIND, '升级命令', `升级到最新CLI：taro update self   升级到最新依赖库：taro update project`)
      printLog(processTypeEnum.REMIND, '升级文档', `请参考 "常用 CLI 命令"中"更新" 章节：https://taro-docs.jd.com/taro/docs/GETTING-STARTED.html`)
      console.log(``)
      console.log(`Taro CLI：${getPkgVersion()}             路径：${taroCliPath}`)
      console.log(`${frameworkName}：${frameworkVersion}   路径：${frameworkPath}`)
      console.log(``)
      process.exit(1)
    }
  } else {
    printLog(processTypeEnum.WARNING, '依赖安装', chalk.red(`项目依赖 ${frameworkName} 未安装，或安装有误，请重新安装此依赖！`))
    process.exit(1)
  }
}

export const getAllFilesInFloder = async (
  floder: string,
  filter: string[] = []
): Promise<string[]> => {
  let files: string[] = []
  const list = readDirWithFileTypes(floder)

  await Promise.all(
    list.map(async item => {
      const itemPath = path.join(floder, item.name)
      if (item.isDirectory) {
        const _files = await getAllFilesInFloder(itemPath, filter)
        files = [...files, ..._files]
      } else if (item.isFile) {
        if (!filter.find(rule => rule === item.name)) files.push(itemPath)
      }
    })
  )

  return files
}

export type TemplateSourceType = 'git' | 'url'

export function getTemplateSourceType (url: string): TemplateSourceType {
  if (/^github:/.test(url) || /^gitlab:/.test(url) || /^direct:/.test(url)) {
    return 'git'
  } else {
    return 'url'
  }
}

interface FileStat {
  name: string
  isDirectory: boolean
  isFile: boolean
}

export function readDirWithFileTypes (floder: string): FileStat[] {
  const list = fs.readdirSync(floder)
  const res = list.map(name => {
    const stat = fs.statSync(path.join(floder, name))
    return {
      name,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile()
    }
  })
  return res
}

interface IRemindVersion {
  remindTimes: number
}

export function printVersionTip () {
  const taroPath = getTaroPath()
  let remindVersion: IRemindVersion = {remindTimes: 0}
  const remindVersionFilePath = path.join(taroPath, '.remind_version.json')
  if (!fs.existsSync(remindVersionFilePath)) {
    fs.ensureDirSync(taroPath)
    fs.writeFileSync(remindVersionFilePath, JSON.stringify(remindVersion))
  } else {
    remindVersion = fs.readJSONSync(remindVersionFilePath)
  }
  if (remindVersion.remindTimes < 5) {
    console.log(chalk.red('当前您正在使用 Taro 2.0 版本，请先执行 taro doctor 确保编译配置正确'))
    console.log(chalk.red('如出现令你束手无策的问题，请使用 taro update 命令更新到你指定的稳定版本'))
    remindVersion.remindTimes++
    fs.writeFileSync(remindVersionFilePath, JSON.stringify(remindVersion))
  }
}

export function recursiveReplaceObjectKeys (obj, keyMap) {
  Object.keys(obj).forEach(key => {
    if (keyMap[key]) {
      obj[keyMap[key]] = obj[key]
      if (typeof obj[key] === 'object') {
        recursiveReplaceObjectKeys(obj[keyMap[key]], keyMap)
      }
      delete obj[key]
    } else if (keyMap[key] === false) {
      delete obj[key]
    } else if (typeof obj[key] === 'object') {
      recursiveReplaceObjectKeys(obj[key], keyMap)
    }
  })
}
