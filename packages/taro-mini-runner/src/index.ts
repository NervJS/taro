import * as webpack from 'webpack'

import { IBuildConfig } from './utils/types'
import { printBuildError, bindProdLogger } from './utils/logHelper'
import MiniPlugin from './plugins/miniPlugin'

export default function build (config: IBuildConfig) {
  const webpackConfig = {
    entry: config.entry,
    output: {
      filename: '[name].js',
      publicPath: '/',
			path: config.outputDir,
    },
    plugins: [
      new MiniPlugin()
    ]
  }

  const compiler = webpack(webpackConfig)
  bindProdLogger(compiler)

  compiler.run((err) => {
    if (err) {
      printBuildError(err)
    }
  })
}
