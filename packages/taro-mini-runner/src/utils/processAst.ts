import * as path from 'path'
import * as fs from 'fs-extra'

import * as t from 'babel-types'
import traverse, { NodePath } from 'babel-traverse'
import * as _ from 'lodash'
import {
  taroJsFramework,
  taroJsComponents,
  taroJsRedux,
  REG_SCRIPTS,
  PARSE_AST_TYPE,
  isNpmPkg,
  isQuickAppPkg,
  isAliasPath,
  replaceAliasPath,
  resolveScriptPath,
  promoteRelativePath
} from '@tarojs/helper'

import {
  QUICKAPP_SPECIAL_COMPONENTS,
  excludeReplaceTaroFrameworkPkgs
} from './constants'
import { convertSourceStringToAstExpression } from './astConvert'
import babylonConfig from '../config/babylon'

const template = require('babel-template')

const NON_WEBPACK_REQUIRE = '__non_webpack_require__'

interface IProcessAstArgs {
  ast: t.File,
  buildAdapter: string,
  type: PARSE_AST_TYPE,
  designWidth: number,
  deviceRatio: number,
  sourceFilePath: string,
  sourceDir: string,
  alias: object,
  isBuildQuickapp: boolean,
  isUseComponentBuildPage: boolean
}

export default function processAst ({
  ast,
  buildAdapter,
  type,
  designWidth,
  deviceRatio,
  sourceFilePath,
  sourceDir,
  alias,
  isBuildQuickapp,
  isUseComponentBuildPage
}: IProcessAstArgs) {
  const taroMiniAppFramework = `@tarojs/taro-${buildAdapter}`
  let componentClassName: string = ''
  let taroJsReduxConnect: string = ''
  let taroImportDefaultName
  let needExportDefault = false
  let exportTaroReduxConnected: string | null = null
  const cannotRemoves = [taroJsFramework, 'react', 'nervjs']
  let hasComponentDidHide
  let hasComponentDidShow
  let hasComponentWillMount
  let needSetConfigFromHooks = false
  let configFromHooks
  if (isBuildQuickapp) {
    cannotRemoves.push(taroJsComponents)
  }
  const taroSelfComponents = new Set<string>()
  const customComponents = new Set<string>()

  traverse(ast, {
    ClassDeclaration (astPath) {
      const node = astPath.node
      let hasCreateData = false
      if (node.superClass) {
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

    ClassMethod (astPath) {
      const node = astPath.node
      const keyName = (astPath.get('key').node as t.Identifier).name
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
                left.property.name === 'customComponents') {
                const right = node.expression.right
                if (t.isArrayExpression(right)) {
                  right.elements.forEach(item => {
                    if (t.isStringLiteral(item)) {
                      customComponents.add(item.value)
                    }
                  })
                }
              }
            }
          }
        })
      } else {
        if (keyName === 'componentWillMount') {
          hasComponentWillMount = true
        } else if (keyName === 'componentDidShow') {
          hasComponentDidShow = true
        } else if (keyName === 'componentDidHide') {
          hasComponentDidHide = true
        }
      }
    },

    ClassProperty (astPath) {
      const node = astPath.node
      const keyName = node.key.name
      const valuePath = astPath.get('value')
      if (keyName === 'customComponents' && valuePath.isArrayExpression()) {
        valuePath.node.elements.forEach(item => {
          if (t.isStringLiteral(item)) {
            customComponents.add(item.value)
          }
        })
      } else if (valuePath.isFunctionExpression() || valuePath.isArrowFunctionExpression()) {
        if (keyName === 'componentWillMount') {
          hasComponentWillMount = true
        } else if (keyName === 'componentDidShow') {
          hasComponentDidShow = true
        } else if (keyName === 'componentDidHide') {
          hasComponentDidHide = true
        }
      }
    },

    ImportDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      let value = source.value
      const specifiers = node.specifiers
      if (isAliasPath(value, alias)) {
        value = replaceAliasPath(sourceFilePath, value, alias)
      }
      if (isBuildQuickapp && isQuickAppPkg(value)) {
        let defaultSpecifier: string = 'LOCAL'
        specifiers.forEach(item => {
          if (item.type === 'ImportDefaultSpecifier') {
            defaultSpecifier = item.local.name
          }
        })
        astPath.replaceWith(
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(defaultSpecifier),
              t.callExpression(
                t.identifier(NON_WEBPACK_REQUIRE),[
                  t.stringLiteral(value)
                ]
              )
            )
          ])
        )
        return
      }
      if (isNpmPkg(value)) {
        if (value === taroJsComponents) {
          if (isBuildQuickapp) {
            specifiers.forEach(specifier => {
              const name = specifier.local.name
              if (!QUICKAPP_SPECIAL_COMPONENTS.has(name)) {
                taroSelfComponents.add(_.kebabCase(name))
              }
            })
            taroSelfComponents.add('taro-page')
          }
          astPath.remove()
        } else {
          const specifiers = node.specifiers
          if (value === taroJsFramework) {
            let defaultSpecifier: string | null = null
            specifiers.forEach(item => {
              if (item.type === 'ImportDefaultSpecifier') {
                defaultSpecifier = item.local.name
              }
            })
            if (defaultSpecifier) {
              taroImportDefaultName = defaultSpecifier
            }
            excludeReplaceTaroFrameworkPkgs.add(taroMiniAppFramework)
            if (!Array.from(excludeReplaceTaroFrameworkPkgs).some(item => sourceFilePath.replace(/\\/g, '/').indexOf(item) >= 0)) {
              value = taroMiniAppFramework
            }
          } else if (value === taroJsRedux) {
            specifiers.forEach(item => {
              if (item.type === 'ImportSpecifier') {
                const local = item.local
                if (local.type === 'Identifier' && local.name === 'connect') {
                  taroJsReduxConnect = item.imported.name
                }
              }
            })
          }
          source.value = value
        }
      } else {
        const extname = path.extname(value)
        if (!extname || REG_SCRIPTS.test(value)) {
          let vpath = resolveScriptPath(path.resolve(sourceFilePath, '..', value))
          if (fs.existsSync(vpath)) {
            value = promoteRelativePath(path.relative(sourceFilePath, vpath))
            source.value = value.replace(path.extname(value), '')
          }
        }
      }
    },

    CallExpression (astPath) {
      const node = astPath.node
      const callee = node.callee as (t.Identifier | t.MemberExpression)
      if (t.isMemberExpression(callee)) {
        if (taroImportDefaultName && (callee.object as t.Identifier).name === taroImportDefaultName && (callee.property as t.Identifier).name === 'render') {
          astPath.remove()
        }
      } else if (callee.name === 'require') {
        const args = node.arguments as t.StringLiteral[]
        let value = args[0].value
        const parentNode = astPath.parentPath.parentPath.node as t.VariableDeclaration
        if (isAliasPath(value, alias)) {
          value = replaceAliasPath(sourceFilePath, value, alias)
          args[0].value = value
        }
        if (isBuildQuickapp && isQuickAppPkg(value)) {
          callee.name = NON_WEBPACK_REQUIRE
          return
        }
        if (isNpmPkg(value)) {
          if (value === taroJsComponents) {
            if (isBuildQuickapp) {
              if (parentNode.declarations.length === 1 && parentNode.declarations[0].init) {
                const id = parentNode.declarations[0].id
                if (id.type === 'ObjectPattern') {
                  const properties = id.properties as any
                  properties.forEach(p => {
                    if (p.type === 'ObjectProperty' && p.value.type === 'Identifier') {
                      taroSelfComponents.add(_.kebabCase(p.value.name))
                    }
                  })
                }
              }
            }
            astPath.remove()
          } else {
            if (t.isVariableDeclaration(astPath.parentPath.parentPath)) {
              if (parentNode.declarations.length === 1 && parentNode.declarations[0].init) {
                const id = parentNode.declarations[0].id
                if (value === taroJsFramework && id.type === 'Identifier') {
                  taroImportDefaultName = id.name
                  excludeReplaceTaroFrameworkPkgs.add(taroMiniAppFramework)
                  if (!Array.from(excludeReplaceTaroFrameworkPkgs).some(item => sourceFilePath.replace(/\\/g, '/').indexOf(item) >= 0)) {
                    value = taroMiniAppFramework
                  }
                } else if (value === taroJsRedux) {
                  const declarations = parentNode.declarations
                  declarations.forEach(item => {
                    const id = item.id
                    if (id.type === 'ObjectPattern') {
                      const properties = id.properties as any
                      properties.forEach(p => {
                        if (p.type === 'ObjectProperty') {
                          if (p.value.type === 'Identifier' && p.value.name === 'connect') {
                            taroJsReduxConnect = p.key.name
                          }
                        }
                      })
                    }
                  })
                }
              }
            }
            args[0].value = value
          }
        } else {
          const extname = path.extname(value)
          let vpath = resolveScriptPath(path.resolve(sourceFilePath, '..', value))
          if (!extname || REG_SCRIPTS.test(value)) {
            if (fs.existsSync(vpath)) {
              value = promoteRelativePath(path.relative(sourceFilePath, vpath))
              args[0].value = value.replace(path.extname(value), '')
            }
          }
        }
      }
    },

    ExportDefaultDeclaration (astPath) {
      const node = astPath.node
      const declaration = node.declaration
      needExportDefault = false
      if (
        declaration &&
        (declaration.type === 'ClassDeclaration' || declaration.type === 'ClassExpression')
      ) {
        const superClass = declaration.superClass
        if (superClass) {
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
            if (declaration.id === null) {
              componentClassName = '_TaroComponentClass'
            } else if (declaration.id.name === 'App') {
              componentClassName = '_App'
            } else {
              componentClassName = declaration.id.name
            }
            const isClassDcl = declaration.type === 'ClassDeclaration'
            const classDclProps = [t.identifier(componentClassName), superClass, declaration.body, declaration.decorators || []]
            astPath.replaceWith(isClassDcl ? t.classDeclaration.apply(null, classDclProps) : t.classExpression.apply(null, classDclProps))
          }
        }
      } else if (declaration.type === 'CallExpression') {
        const callee = declaration.callee
        if (callee && callee.type === 'CallExpression') {
          const subCallee = callee.callee
          if (subCallee.type === 'Identifier' && subCallee.name === taroJsReduxConnect) {
            const args = declaration.arguments as t.Identifier[]
            if (args.length === 1 && args[0].name === componentClassName) {
              needExportDefault = true
              exportTaroReduxConnected = `${componentClassName}__Connected`
              astPath.replaceWith(t.variableDeclaration('const', [t.variableDeclarator(t.identifier(`${componentClassName}__Connected`), t.callExpression(declaration.callee as t.Expression, declaration.arguments as Array<t.Expression | t.SpreadElement>))]))
            }
          }
        }
      } else if (declaration.type === 'Identifier') {
        const name = declaration.name
        if (name === componentClassName || name === exportTaroReduxConnected) {
          needExportDefault = true
          astPath.remove()
        }
      }
    },

    AssignmentExpression (astPath) {
      const node = astPath.node
      const left = node.left
      if (t.isMemberExpression(left) && t.isIdentifier(left.object)) {
        if (left.object.name === componentClassName
            && t.isIdentifier(left.property)
            && left.property.name === 'config') {
          needSetConfigFromHooks = true
          configFromHooks = node.right
        }
      }
    },

    Program: {
      exit (astPath) {
        astPath.traverse({
          ClassBody (astPath) {
            if (isBuildQuickapp) {
              const node = astPath.node
              if (!hasComponentWillMount) {
                node.body.push(t.classMethod(
                  'method', t.identifier('componentWillMount'), [],
                  t.blockStatement([]), false, false))
              }
              if (!hasComponentDidShow) {
                node.body.push(t.classMethod(
                  'method', t.identifier('componentDidShow'), [],
                  t.blockStatement([]), false, false))
              }
              if (!hasComponentDidHide) {
                node.body.push(t.classMethod(
                  'method', t.identifier('componentDidHide'), [],
                  t.blockStatement([]), false, false))
              }
              node.body.push(t.classMethod(
                'method', t.identifier('__listenToSetNavigationBarEvent'), [],
                t.blockStatement([convertSourceStringToAstExpression(
                  `if (!Taro.eventCenter.callbacks['TaroEvent:setNavigationBar']) {
                    Taro.eventCenter.on('TaroEvent:setNavigationBar', params => {
                      if (params.title) {
                        this.$scope.$page.setTitleBar({ text: params.title })
                      }
                      if (params.frontColor) {
                        this.$scope.$page.setTitleBar({ textColor: params.frontColor })
                      }
                      if (params.backgroundColor) {
                        this.$scope.$page.setTitleBar({ backgroundColor: params.backgroundColor })
                      }
                    })
                  }`
                )]), false, false))
              node.body.push(t.classMethod(
                'method', t.identifier('__offListenToSetNavigationBarEvent'), [],
                t.blockStatement([convertSourceStringToAstExpression(
                  `Taro.eventCenter.off('TaroEvent:setNavigationBar')`
              )]), false, false))
            }
            if (needSetConfigFromHooks) {
              const classPath = astPath.findParent((p: NodePath<t.Node>) => p.isClassExpression() || p.isClassDeclaration()) as NodePath<t.ClassDeclaration>
              classPath.node.body.body.unshift(
                t.classProperty(
                  t.identifier('config'),
                  configFromHooks as t.ObjectExpression
                )
              )
            }
          },
          ClassMethod (astPath) {
            if (isBuildQuickapp) {
              const node = astPath.node
              const keyName = (node.key as t.Identifier).name
              if (keyName === 'componentDidShow' || keyName === 'componentWillMount') {
                node.body.body.unshift(convertSourceStringToAstExpression(`this.__listenToSetNavigationBarEvent()`))
              } else if (keyName === 'componentDidHide') {
                node.body.body.unshift(convertSourceStringToAstExpression(`this.__offListenToSetNavigationBarEvent()`))
              }
            }
          },
          ImportDeclaration (astPath) {
            const node = astPath.node
            const specifiers = node.specifiers
            let needRemove = false
            specifiers.forEach(item => {
              if (customComponents.has(item.local.name)) {
                needRemove = true
              }
            })
            if (needRemove) {
              astPath.remove()
            }
          },
          CallExpression (astPath) {
            const node = astPath.node
            const callee = node.callee as t.Identifier
            if (callee.name === 'require') {
              const parentNode = astPath.parentPath.node as t.VariableDeclarator
              let needRemove = false
              const id = parentNode.id
              if (t.isObjectPattern(id)) {
                const properties = id.properties
                properties.forEach(property => {
                  if (t.isObjectProperty(property) && customComponents.has((property.value as t.Identifier).name)) {
                    needRemove = true
                  }
                })
              } else if (t.isIdentifier(id) && customComponents.has(id.name)) {
                needRemove = true
              }
              if (needRemove) {
                astPath.parentPath.parentPath.remove()
              }
            }
          }
        })
        const node = astPath.node as t.Program
        const exportVariableName = exportTaroReduxConnected || componentClassName
        if (needExportDefault && !isBuildQuickapp) {
          const exportDefault = template(`export default ${exportVariableName}`, babylonConfig as any)()
          node.body.push(exportDefault as any)
        }
        switch (type) {
          case PARSE_AST_TYPE.ENTRY:
            const pxTransformConfig = {
              designWidth: designWidth || 750
            }
            if (deviceRatio) {
              pxTransformConfig['deviceRatio'] = deviceRatio
            }
            if (isBuildQuickapp) {
              if (!taroImportDefaultName) {
                node.body.unshift(
                  template(`import Taro from '${taroMiniAppFramework}'`, babylonConfig as any)() as any
                )
              }
              node.body.push(template(`exportRes = require('${taroMiniAppFramework}').default.createApp(${exportVariableName})`, babylonConfig as any)() as any)
              node.body.push(template(`export default exportRes`, babylonConfig as any)() as any)
            } else {
              node.body.push(template(`App(require('${taroMiniAppFramework}').default.createApp(${exportVariableName}))`, babylonConfig as any)() as any)
            }
            node.body.push(template(`Taro.initPxTransform(${JSON.stringify(pxTransformConfig)})`, babylonConfig as any)() as any)
            break
          case PARSE_AST_TYPE.PAGE:
            if (isUseComponentBuildPage) {
              node.body.push(template(`Component(require('${taroMiniAppFramework}').default.createComponent(${exportVariableName}, true))`, babylonConfig as any)() as any)
            } else if (isBuildQuickapp) {
              const pagePath = sourceFilePath.replace(sourceDir, '').replace(/\\/g, '/').replace(path.extname(sourceFilePath), '')
              if (!taroImportDefaultName) {
                node.body.unshift(
                  template(`import Taro from '${taroMiniAppFramework}'`, babylonConfig as any)() as any
                )
              }
              node.body.push(template(`exportRes = require('${taroMiniAppFramework}').default.createComponent(${exportVariableName}, '${pagePath}')`, babylonConfig as any)() as any)
              node.body.push(template(`export default exportRes`, babylonConfig as any)() as any)
            } else {
              node.body.push(template(`Page(require('${taroMiniAppFramework}').default.createComponent(${exportVariableName}, true))`, babylonConfig as any)() as any)
            }
            break
          case PARSE_AST_TYPE.COMPONENT:
            if (isBuildQuickapp) {
              if (!taroImportDefaultName) {
                node.body.unshift(
                  template(`import Taro from '${taroMiniAppFramework}'`, babylonConfig as any)() as any
                )
              }
              node.body.push(template(`exportRes = require('${taroMiniAppFramework}').default.createComponent(${exportVariableName})`, babylonConfig as any)() as any)
              node.body.push(template(`export default exportRes`, babylonConfig as any)() as any)
            } else {
              node.body.push(template(`Component(require('${taroMiniAppFramework}').default.createComponent(${exportVariableName}))`, babylonConfig as any)() as any)
            }
            break
          default:
            break
        }
      }
    }
  })

  return ast
}
