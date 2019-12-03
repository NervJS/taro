import * as webpack from 'webpack'

import { IBuildConfig } from './utils/types'
import { BUILD_TYPES } from './utils/constants'
import { printBuildError, bindProdLogger, bindDevLogger } from './utils/logHelper'
import Bundler from './utils/bundler'
import buildConf from './webpack/build.conf'

const customizeChain = (chain, customizeFunc: Function) => {
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack)
  }
}

const getSassLoaderOption = async ({ sass, sassLoaderOption }: IBuildConfig) => {
  let bundledContent = ''
  sassLoaderOption = sassLoaderOption || {}
  if (!sass) {
    return sassLoaderOption
  }
  if (sass.resource && !sass.projectDirectory) {
    const { resource } = sass
    try {
      if (typeof resource === 'string') {
        const res = await Bundler(resource)
        bundledContent += res.bundledContent
        if (Array.isArray(resource)) {
          for (const url of resource) {
            const res = await Bundler(url)
            bundledContent += res.bundledContent
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  if (sass.resource && sass.projectDirectory) {
    const { resource, projectDirectory } = sass
    try {
      if (typeof resource === 'string') {
        const res = await Bundler(resource, projectDirectory)
        bundledContent += res.bundledContent
      }
      if (Array.isArray(resource)) {
        for (const url of resource) {
          const res = await Bundler(url, projectDirectory)
          bundledContent += res.bundledContent
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
  if (sass.data) {
    bundledContent += sass.data
  }
  return {
    ...sassLoaderOption,
    data: sassLoaderOption.data ? `${sassLoaderOption.data}${bundledContent}` : bundledContent
  }
}

const makeConfig = async (buildConfig: IBuildConfig) => {
  const sassLoaderOption = await getSassLoaderOption(buildConfig)
  return {
    ...buildConfig,
    sassLoaderOption
  }
}

export default function build (appPath: string, config: IBuildConfig, mainBuilder) {
  const mode = config.isWatch ? 'development' : 'production'
  return new Promise((resolve, reject) => {
    const { buildAdapter } = config
    if (buildAdapter === BUILD_TYPES.PLUGIN) {
      config.buildAdapter = BUILD_TYPES.WEAPP
      config.isBuildPlugin = true
    }
    makeConfig(config)
      .then(config => {
        const webpackChain = buildConf(appPath, mode, config)

        customizeChain(webpackChain, config.webpackChain)
        const webpackConfig = webpackChain.toConfig()

        const compiler = webpack(webpackConfig)
        if (config.isWatch) {
          bindDevLogger(compiler, config.buildAdapter)
          compiler.watch({
            aggregateTimeout: 300,
            poll: true
          }, (err, stats) => {
            if (err) {
              printBuildError(err)
              return reject(err)
            }
            mainBuilder.hooks.afterBuild.call(stats)
            resolve()
          })
        } else {
          bindProdLogger(compiler, config.buildAdapter)
          compiler.run((err, stats) => {
            if (err) {
              printBuildError(err)
              return reject(err)
            }
            mainBuilder.hooks.afterBuild.call(stats)
            resolve()
          })
        }
      })
  })
}
