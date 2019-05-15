import * as path from 'path'
import * as fs from 'fs-extra'

import * as t from 'babel-types'

import { CONFIG_MAP, JS_EXT, TS_EXT } from './constants'

export function traverseObjectNode (node, buildAdapter: string, parentKey?: string) {
  if (node.type === 'ClassProperty' || node.type === 'ObjectProperty') {
    const properties = node.value.properties
    const obj = {}
    properties.forEach(p => {
      let key = t.isIdentifier(p.key) ? p.key.name : p.key.value
      if (CONFIG_MAP[buildAdapter][key] === false) {
        return
      }
      if (parentKey !== 'usingComponents' && CONFIG_MAP[buildAdapter][key]) {
        key = CONFIG_MAP[buildAdapter][key]
      }
      obj[key] = traverseObjectNode(p.value, buildAdapter, key)
    })
    return obj
  }
  if (node.type === 'ObjectExpression') {
    const properties = node.properties
    const obj= {}
    properties.forEach(p => {
      let key = t.isIdentifier(p.key) ? p.key.name : p.key.value
      if (CONFIG_MAP[buildAdapter][key] === false) {
        return
      }
      if (parentKey !== 'usingComponents' && CONFIG_MAP[buildAdapter][key]) {
        key = CONFIG_MAP[buildAdapter][key]
      }
      obj[key] = traverseObjectNode(p.value, buildAdapter, key)
    })
    return obj
  }
  if (node.type === 'ArrayExpression') {
    return node.elements.map(item => traverseObjectNode(item, buildAdapter))
  }
  if (node.type === 'NullLiteral') {
    return null
  }
  return node.value
}

export function resolveScriptPath (p: string): string {
  const realPath = p
  const taroEnv = process.env.TARO_ENV
  const SCRIPT_EXT = JS_EXT.concat(TS_EXT)
  for (let i = 0; i < SCRIPT_EXT.length; i++) {
    const item = SCRIPT_EXT[i]
    if (taroEnv) {
      if (fs.existsSync(`${p}.${taroEnv}${item}`)) {
        return `${p}.${taroEnv}${item}`
      }
      if (fs.existsSync(`${p}${path.sep}index.${taroEnv}${item}`)) {
        return `${p}${path.sep}index.${taroEnv}${item}`
      }
      if (fs.existsSync(`${p.replace(/\/index$/, `.${taroEnv}/index`)}${item}`)) {
        return `${p.replace(/\/index$/, `.${taroEnv}/index`)}${item}`
      }
    }
    if (fs.existsSync(`${p}${item}`)) {
      return `${p}${item}`
    }
    if (fs.existsSync(`${p}${path.sep}index${item}`)) {
      return `${p}${path.sep}index${item}`
    }
  }
  return realPath
}
