import * as path from 'path'
import * as fs from 'fs-extra'

import * as t from 'babel-types'
import {
  NODE_MODULES_REG,
  isAliasPath,
  replaceAliasPath,
  resolveScriptPath,
  promoteRelativePath
} from '@tarojs/helper'

import {
  GLOBAL_PROPS
} from './constants'
import { IOption, IComponentObj } from './types'

export function traverseObjectNode (node) {
  if (node.type === 'ClassProperty' || node.type === 'ObjectProperty') {
    const properties = node.value.properties
    const obj = {}
    properties.forEach(p => {
      let key = t.isIdentifier(p.key) ? p.key.name : p.key.value
      obj[key] = traverseObjectNode(p.value)
    })
    return obj
  }
  if (node.type === 'ObjectExpression') {
    const properties = node.properties
    const obj= {}
    properties.forEach(p => {
      let key = t.isIdentifier(p.key) ? p.key.name : p.key.value
      obj[key] = traverseObjectNode(p.value)
    })
    return obj
  }
  if (node.type === 'ArrayExpression') {
    return node.elements.map(item => traverseObjectNode(item))
  }
  if (node.type === 'NullLiteral') {
    return null
  }
  return node.value
}

export function buildUsingComponents (
  filePath: string,
  sourceDir: string,
  pathAlias: IOption,
  components: IComponentObj[],
  isComponent?: boolean
): IOption {
  const usingComponents = Object.create(null)
  for (const component of components) {
    let componentPath = component.path
    if (isAliasPath(componentPath as string, pathAlias)) {
      componentPath = replaceAliasPath(filePath, componentPath as string, pathAlias)
    }
    componentPath = resolveScriptPath(path.resolve(filePath, '..', componentPath as string))
    if (fs.existsSync(componentPath)) {
      if (NODE_MODULES_REG.test(componentPath) && !NODE_MODULES_REG.test(filePath)) {
        componentPath = componentPath!.replace(NODE_MODULES_REG, path.join(sourceDir, 'npm'))
      }
      componentPath = promoteRelativePath(path.relative(filePath, componentPath!))
    } else {
      componentPath = component.path
    }
    if (component.name) {
      const componentName = component.name.split('|')[0]
      usingComponents[componentName] = (componentPath as string).replace(path.extname(componentPath as string), '')
    }
  }
  return Object.assign({}, isComponent ? { component: true } : { usingComponents: {} }, components.length ? {
    usingComponents
  } : {})
}

export function removeHeadSlash (str: string) {
  return str.replace(/^(\/|\\)/, '')
}

export function npmCodeHack (filePath: string, content: string): string {
  // 修正core-js目录 _global.js
  // 修正所有用到过lodash的第三方包
  // 注：@tarojs/taro-alipay/dist/index.js,@tarojs/taro/dist/index.esm.js里面也有lodash相关的代码
  content = content && content.replace(/(\|\||:)\s*Function\(['"]return this['"]\)\(\)/g, function (match, first, second) {
    return `${first} ${GLOBAL_PROPS}`
  })

  const basename = path.basename(filePath)
  switch (basename) {
    case 'mobx.js':
      // 解决支付宝小程序全局window或global不存在的问题
      content = content.replace(
        /typeof window\s{0,}!==\s{0,}['"]undefined['"]\s{0,}\?\s{0,}window\s{0,}:\s{0,}global/,
        'typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}'
      )
      break
    case '_html.js':
      content = 'module.exports = false;'
      break
    case '_microtask.js':
      content = content.replace('if(Observer)', 'if(false && Observer)')
      // IOS 1.10.2 Promise BUG
      content = content.replace('Promise && Promise.resolve', 'false && Promise && Promise.resolve')
      break
  }
  return content
}
