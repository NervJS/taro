import * as fs from 'fs-extra'

import { IBuildOptions } from '../util/types'
import { BUILD_TYPES } from '../util/constants'
import * as npmProcess from '../util/npm'
import { getBabelConfig } from '../util'
import Builder from '../build'

import {
  setBuildData,
  setIsProduction,
  getBuildData
} from './helper'

export async function build (appPath: string, { watch, type = BUILD_TYPES.WEAPP, envHasBeenSet = false, port, release }: IBuildOptions, builder: Builder) {
  const buildData = setBuildData(appPath, type)
  process.env.TARO_ENV = type
  if (!envHasBeenSet) {
    setIsProduction(process.env.NODE_ENV === 'production' || !watch)
  }
  fs.ensureDirSync(buildData.outputDir)

  await buildWithWebpack({
    appPath
  }, builder)
}

async function buildWithWebpack ({ appPath }: { appPath: string }, builder) {
  const {
    entryFilePath,
    buildAdapter,
    projectConfig,
    isProduction,
    alias,
    sourceDirName,
    outputDirName
  } = getBuildData()
  const miniRunner = await npmProcess.getNpmPkg('@tarojs/mini-runner', appPath)
  const babelConfig = getBabelConfig(projectConfig.babel)
  const miniRunnerOpts = {
    entry: {
      app: entryFilePath
    },
    alias,
    copy: projectConfig.copy,
    sourceRoot: sourceDirName,
    outputRoot: outputDirName,
    buildAdapter,
    babel: babelConfig,
    csso: projectConfig.csso,
    sass: projectConfig.csso,
    uglify: projectConfig.uglify,
    plugins: projectConfig.plugins,
    projectName: projectConfig.projectName,
    isWatch: !isProduction,
    env: projectConfig.env,
    defineConstants: projectConfig.defineConstants,
    designWidth: projectConfig.designWidth,
    deviceRatio: projectConfig.deviceRatio,
    ...projectConfig.mini
  }
  miniRunner(appPath, miniRunnerOpts, builder)
}
