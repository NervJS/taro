import * as t from 'babel-types'
import { parseWXML } from './wxml'
import { parseScript } from './script'
import { parseJSON } from './json'
import { errors, resetGlobals } from './global'
import { setting } from './utils'

interface Option {
  json?: string,
  script?: string,
  wxml?: string,
  path: string
}

export function parse (option: Option) {
  resetGlobals()
  const { wxml, wxses, imports, refIds } = parseWXML(option.path, option.wxml)
  const json = parseJSON(option.json)
  setting.sourceCode = option.script!
  const ast = parseScript(option.script, wxml as t.Expression, json, wxses, refIds)
  return {
    ast,
    imports,
    errors
  }
}
