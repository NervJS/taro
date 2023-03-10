/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import {
  createSwcRegister,
  ENTRY,
  getModuleDefaultExport,
  OUTPUT_DIR,
  resolveScriptPath,
  SOURCE_DIR
} from '@tarojs/helper'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as merge from 'webpack-merge'

import {
  CONFIG_DIR_NAME,
  DEFAULT_CONFIG_FILE
} from './utils/constants'

import type { IProjectConfig } from '@tarojs/taro/types/compile'

interface IConfigOptions {
  appPath: string
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
    this.configPath = resolveScriptPath(path.join(this.appPath, CONFIG_DIR_NAME, DEFAULT_CONFIG_FILE))
    if (!fs.existsSync(this.configPath)) {
      this.initialConfig = {}
      this.isInitSuccess = false
    } else {
      createSwcRegister({
        only: [
          filePath => filePath.indexOf(path.join(this.appPath, CONFIG_DIR_NAME)) >= 0
        ]
      })
      try {
        this.initialConfig = getModuleDefaultExport(require(this.configPath))(merge)
        this.isInitSuccess = true
      } catch (err) {
        this.initialConfig = {}
        this.isInitSuccess = false
        console.log(err)
      }
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
      framework: initialConfig.framework,
      compiler: initialConfig.compiler,
      cache: initialConfig.cache,
      logger: initialConfig.logger,
      baseLevel: initialConfig.baseLevel,
      csso: initialConfig.csso,
      sass: initialConfig.sass,
      uglify: initialConfig.uglify,
      plugins: initialConfig.plugins,
      projectName: initialConfig.projectName,
      env: initialConfig.env,
      defineConstants: initialConfig.defineConstants,
      designWidth: initialConfig.designWidth,
      deviceRatio: initialConfig.deviceRatio,
      projectConfigName: initialConfig.projectConfigName,
      jsMinimizer: initialConfig.jsMinimizer,
      cssMinimizer: initialConfig.cssMinimizer,
      terser: initialConfig.terser,
      esbuild: initialConfig.esbuild,
      ...initialConfig[useConfigName]
    }
  }
}
