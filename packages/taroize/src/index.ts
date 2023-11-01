import * as t from '@babel/types'

import { errors, resetGlobals, THIRD_PARTY_COMPONENTS } from './global'
import { parseScript } from './script'
import { setting } from './utils'
import { parseVue } from './vue'
import { parseWXML } from './wxml'

interface Option {
  json?: string
  script?: string
  scriptPath?: string
  wxml?: string
  path: string
  rootPath: string
  framework: 'react' | 'vue'
  isApp?: boolean
  logFilePath: string
}

export function parse (option: Option) {
  resetGlobals(option.rootPath, option.logFilePath)
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
      errors,
    }
  }

  const { wxml, wxses, imports, refIds } = parseWXML(option.path, option.wxml)
  setting.sourceCode = option.script!
  const ast = parseScript(option.script, option.scriptPath, wxml as t.Expression, wxses, refIds, option.isApp)

  return {
    ast,
    imports,
    errors,
  }
}
