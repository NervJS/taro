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
import { normalizePath } from '@tarojs/helper'

import { frameworkMeta } from './utils'

export default function (this: webpack.loader.LoaderContext) {
  const stringify = (s: string): string => stringifyRequest(this, s)

  const options = getOptions(this)
  const { importFrameworkStatement, frameworkArgs, creator } = frameworkMeta[options.framework]
  const config = JSON.stringify(options.config)
  const blended = options.blended
  const pxTransformConfig = options.pxTransformConfig
  const loaders = this.loaders
  const thisLoaderIndex = loaders.findIndex(item => normalizePath(item.path).indexOf('@tarojs/taro-loader') >= 0)

  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`

  const runtimePath = Array.isArray(options.runtimePath) ? options.runtimePath : [options.runtimePath]
  const setReconciler = runtimePath.reduce((res, item) => {
    return res + `import '${item}'\n`
  }, '')

  const createApp = `${creator}(component, ${frameworkArgs})`

  const instantiateApp = blended
    ? `
var app = ${createApp}
app.onLaunch()
exports.taroApp = app
`
    : `var inst = App(${createApp})`

  return `${setReconciler}
import { ${creator}, window } from '@tarojs/runtime'
import { initPxTransform } from '@tarojs/taro'
import component from ${stringify(this.request.split('!').slice(thisLoaderIndex + 1).join('!'))}
${importFrameworkStatement}
var config = ${config};
window.__taroAppConfig = config
${instantiateApp}
${options.prerender ? prerender : ''}
initPxTransform({
  designWidth: ${pxTransformConfig.designWidth},
  deviceRatio: ${JSON.stringify(pxTransformConfig.deviceRatio)}
})
`
}
