import * as t from 'babel-types'
import { parseWXML } from './wxml'
import { parseScript } from './script'
import { parseJSON } from './json'
import { errors } from './global'

interface Option {
  json?: string,
  script?: string,
  wxml?: string,
  path: string
}

export function parse (option: Option) {
  const { wxml, wxses, imports } = parseWXML(option.path, option.wxml)
  const json = parseJSON(option.json)
  const ast = parseScript(option.script, wxml as t.Expression, json, wxses)
  return {
    ast,
    imports,
    errors
  }
}
