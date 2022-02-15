import * as path from 'path'
import * as Chain from 'webpack-chain'
import { recursiveMerge } from '@tarojs/helper'
import { MultiPlatformPlugin } from '@tarojs/runner-utils'

import type { H5BuildConfig, MiniBuildConfig } from '../utils/types'

export class BaseConfig {
  private _chain: Chain

  constructor (appPath: string, config: Partial<MiniBuildConfig | H5BuildConfig>) {
    const chain = this._chain = new Chain()
    chain.merge({
      target: ['web', 'es5'],
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.vue'],
        symlinks: true,
        modules: [path.join(appPath, 'node_modules'), 'node_modules'],
        plugin: {
          MultiPlatformPlugin: {
            plugin: MultiPlatformPlugin,
            args: ['described-resolve', 'resolve', { chain }]
          }
        }
      },
      resolveLoader: {
        modules: [path.resolve(__dirname, '../../node_modules'), 'node_modules']
      }
    })

    if (config.cache?.enable) {
      delete config.cache.enable

      const cacheDefault = {
        type: 'filesystem',
        // 让缓存失效
        buildDependencies: {
          config: [path.join(appPath, 'config/index.js')]
        },
        name: `${process.env.NODE_ENV}-${process.env.TARO_ENV}`
      }
      chain.merge({
        cache: recursiveMerge<any>({}, cacheDefault, config.cache)
      })
    }
  }

  get chain () {
    return this._chain
  }
}
