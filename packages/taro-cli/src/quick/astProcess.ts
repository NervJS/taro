import * as fs from 'fs-extra'
import * as path from 'path'

import * as babel from 'babel-core'
import * as t from 'babel-types'
import generate from 'babel-generator'
import traverse from 'babel-traverse'
import _ from 'lodash'
import { Config as IConfig } from '@tarojs/taro'

import { PARSE_AST_TYPE, taroJsComponents, taroJsQuickAppComponents } from '../util/constants'
import { getBuildData, isQuickAppPkg } from './helper'
import { getNotExistNpmList } from '../util/npmExact'
import { traverseObjectNode, isAliasPath, replaceAliasPath, isNpmPkg } from '../util'

export function parseAst (
  type: PARSE_AST_TYPE,
  ast: t.File,
  sourceFilePath: string,
  filePath: string,
  npmSkip: boolean = false
) {
  const styleFiles: string[] = []
  const scriptFiles: string[] = []
  const jsonFiles: string[] = []
  const mediaFiles: string[] = []

  const {
    nodeModulesPath,
    npmOutputDir,
    sourceDir,
    outputDir,
    buildAdapter,
    constantsReplaceList,
    isProduction,
    npmConfig,
    alias: pathAlias,
    projectConfig
  } = getBuildData()
  const notExistNpmList = getNotExistNpmList()
  const taroMiniAppFramework = `@tarojs/taro-${buildAdapter}`
  let needExportDefault = false
  let configObj: IConfig = {}
  let componentClassName: string = ''
  ast = babel.transformFromAst(ast, '', {
    plugins: [
      [require('babel-plugin-danger-remove-unused-import'), { ignore: ['@tarojs/taro', 'react', 'nervjs'] }],
      [require('babel-plugin-transform-define').default, constantsReplaceList]
    ]
  }).ast as t.File
  traverse(ast, {
    ClassDeclaration (astPath) {
      const node = astPath.node
      let hasCreateData = false
      if (astPath.isProperty({ superClass: true })) {
        astPath.traverse({
          ClassMethod (astPath) {
            if (astPath.get('key').isIdentifier({ name: '_createData' })) {
              hasCreateData = true
            }
          }
        })
        if (hasCreateData) {
          needExportDefault = true
          astPath.traverse({
            ClassMethod (astPath) {
              const node = astPath.node
              if (node.kind === 'constructor') {
                astPath.traverse({
                  ExpressionStatement (astPath) {
                    const node = astPath.node
                    if (node.expression &&
                      node.expression.type === 'AssignmentExpression' &&
                      node.expression.operator === '=') {
                      const left = node.expression.left
                      if (left.type === 'MemberExpression' &&
                        left.object.type === 'ThisExpression' &&
                        left.property.type === 'Identifier' &&
                        left.property.name === 'config') {
                        configObj = traverseObjectNode(node.expression.right, buildAdapter)
                      }
                    }
                  }
                })
              }
            }
          })
          if (node.id === null) {
            componentClassName = '_TaroComponentClass'
            astPath.replaceWith(
              t.classDeclaration(
                t.identifier(componentClassName),
                node.superClass as t.Expression,
                node.body as t.ClassBody,
                node.decorators as t.Decorator[] || []
              )
            )
          } else if (node.id.name === 'App') {
            componentClassName = '_App'
            astPath.replaceWith(
              t.classDeclaration(
                t.identifier(componentClassName),
                node.superClass as t.Expression,
                node.body as t.ClassBody,
                node.decorators as t.Decorator[] || []
              )
            )
          } else {
            componentClassName = node.id.name
          }
        }
      }
    },

    ClassExpression (astPath) {
      const node = astPath.node
      if (node.superClass) {
        let hasCreateData = false
        astPath.traverse({
          ClassMethod (astPath) {
            if (astPath.get('key').isIdentifier({ name: '_createData' })) {
              hasCreateData = true
            }
          }
        })
        if (hasCreateData) {
          needExportDefault = true
          if (node.id === null) {
            const parentNode = astPath.parentPath.node as any
            if (t.isVariableDeclarator(astPath.parentPath)) {
              componentClassName = parentNode.id.name
            } else {
              componentClassName = '_TaroComponentClass'
            }
            astPath.replaceWith(
              t.classExpression(
                t.identifier(componentClassName),
                node.superClass as t.Expression,
                node.body as t.ClassBody,
                node.decorators as t.Decorator[] || []
              )
            )
          } else if (node.id.name === 'App') {
            componentClassName = '_App'
            astPath.replaceWith(
              t.classExpression(
                t.identifier(componentClassName),
                node.superClass as t.Expression,
                node.body as t.ClassBody,
                node.decorators as t.Decorator[] || []
              )
            )
          } else {
            componentClassName = node.id.name
          }
        }
      }
    },

    ClassProperty (astPath) {
      const node = astPath.node
      if (node.key.name === 'config') {
        configObj = traverseObjectNode(node, buildAdapter)
      }
    },

    ImportDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      let value = source.value
      const specifiers = node.specifiers
      if (isAliasPath(value, pathAlias)) {
        value = replaceAliasPath(sourceFilePath, value, pathAlias)
        source.value = value
      }
      if (isNpmPkg(value)
        && !isQuickAppPkg(value)
        && !notExistNpmList.has(value)) {
        if (value === taroJsComponents) {
          source.value = taroJsQuickAppComponents
        }

      }
    }
  })
  return {
    code: generate(ast).code,
    styleFiles,
    scriptFiles,
    jsonFiles,
    configObj,
    mediaFiles,
    componentClassName
  }
}
