import { BUILD_TYPES } from '../util/constants'
import { IMiniAppBuildConfig } from '../util/types'

import {
  getBuildData,
  setIsProduction,
  setBuildAdapter,
  setAppConfig
} from './helper'
import { copyFiles } from '../util'

import { buildEntry } from './entry'

export async function build ({ watch, adapter = BUILD_TYPES.QUICKAPP }: IMiniAppBuildConfig) {
  const { projectConfig, appPath } = getBuildData()
  process.env.TARO_ENV = adapter
  setIsProduction(process.env.NODE_ENV === 'production' || !watch)
  setBuildAdapter(adapter)
  copyFiles(appPath, projectConfig.copy)
  const appConfig = await buildEntry()
  // setAppConfig(appConfig)
}
