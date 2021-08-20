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

import path from 'path'
import { resolveStyle } from './index'
import { LogLevelEnum } from '../types'

class Importer {
  constructor (opt) {
    this.platform = opt.platform
    this.alias = opt.alias
  }

  platform: 'android' | 'ios'

  alias: Record<string, string> = {}

  process (src: string, options: Less.PreProcessorExtraInfo) {
    const { fileInfo } = options
    const { filename, currentDirectory: basedir } = fileInfo

    if (!basedir) {
      return src
    }

    const resolveOpts = {
      basedir,
      alias: this.alias,
      platform: this.platform,
      logLevel: LogLevelEnum.WARNING,
      defaultExt: path.extname(filename)
    }

    // 解析 @import "a.less" 字符串里面的内容
    src = src.replace(/@import\s+['"]([^'|"]*)['"]/gi, (_, id) => {
      const relativePath = path.relative(basedir, resolveStyle(id.trim(), resolveOpts)).replace(/\\/g, '/')
      return `@import '${relativePath}';`
    })

    return src
  }
}

function makeLessImport (options) {
  return {
    install: (_, pluginManager) => {
      pluginManager.addPreProcessor(new Importer(options))
    },
    minVersion: [2, 7, 1]
  }
}

export default makeLessImport
