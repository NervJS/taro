import saveAssets from '@react-native-community/cli-plugin-metro/build/commands/bundle/saveAssets'
import { createDevServerMiddleware } from '@react-native-community/cli-server-api'
import { PLATFORMS } from '@tarojs/helper'
import * as fse from 'fs-extra'
import * as Metro from 'metro'
import { getResolveDependencyFn } from 'metro/src/lib/transformHelpers'
import * as Server from 'metro/src/Server'
import * as outputBundle from 'metro/src/shared/output/bundle'
import * as path from 'path'
import * as qr from 'qrcode-terminal'
import * as readline from 'readline'
import * as url from 'url'

import getMetroConfig from './config'
import buildComponent from './config/build-component'
import { getRNConfigEntry } from './config/config-holder'
import preview from './config/preview'
import { TerminalReporter } from './config/terminal-reporter'
import { getOpenHost, isWin, PLAYGROUNDINFO } from './utils'

function concatOutputFileName (config: any): string {
  // 优先级：--bundle-output > config.output > config.outputRoot
  let output = path.join(config.outputRoot, 'index.bundle')
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
  if (config.bundleOutput) {
    output = config.bundleOutput
  }
  const res = path.isAbsolute(output) ? output : path.join('.', output)
  fse.ensureDirSync(path.dirname(res))
  return res
}

function concatOutputAssetsDest (config: any): string | undefined {
  // 优先级：--assets-dest > config.output > config.outputRoot
  let assetDest
  if (!config?.deviceType || !config?.output) {
    assetDest = config.outputRoot
  } else {
    assetDest = config.deviceType === 'ios' ? config.output.iosAssetsDest : config.output.androidAssetsDest
  }
  if (config.assetsDest) {
    assetDest = config.assetsDest
  }
  if (!assetDest) return undefined
  const res = path.isAbsolute(assetDest) ? assetDest : path.join('.', assetDest)
  fse.ensureDirSync(path.dirname(res))
  return res
}

function getOutputSourceMapOption (config: any): Record<string, any> {
  if (!config?.deviceType) {
    return {}
  }
  const isIos = config.deviceType === 'ios'
  const sourceMapUrl = config.sourceMapUrl || (isIos ? config?.output?.iosSourceMapUrl : config?.output?.androidSourceMapUrl)
  const sourcemapOutput = config.sourcemapOutput || (isIos ? config?.output?.iosSourcemapOutput : config?.output?.androidSourcemapOutput)
  const sourcemapSourcesRoot = config.sourcemapSourcesRoot || (isIos ? config?.output?.iosSourcemapSourcesRoot : config?.output?.androidSourcemapSourcesRoot)
  sourcemapOutput && fse.ensureDirSync(path.dirname(sourcemapOutput))
  return {
    sourceMapUrl,
    sourcemapOutput,
    sourcemapSourcesRoot
  }
}

// TODO: 返回值
// HttpServer | {code: string, map: string}
// IBuildConfig
export default async function build (_appPath: string, config: any): Promise<any> {
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
  if (config.publicPath) {
    metroConfig.transformer.publicPath = config.publicPath
  }
  metroConfig.reporter = new TerminalReporter(entry, sourceRoot, metroConfig.cacheStores[0])

  const onFinish = function (error?) {
    if (typeof config.onBuildFinish === 'function') {
      config.onBuildFinish({
        error,
        isWatch: config.isWatch
      })
    }
    if (error instanceof Error) throw error
  }

  if (config.isBuildNativeComp) {
    return buildComponent(
      _appPath,
      config
    )
  } else if (config.isWatch) {
    if (!metroConfig.server || (metroConfig.server.useGlobalHotkey === undefined)) {
      if (!metroConfig.server) {
        metroConfig.server = {}
      }
      metroConfig.server.useGlobalHotkey = true
    }
    if (config.port) {
      metroConfig.server.port = config.port
    }

    const {
      middleware,
      messageSocketEndpoint,
      websocketEndpoints
    } = createDevServerMiddleware({
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
      hmrEnabled: true,
      websocketEndpoints
    }).then(server => {
      console.log(`React-Native Dev server is running on port: ${metroConfig.server.port}`)
      console.log('\n\nTo reload the app press "r"\nTo open developer menu press "d"\n')

      readline.emitKeypressEvents(process.stdin)
      process.stdin.setRawMode && process.stdin.setRawMode(true)
      process.stdin.on('keypress', (_key, data) => {
        const { ctrl, name } = data
        if (name === 'r') {
          messageSocketEndpoint.broadcast('reload')
          console.log('Reloading app...')
        } else if (name === 'd') {
          messageSocketEndpoint.broadcast('devMenu')
          console.log('Opening developer menu...')
        } else if (ctrl && (name === 'c')) {
          process.exit()
        }
      })

      if (config.qr) {
        const host = getOpenHost()
        if (host) {
          const url = `taro://${host}:${metroConfig.server.port}`
          console.log(PLAYGROUNDINFO)
          console.log(`print qrcode of '${url}':`)
          qr.generate(url, { small: !isWin })
        } else {
          console.log('print qrcode error: host not found.')
        }
      }
      onFinish(null)
      return server
    }).catch(e => {
      onFinish(e)
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
      // try for test case build_noWatch
      try {
        requestOptions.entryFile = resolutionFn(metroConfig.projectRoot, requestOptions.entryFile)
      } catch (e) {} // eslint-disable-line no-empty
      return savedBuildFunc(packagerClient, requestOptions)
    }

    const server = new Server(metroConfig)

    const sourceMapOption = getOutputSourceMapOption(config)

    try {
      const requestOptions = {
        ...commonOptions,
        ...sourceMapOption,
        entryFile: options.entry,
        inlineSourceMap: false,
        createModuleIdFactory: metroConfig.serializer.createModuleIdFactory
      }
      const bundle = await outputBundle.build(server, requestOptions)
      const outputOptions = {
        ...commonOptions,
        ...sourceMapOption,
        bundleOutput: options.out
      }
      await outputBundle.save(bundle, outputOptions, console.log)

      // Save the assets of the bundle
      const outputAssets = await server.getAssets({
        ...Server.DEFAULT_BUNDLE_OPTIONS,
        ...requestOptions
      })
      const assetsDest = concatOutputAssetsDest(config)
      return await saveAssets(outputAssets, options.platform, assetsDest).then(() => {
        if (config.qr) {
          preview({
            out: options.out,
            assetsDest,
            platform: options.platform
          })
        }
        onFinish(null)
      })
    } catch (e) {
      onFinish(e)
    } finally {
      server.end()
    }
  }
}
