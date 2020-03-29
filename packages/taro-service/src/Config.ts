import * as path from 'path'
import * as fs from 'fs-extra'

import { merge } from 'lodash'
import { IProjectConfig } from '@tarojs/taro/types/compile'
import {
  SOURCE_DIR,
  OUTPUT_DIR,
  ENTRY,
  resolveScriptPath,
  getBabelConfig
} from '@tarojs/helper'

import {
  CONFIG_DIR_NAME,
  DEFAULT_CONFIG_FILE
} from './utils/constants'

interface IConfigOptions {
  appPath: string,
}

export default class Config {
  appPath: string
  configPath: string
  initialConfig: IProjectConfig
  isInitSuccess: boolean
  constructor (opts: IConfigOptions) {
    this.appPath = opts.appPath
    this.init()
  }

  init () {
    this.configPath = path.join(this.appPath, CONFIG_DIR_NAME, DEFAULT_CONFIG_FILE)
    if (!fs.existsSync(this.configPath)) {
      this.initialConfig = {}
      this.isInitSuccess = false
    } else {
      this.initialConfig = require(this.configPath)(merge)
      this.isInitSuccess = true
    }
  }

  getConfigWithNamed (platform, useConfigName) {
    const initialConfig = this.initialConfig
    const sourceDirName = initialConfig.sourceRoot || SOURCE_DIR
    const outputDirName = initialConfig.outputRoot || OUTPUT_DIR
    const sourceDir = path.join(this.appPath, sourceDirName)
    const entryName = ENTRY
    const entryFilePath = resolveScriptPath(path.join(sourceDir, entryName))

    const entry = {
      [entryName]: [entryFilePath]
    }

    return {
      entry,
      alias: initialConfig.alias || {},
      copy: initialConfig.copy,
      sourceRoot: sourceDirName,
      outputRoot: outputDirName,
      platform,
      babel: getBabelConfig(initialConfig.babel),
      csso: initialConfig.csso,
      sass: initialConfig.sass,
      uglify: initialConfig.uglify,
      plugins: initialConfig.plugins,
      projectName: initialConfig.projectName,
      env: initialConfig.env,
      defineConstants: initialConfig.defineConstants,
      designWidth: initialConfig.designWidth,
      deviceRatio: initialConfig.deviceRatio,
      ...initialConfig[useConfigName]
    }
  }
}
