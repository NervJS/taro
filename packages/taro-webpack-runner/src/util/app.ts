/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
