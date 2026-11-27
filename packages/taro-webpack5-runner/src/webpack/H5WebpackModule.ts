import { BaseH5Module } from '@tarojs/runner-utils/bundler/config/H5Module'

import { WebpackModule } from './WebpackModule'

import type { H5Combination } from './H5Combination'

export class H5WebpackModule extends BaseH5Module<H5Combination> {
  protected getModuleClass () {
    return WebpackModule
  }
}
