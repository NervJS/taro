import * as path from 'path'
import * as fs from 'fs-extra'

import * as resolvePath from 'resolve'
import {
  isAliasPath,
  replaceAliasPath,
  resolveMainFilePath,
  NODE_MODULES_REG,
  promoteRelativePath
} from '@tarojs/helper'

import { IOption, IComponentObj } from './types'

export function isQuickAppPkg (name: string): boolean {
  return /^@(system|service)\.[a-zA-Z]{1,}/.test(name)
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
    let componentPath = component.path as string
    if (isAliasPath(componentPath, pathAlias)) {
      componentPath = replaceAliasPath(filePath, componentPath as string, pathAlias)
    }
    componentPath = resolveMainFilePath(path.resolve(filePath, '..', componentPath as string))
    if (fs.existsSync(componentPath)) {
      if (NODE_MODULES_REG.test(componentPath) && !NODE_MODULES_REG.test(filePath)) {
        componentPath = componentPath.replace(NODE_MODULES_REG, path.join(sourceDir, 'npm'))
      }
      componentPath = promoteRelativePath(path.relative(filePath, componentPath))
    } else {
      componentPath = component.path as string
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
