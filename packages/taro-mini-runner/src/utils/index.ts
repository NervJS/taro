import * as path from 'path'
import * as fs from 'fs-extra'

import * as resolvePath from 'resolve'
import * as t from 'babel-types'
import { CONFIG_MAP, isAliasPath, replaceAliasPath, resolveMainFilePath, NODE_MODULES_REG, promoteRelativePath } from '@tarojs/runner-utils'

import { IOption, IComponentObj } from './types'

export function isQuickAppPkg (name: string): boolean {
  return /^@(system|service)\.[a-zA-Z]{1,}/.test(name)
}

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
  if (node.type === 'ArrayExpression') {
    return node.elements.map(item => traverseObjectNode(item, buildAdapter))
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
    componentPath = resolveMainFilePath(path.resolve(filePath, '..', componentPath as string))
    if (fs.existsSync(componentPath)) {
      if (NODE_MODULES_REG.test(componentPath) && !NODE_MODULES_REG.test(filePath)) {
        componentPath = componentPath.replace(NODE_MODULES_REG, path.join(sourceDir, 'npm'))
      }
      componentPath = promoteRelativePath(path.relative(filePath, componentPath))
    } else {
      componentPath = component.path
    }
    if (component.name) {
      usingComponents[component.name] = (componentPath as string).replace(path.extname(componentPath as string), '')
    }
  }
  return Object.assign({}, isComponent ? { component: true } : { usingComponents: {} }, components.length ? {
    usingComponents
  } : {})
}
const npmCached = {}
export function resolveNpmSync (pkgName: string, root): string | null {
  try {
    if (!npmCached[pkgName]) {
      return resolvePath.sync(pkgName, { basedir: root })
    }
    return npmCached[pkgName]
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      throw new Error(`包 ${pkgName} 未安装`)
    }
    return null
  }
}
