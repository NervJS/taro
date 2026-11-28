import { recursiveMerge } from '@tarojs/helper'
import { BaseCombination } from '@tarojs/runner-utils/bundler/config/Combination'
import { isObject } from '@tarojs/shared'
import webpack from 'webpack'

import { componentConfig } from '../utils/component'

import type { IPrebundle } from '@tarojs/webpack5-prebundle'
import type Chain from 'webpack-chain'
import type { CommonBuildConfig, IH5BuildConfig, IHarmonyBuildConfig, IMiniBuildConfig } from '../utils/types'

type ICompiler = Exclude<CommonBuildConfig['compiler'], string | undefined>

export class Combination<T extends IMiniBuildConfig | IH5BuildConfig | IHarmonyBuildConfig = CommonBuildConfig> extends BaseCombination<T, Chain> {
  prebundleOptions?: IPrebundle
  protected bundler = webpack
  protected componentConfig = componentConfig

  getPrebundleOptions () {
    if (this.isBuildNativeComp) return { enable: false }
    if (this.prebundleOptions) return this.prebundleOptions
    const include: string[] = ['@tarojs/taro', '@tarojs/runtime']
    const exclude: string[] = []
    if (this.isWeb) {
      include.push('@tarojs/router')
    } else {
      // 小程序编译 Host 时需要扫描 @tarojs/components 的 useExports，因此不能被 external
      exclude.push('@tarojs/components')
      // 预依赖 vue 会报错，先简单处理 exclude掉
      exclude.push('vue')
    }

    const defaultOptions: IPrebundle = {
      enable: this.config.mode !== 'production', // 因为使用了 esbuild 单独打包依赖，会使项目体积略微变大，所以生产模式下默认不开启
      timings: false,
      force: false,
      include,
      exclude,
      esbuild: {}
    }

    if (isObject<ICompiler>(this.config.compiler)) {
      this.prebundleOptions = recursiveMerge({}, defaultOptions, this.config.compiler.prebundle)
    }

    return this.prebundleOptions as IPrebundle
  }
}
