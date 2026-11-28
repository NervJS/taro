/* eslint-disable no-console */
import { format as formatUrl } from 'node:url'

import { recursiveMerge } from '@tarojs/helper'
import { isFunction } from '@tarojs/shared'
import { isEmpty } from 'lodash'

import { errorHandling } from './loadChunks'
import { bindDevLogger, bindProdLogger, printBuildError } from './logHelper'
import { Prerender } from './prerender'
import { formatOpenHost } from './utils'

export interface IRunH5BuildOptions<TConfig = any, TDevServerConfig = any> {
  appPath: string
  config: Record<string, any>
  bundlerConfig: TConfig
  isBuildNativeComp: boolean
  createCompiler: (bundlerConfig: TConfig) => any
  createDevServer: (devServerOptions: TDevServerConfig, compiler: any) => any
  onCompilerCreated?: (compiler: any) => void
}

export async function runH5Build<TStats = any, TConfig extends Record<string, any> = any, TDevServerConfig extends Record<string, any> = any> (
  opts: IRunH5BuildOptions<TConfig, TDevServerConfig>
): Promise<TStats | void> {
  const { appPath, config, bundlerConfig, isBuildNativeComp, createCompiler, createDevServer, onCompilerCreated } = opts
  const { entry = {} } = config
  const errorLevel = (typeof config.compiler !== 'string' && config.compiler?.errorLevel) || 0

  const notifyFinish = (error: any, stats: TStats | null, isWatch: boolean) => {
    if (isFunction(config.onBuildFinish)) {
      config.onBuildFinish({ error, stats, isWatch })
    }
  }

  const tapModifyAssets = (compiler: any) => {
    compiler.hooks.emit.tapAsync('taroBuildDone', async (compilation: any, callback: () => void) => {
      if (isFunction(config.modifyBuildAssets)) {
        await config.modifyBuildAssets(compilation.assets)
      }
      callback()
    })
  }

  try {
    if (!config.isWatch) {
      if (config.withoutBuild) { return }

      const compiler = createCompiler(bundlerConfig)
      onCompilerCreated?.(compiler)
      tapModifyAssets(compiler)

      return new Promise<TStats>((resolve, reject) => {
        bindProdLogger(compiler)

        compiler.run((error: any, stats: TStats) => {
          compiler.close((error2: any) => {
            const err = error || error2
            notifyFinish(err, err ? null : stats, false)
            err ? reject(err) : resolve(stats)
            errorHandling(errorLevel, stats as any)
          })
        })
      })
    } else {
      config.devServer = recursiveMerge<any>(config.devServer || {}, bundlerConfig.devServer)
      config.output = bundlerConfig.output
      const routerConfig = config.router || {}
      const routerMode = routerConfig.mode || 'hash'
      const routerBasename = routerConfig.basename || '/'
      const { getH5DevServerOptions } = require('./devServer') as typeof import('./devServer')
      const devServerOptions = await getH5DevServerOptions<TDevServerConfig>(appPath, config as any)
      ;(bundlerConfig as Record<string, any>).devServer = devServerOptions

      const firstEntry = Object.keys(entry as Record<string, any>)[0]
      const pathname = isBuildNativeComp ? `/${firstEntry}.html` : '/'
      const devUrl = formatUrl({
        protocol: devServerOptions?.https ? 'https' : 'http',
        hostname: formatOpenHost(devServerOptions?.host),
        port: devServerOptions?.port,
        pathname: routerMode === 'browser' ? routerBasename : pathname
      })
      if (typeof devServerOptions.open === 'undefined' || devServerOptions.open === true) {
        Object.assign(devServerOptions, { open: devUrl })
      }

      if (config.withoutBuild) { return }

      const compiler = createCompiler(bundlerConfig)
      const server = createDevServer(devServerOptions, compiler)
      onCompilerCreated?.(compiler)
      bindDevLogger(compiler, devUrl)
      tapModifyAssets(compiler)

      compiler.hooks.done.tap('taroBuildDone', (stats: TStats) => {
        notifyFinish(null, stats, true)
        errorHandling(errorLevel, stats as any)
      })
      compiler.hooks.failed.tap('taroBuildDone', (error: any) => {
        notifyFinish(error, null, true)
        process.exit(1)
      })

      return new Promise<void>((resolve, reject) => {
        server.startCallback((err: any) => {
          if (err) {
            printBuildError(err)
            reject(err)
            return console.log(err)
          }
          resolve()
        })
      })
    }
  } catch (err) {
    console.error(err)
    if (!config.isWatch) { process.exit(1) }
  }
}

export interface IRunMiniBuildOptions<TConfig = any> {
  config: Record<string, any>
  bundlerConfig: TConfig
  createCompiler: (bundlerConfig: TConfig) => any
}

export function runMiniBuild<TStats = any, TConfig = any> (
  opts: IRunMiniBuildOptions<TConfig>
): Promise<TStats | void> {
  const { config, bundlerConfig, createCompiler } = opts

  return new Promise<TStats | void>((resolve, reject) => {
    if (config.withoutBuild) { return }

    const compiler = createCompiler(bundlerConfig)
    const onBuildFinish = config.onBuildFinish
    let prerender: Prerender

    const onFinish = function (error: Error | null, stats: TStats | null) {
      if (typeof onBuildFinish !== 'function') { return }

      onBuildFinish({
        error,
        stats,
        isWatch: config.isWatch
      })
    }

    const callback = async (err: Error | null, stats: TStats) => {
      const errorLevel = (typeof config.compiler !== 'string' && config.compiler?.errorLevel) || 0
      if (err || (stats as any).hasErrors()) {
        const error = err ?? (stats as any).toJson().errors
        onFinish(error, null)
        reject(error)
        errorHandling(errorLevel, stats as any)
        return
      }

      if (!isEmpty(config.prerender)) {
        prerender = prerender ?? new Prerender(config as any, bundlerConfig as any, stats as any, config.template)
        await prerender.render()
      }

      onFinish(null, stats)
      resolve(stats)
    }

    if (config.isWatch) {
      compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
      }, callback)
    } else {
      compiler.run((err: Error | null, stats: TStats) => {
        compiler.close((err2: Error | null) => callback(err || err2, stats))
      })
    }
  })
}
