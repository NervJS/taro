import * as t from 'babel-types'
import { parseWXML } from './wxml'
import { parseScript } from './script'
import { parseJSON } from './json'

interface Option {
  json?: string,
  script?: string,
  wxml?: string
}

export function parse (option: Option): t.File {
  const wxml = parseWXML(option.wxml)
  const json = parseJSON(option.json)
  return parseScript(option.script, wxml as t.Expression, json)
}
