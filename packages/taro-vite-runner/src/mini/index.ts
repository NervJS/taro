import configPlugin from './config'
import emitPlugin from './emit'
import entryPlugin from './entry'
import pagePlugin from './page'
import pipelinePlugin from './pipeline'

import type { PluginOption } from 'vite'
import type { MiniBuildConfig } from '../utils/types'

export default function (appPath: string, taroConfig: MiniBuildConfig): PluginOption[] {
  return [
    pipelinePlugin(appPath, taroConfig),
    configPlugin(taroConfig),
    entryPlugin(),
    pagePlugin(),
    emitPlugin()
  ]
}
