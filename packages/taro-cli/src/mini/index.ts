import * as fs from 'fs-extra'
import * as path from 'path'

import chalk from 'chalk'
import * as _ from 'lodash'
import * as ora from 'ora'
import { execSync } from 'child_process'

import {
  printLog,
  getInstalledNpmPkgVersion,
  getPkgVersion,
  copyFiles,
  unzip,
  shouldUseYarn,
  shouldUseCnpm
} from '../util'
import { processTypeEnum, BUILD_TYPES } from '../util/constants'
import { IMiniAppBuildConfig } from '../util/types'
import * as defaultManifestJSON from '../config/manifest.default.json'

import {
  setBuildData,
  getBuildData,
  setIsProduction,
  setAppConfig,
  IBuildData,
  setQuickappManifest
} from './helper'
import { buildEntry } from './entry'
import { buildPages } from './page'
import { watchFiles } from './watch'
import { downloadGithubRepoLatestRelease } from '../util/dowload'

function buildProjectConfig () {
  const { buildAdapter, sourceDir, outputDir, outputDirName, appPath } = getBuildData()
  let projectConfigFileName = `project.${buildAdapter}.json`
  if (buildAdapter === BUILD_TYPES.WEAPP || buildAdapter === BUILD_TYPES.QQ) {
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

function readQuickAppManifest () {
  const { appPath } = getBuildData()
  // 读取 project.quickapp.json
  const quickappJSONPath = path.join(appPath, 'project.quickapp.json')
  let quickappJSON
  if (fs.existsSync(quickappJSONPath)) {
    quickappJSON = fs.readJSONSync(quickappJSONPath)
  } else {
    printLog(processTypeEnum.WARNING, '缺少配置', `检测到项目目录下未添加 ${chalk.bold('project.quickapp.json')} 文件，将使用默认配置，参考文档 https://nervjs.github.io/taro/docs/project-config.html`)
    quickappJSON = defaultManifestJSON
  }
  return quickappJSON
}

function generateQuickAppManifest (quickappJSON: any) {
  const { appConfig, pageConfigs, outputDir, projectConfig } = getBuildData()
  // 生成 router
  const pages = (appConfig.pages as string[]).concat()
  const routerPages = {}
  pages.forEach(element => {
    routerPages[path.dirname(element)] = {
      component: path.basename(element),
      filter: {
        view: {
          uri: 'https?://.*'
        }
      }
    }
  })
  const routerEntry = pages.shift()
  const router = {
    entry: path.dirname(routerEntry as string),
    pages: routerPages
  }
  // 生成 display
  const display = JSON.parse(JSON.stringify(appConfig.window || {}))
  display.pages = {}
  pageConfigs.forEach((item, page) => {
    if (item) {
      display.pages[path.dirname(page)] = item
    }
  })
  quickappJSON.router = router
  quickappJSON.display = display
  quickappJSON.config = Object.assign({}, quickappJSON.config, {
    designWidth: projectConfig.designWidth || 750
  })
  fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(quickappJSON, null, 2))
}

async function prepareQuickAppEnvironment (buildData: IBuildData) {
  let isReady = false
  let needDownload = false
  let needInstall = false
  const originalOutputDir = buildData.originalOutputDir
  console.log()
  if (fs.existsSync(path.join(buildData.originalOutputDir, 'sign'))) {
    needDownload = false
  } else {
    needDownload = true
  }
  if (needDownload) {
    const getSpinner = ora('开始下载快应用运行容器...').start()
    await downloadGithubRepoLatestRelease('NervJS/quickapp-container', buildData.appPath, originalOutputDir)
    await unzip(path.join(originalOutputDir, 'download_temp.zip'))
    getSpinner.succeed('快应用运行容器下载完成')
  } else {
    console.log(`${chalk.green('✔ ')} 快应用容器已经准备好`)
  }
  process.chdir(originalOutputDir)
  console.log()
  if (fs.existsSync(path.join(originalOutputDir, 'node_modules'))) {
    needInstall = false
  } else {
    needInstall = true
  }
  if (needInstall) {
    let command
    if (shouldUseYarn()) {
      command = 'NODE_ENV=development yarn install'
    } else if (shouldUseCnpm()) {
      command = 'NODE_ENV=development cnpm install'
    } else {
      command = 'NODE_ENV=development npm install'
    }
    const installSpinner = ora(`安装快应用依赖环境, 需要一会儿...`).start()
    try {
      const stdout = execSync(command)
      installSpinner.color = 'green'
      installSpinner.succeed('安装成功')
      console.log(`${stdout}`)
      isReady = true
    } catch (error) {
      installSpinner.color = 'red'
      installSpinner.fail(chalk.red(`快应用依赖环境安装失败，请进入 ${path.basename(originalOutputDir)} 重新安装！`))
      console.log(`${error}`)
      isReady = false
    }
  } else {
    console.log(`${chalk.green('✔ ')} 快应用依赖已经安装好`)
    isReady = true
  }
  return isReady
}

async function runQuickApp (isWatch: boolean | void, buildData: IBuildData, port?: number, release?: boolean) {
  const originalOutputDir = buildData.originalOutputDir
  const { compile } = require(require.resolve('hap-toolkit/lib/commands/compile', { paths: [originalOutputDir] }))
  if (isWatch) {
    const { launchServer } = require(require.resolve('@hap-toolkit/server', { paths: [originalOutputDir] }))
    launchServer({
      port: port || 12306,
      watch: isWatch,
      clearRecords: false,
      disableADB: false
    })
    compile('native', 'dev', true)
  } else {
    if (!release) {
      compile('native', 'dev', false)
    } else {
      compile('native', 'prod', false)
    }
  }
}

export async function build (appPath: string, { watch, adapter = BUILD_TYPES.WEAPP, envHasBeenSet = false, port, release }: IMiniAppBuildConfig) {
  const buildData = setBuildData(appPath, adapter)
  const isQuickApp = adapter === BUILD_TYPES.QUICKAPP
  let quickappJSON
  process.env.TARO_ENV = adapter
  if (!envHasBeenSet) {
    setIsProduction(process.env.NODE_ENV === 'production' || !watch)
  }
  fs.ensureDirSync(buildData.outputDir)
  if (!isQuickApp) {
    buildProjectConfig()
    await buildFrameworkInfo()
  } else {
    quickappJSON = readQuickAppManifest()
    setQuickappManifest(quickappJSON)
  }
  copyFiles(appPath, buildData.projectConfig.copy)
  const appConfig = await buildEntry()
  setAppConfig(appConfig)
  await buildPages()
  if (watch) {
    watchFiles()
  }
  if (isQuickApp) {
    generateQuickAppManifest(quickappJSON)
    const isReady = await prepareQuickAppEnvironment(buildData)
    if (!isReady) {
      console.log()
      console.log(chalk.red('快应用环境准备失败，请重试！'))
      process.exit(0)
      return
    }
    await runQuickApp(watch, buildData, port, release)
  }
}
