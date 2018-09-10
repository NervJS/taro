import * as t from 'babel-types'
import { parseWXML } from './wxml'
import { parseScript } from './script'

interface Option {
  json?: string,
  script: string,
  wxml: string
}

export function parse (option: Option): t.File {
  const wxml = parseWXML(option.wxml)
  return parseScript(option.script, wxml as t.Expression)
}
