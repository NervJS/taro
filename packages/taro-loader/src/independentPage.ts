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

import { getOptions, stringifyRequest } from 'loader-utils'
import * as path from 'path'

import { REG_POST } from './constants'

import type * as webpack from 'webpack'

interface PageConfig {
  content: any
  path: string
}

export default function (this: webpack.LoaderContext<any>) {
  const options = getOptions(this)
  const config = getPageConfig(options.config, this.resourcePath)
  const configString = JSON.stringify(config)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const {
    isNeedRawLoader,
    importFrameworkStatement,
    mockAppStatement,
    frameworkArgs,
    creator,
    creatorLocation
  } = options.loaderMeta
  const appConfig = options.appConfig
  const frameworkArgsArray = frameworkArgs.split(',')
  frameworkArgsArray.splice(frameworkArgsArray.length - 1, 1, 'appConfig')
  const frameworkArgsCopy = frameworkArgsArray.join(',')
  // raw is a placeholder loader to locate changed .vue resource
  const raw = path.join(__dirname, 'raw.js')
  const componentPath = isNeedRawLoader
    ? `${raw}!${this.resourcePath}`
    : this.request.split('!').slice(1).join('!')
  const runtimePath = Array.isArray(options.runtimePath) ? options.runtimePath : [options.runtimePath]
  let setReconcilerPost = ''
  const setReconciler = runtimePath.reduce((res, item) => {
    if (REG_POST.test(item)) {
      setReconcilerPost += `import '${item.replace(REG_POST, '')}'\n`
      return res
    } else {
      return res + `import '${item}'\n`
    }
  }, '')
  const { globalObject } = this._compilation?.outputOptions || { globalObject: 'wx' }

  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  ${globalObject}._prerender = inst
}`
  return `${setReconciler}
import { createPageConfig, window } from '@tarojs/runtime'
import { ${creator} } from '${creatorLocation}'
${setReconcilerPost}
${importFrameworkStatement}
var config = ${configString};
var appConfig = ${JSON.stringify(appConfig)};
window.__taroAppConfig = appConfig
${mockAppStatement}
${creator}(App, ${frameworkArgsCopy})
var component = require(${stringify(componentPath)}).default
${config.enableShareTimeline ? 'component.enableShareTimeline = true' : ''}
${config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : ''}
var inst = Page(createPageConfig(component, '${options.name}', {}, config || {}))
${options.prerender ? prerender : ''}
`
}

function getPageConfig (configs: Record<string, PageConfig>, resourcePath: string) {
  const configPath = removeExt(resourcePath) + '.config'
  for (const name in configs) {
    const config = configs[name]
    if (removeExt(configs[name].path) === configPath) {
      return config.content
    }
  }
  return {}
}

function removeExt (file: string) {
  return path.join(path.dirname(file), path.basename(file, path.extname(file)))
}
