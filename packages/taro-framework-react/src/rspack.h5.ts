import { REG_TARO_H5, RSPACK_H5_TARO_ENTRY_RULE, RSPACK_H5_TARO_LOADER_USE } from '@tarojs/helper'
import { mergeWith } from 'lodash'

import { getLoaderMeta } from './loader-meta'

import type RspackChain from 'rspack-chain'
import type { Frameworks } from './index'

/**
 * 对称于 webpack.h5.ts 的 modifyH5WebpackChain,但落点为 rspack-chain 的命名约定。
 *
 * Note: loaderMeta 注入到 @tarojs/rspack-runner 约定的命名 rule / use（常量见 @tarojs/helper,
 * runner 与平台/框架插件共享,避免魔法字符串各自漂移）。api-loader 则以命名 rule
 * 'process-import-taro-h5' 追加,向 @tarojs/taro 注入 useLaunch/useLoad 等 React hooks。
 */
export function modifyH5RspackChain (framework: Frameworks, chain: RspackChain) {
  const customizer = (object = '', sources = '') => {
    if ([object, sources].every((e) => typeof e === 'string')) return object + sources
  }

  chain.module
    .rule(RSPACK_H5_TARO_ENTRY_RULE)
    .use(RSPACK_H5_TARO_LOADER_USE)
    .tap((options: any = {}) => ({
      ...options,
      loaderMeta: mergeWith(getLoaderMeta(framework), options.loaderMeta, customizer),
    }))

  chain.module
    .rule('process-import-taro-h5')
    .test(REG_TARO_H5)
    .use('apiLoader')
    .loader(require.resolve('./api-loader'))
    .end()
    .end()
}
