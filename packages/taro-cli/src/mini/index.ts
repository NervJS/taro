import * as fs from 'fs-extra'
import * as path from 'path'
import chalk from 'chalk'

import { IBuildOptions } from '../util/types'
import { BUILD_TYPES, processTypeEnum } from '../util/constants'
import * as npmProcess from '../util/npm'
import { getBabelConfig, getInstalledNpmPkgVersion, getPkgVersion, printLog, checkCliAndFrameworkVersion } from '../util'
import Builder from '../build'
import * as defaultManifestJSON from '../config/manifest.default.json'

import {
  setBuildData,
  setIsProduction,
  getBuildData,
  setQuickappManifest,
  prepareQuickAppEnvironment,
  runQuickApp,
  IBuildData
} from './helper'

function buildProjectConfig () {
  const { buildAdapter, sourceDir, outputDir, outputDirName, appPath } = getBuildData()
  let projectConfigFileName = `project.${buildAdapter}.json`
  if (buildAdapter === BUILD_TYPES.WEAPP) {
    // 微信小程序 projectConfig 不遵循多端配置规则，规则参考[项目配置](https://taro-docs.jd.com/taro/docs/project-config.html)
    projectConfigFileName = 'project.config.json'
  }

  let projectConfigPath = path.join(appPath, projectConfigFileName)
  if (!fs.existsSync(projectConfigPath)) {
    // 若项目根目录不存在对应平台的 projectConfig 文件，则尝试从源代码目录查找
    projectConfigPath = path.join(sourceDir, projectConfigFileName)
    if (!fs.existsSync(projectConfigPath)) return
  }

  const origProjectConfig = fs.readJSONSync(projectConfigPath)
  // compileType 是 plugin 时不修改 miniprogramRoot 字段
  let distProjectConfig = origProjectConfig
  if (origProjectConfig['compileType'] !== 'plugin') {
    distProjectConfig = Object.assign({}, origProjectConfig, { miniprogramRoot: './' })
  }

  if (buildAdapter === BUILD_TYPES.TT || buildAdapter === BUILD_TYPES.QQ) {
    // 输出头条和 QQ 小程序要求的 projectConfig 文件名
    projectConfigFileName = 'project.config.json'
  }

  fs.ensureDirSync(outputDir)
  fs.writeFileSync(
    path.join(outputDir, projectConfigFileName),
    JSON.stringify(distProjectConfig, null, 2)
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

export async function build (appPath: string, { watch, type = BUILD_TYPES.WEAPP, envHasBeenSet = false, port, release }: IBuildOptions, customBuildData: Partial<IBuildData> | null | undefined, builder: Builder) {
  const buildData = setBuildData(appPath, type, customBuildData)
  const isQuickApp = type === BUILD_TYPES.QUICKAPP
  if (type !== BUILD_TYPES.PLUGIN) {
    await checkCliAndFrameworkVersion(appPath, type)
  }
  process.env.TARO_ENV = type
  if (!envHasBeenSet) {
    setIsProduction(process.env.NODE_ENV === 'production' || !watch)
  }
  fs.ensureDirSync(buildData.outputDir)
  let quickappJSON
  if (!isQuickApp) {
    buildProjectConfig()
    await buildFrameworkInfo()
  } else {
    quickappJSON = readQuickAppManifest()
    setQuickappManifest(quickappJSON)
  }

  await buildWithWebpack({
    appPath,
    watch,
  }, builder)
  if (isQuickApp) {
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

async function buildWithWebpack ({ appPath, watch }: { appPath: string, watch?: boolean }, builder) {
  const {
    entryFilePath,
    buildAdapter,
    projectConfig,
    isProduction,
    alias,
    sourceDirName,
    outputDirName,
    nodeModulesPath,
    quickappManifest
  } = getBuildData()
  const miniRunner = await npmProcess.getNpmPkg('@tarojs/mini-runner', appPath)
  const babelConfig = getBabelConfig(projectConfig.babel)
  const miniRunnerOpts = {
    entry: {
      app: [entryFilePath]
    },
    alias,
    copy: projectConfig.copy,
    sourceRoot: sourceDirName,
    outputRoot: outputDirName,
    buildAdapter,
    babel: babelConfig,
    csso: projectConfig.csso,
    sass: projectConfig.sass,
    uglify: projectConfig.uglify,
    plugins: projectConfig.plugins,
    projectName: projectConfig.projectName,
    isWatch: watch,
    mode: isProduction? 'production': 'development',
    env: projectConfig.env,
    defineConstants: projectConfig.defineConstants,
    designWidth: projectConfig.designWidth,
    deviceRatio: projectConfig.deviceRatio,
    nodeModulesPath,
    quickappJSON: quickappManifest,
    ...projectConfig.mini
  }
  await miniRunner(appPath, miniRunnerOpts, builder)
}
