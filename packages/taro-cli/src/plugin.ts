import * as fs from 'fs-extra'
import * as path from 'path'
import chalk from 'chalk'

import {
  BUILD_TYPES
} from './util/constants'

import {
  getBuildData
} from './mini/helper'
import { build as buildMini } from './mini'
import { IBuildOptions } from './util/types'
import { Builder } from '.'

const PLUGIN_JSON = 'plugin.json'
const PLUGIN_MOCK_JSON = 'plugin-mock.json'

export async function build (appPath: string, { watch, platform }: IBuildOptions, builder: Builder) {
  switch (platform) {
    case BUILD_TYPES.WEAPP:
      await buildWxPlugin(appPath, { watch, type: BUILD_TYPES.WEAPP }, builder)
      break
    case BUILD_TYPES.ALIPAY:
      await buildAlipayPlugin(appPath, { watch, type: BUILD_TYPES.ALIPAY }, builder)
      break
    default:
      console.log(chalk.red('输入插件类型错误，目前只支持 weapp/alipay 插件类型'))
      break
  }
}

async function buildWxPlugin (appPath, { watch, type }, builder) {
  await buildMini(appPath, { watch, type: BUILD_TYPES.PLUGIN }, null, builder)
  const { outputDirName } = getBuildData()
  await buildMini(appPath, { watch, type }, {
    outputDirName: `${outputDirName}/miniprogram`
  }, builder)
}

async function buildAlipayPlugin (appPath, { watch, type }, builder) {
  await buildMini(appPath, { watch, type }, null, builder)
  const {
    sourceDir,
    outputDir
  } = getBuildData()
  const pluginJson = path.join(sourceDir, PLUGIN_JSON)
  const pluginMockJson = path.join(sourceDir, PLUGIN_MOCK_JSON)

  if (fs.existsSync(pluginJson)) {
    fs.copyFileSync(pluginJson, path.join(outputDir, PLUGIN_JSON))
  }
  if (fs.existsSync(pluginMockJson)) {
    fs.copyFileSync(pluginMockJson, path.join(outputDir, PLUGIN_MOCK_JSON))
  }
}
