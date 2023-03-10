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

import { chalk, fs } from '@tarojs/helper'
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
      console.log(`detectPort 错误：${err}`)
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

  ctx.modifyRunnerOpts(({ opts }) => {
    if (!opts?.compiler) return

    if (isString(opts.compiler)) {
      opts.compiler = {
        type: opts.compiler
      }
    }
    if (opts.compiler.type === 'webpack5') {
      opts.compiler.prebundle ||= {}
      const prebundle = opts.compiler.prebundle
      if (prebundle.enable === false) return

      // 代替 ./loader 里的功能
      const taroReactDevtoolsPlugin = {
        name: 'taroReactDevtoolsPlugin',
        setup (build) {
          build.onLoad({ filter: /react-reconciler\.(production|development)/ }, ({ path }) => {
            const content = fs.readFileSync(path).toString()
            return {
              contents: content.replace(/__REACT_DEVTOOLS_GLOBAL_HOOK__/g, 'window.__REACT_DEVTOOLS_GLOBAL_HOOK__')
            }
          })
        }
      }

      prebundle.esbuild ||= {}
      const esbuildConfig = prebundle.esbuild
      esbuildConfig.plugins ||= []
      esbuildConfig.plugins.push(taroReactDevtoolsPlugin)
    }
  })
}

function injectRuntimePath (platform: TaroPlatformBase) {
  const injectedPath = 'post:@tarojs/plugin-react-devtools/dist/runtime'
  if (isArray(platform.runtimePath)) {
    platform.runtimePath.push(injectedPath)
  } else if (isString(platform.runtimePath)) {
    platform.runtimePath = [platform.runtimePath, injectedPath]
  }
}
