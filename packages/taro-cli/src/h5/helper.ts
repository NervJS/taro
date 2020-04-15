import { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import { cloneDeep, remove } from 'lodash'
import * as rimraf from 'rimraf'
import { convertAstExpressionToVariable as toVar } from '../util/astConvert'
import { promisify } from 'util'

export const pRimraf = promisify(rimraf)

/**
 * 判断是否为子页面
 * @param parentPath
 */
export const isUnderSubPackages = (parentPath: NodePath<t.Node>) => (parentPath.isObjectProperty() && /subpackages/i.test(toVar(parentPath.node.key)))

export function createRoute ({ pageName, isIndex, lazyload = true }) {
  const absPagename = addLeadingSlash(pageName)
  const relPagename = `.${absPagename}`
  const chunkName = relPagename.split('/').filter(v => !/^(pages|\.)$/i.test(v)).join('_')
  if (lazyload) {
    const chunkNameComment = chunkName ? `/* webpackChunkName: "${chunkName}" */` : ''
    return `{
      path: '${absPagename}',
      componentLoader: () => import(${chunkNameComment}'${relPagename}'),
      isIndex: ${isIndex}
    }`
  } else {
    return `{
      path: '${absPagename}',
      componentLoader: () => Promise.resolve(require('${relPagename}')),
      isIndex: ${isIndex}
    }`
  }
}

/**
 * TS 编译器会把 class property 移到构造器，
 * 而小程序要求 `config` 和所有函数在初始化(after new Class)之后就收集到所有的函数和 config 信息，
 * 所以当如构造器里有 this.func = () => {...} 的形式，就给他转换成普通的 classProperty function
 * 如果有 config 就给他还原
 */
export function resetTSClassProperty (body) {
  for (const method of body) {
    if (t.isClassMethod(method) && method.kind === 'constructor') {
      for (const statement of cloneDeep(method.body.body)) {
        if (t.isExpressionStatement(statement) && t.isAssignmentExpression(statement.expression)) {
          const expr = statement.expression
          const { left, right } = expr
          if (
            t.isMemberExpression(left) &&
              t.isThisExpression(left.object) &&
              t.isIdentifier(left.property)
          ) {
            if (
              (t.isArrowFunctionExpression(right) || t.isFunctionExpression(right)) ||
                (left.property.name === 'config' && t.isObjectExpression(right))
            ) {
              body.push(
                t.classProperty(left.property, right)
              )
              remove(method.body.body, statement)
            }
          }
        }
      }
    }
  }
}

export const addLeadingSlash = (url: string) => url.charAt(0) === '/' ? url : '/' + url

export const removeLeadingSlash = (url: string) => url.replace(/^\.?\//, '')

export const stripTrailingSlash = (url: string) => url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url

export const isTaroClass = (astPath: NodePath<t.ClassDeclaration> | NodePath<t.ClassExpression>) => {
  let isTaroClass = false
  astPath.traverse({
    ClassMethod (astPath: NodePath<t.ClassMethod>) {
      const key = astPath.get('key')
      if (t.isIdentifier(key.node) && key.node.name === 'render') {
        astPath.traverse({
          ReturnStatement (astPath) {
            const argument = astPath.get('argument')
            if (argument) {
              isTaroClass = true
            }
          }
        })
      }
    }
  })
  return isTaroClass
}
