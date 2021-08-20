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
import { merge, get } from 'lodash'
import { IPluginContext } from '@tarojs/service'
import { getPkgVersion } from '../../util'

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'h5',
    useConfigName: 'h5',
    async fn ({ config }) {
      const { appPath, outputPath, sourcePath } = ctx.paths
      const { initialConfig } = ctx
      const { port } = ctx.runOpts
      const { emptyDirectory, recursiveMerge, npm, ENTRY, SOURCE_DIR, OUTPUT_DIR } = ctx.helper
      emptyDirectory(outputPath)
      const entryFileName = `${ENTRY}.config`
      const entryFile = path.basename(entryFileName)
      const defaultEntry = {
        [ENTRY]: [path.join(sourcePath, entryFile)]
      }
      const customEntry = get(initialConfig, 'h5.entry')
      const h5RunnerOpts = recursiveMerge(Object.assign({}, config), {
        entryFileName: ENTRY,
        env: {
          TARO_ENV: JSON.stringify('h5'),
          FRAMEWORK: JSON.stringify(config.framework),
          TARO_VERSION: JSON.stringify(getPkgVersion())
        },
        port,
        sourceRoot: config.sourceRoot || SOURCE_DIR,
        outputRoot: config.outputRoot || OUTPUT_DIR
      })
      h5RunnerOpts.entry = merge(defaultEntry, customEntry)
      const webpackRunner = await npm.getNpmPkg('@tarojs/webpack-runner', appPath)
      webpackRunner(appPath, h5RunnerOpts)
    }
  })
}
