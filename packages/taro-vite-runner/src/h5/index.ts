import multiPlatformPlugin from '../common/multi-platform-plugin'
import configPlugin from './config'
import entryPlugin from './entry'
import pipelinePlugin from './pipeline'

import type { PluginOption } from 'vite'
import type { H5BuildConfig } from '../utils/types'

export default function (appPath: string, taroConfig: H5BuildConfig): PluginOption[] {
  return [
    pipelinePlugin(appPath, taroConfig),
    configPlugin(appPath, taroConfig),
    entryPlugin(),
    multiPlatformPlugin(taroConfig),
  ]
}
