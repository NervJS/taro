import * as path from 'path'
import * as webpack from 'webpack'

import { IBuildConfig } from './utils/types'
import { printBuildError, bindProdLogger } from './utils/logHelper'
import MiniPlugin from './plugins/miniPlugin'

export default function build (config: IBuildConfig) {
  const compilePlugins = config.plugins
  const { babel } = compilePlugins
  const webpackConfig = {
    mode: config.isWatch ? 'development' : 'production',
    entry: config.entry,
    output: {
      filename: '[name].js',
      publicPath: '/',
			path: config.outputDir,
    },
    module: {
      rules: [
        {
					test: /\.(tsx?|jsx?)$/,
					include: /src/,
					exclude: /node_modules/,
					use: [{
            loader: path.resolve(__dirname, './loaders/fileParseLoader'),
            options: {
              babel,
              constantsReplaceList: config.constantsReplaceList
            }
          }, {
            loader: path.resolve(__dirname, './loaders/wxTransformerLoader'),
            options: {
              buildAdapter: config.buildAdapter,
              fileTypeMap: MiniPlugin.getTaroFileTypeMap()
            }
          }]
				}
      ]
    },
    plugins: [
      new MiniPlugin({
        buildAdapter: config.buildAdapter,
        constantsReplaceList: config.constantsReplaceList
      })
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
