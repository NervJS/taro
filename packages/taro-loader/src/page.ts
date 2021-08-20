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
import * as path from 'path'
import * as acorn from 'acorn'
import * as walk from 'acorn-walk'
import { frameworkMeta } from './utils'

interface PageConfig {
  content: any
  path: string
}

export default function (this: webpack.loader.LoaderContext, source: string) {
  const options = getOptions(this)
  const { framework, config: loaderConfig } = options
  const config = getPageConfig(loaderConfig, this.resourcePath)
  const configString = JSON.stringify(config)
  const stringify = (s: string): string => stringifyRequest(this, s)
  const { isNeedRawLoader } = frameworkMeta[framework]
  // raw is a placeholder loader to locate changed .vue resource
  const raw = path.join(__dirname, 'raw.js')
  const loaders = this.loaders
  const thisLoaderIndex = loaders.findIndex(item => normalizePath(item.path).indexOf('@tarojs/taro-loader/lib/page') >= 0)
  const componentPath = isNeedRawLoader
    ? `${raw}!${this.resourcePath}`
    : this.request.split('!').slice(thisLoaderIndex + 1).join('!')
  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`

  if (framework === 'react' || framework === 'nerv') {
    Object.assign(config, addConfig(source))
  }

  return `import { createPageConfig } from '@tarojs/runtime'
import component from ${stringify(componentPath)}
var config = ${configString};
${config.enableShareTimeline ? 'component.enableShareTimeline = true' : ''}
${config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : ''}
var inst = Page(createPageConfig(component, '${options.name}', {root:{cn:[]}}, config || {}))
${options.prerender ? prerender : ''}
`
}

export function getPageConfig (configs: Record<string, PageConfig>, resourcePath: string) {
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

function addConfig (source) {
  const configsMap = {
    enableShareAppMessage: ['onShareAppMessage', 'useShareAppMessage'],
    enableShareTimeline: ['onShareTimeline', 'useShareTimeline']
  }
  const ast = acorn.parse(source, {
    ecmaVersion: 'latest',
    sourceType: 'module'
  })

  const additionConfig: Record<string, any> = {}

  function check (name: string) {
    Object.keys(configsMap).forEach(configName => {
      const apis: string[] = configsMap[configName]
      if (apis.includes(name)) {
        additionConfig[configName] = true
      }
    })
  }

  walk.simple(ast, {
    FunctionExpression (node: any) {
      if (!node.id || !node.id.name) return
      check(node.id.name)
    },
    FunctionDeclaration (node: any) {
      if (!node.id || !node.id.name) return
      check(node.id.name)
    },
    CallExpression (node: any) {
      const { callee } = node
      if (callee.type === 'Identifier') {
        check(callee.name)
      } else if (callee.type === 'MemberExpression') {
        if (callee.property.type === 'Identifier') {
          check(callee.property.name)
        } else if (callee.property.type === 'Literal') {
          check(callee.property.value)
        }
      }
    }
  })

  return additionConfig
}
