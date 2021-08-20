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

import * as envinfo from 'envinfo'
import { IPluginContext } from '@tarojs/service'

import { getPkgVersion } from '../../util'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'info',
    synopsisList: [
      'taro info',
      'taro info rn'
    ],
    async fn ({ _ }) {
      const rn = _[1] === 'rn'
      const { fs, chalk, PROJECT_CONFIG } = ctx.helper
      const { appPath, configPath } = ctx.paths

      if (!configPath || !fs.existsSync(configPath)) {
        console.log(chalk.red(`找不到项目配置文件${PROJECT_CONFIG}，请确定当前目录是 Taro 项目根目录!`))
        process.exit(1)
      }

      if (rn) {
        const tempPath = path.join(appPath, '.rn_temp')
        if (fs.lstatSync(tempPath).isDirectory()) {
          process.chdir('.rn_temp')
        }
      }

      await info({}, ctx)
    }
  })
}

async function info (options, ctx) {
  const npmPackages = ctx.helper.UPDATE_PACKAGE_LIST.concat(['react', 'react-native', 'nervjs', 'expo', 'taro-ui'])
  const info = await envinfo.run(Object.assign({}, {
    System: ['OS', 'Shell'],
    Binaries: ['Node', 'Yarn', 'npm'],
    npmPackages,
    npmGlobalPackages: ['typescript']
  }, options), {
    title: `Taro CLI ${getPkgVersion()} environment info`
  })
  console.log(info)
}
