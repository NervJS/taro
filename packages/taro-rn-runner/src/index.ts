import * as Metro from 'metro'
import getMetroConfig from './config'
import { getRNConfigEntry } from './config/config-holder'

import { PLATFORMS } from '@tarojs/helper'
import * as path from 'path'
import * as fse from 'fs-extra'
import * as url from 'url'

import * as readline from 'readline'
import { createDevServerMiddleware } from '@react-native-community/cli-server-api'
import { TerminalReporter } from './config/terminal-reporter'
import { getResolveDependencyFn } from 'metro/src/lib/transformHelpers'
import * as Server from 'metro/src/Server'
import saveAssets from '@react-native-community/cli/build/commands/bundle/saveAssets'
import * as outputBundle from 'metro/src/shared/output/bundle'

function concatOutputFileName (config: any): string {
  let output = 'index.bundle'
  if (config.output) {
    const outputType = typeof config.output
    if (outputType === 'string') {
      output = config.output
    } else if (outputType === 'object') {
      output = config.output[config.deviceType]
      if (!output) {
        console.error(`lack value for 'rn.output' configuration with platform '${config.deviceType}': ${JSON.stringify(config.output)}`)
      }
    } else {
      console.error(`invalid value for 'rn.output' configuration: ${JSON.stringify(config.output)}`)
    }
  }
  const res = path.isAbsolute(output) ? output : path.join(config.outputRoot, output)
  fse.ensureDirSync(path.dirname(res))
  return res
}

function concatOutputAssetsDest (config: any): string | undefined {
  if (!config?.deviceType || !config?.output) {
    return undefined
  }
  const assetDest = config.deviceType === 'ios' ? config.output.iosAssetsDest : config.output.androidAssetsDest
  if (!assetDest) return undefined
  const res = path.isAbsolute(assetDest) ? assetDest : path.join(config.outputRoot, assetDest)
  fse.ensureDirSync(path.dirname(res))
  return res
}

// TODO: 返回值
// HttpServer | {code: string, map: string}
// IBuildConfig
export default async function build (appPath: string, config: any): Promise<any> {
  process.env.TARO_ENV = PLATFORMS.RN
  // TODO:新增环境变量是否可以在metro构建过程中可以访问到？
  const entry = getRNConfigEntry()
  config.entry = entry
  const metroConfig = await getMetroConfig(config)
  const sourceRoot = config.sourceRoot || 'src'

  const commonOptions = {
    platform: config.deviceType,
    minify: process.env.NODE_ENV === 'production' || !config.isWatch,
    dev: config.isWatch
  }
  if (config.resetCache) {
    metroConfig.resetCache = config.resetCache
  }
  metroConfig.reporter = new TerminalReporter(entry, sourceRoot, metroConfig.cacheStores[0])
  if (config.isWatch) {
    if (!metroConfig.server || (metroConfig.server.useGlobalHotkey === undefined)) {
      if (!metroConfig.server) {
        metroConfig.server = {}
      }
      metroConfig.server.useGlobalHotkey = true
    }
    if (config.port) {
      metroConfig.server.port = config.port
    }

    const { middleware, attachToServer } = createDevServerMiddleware({
      port: metroConfig.server.port,
      watchFolders: metroConfig.watchFolders
    })
    metroConfig.server.enhanceMiddleware = (metroMiddleware, metroServer) => {
      metroConfig.reporter.metroServerInstance = metroServer

      // bundle路由只识别/index.bundle
      return middleware.use((req, res, next) => {
        // eslint-disable-next-line node/no-deprecated-api
        const urlObj = url.parse(req.url)
        if (/\/[^]+.bundle/.test(urlObj.pathname || '') && (urlObj.pathname || '').toLowerCase() !== '/index.bundle') {
          res.writeHead(400)
          res.end('Please access /index.bundle for entry bundling.')
        } else if (/^\/debugger-ui\//.test(urlObj.pathname || '')) {
          next()
        } else {
          metroMiddleware(req, res, next)
        }
      })
    }

    // 支持host
    return Metro.runServer(metroConfig, {
      ...commonOptions,
      hmrEnabled: true
    }).then(server => {
      console.log(`React-Native Dev server is running on port: ${metroConfig.server.port}`)
      console.log('\n\nTo reload the app press "r"\nTo open developer menu press "d"')

      const { messageSocket } = attachToServer(server)

      readline.emitKeypressEvents(process.stdin)
      process.stdin.setRawMode && process.stdin.setRawMode(true)
      process.stdin.on('keypress', (key, data) => {
        const { ctrl, name } = data
        if (name === 'r') {
          messageSocket.broadcast('reload')
          console.log('Reloading app...')
        } else if (name === 'd') {
          messageSocket.broadcast('devMenu')
          console.log('Opening developer menu...')
        } else if (ctrl && (name === 'c')) {
          process.exit()
        }
      })
      return server
    })
  } else {
    const options = {
      ...commonOptions,
      entry: './index',
      out: concatOutputFileName(config)
    }
    const savedBuildFunc = outputBundle.build
    outputBundle.build = async (packagerClient, requestOptions) => {
      const resolutionFn = await getResolveDependencyFn(packagerClient.getBundler().getBundler(), requestOptions.platform)
      requestOptions.entryFile = resolutionFn(metroConfig.projectRoot, requestOptions.entryFile)
      return savedBuildFunc(packagerClient, requestOptions)
    }

    const server = new Server(metroConfig)

    try {
      const requestOptions = {
        ...commonOptions,
        entryFile: options.entry,
        inlineSourceMap: false,
        createModuleIdFactory: metroConfig.serializer.createModuleIdFactory
      }
      const bundle = await outputBundle.build(server, requestOptions)
      const outputOptions = {
        ...commonOptions,
        bundleOutput: options.out
      }
      await outputBundle.save(bundle, outputOptions, console.log)

      // Save the assets of the bundle
      const outputAssets = await server.getAssets({
        ...Server.DEFAULT_BUNDLE_OPTIONS,
        ...requestOptions
      })
      return await saveAssets(outputAssets, options.platform, concatOutputAssetsDest(config))
    } finally {
      server.end()
    }
  }
}
