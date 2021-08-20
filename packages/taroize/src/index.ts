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

import * as t from 'babel-types'
import { parseWXML } from './wxml'
import { parseScript } from './script'
import { errors, resetGlobals, THIRD_PARTY_COMPONENTS } from './global'
import { setting } from './utils'
import { parseVue } from './vue'

interface Option {
  json?: string,
  script?: string,
  wxml?: string,
  path: string
  rootPath: string,
  framework: 'react' | 'vue'
  isApp?: boolean
}

export function parse (option: Option) {
  resetGlobals()
  setting.rootPath = option.rootPath
  if (option.json) {
    const config = JSON.parse(option.json)
    const usingComponents = config.usingComponents
    if (usingComponents) {
      for (const key in usingComponents) {
        if (usingComponents.hasOwnProperty(key)) {
          THIRD_PARTY_COMPONENTS.add(key)
        }
      }
    }
  }

  if (option.framework === 'vue') {
    const result = parseVue(option.path, option.wxml || '', option.script)
    return {
      ...result,
      errors
    }
  }

  const { wxml, wxses, imports, refIds } = parseWXML(option.path, option.wxml)
  setting.sourceCode = option.script!
  const ast = parseScript(option.script, wxml as t.Expression, wxses, refIds, option.isApp)
  return {
    ast,
    imports,
    errors
  }
}
