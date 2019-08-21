import * as t from 'babel-types'
import { parseWXML } from './wxml'
import { parseScript } from './script'
import { parseJSON } from './json'
import { errors, resetGlobals, THIRD_PARTY_COMPONENTS } from './global'
import { setting, getUniqImports } from './utils'

interface Option {
  json?: string,
  script?: string,
  wxml?: string,
  path: string
}

export function parse (option: Option) {
  resetGlobals()
  if (option.json) {
    const config = JSON.parse(option.json)
    const usingComponents = config['usingComponents']
    if (usingComponents) {
      for (const key in usingComponents) {
        if (usingComponents.hasOwnProperty(key)) {
          THIRD_PARTY_COMPONENTS.add(key)
        }
      }
    }
  }
  const { wxml, wxses, imports, refIds } = parseWXML(option.path, option.wxml)
  const uniqImports = getUniqImports(imports)
  const json = parseJSON(option.json)
  setting.sourceCode = option.script!
  const ast = parseScript(option.script, wxml as t.Expression, json, wxses, refIds)
  return {
    ast,
    uniqImports,
    errors
  }
}
