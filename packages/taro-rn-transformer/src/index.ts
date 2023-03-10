/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import * as path from 'path'

import appLoader, { getAppConfig, getAppPages } from './app'
import componentLoader from './component'
import { globalAny, TransformType } from './types/index'
import { getCommonStyle, isNPMComponent, isPageFile, isSourceComponent } from './utils'

export function transform ({ src, filename, options }: TransformType) {
  let code = src
  const sourceDir = options?.sourceRoot || 'src'
  const entryName = options?.entry || 'app'
  const appPath = path.join(options.projectRoot, sourceDir, entryName)
  const basePath = path.join(options.projectRoot, sourceDir)
  // metro 起了多个 worker，内存不共享，每个 worker 需要去解析数据存在内存里面，内存有则不解析
  globalAny.__taroCommonStyle = globalAny.__taroCommonStyle || getCommonStyle(appPath, basePath)
  if (!globalAny.__taroAppPages) {
    const pages = getAppPages(appPath)
    globalAny.__taroAppPages = pages.map(item => sourceDir + item)
  }

  if (options.isEntryFile(filename)) {
    code = appLoader({
      filename: filename,
      projectRoot: options.projectRoot,
      sourceDir: sourceDir,
      appName: options.appName || 'taroDemo',
      entryName: entryName,
      designWidth: options?.designWidth || 750,
      deviceRatio: options?.deviceRatio || {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
      }
    })
  } else if (isPageFile(filename, sourceDir) || isSourceComponent(filename, code, sourceDir) || isNPMComponent(filename, code, options?.rn)) {
    code = componentLoader({
      projectRoot: options.projectRoot,
      sourceCode: src,
      sourceDir: sourceDir,
      filename
    })
  }

  return options.nextTransformer({
    src: code,
    filename: filename,
    options: options
  })
}

module.exports.getAppConfig = getAppConfig
