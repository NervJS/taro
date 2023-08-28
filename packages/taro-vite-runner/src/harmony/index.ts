import multiPlatformPlugin from '../common/multi-platform-plugin'
import importPlugin from './babel'
import configPlugin from './config'
import emitPlugin from './emit'
import entryPlugin from './entry'
import etsPlugin from './ets'
import pagePlugin from './page'
import pipelinePlugin from './pipeline'

import type { PluginOption } from 'vite'
import type { HarmonyBuildConfig } from '../utils/types'

export default function (appPath: string, taroConfig: HarmonyBuildConfig): PluginOption[] {
  return [
    pipelinePlugin(appPath, taroConfig),
    configPlugin(appPath, taroConfig),
    entryPlugin(),
    pagePlugin(),
    etsPlugin(appPath, taroConfig),
    multiPlatformPlugin(taroConfig),
    emitPlugin(),
    importPlugin()
  ]
}
