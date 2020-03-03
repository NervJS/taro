import * as t from 'babel-types'
import { parseWXML } from './wxml'
import { parseScript } from './script'
import { errors, resetGlobals, THIRD_PARTY_COMPONENTS } from './global'
import { setting } from './utils'

interface Option {
  json?: string,
  script?: string,
  wxml?: string,
  path: string
  rootPath: string
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
  const { wxml, wxses, imports, refIds } = parseWXML(option.path, option.wxml)
  setting.sourceCode = option.script!
  const ast = parseScript(option.script, wxml as t.Expression, wxses, refIds)
  return {
    ast,
    imports,
    errors
  }
}
