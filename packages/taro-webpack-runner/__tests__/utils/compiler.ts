import * as path from 'path'
import * as webpack from 'webpack'
import * as merge from 'webpack-merge'
import { createFsFromVolume, Volume, IFs } from 'memfs'
import * as joinPath from 'memory-fs/lib/join'

import baseConfig from './config'
import prodConf from '../../src/config/prod.conf'
import baseConf from '../../src/config/base.conf'
import { BuildConfig } from '../../src/util/types'
import { customizeChain } from '../../src/index'

interface EnsuredFs extends IFs {
  join: () => string
}

function ensureWebpackMemoryFs (fs: IFs): EnsuredFs {
  const newFs: EnsuredFs = Object.create(fs)
  newFs.join = joinPath

  return newFs
}

function run (webpackConfig: webpack.Configuration): Promise<webpack.Stats> {
  const compiler = webpack(webpackConfig)
  const fs = createFsFromVolume(new Volume())
  const ensuredFs = ensureWebpackMemoryFs(fs)

  compiler.outputFileSystem = ensuredFs

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        const error = err ?? stats.toJson().errors
        reject(error)
      } else {
        resolve(stats)
      }
    })
  })
}

function readDir (fs: IFs, dir: string) {
  let files: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach(item => {
    const filePath = path.join(dir, item)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      files = files.concat(readDir(fs, filePath))
    } else {
      files.push(filePath)
    }
  })
  return files
}

export function getOutput (stats, config: Partial<BuildConfig>) {
  const fs: IFs = stats.compilation.compiler.outputFileSystem

  const files = readDir(fs, config.outputRoot)
  const output = files.reduce((content, file) => {
    return `${content}
/** filePath: ${file} **/
${fs.readFileSync(file)}
`
  }, '')
  return output
}

export async function compile (app: string, customConfig: Partial<BuildConfig> = {
  framework: 'react'
}) {
  const appPath = path.resolve(__dirname, '../fixtures', app)

  process.chdir(appPath)

  const config: BuildConfig = merge(baseConfig, {
    entry: {
      app: [path.join(appPath, customConfig.sourceRoot || 'src', 'app.config')]
    },
    env: {
      FRAMEWORK: customConfig.framework
    },
    terser: {
      enable: true,
      config: {
        compress: false,
        mangle: false,
        output: {
          comments: false,
          beautify: true
        }
      }
    }
  }, customConfig)
  const baseWebpackChain = baseConf(appPath, config)
  await customizeChain(baseWebpackChain, null, config.webpackChain)
  const prodWebpackConf = prodConf(appPath, config, baseWebpackChain)
  const webpackChain = baseWebpackChain.merge(prodWebpackConf)
  webpackChain.merge({
    resolve: {
      alias: {
        '@tarojs/runtime': path.resolve(__dirname, '../mocks/taro-runtime'),
        '@tarojs/shared': path.resolve(__dirname, '../mocks/taro-shared'),
        '@tarojs/taro-h5': path.resolve(__dirname, '../mocks/taro-h5'),
        '@tarojs/components$': path.resolve(__dirname, '../mocks/taro-components'),
        '@tarojs/components/loader': path.resolve(__dirname, '../mocks/taro-components'),
        '@tarojs/components/dist/taro-components/taro-components.css': path.resolve(__dirname, '../mocks/taro-components.css'),
        'react-dom': path.resolve(__dirname, '../mocks/react'),
        react: path.resolve(__dirname, '../mocks/react'),
        vue: path.resolve(__dirname, '../mocks/vue'),
        nervjs: path.resolve(__dirname, '../mocks/nerv')
      }
    }
  })

  const webpackConfig: webpack.Configuration = webpackChain.toConfig()

  const stats = await run(webpackConfig)
  return { stats, config: config }
}
