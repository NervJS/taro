import { isString } from '@tarojs/shared'

import H5 from './program'
import { computeH5RunnerInject } from './runner-inject'

import type { IPluginContext } from '@tarojs/service'

// Note: 让其它平台插件可以继承此平台
export { H5 }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'h5',
    useConfigName: 'h5',
    async fn ({ config }) {
      const program = new H5(ctx, config)
      await program.start()
    }
  })

  // Note: rspack 等无 webpack-chain 概念的 runner 拿不到 modifyWebpackChain 闭包注入的 alias/loaderMeta，
  // 改由 opts.runnerInject 传递。必须挂在插件入口（initPresetsAndPlugins 阶段执行），
  // 不能挂在 H5 类构造函数里 —— Kernel.run() 触发 modifyRunnerOpts 时 H5 实例尚未创建（见 Kernel.ts run()）。
  ctx.modifyRunnerOpts(({ opts }) => {
    if (!opts?.compiler) return

    if (isString(opts.compiler)) {
      opts.compiler = { type: opts.compiler }
    }

    if (opts.compiler.type !== 'rspack') return

    const { alias, loaderMeta } = computeH5RunnerInject(ctx)
    opts.runnerInject ||= {}
    opts.runnerInject.alias = { ...opts.runnerInject.alias, ...alias }
    opts.runnerInject.loaderMeta ||= { extraImportForWeb: '', execBeforeCreateWebApp: '' }
    opts.runnerInject.loaderMeta.extraImportForWeb = (opts.runnerInject.loaderMeta.extraImportForWeb || '') + loaderMeta.extraImportForWeb
    opts.runnerInject.loaderMeta.execBeforeCreateWebApp = (opts.runnerInject.loaderMeta.execBeforeCreateWebApp || '') + loaderMeta.execBeforeCreateWebApp
  })
}

export * from './utils'
