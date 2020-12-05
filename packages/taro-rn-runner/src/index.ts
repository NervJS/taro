import * as Metro from 'metro'
import getMetroConfig from './config'
import { PLATFORMS } from '@tarojs/helper'
import * as path from 'path'
import * as fse from 'fs-extra'
import * as url from 'url'

import * as readline from 'readline'
import { createDevServerMiddleware } from '@react-native-community/cli-server-api'
import { TerminalReporter } from './config/terminal-reporter'
import { getResolveDependencyFn } from 'metro/src/lib/transformHelpers'
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
  const res = path.join(config.outputRoot, output)
  fse.ensureDirSync(path.dirname(res))
  return res
}

// TODO: 返回值
// HttpServer | {code: string, map: string}
// IBuildConfig
export default async function build (appPath: string, config: any): Promise<any> {
  process.env.TARO_ENV = PLATFORMS.RN
  // TODO:新增环境变量是否可以在metro构建过程中可以访问到？
  const metroConfig = await getMetroConfig(config)
  const commonOptions = {
    platform: config.deviceType,
    minify: process.env.NODE_ENV === 'production' || !config.isWatch,
    dev: config.isWatch
  }
  metroConfig.resetCache = config.resetCache
  metroConfig.reporter = new TerminalReporter(config.entry, metroConfig.cacheStores[0])
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
      out: concatOutputFileName(config),
      output: outputBundle
    }
    const savedBuildFunc = outputBundle.build
    outputBundle.build = async (packagerClient, requestOptions) => {
      const resolutionFn = await getResolveDependencyFn(packagerClient.getBundler().getBundler(), requestOptions.platform)
      requestOptions.entryFile = resolutionFn(metroConfig.projectRoot, requestOptions.entryFile)
      return savedBuildFunc(packagerClient, requestOptions)
    }
    return Metro.runBuild(metroConfig, options)
  }
}
