import * as fs from 'fs-extra'
import * as path from 'path'

import chalk from 'chalk'
import * as minimatch from 'minimatch'
import * as _ from 'lodash'

import {
  printLog,
  getInstalledNpmPkgVersion,
  getPkgVersion
} from '../util'
import { processTypeEnum, BUILD_TYPES } from '../util/constants'
import { IMiniAppBuildConfig } from '../util/types'

import {
  getBuildData,
  setIsProduction,
  setBuildAdapter,
  setAppConfig
} from './helper'
import { ICopyOptions } from './interface'
import { copyFileSync } from './copy'
import { buildEntry } from './entry'
import { buildPages } from './page'
import { watchFiles } from './watch'

const appPath = process.cwd()

async function checkCliAndFrameworkVersion () {
  const { buildAdapter, nodeModulesPath } = getBuildData()
  const frameworkName = `@tarojs/taro-${buildAdapter}`
  const frameworkVersion = getInstalledNpmPkgVersion(frameworkName, nodeModulesPath)
  if (frameworkVersion) {
    if (frameworkVersion !== getPkgVersion()) {
      printLog(processTypeEnum.ERROR, '版本问题', `Taro CLI 与本地安装的小程序框架 ${frameworkName} 版本不一致，请确保一致`)
      console.log(`Taro CLI: ${getPkgVersion()}`)
      console.log(`${frameworkName}: ${frameworkVersion}`)
      process.exit(1)
    }
  } else {
    printLog(processTypeEnum.WARNING, '依赖安装', chalk.red(`项目依赖 ${frameworkName} 未安装，或安装有误！`))
  }
}

function buildProjectConfig () {
  const { buildAdapter, sourceDir, outputDir, outputDirName } = getBuildData()
  let projectConfigFileName = `project.${buildAdapter}.json`
  if (buildAdapter === BUILD_TYPES.WEAPP) {
    projectConfigFileName = 'project.config.json'
  }
  let projectConfigPath = path.join(appPath, projectConfigFileName)

  if (!fs.existsSync(projectConfigPath)) {
    projectConfigPath = path.join(sourceDir, projectConfigFileName)
    if (!fs.existsSync(projectConfigPath)) return
  }

  const origProjectConfig = fs.readJSONSync(projectConfigPath)
  if (buildAdapter === BUILD_TYPES.TT) {
    projectConfigFileName = 'project.config.json'
  }
  fs.ensureDirSync(outputDir)
  fs.writeFileSync(
    path.join(outputDir, projectConfigFileName),
    JSON.stringify(Object.assign({}, origProjectConfig, { miniprogramRoot: './' }), null, 2)
  )
  printLog(processTypeEnum.GENERATE, '工具配置', `${outputDirName}/${projectConfigFileName}`)
}

async function buildFrameworkInfo () {
  // 百度小程序编译出 .frameworkinfo 文件
  const {
    buildAdapter,
    outputDir,
    outputDirName,
    nodeModulesPath,
    projectConfig
  } = getBuildData()
  if (buildAdapter === BUILD_TYPES.SWAN) {
    const frameworkInfoFileName = '.frameworkinfo'
    const frameworkName = `@tarojs/taro-${buildAdapter}`
    const frameworkVersion = getInstalledNpmPkgVersion(frameworkName, nodeModulesPath)
    if (frameworkVersion) {
      const frameworkinfo = {
        toolName: 'Taro',
        toolCliVersion: getPkgVersion(),
        toolFrameworkVersion: frameworkVersion,
        createTime: projectConfig.date ? new Date(projectConfig.date).getTime() : Date.now()
      }
      fs.writeFileSync(
        path.join(outputDir, frameworkInfoFileName),
        JSON.stringify(frameworkinfo, null, 2)
      )
      printLog(processTypeEnum.GENERATE, '框架信息', `${outputDirName}/${frameworkInfoFileName}`)
    } else {
      printLog(processTypeEnum.WARNING, '依赖安装', chalk.red(`项目依赖 ${frameworkName} 未安装，或安装有误！`))
    }
  }
}

function copyFiles () {
  const { projectConfig } = getBuildData()
  const copyConfig = projectConfig.copy || { patterns: [], options: {} }
  if (copyConfig.patterns && copyConfig.patterns.length) {
    copyConfig.options = copyConfig.options || {}
    const globalIgnore = copyConfig.options.ignore
    const projectDir = appPath
    copyConfig.patterns.forEach(pattern => {
      if (typeof pattern === 'object' && pattern.from && pattern.to) {
        const from = path.join(projectDir, pattern.from)
        const to = path.join(projectDir, pattern.to)
        let ignore = pattern.ignore || globalIgnore
        if (fs.existsSync(from)) {
          const copyOptions: ICopyOptions = {}
          if (ignore) {
            ignore = Array.isArray(ignore) ? ignore : [ignore]
            copyOptions.filter = src => {
              let isMatch = false
              ignore && ignore.forEach(iPa => {
                if (minimatch(path.basename(src), iPa)) {
                  isMatch = true
                }
              })
              return !isMatch
            }
          }
          copyFileSync(from, to, copyOptions)
        } else {
          printLog(processTypeEnum.ERROR, '拷贝失败', `${pattern.from} 文件不存在！`)
        }
      }
    })
  }
}

export async function build ({ watch, adapter = BUILD_TYPES.WEAPP }: IMiniAppBuildConfig) {
  process.env.TARO_ENV = adapter
  setIsProduction(process.env.NODE_ENV === 'production' || !watch)
  setBuildAdapter(adapter)
  await checkCliAndFrameworkVersion()
  buildProjectConfig()
  await buildFrameworkInfo()
  copyFiles()
  const appConfig = await buildEntry()
  setAppConfig(appConfig)
  await buildPages()
  if (watch) {
    watchFiles()
  }
}
