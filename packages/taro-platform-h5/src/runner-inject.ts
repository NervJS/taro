import path from 'node:path'

import { defaultMainFields } from '@tarojs/helper'

import { resolveSync } from './utils'

import type { IPluginContext } from '@tarojs/service'

const compLibraryAlias = {
  vue3: 'vue3',
  solid: 'solid',
}

export interface IH5RunnerInject {
  alias: Record<string, string>
  loaderMeta: {
    extraImportForWeb: string
    execBeforeCreateWebApp: string
  }
}

/**
 * 计算 H5 平台注入 runner 的 alias 与 loaderMeta 增量。
 * 供 program.ts 的 modifyWebpackConfig()（写入 webpack-chain）与
 * index.ts 的 modifyRunnerOpts tap（写入 opts.runnerInject，供 rspack-runner 等无 chain 的 runner 消费）共用，
 * 保证两条链路产出一致。
 */
export function computeH5RunnerInject (ctx: IPluginContext, mainFields: string[] = [...defaultMainFields]): IH5RunnerInject {
  const framework = ctx.initialConfig.framework || 'react'
  const useHtmlComponents = !!ctx.initialConfig.h5?.useHtmlComponents
  const useDeprecatedAdapterComponent = !!ctx.initialConfig.h5?.useDeprecatedAdapterComponent
  const aliasFramework = compLibraryAlias[framework] || 'react'

  const apiLibrary = require.resolve('./runtime/apis')
  const componentAdapter = path.join(path.dirname(require.resolve('@tarojs/components')), '..', 'lib')
  const componentLibrary = useHtmlComponents && aliasFramework === 'react'
    ? (framework === 'solid'
      ? require.resolve('@tarojs/components-react/dist/solid')
      : require.resolve('./runtime/components'))
    : useDeprecatedAdapterComponent
      ? require.resolve(`@tarojs/components/lib/${aliasFramework}/component-lib`)
      : require.resolve(`@tarojs/components/lib/${aliasFramework}`)
  const routerLibrary = resolveSync('@tarojs/router', { mainFields }) || '@tarojs/router'

  const alias: Record<string, string> = {
    '@tarojs/components$': componentLibrary,
    '@tarojs/components/lib': componentAdapter,
    '@tarojs/router$': routerLibrary,
    '@tarojs/taro': apiLibrary,
  }

  let extraImportForWeb = ''
  let execBeforeCreateWebApp = ''

  // Note: 旧版本适配器不会自动注册 Web Components 组件，需要加载 defineCustomElements 脚本自动注册使用的组件
  if (useDeprecatedAdapterComponent) {
    extraImportForWeb += `import { applyPolyfills, defineCustomElements } from '@tarojs/components/loader'\n`
    execBeforeCreateWebApp += `applyPolyfills().then(() => defineCustomElements(window))\n`
  }

  if (!useHtmlComponents) {
    extraImportForWeb += `import { defineCustomElementTaroPullToRefreshCore } from '@tarojs/components/dist/components'\n`
    execBeforeCreateWebApp += `defineCustomElementTaroPullToRefreshCore()\n`
  }

  switch (framework) {
    case 'vue3':
      extraImportForWeb += `import { initVue3Components } from '@tarojs/components/lib/vue3/components-loader'\nimport * as list from '@tarojs/components'\n`
      execBeforeCreateWebApp += `initVue3Components(component, list)\n`
      break
    default:
      if (useHtmlComponents) {
        extraImportForWeb += `import '@tarojs/components-react/dist/index.css'\nimport { PullDownRefresh } from '@tarojs/components'\n`
        execBeforeCreateWebApp += `config.PullDownRefresh = PullDownRefresh\n`
      }
  }

  return {
    alias,
    loaderMeta: { extraImportForWeb, execBeforeCreateWebApp },
  }
}
