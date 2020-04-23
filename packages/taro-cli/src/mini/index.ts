import * as fs from 'fs-extra'
import * as path from 'path'
import chalk from 'chalk'

import { IBuildOptions } from '../util/types'
import { BUILD_TYPES, processTypeEnum } from '../util/constants'
import * as npmProcess from '../util/npm'
import { getBabelConfig, getInstalledNpmPkgVersion, getPkgVersion, printLog } from '../util'
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
  const { buildAdapter, outputDir, outputDirName, nodeModulesPath, projectConfig } = getBuildData()
  if (buildAdapter === BUILD_TYPES.SWAN) {
    const frameworkInfoFileName = '.frameworkinfo'
    const frameworkName = '@tarojs/taro'
    const frameworkVersion = getInstalledNpmPkgVersion(frameworkName, nodeModulesPath)
    if (frameworkVersion) {
      const frameworkinfo = {
        toolName: 'Taro',
        toolCliVersion: getPkgVersion(),
        toolFrameworkVersion: frameworkVersion,
        createTime: projectConfig.date ? new Date(projectConfig.date).getTime() : Date.now()
      }
      fs.writeFileSync(path.join(outputDir, frameworkInfoFileName), JSON.stringify(frameworkinfo, null, 2))
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
    printLog(
      processTypeEnum.WARNING,
      '缺少配置',
      `检测到项目目录下未添加 ${chalk.bold(
        'project.quickapp.json'
      )} 文件，将使用默认配置，参考文档 https://nervjs.github.io/taro/docs/project-config.html`
    )
    quickappJSON = defaultManifestJSON
  }
  return quickappJSON
}

export async function build (appPath: string, { watch, type = BUILD_TYPES.WEAPP, envHasBeenSet = false, port, release }: IBuildOptions, customBuildData: Partial<IBuildData> | null | undefined, builder: Builder) {
  const buildData = setBuildData(appPath, type, customBuildData)
  const isQuickApp = type === BUILD_TYPES.QUICKAPP
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
    appPath
  }, builder)
  if (isQuickApp) {
    const isReady = await prepareQuickAppEnvironment(buildData)
    if (!isReady) {
      console.log()
      console.log(chalk.red('快应用环境准备失败，请重试！'))
      process.exit(0)
    }
    await runQuickApp(watch, buildData, port, release)
  }
}

async function buildWithWebpack ({ appPath }: { appPath: string }, builder) {
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
    // uglify: projectConfig.uglify,
    terser: projectConfig.terser,
    plugins: projectConfig.plugins,
    projectName: projectConfig.projectName,
    isWatch: !isProduction,
    env: projectConfig.env,
    defineConstants: projectConfig.defineConstants,
    designWidth: projectConfig.designWidth,
    deviceRatio: projectConfig.deviceRatio,
    baseLevel: projectConfig.baseLevel,
    framework: projectConfig.framework,
    nodeModulesPath,
    quickappJSON: quickappManifest,
    ...projectConfig.mini
  }
  await miniRunner(appPath, miniRunnerOpts, builder)
}
