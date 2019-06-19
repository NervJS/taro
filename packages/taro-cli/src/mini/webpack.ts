import * as fs from 'fs-extra'
import * as path from 'path'

import { IMiniAppBuildConfig } from '../util/types'
import { BUILD_TYPES } from '../util/constants'
import * as npmProcess from '../util/npm'
import { getBabelConfig } from '../util'
import Builder from '../build'

import {
  setBuildData,
  setIsProduction,
  getBuildData
} from './helper'

export async function build (appPath: string, { watch, adapter = BUILD_TYPES.WEAPP, envHasBeenSet = false, port, release }: IMiniAppBuildConfig, builder: Builder) {
  const buildData = setBuildData(appPath, adapter)
  process.env.TARO_ENV = adapter
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
    alias
  } = getBuildData()
  const miniRunner = await npmProcess.getNpmPkg('@tarojs/mini-runner', appPath)
  const babelConfig = getBabelConfig(projectConfig.babel)
  const miniRunnerOpts = {
    entry: {
      app: entryFilePath
    },
    alias,
    copy: projectConfig.copy,
    outputRoot: projectConfig.outputRoot,
    buildAdapter,
    babel: babelConfig,
    csso: projectConfig.csso,
    sass: projectConfig.csso,
    uglify: projectConfig.uglify,
    isWatch: !isProduction,
    env: projectConfig.env,
    defineConstants: projectConfig.defineConstants,
    designWidth: projectConfig.designWidth,
    deviceRatio: projectConfig.deviceRatio
  }
  miniRunner(appPath, miniRunnerOpts, builder)
}
