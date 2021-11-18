import { chalk } from '@tarojs/helper'
import { modifyMiniWebpackChain } from './webpack.mini'
import { modifyH5WebpackChain } from './webpack.h5'

import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  const { framework } = ctx.initialConfig
  if (framework !== 'vue3') return

  ctx.modifyWebpackChain(({ chain, webpack, data }) => {
    // 通用
    setAlias(chain)
    setDefinePlugin(chain, webpack)

    if (process.env.TARO_ENV === 'h5') {
      // H5
      modifyH5WebpackChain(ctx, chain)
    } else {
      // 小程序
      modifyMiniWebpackChain(ctx, chain, data)
    }
  })
}

function setAlias (chain) {
  // 避免 npm link 时，taro composition apis 使用的 vue 和项目使用的 vue 实例不一致。
  chain.resolve.alias
    .set('vue', require.resolve('vue'))
}

function setDefinePlugin (chain, webpack) {
  chain
    .plugin('defined')
    .use(webpack.DefinePlugin, [{
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
    }])
}

export function getVueLoaderPath (): string {
  try {
    return require.resolve('vue-loader', {
      paths: [process.cwd()]
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(chalk.yellow('找不到 vue-loader，请先安装。'))
    process.exit(1)
  }
}
