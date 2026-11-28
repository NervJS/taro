import { type CssModuleOptionConfig, type IRule, createBundlerModule } from '@tarojs/runner-utils/bundler/config/BundlerModule'

export type { CssModuleOptionConfig, IRule }

export class WebpackModule extends createBundlerModule({
  resolveLoader: id => require.resolve(id),
  loadModule: id => require(id)
}) {}
