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
import * as webpack from 'webpack'
import { DEFAULT_Components } from '../util/chain'
import type { RootNode, TemplateChildNode, ElementNode } from '@vue/compiler-core'

export function customVue3Chain (chain, config) {
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
  const { styleLoaderOption = {} } = config

  chain.resolve.alias
    .set('vue', '@vue/runtime-dom')

  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  chain
    .plugin('defined')
    .use(webpack.DefinePlugin, [{
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
    }])

  chain.module
    .rule('customStyle')
    .merge({
      use: [{
        loader: 'style-loader',
        options: styleLoaderOption
      }]
    })

  chain.module
    .rule('vue')
    .test(REG_VUE)
    .use('vueLoader')
    .loader(vueLoaderPath)
    .options({
      transformAssetUrls: {
        video: ['src', 'poster'],
        'live-player': 'src',
        audio: 'src',
        source: 'src',
        image: 'src',
        'cover-image': 'src',
        'taro-video': ['src', 'poster'],
        'taro-live-player': 'src',
        'taro-audio': 'src',
        'taro-source': 'src',
        'taro-image': 'src',
        'taro-cover-image': 'src'
      },
      compilerOptions: {
        // https://github.com/vuejs/vue-next/blob/master/packages/compiler-core/src/options.ts
        nodeTransforms: [(node: RootNode | TemplateChildNode) => {
          if (node.type === 1 /* ELEMENT */) {
            node = node as ElementNode
            const nodeName = node.tag
            if (DEFAULT_Components.has(nodeName)) {
              node.tag = `taro-${nodeName}`
              node.tagType = 1 /* 0: ELEMENT, 1: COMPONENT */
            }
          }
        }]
      }
    })
}
