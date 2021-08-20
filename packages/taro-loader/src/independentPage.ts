/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import * as path from 'path'
import { frameworkMeta } from './utils'

interface PageConfig {
  content: any
  path: string
}

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const config = getPageConfig(options.config, this.resourcePath)
  const configString = JSON.stringify(config)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const {
    isNeedRawLoader,
    importFrameworkStatement,
    mockAppStatement,
    frameworkArgs,
    creator
  } = frameworkMeta[options.framework]
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
  const setReconciler = runtimePath.reduce((res, item) => {
    return res + `import '${item}'\n`
  }, '')
  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`
  return `${setReconciler}
import { createPageConfig, ${creator}, window } from '@tarojs/runtime'
import component from ${stringify(componentPath)}
${importFrameworkStatement}
var config = ${configString};
var appConfig = ${JSON.stringify(appConfig)};
window.__taroAppConfig = appConfig
${mockAppStatement}
${creator}(App, ${frameworkArgsCopy})
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
