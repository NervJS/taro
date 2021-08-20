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

import { REG_VUE, chalk } from '@tarojs/helper'
import { toCamelCase, internalComponents, capitalize } from '@tarojs/shared'
import { componentConfig } from '../template/component'

const CUSTOM_WRAPPER = 'custom-wrapper'

export function customVueChain (chain) {
  let vueLoaderPath: string
  try {
    vueLoaderPath = require.resolve('vue-loader', {
      paths: [process.cwd()]
    })
  } catch (error) {
    console.log(chalk.yellow('找不到 vue-loader，请先安装。'))
    process.exit(1)
  }

  const { VueLoaderPlugin } = require(vueLoaderPath)

  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  chain.module
    .rule('vue')
    .test(REG_VUE)
    .use('vueLoader')
    .loader(vueLoaderPath)
    .options({
      optimizeSSR: false,
      transformAssetUrls: {
        video: ['src', 'poster'],
        'live-player': 'src',
        audio: 'src',
        source: 'src',
        image: 'src',
        'cover-image': 'src'
      },
      compilerOptions: {
        whitespace: 'condense',
        modules: [{
          preTransformNode (el) {
            const nodeName = el.tag
            if (capitalize(toCamelCase(nodeName)) in internalComponents) {
              componentConfig.includes.add(nodeName)
            }

            if (nodeName === CUSTOM_WRAPPER) {
              componentConfig.thirdPartyComponents.set(CUSTOM_WRAPPER, new Set())
            }

            const usingComponent = componentConfig.thirdPartyComponents.get(nodeName)
            if (usingComponent != null) {
              el.attrsList
                .filter(a => !a.dynamic)
                .forEach(a => usingComponent.add(a.name.startsWith(':') ? a.name.slice(1) : a.name))
            }

            return el
          }
        }]
      }
    })
}
