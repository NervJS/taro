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
