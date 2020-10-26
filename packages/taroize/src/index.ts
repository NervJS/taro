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
  const ast = parseScript(option.script, wxml as t.Expression, wxses, refIds)
  return {
    ast,
    imports,
    errors
  }
}
