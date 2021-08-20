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

  const port = Number(options.port || '8097')

  detectPort(port, (err, availablePort) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(`detectport 错误：${err}`)
    }

    if (availablePort === port) {
      // eslint-disable-next-line no-console
      console.log(chalk.yellow('\n提示  ') + '正在启动 react-devtools...\n')
      spawn(require.resolve('react-devtools/bin'), { env: { ...process.env, PORT: port } })
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
        config.__REACT_DEVTOOLS_PORT__ = port
        return args
      })

    // 最理想是可以使用 definePlugin 设置 __REACT_DEVTOOLS_GLOBAL_HOOK__: window.__REACT_DEVTOOLS_GLOBAL_HOOK__
    // 但是 providerPlugin 不会识别 definePlugin 改写的 window 从而注入 window，可能是两个插件的调用时机问题
    // 因此使用 loader 魔改 react-reconciler，代替 definePlugin
    chain.merge({
      module: {
        rule: {
          'plugin-react-devtools': {
            test: /react-reconciler\.(production|development)/,
            loader: require.resolve('./loader')
          }
        }
      }
    })
  })
}

function injectRuntimePath (platform: TaroPlatformBase) {
  const injectedPath = '@tarojs/plugin-react-devtools/dist/runtime'
  if (isArray(platform.runtimePath)) {
    platform.runtimePath.push(injectedPath)
  } else if (isString(platform.runtimePath)) {
    platform.runtimePath = [platform.runtimePath, injectedPath]
  }
}
