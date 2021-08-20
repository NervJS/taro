/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import * as path from 'path'
import * as fs from 'fs-extra'

import { merge } from 'lodash'
import { IProjectConfig } from '@tarojs/taro/types/compile'
import {
  SOURCE_DIR,
  OUTPUT_DIR,
  ENTRY,
  resolveScriptPath,
  createBabelRegister,
  getModuleDefaultExport
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
    this.configPath = resolveScriptPath(path.join(this.appPath, CONFIG_DIR_NAME, DEFAULT_CONFIG_FILE))
    if (!fs.existsSync(this.configPath)) {
      this.initialConfig = {}
      this.isInitSuccess = false
    } else {
      createBabelRegister({
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
      terser: initialConfig.terser,
      ...initialConfig[useConfigName]
    }
  }
}
