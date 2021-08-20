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

import { chalk } from '@tarojs/helper'
import { isArray, isString } from '@tarojs/shared'

import type { IPluginContext, TaroPlatformBase } from '@tarojs/service'

const spawn = require('cross-spawn')
const detectPort = require('detect-port')

interface IOptions {
  enabled?: boolean
  port?: string
}

export default function (ctx: IPluginContext, options: IOptions) {
  if (process.env.NODE_ENV === 'production' || options.enabled === false) return

  const port = Number(options.port || '8098')

  detectPort(port, (err, availablePort) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(`detectport 错误：${err}`)
    }

    if (availablePort === port) {
      // eslint-disable-next-line no-console
      console.log(chalk.yellow('\n提示  ') + '正在启动 vue-devtools...\n')
      spawn(require.resolve('@vue/devtools/bin'), { env: { ...process.env, PORT: port } })
    }
  })

  ctx.registerMethod({
    name: 'onSetupClose',
    fn (platform: TaroPlatformBase) {
      injectRuntimePath(platform)
    }
  })

  ctx.modifyWebpackChain(({ chain }) => {
    chain
      .plugin('definePlugin')
      .tap(args => {
        const config = args[0]
        config.__VUE_DEVTOOLS_PORT__ = port
        return args
      })

    chain
      .plugin('providerPlugin')
      .tap(args => {
        const config = args[0]
        config.globalThis = ['@tarojs/runtime', 'window']
        config.HTMLElement = ['@tarojs/runtime', 'TaroElement']
        return args
      })
  })
}

function injectRuntimePath (platform: TaroPlatformBase) {
  const injectedPath = '@tarojs/plugin-vue-devtools/dist/runtime'

  if (isArray(platform.runtimePath)) {
    platform.runtimePath.push(injectedPath)
  } else if (isString(platform.runtimePath)) {
    platform.runtimePath = [platform.runtimePath, injectedPath]
  }
}
