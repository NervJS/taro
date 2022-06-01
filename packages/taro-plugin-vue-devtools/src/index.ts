import { chalk } from '@tarojs/helper'
import type { IPluginContext, TaroPlatformBase } from '@tarojs/service'
import { isArray, isString } from '@tarojs/shared'

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
        config.ENABLE_SIZE_APIS = true
        config.ENABLE_CONTAINS = true
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

  ctx.modifyRunnerOpts(({ opts }) => {
    if (isString(opts.compiler)) {
      opts.compiler = {
        type: opts.compiler
      }
    }
    if (opts.compiler.type === 'webpack5') {
      opts.compiler.prebundle ||= {}
      const prebundle = opts.compiler.prebundle
      if (prebundle.enable === false) return

      // @todos
      // 预编译时暂时不处理本插件和 vue，因为本插件使用了 providePlugin 注入了 "globalThis" 和 "HTMLElement"。
      // 但目前预编译第三阶段还不支持配置 Webpack，导致无法应用上述注入。待后续预编译第三阶段支持后可调整回来。
      prebundle.exclude ||= []
      prebundle.exclude.push('vue', /^@tarojs[\\/]/)
    }
  })
}

function injectRuntimePath (platform: TaroPlatformBase) {
  const injectedPath = 'post:@tarojs/plugin-vue-devtools/dist/runtime'

  if (isArray(platform.runtimePath)) {
    platform.runtimePath.push(injectedPath)
  } else if (isString(platform.runtimePath)) {
    platform.runtimePath = [platform.runtimePath, injectedPath]
  }
}
