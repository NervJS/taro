import { isEmptyObject, readConfig, resolveMainFilePath, SCRIPT_EXT } from '@tarojs/helper'
import * as path from 'path'
import { Entry, EntryFunc } from 'webpack'

export function getConfigFilePath (filePath: string) {
  return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
}

export function getAppConfig (appEntry: string) {
  const appConfigPath = getConfigFilePath(appEntry)
  const appConfig = readConfig(appConfigPath)
  if (isEmptyObject(appConfig)) {
    throw new Error('缺少 app 全局配置，请检查！')
  }

  return appConfig
}

export async function getAppEntry (entry: string | string[] | Entry | EntryFunc = {}, entryFileName = 'app') {
  if (typeof entry === 'function') {
    return getAppEntry(await entry(), entryFileName)
  } else if (Array.isArray(entry) || typeof entry === 'string') {
    return getAppEntry({ entryFileName: entry }, entryFileName)
  }
  const app = entry[entryFileName]
  if (Array.isArray(app)) {
    return app.filter(item => path.basename(item, path.extname(item)) === entryFileName)[0]
  }
  return app
}

export function getPages (appPages?: string[], sourceDir = '', frameworkExts: string[] = SCRIPT_EXT) {
  if (!appPages || !appPages.length) {
    throw new Error('全局配置缺少 pages 字段，请检查！')
  }
  return new Set([
    ...appPages.map(item => ({
      name: item,
      path: resolveMainFilePath(path.join(sourceDir, item), frameworkExts)
    }))
  ])
}
