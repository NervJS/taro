import { BaseH5Plugin, resolveH5EntryLoaderConfig } from '@tarojs/runner-utils/bundler/h5Plugin'

import { componentConfig } from '../utils/component'
import TaroComponentsExportsPlugin from './TaroComponentsExportsPlugin'

import type { Compiler, LoaderContext, NormalModule } from 'webpack'

const PLUGIN_NAME = 'TaroH5Plugin'

export default class TaroH5Plugin extends BaseH5Plugin {
  protected applyBundlerHooks (compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compiler.webpack.NormalModule.getCompilationHooks(compilation).loader.tap(PLUGIN_NAME, (_loaderContext: LoaderContext<any>, module: NormalModule) => {
        const resolved = resolveH5EntryLoaderConfig(
          module.resource,
          this.appHelper,
          this.options,
          id => require.resolve(id)
        )
        if (resolved) {
          module.loaders.push({
            loader: resolved.loader,
            options: resolved.options,
            ident: null,
            type: null
          })
        }
      })
    })

    if (!componentConfig.includeAll) {
      new TaroComponentsExportsPlugin(this.options).apply(compiler)
    }
  }
}
