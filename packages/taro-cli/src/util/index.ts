import { chalk, isWindows } from '@tarojs/helper'
import { parse } from 'dotenv'
import { expand } from 'dotenv-expand'
import * as fs from 'fs-extra'
import * as path from 'path'

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

export const getAllFilesInFolder = async (
  folder: string,
  filter: string[] = []
): Promise<string[]> => {
  let files: string[] = []
  const list = readDirWithFileTypes(folder)

  await Promise.all(
    list.map(async item => {
      const itemPath = path.join(folder, item.name)
      if (item.isDirectory) {
        const _files = await getAllFilesInFolder(itemPath, filter)
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

export function readDirWithFileTypes (folder: string): FileStat[] {
  const list = fs.readdirSync(folder)
  const res = list.map(name => {
    const stat = fs.statSync(path.join(folder, name))
    return {
      name,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile()
    }
  })
  return res
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

export function clearConsole () {
  const readline = require('readline')
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
  }
}

export const dotenvParse = (root: string, prefixs: string | string[], mode?: string) => {
  const prefixsArr: string[] = (Array.isArray(prefixs) ? prefixs : [prefixs]).map(prefix => prefix.trim()).filter(prefix => !!prefix)

  const envFiles = new Set([
    /** default file */ `.env`,
    /** local file */ `.env.local`,
  ])

  if(mode) {
    envFiles.add(/** mode file */ `.env.${mode}`)
    envFiles.add(/** mode local file */ `.env.${mode}.local`)
  }

  let parseTemp = {}
  const load = envPath => {
    // file doesn'et exist
    if(!fs.existsSync(envPath)) return
    const env = parse(fs.readFileSync(envPath))
    parseTemp = {
      ...parseTemp,
      ...env
    }
  }

  envFiles.forEach(envPath => {
    load(path.resolve(root, envPath))
  })

  const parsed = {}
  Object.entries(parseTemp).forEach(([key, value]) => {
    if(prefixsArr.some(prefix => key.startsWith(prefix))) {
      parsed[key] = value
    }
  })
  expand({ parsed })
}
