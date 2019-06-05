import * as path from 'path'
import * as webpack from 'webpack'

import { IBuildConfig } from './utils/types'
import { printBuildError, bindProdLogger } from './utils/logHelper'
import MiniPlugin, { Targets } from './plugins/MiniPlugin'
import { MINI_APP_FILES, BUILD_TYPES } from './utils/constants'

const extensions = ['.ts', '.tsx', '.js', '.jsx']

const globalObjectMap = {
  [BUILD_TYPES.WEAPP]: 'wx',
  [BUILD_TYPES.ALIPAY]: 'my',
  [BUILD_TYPES.SWAN]: 'swan',
  [BUILD_TYPES.QQ]: 'qq',
  [BUILD_TYPES.TT]: 'tt'
}

export default function build (config: IBuildConfig) {
  const compilePlugins = config.plugins
  const { babel } = compilePlugins
  const webpackConfig = {
    mode: config.isWatch ? 'development' : 'production',
    devtool: "inline-source-map",
    entry: config.entry,
    output: {
      filename: '[name].js',
      publicPath: '/',
      path: config.outputDir,
      globalObject: globalObjectMap[config.buildAdapter]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
      rules: [
        {
					test: /\.(tsx?|jsx?)$/,
					exclude: /node_modules/,
					use: [{
            loader: path.resolve(__dirname, './loaders/fileParseLoader'),
            options: {
              babel,
              designWidth: config.designWidth,
              deviceRatio: config.deviceRatio,
              buildAdapter: config.buildAdapter,
              constantsReplaceList: config.constantsReplaceList,
              fileTypeMap: MiniPlugin.getTaroFileTypeMap()
            }
          }, {
            loader: path.resolve(__dirname, './loaders/wxTransformerLoader'),
            options: {
              buildAdapter: config.buildAdapter,
              fileTypeMap: MiniPlugin.getTaroFileTypeMap()
            }
          }]
        },
        {
          test: /\.(scss|wxss|acss|ttss|acss|)$/,
					include: /src/,
					use: [
						{
              loader: require.resolve('file-loader'),
              options: {
                useRelativePath: true,
                name: `[path][name]${MINI_APP_FILES[config.buildAdapter].STYLE}`,
                context: config.sourceDir
              }
            },
						{
							loader: require.resolve('sass-loader'),
							options: {

							},
						},
					],
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
