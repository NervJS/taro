import multiPlatformPlugin from '../common/multi-platform-plugin'
import assetsPlugin from './assets'
import configPlugin from './config'
import emitPlugin from './emit'
import entryPlugin from './entry'
import nativeSupportPlugin from './native-support'
import pagePlugin from './page'
import pipelinePlugin from './pipeline'

import type { PluginOption } from 'vite'
import type { MiniBuildConfig } from '../utils/types'

export default function (appPath: string, taroConfig: MiniBuildConfig): PluginOption[] {
  return [
    pipelinePlugin(appPath, taroConfig),
    configPlugin(appPath, taroConfig),
    entryPlugin(),
    pagePlugin(),
    multiPlatformPlugin(taroConfig),
    nativeSupportPlugin(taroConfig),
    assetsPlugin(taroConfig),
    emitPlugin()
  ]
}
