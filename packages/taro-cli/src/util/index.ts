import * as fs from 'fs-extra'
import * as path from 'path'
import { isWindows, chalk } from '@tarojs/helper'

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

export function printDevelopmentTip (platform: string) {
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    let exampleCommand
    if (isWindows) {
      exampleCommand = `$ set NODE_ENV=production && taro build --type ${platform} --watch`
    } else {
      exampleCommand = `$ NODE_ENV=production taro build --type ${platform} --watch`
    }
    console.log(chalk.yellowBright(`Tips: 预览模式生成的文件较大，设置 NODE_ENV 为 production 可以开启压缩。
Example:
${exampleCommand}
`))
  }
}
