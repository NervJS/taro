import { babelKit } from '@tarojs/helper'

import { ConfigModificationState, ModifyCallback } from '../create/page'

import type { ArrayExpression, ExportDefaultDeclaration, Node, ObjectExpression, ObjectProperty } from '@babel/types'
import type { NodePath } from 'babel__traverse'

const t = babelKit.types

// undefined means absent; null means the effective property cannot be safely resolved.
const getObjectProperty = (node: Node | null | undefined, name: string): ObjectProperty | null | undefined => {
  if (node?.type !== 'ObjectExpression') return null
  for (let index = node.properties.length - 1; index >= 0; index--) {
    const property = node.properties[index]
    if (property.type === 'SpreadElement' || property.computed) return null
    if (t.isIdentifier(property.key, { name }) || t.isStringLiteral(property.key, { value: name })) {
      return property.type === 'ObjectProperty' ? property : null
    }
  }
}

const generateNewSubPackageItem = (subPackage: string) => {
  const pageObject = t.objectProperty(t.identifier('pages'), t.arrayExpression([]))
  const subPkgRootObject = t.objectProperty(t.identifier('root'), t.stringLiteral(subPackage))
  const subPkgItemObject = t.objectExpression([subPkgRootObject, pageObject])
  return subPkgItemObject
}

const isValidSubPkgObject = (subPkgObject: ObjectExpression) => {
  const rootProperty = getObjectProperty(subPkgObject, 'root')
  const pagesProperty = getObjectProperty(subPkgObject, 'pages')
  const rootPropertyValueType = rootProperty?.value?.type
  const pagesPropertyValueType = pagesProperty?.value?.type
  return rootPropertyValueType === 'StringLiteral' && pagesPropertyValueType === 'ArrayExpression'
}

const addNewSubPackage = (node: ObjectExpression, page: string, subPackage: string): ConfigModificationState => {
  if (!t.isObjectExpression(node)) return ConfigModificationState.Fail
  let subPackages = getObjectProperty(node, 'subPackages')
  if (subPackages === null) return ConfigModificationState.Fail
  if (!subPackages) {
  // config 文件不存在 subPackages 字段的情况，给该字段赋予默认值
    const subPkgObject = t.objectProperty(t.identifier('subPackages'), t.arrayExpression([]))
    subPackages = subPkgObject
    node?.properties.push(subPkgObject)
  }
  const value = subPackages?.value

  // 文件格式不对的情况
  if (!value || value?.type !== 'ArrayExpression') return ConfigModificationState.Fail
  let targetSubPkgObject: ObjectExpression | undefined
  for (const element of value.elements) {
    const rootProperty = getObjectProperty(element, 'root')
    if (rootProperty === null) return ConfigModificationState.Fail
    if (!rootProperty) continue
    if (rootProperty.value.type !== 'StringLiteral') return ConfigModificationState.Fail
    if (rootProperty.value.value === subPackage && element?.type === 'ObjectExpression') {
      targetSubPkgObject = element
      break
    }
  }

  if (!targetSubPkgObject) {
    // 不存在 当前分包配置对象的情况
    const subPkgItemObject = generateNewSubPackageItem(subPackage)
    targetSubPkgObject = subPkgItemObject
    value.elements.push(subPkgItemObject)
  }

  if (!targetSubPkgObject || targetSubPkgObject.type !== 'ObjectExpression' || !isValidSubPkgObject(targetSubPkgObject)) return ConfigModificationState.Fail
  const pagesProperty = getObjectProperty(targetSubPkgObject, 'pages')!
  const currentPages = (pagesProperty.value as ArrayExpression).elements
  const isPageExists = Boolean(currentPages.find(node => (node as any).value === page))

  if (isPageExists) return ConfigModificationState.NeedLess

  currentPages.push(t.stringLiteral(page))
  return ConfigModificationState.Success
}

const addNewPage = (node: ObjectExpression, page: string): ConfigModificationState => {
  const pages = getObjectProperty(node, 'pages')
  if (!pages) return ConfigModificationState.Fail

  const value = pages?.value
  // 仅处理 pages 为数组字面量的情形
  if (!value || value?.type !== 'ArrayExpression') return ConfigModificationState.Fail

  const isPageExists = Boolean(value.elements.find(node => (node as any).value === page))
  if (isPageExists) return ConfigModificationState.NeedLess

  const newArrayElement = t.stringLiteral(page)
  value.elements.push(newArrayElement)

  return ConfigModificationState.Success
}

const modifyPages = (path: NodePath<ExportDefaultDeclaration>, newPageConfig, callback: ModifyCallback) => {
  let state = ConfigModificationState.Fail
  const node = path.node.declaration as any
  // Case 1. `export default defineAppConfig({})` 这种情况
  if (node.type === 'CallExpression' && node.callee.name === 'defineAppConfig') {
    const configNode = node.arguments[0]
    state = addNewPage(configNode, newPageConfig.page)
  }
  // Case 2. `export default {}` 这种情况
  if (node.type === 'ObjectExpression') {
    state = addNewPage(node, newPageConfig.page)
  }
  callback(state)
}

const modifySubPackages = (path: NodePath<ExportDefaultDeclaration>, newPageConfig, callback: ModifyCallback) => {
  let state = ConfigModificationState.Fail
  const node = path.node.declaration as any
  // `export default defineAppConfig({})` 这种情况
  if (node.type === 'CallExpression' && node.callee.name === 'defineAppConfig') {
    const configNode = node.arguments[0]
    state = addNewSubPackage(configNode, newPageConfig.page, newPageConfig.pkg)
  }
  // `export default {}` 这种情况
  if (node.type === 'ObjectExpression') {
    state = addNewSubPackage(node, newPageConfig.page, newPageConfig.pkg)
  }
  callback(state)
}

const generateNewPageConfig = (fullPagePath: string, subPkgRootPath = '') => {
  const newPageConfig = {
    pkg: '',
    page: ''
  }
  if (subPkgRootPath) {
    const processedSubPkg = `${subPkgRootPath}/`
    newPageConfig.pkg = processedSubPkg
    newPageConfig.page = fullPagePath.split(processedSubPkg)[1]
  } else {
    newPageConfig.page = fullPagePath
  }

  return newPageConfig
}

export const modifyPagesOrSubPackages = (params: {
  path: NodePath<ExportDefaultDeclaration>
  fullPagePath: string
  subPkgRootPath?: string
  callback: ModifyCallback
}) => {
  const { fullPagePath, subPkgRootPath, callback, path } = params
  const newPageConfig = generateNewPageConfig(fullPagePath, subPkgRootPath)
  subPkgRootPath
    ? modifySubPackages(path, newPageConfig, callback)
    : modifyPages(path, newPageConfig, callback)
}
