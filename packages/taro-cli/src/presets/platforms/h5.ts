import { IPluginContext } from '@tarojs/service'
import { get, merge } from 'lodash'
import * as path from 'path'

import { getPkgVersion } from '../../util'

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'h5',
    useConfigName: 'h5',
    async fn ({ config }) {
      const { appPath, outputPath, sourcePath } = ctx.paths
      const { initialConfig } = ctx
      const { port } = ctx.runOpts.options
      const { emptyDirectory, recursiveMerge, npm, ENTRY, SOURCE_DIR, OUTPUT_DIR } = ctx.helper
      emptyDirectory(outputPath)
      const entryFileName = `${ENTRY}.config`
      const entryFile = path.basename(entryFileName)
      const defaultEntry = {
        [ENTRY]: [path.join(sourcePath, entryFile)]
      }
      const customEntry = get(initialConfig, 'h5.entry')
      const h5RunnerOpts = recursiveMerge(Object.assign({}, config), {
        entryFileName: ENTRY,
        env: {
          TARO_ENV: JSON.stringify('h5'),
          FRAMEWORK: JSON.stringify(config.framework),
          TARO_VERSION: JSON.stringify(getPkgVersion())
        },
        devServer: { port },
        sourceRoot: config.sourceRoot || SOURCE_DIR,
        outputRoot: config.outputRoot || OUTPUT_DIR
      })
      h5RunnerOpts.entry = merge(defaultEntry, customEntry)

      let runnerPkg: string
      const compiler = typeof config.compiler === 'object' ? config.compiler.type : config.compiler
      switch (compiler) {
        case 'webpack5':
          runnerPkg = '@tarojs/webpack5-runner'
          break
        default:
          runnerPkg = '@tarojs/webpack-runner'
      }
      const webpackRunner = await npm.getNpmPkg(runnerPkg, appPath)

      webpackRunner(appPath, h5RunnerOpts)
    }
  })
}
